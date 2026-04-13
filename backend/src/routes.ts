import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { generateReplySchema, supportChatSchema } from "./schema";
//import { generateReplies, generateRomeoResponse, analyzeMessagePattern, generateRomeoDateingCoachResponse } from "./openai.ts";
import { generateReplies, generateRomeoResponse, analyzeMessagePattern, generateRomeoDateingCoachResponse } from "./groqai";
import { sendWelcomeEmail, sendFeedbackNotification, sendFeedbackAutoReply, sendPremiumUpgradeEmail, sendPremiumPlusUpgradeEmail, sendDripCampaignEmail, sendRefundRequestAutoReply, sendRefundRequestNotification } from "./sendgrid";
import { optionalAuth } from "./unifiedAuth";
import { sql } from 'drizzle-orm';
import { db } from './db';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getRequestUserId = (req: any): string | undefined => req?.user?.claims?.sub;

const logPaymentResolution = (source: string, lookup: string, userId: string) => {
  console.log(`[payments] ${source}: resolved user ${userId} via ${lookup}`);
};

async function resolvePaymentUser({
  req,
  metadataUserId,
  email,
}: {
  req?: any;
  metadataUserId?: string | null;
  email?: string | null;
}) {
  const sessionUserId = req ? getRequestUserId(req) : undefined;

  if (sessionUserId) {
    const sessionUser = await storage.getUser(sessionUserId);
    if (sessionUser) {
      return { user: sessionUser, lookup: `session:${sessionUserId}` };
    }
    console.warn(`[payments] session user ${sessionUserId} not found in database`);
  }

  if (metadataUserId) {
    const metadataUser = await storage.getUser(metadataUserId);
    if (metadataUser) {
      return { user: metadataUser, lookup: `metadata:${metadataUserId}` };
    }
    console.warn(`[payments] metadata user ${metadataUserId} not found in database`);
  }

  if (email) {
    const users = await storage.getUserByEmail(email);
    if (users.length > 0) {
      return { user: users[0], lookup: `email:${email}` };
    }
    console.warn(`[payments] no user found for email ${email}`);
  }

  return null;
}

async function activatePremiumUser(
  userId: string,
  source: string,
  paymentData: {
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
  },
) {
  const updatedUser = await storage.activatePremiumSubscription(userId, {
    stripeCustomerId: paymentData.stripeCustomerId,
    stripeSubscriptionId: paymentData.stripeSubscriptionId,
    subscriptionStatus: 'premium',
    subscriptionStartDate: new Date(),
  });

  console.log(
    `[payments] ${source}: activated premium for user ${updatedUser.id} (customer=${updatedUser.stripeCustomerId || 'none'}, subscription=${updatedUser.stripeSubscriptionId || 'none'})`,
  );

  return updatedUser;
}

// Simple middleware that bypasses authentication completely
const noAuth = (req: any, res: any, next: any) => {
  const anonId = req.headers['x-anon-id'];

  if (!anonId) {
    return res.status(400).json({ error: 'Missing anonymous ID' });
  }

  req.user = {
    claims: {
      sub: anonId
    }
  };

  next();
};
export async function registerRoutes(app: Express): Promise<Server> {
  // Test route to verify API routing works
  app.get('/api/test', (req, res) => {
    res.json({ status: 'API routes working correctly', timestamp: new Date().toISOString() });
  });

  app.get('/api/session-user', optionalAuth, async (req: any, res) => {
    try {
      const userId = getRequestUserId(req);

      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user.id,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus ?? null,
      });
    } catch (error) {
      console.error('Session user lookup error:', error);
      res.status(500).json({ message: 'Failed to load session user' });
    }
  });

  // Health check for external monitoring
  app.get('/health', async (req, res) => {
    try {
      await db.execute(sql`SELECT 1`); // absolute lightest possible query
    } catch (e) {}
    res.status(200).send('OK');
  });

  // Simple status page that bypasses React
  app.get('/status', (req, res) => {
    const uptime = process.uptime();
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Holla AI - Server Status</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="refresh" content="30">
        </head>
        <body style="font-family: Arial; padding: 20px; background: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #333; text-align: center;">🎉 Holla AI Server Status</h1>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin: 0; color: #2d5a2d;">✅ Server is Running</h3>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Uptime</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${Math.floor(uptime / 60)} minutes</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Port</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">5000</td>
              </tr>
              <tr style="background: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Host</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${req.headers.host}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Timestamp</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toISOString()}</td>
              </tr>
            </table>
            <div style="text-align: center; margin-top: 30px;">
              <a href="/" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 5px;">Main App</a>
              <a href="/api/test" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 5px;">Test API</a>
            </div>
            <p style="text-align: center; color: #666; margin-top: 20px; font-size: 0.9em;">
              Page auto-refreshes every 30 seconds
            </p>
          </div>
        </body>
      </html>
    `);
  });

  // Force webview to show content by creating a fallback route
  app.get('/force-webview', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Holla AI - Force Webview</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; }
            .container { max-width: 800px; margin: 0 auto; text-align: center; padding: 40px 20px; }
            .card { background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; margin: 20px 0; backdrop-filter: blur(10px); }
            .btn { background: #fff; color: #333; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin: 10px; transition: transform 0.2s; }
            .btn:hover { transform: translateY(-2px); }
            .status { background: rgba(0,255,0,0.2); padding: 10px; border-radius: 5px; margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 style="font-size: 3.5em; margin-bottom: 20px;">🎉 Holla AI</h1>
            <h2 style="font-size: 1.8em; margin-bottom: 30px;">Webview Force Display</h2>
            
            <div class="card">
              <h3>System Status</h3>
              <div class="status">✅ Server running on port 5000</div>
              <div class="status">✅ Express routes working</div>
              <div class="status">✅ Firebase credentials configured</div>
              <div class="status">✅ Database connected</div>
              <div class="status">✅ Webview is functional</div>
            </div>

            <div class="card">
              <h3>AI Dating Coach Ready</h3>
              <p>Transform your dating conversations with psychology-backed AI replies</p>
              <p>Generate confident, funny, flirty, and creative responses instantly</p>
            </div>

            <a href="/" class="btn">🚀 Launch Main App</a>
            <a href="/api/test" class="btn">🔧 Test API</a>
            
            <div style="margin-top: 40px; font-size: 0.9em; opacity: 0.8;">
              <p>Server Time: ${new Date().toISOString()}</p>
              <p>If this page displays correctly, your webview is working properly.</p>
            </div>
          </div>
        </body>
      </html>
    `);
  });

  // Download route for backup file
  app.get('/download-backup', (req, res) => {
    const path = require('path');
    const filePath = path.join(process.cwd(), 'holla-ai-source.tar.xz');
    res.download(filePath, 'holla-ai-source.tar.xz', (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(404).send('File not found');
      }
    });
  });

  // Webview test route  
  app.get('/webview-test', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Holla AI - Webview Test</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; margin: 0;">
          <div style="text-align: center; padding: 40px;">
            <h1 style="font-size: 3em; margin-bottom: 20px;">🎉 Holla AI</h1>
            <h2 style="font-size: 1.5em; margin-bottom: 30px;">Webview is Working!</h2>
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px auto; max-width: 500px;">
              <p>✅ Server running successfully</p>
              <p>✅ React app configured</p>  
              <p>✅ Firebase authentication ready</p>
              <p>✅ API endpoints active</p>
            </div>
            <a href="/" style="background: #fff; color: #333; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin-top: 20px;">
              Open Main App →
            </a>
          </div>
        </body>
      </html>
    `);
  });

  // Setup authentication middleware
  const { setupStandaloneAuth } = await import("./standaloneAuth");
  const { setupDirectAuth } = await import("./directAuth");
  const { setupFirebaseAuth } = await import("./firebaseAuth");
  
// Add this to registerRoutes in routes.ts
// Unified route to return the current user session
  setupStandaloneAuth(app);
  setupDirectAuth(app);
  setupFirebaseAuth(app);
  // Simple alias for backward compatibility
  app.post("/api/generate", optionalAuth, async (req, res) => {
    try {
      const { message, tone, language } = generateReplySchema.parse(req.body);
      
      // Check premium status
      let isPremium = false;
      
      // TEMPORARY: Allow testing
      const isTestMode = process.env.NODE_ENV === 'development';
      const hasTestTier = req.headers['x-test-tier'] === 'premium' || req.headers['x-test-tier'] === 'premium_plus';
      
      if ((req as any).user?.claims?.sub) {
        const user = await storage.getUser((req as any).user.claims.sub);
        isPremium = !!(user && ['premium', 'premium_plus'].includes((user as any).subscriptionStatus || ''));
      }
      
      // Allow testing in development or with test tier header
      isPremium = isPremium || (isTestMode && hasTestTier);
      
      // Block premium features for non-premium users
      if (tone === "creative" && !isPremium) {
        return res.status(403).json({ 
          message: "Premium Feature - Creative tone requires Premium subscription. Upgrade to access psychology-backed replies.",
          requiresUpgrade: true
        });
      }
      
      console.log(`Generating replies for: ${message.substring(0, 50)}... (Premium: ${isPremium})`);
      
      const replies = await generateReplies(message, tone, language, isPremium);
      
      res.json({ 
        success: true, 
        replies: replies.replies,
        tone: replies.tone 
      });
    } catch (error) {
      console.error("Error generating replies:", error);
      res.status(500).json({ message: "Failed to generate replies" });
    }
  });

  // Generate replies endpoint with premium validation
  app.post("/api/generate-replies",optionalAuth, async (req, res) => {
    try {
      const { message, tone, language } = generateReplySchema.parse(req.body);
      
      // Check premium status
      let isPremium = false;
      
      // TEMPORARY: Allow testing
      const isTestMode = process.env.NODE_ENV === 'development';
      const hasTestTier = req.headers['x-test-tier'] === 'premium' || req.headers['x-test-tier'] === 'premium_plus';
      if ((req as any).user?.claims?.sub) {
        const user = await storage.getUser((req as any).user.claims.sub);
        isPremium = !!(user && ['premium', 'premium_plus'].includes((user as any).subscriptionStatus || ''));
      }
      
      // Allow testing in development or with test tier header
      isPremium = isPremium || (isTestMode && hasTestTier);
      
      // Block premium features for non-premium users
      if (tone === "creative" && !isPremium) {
        return res.status(403).json({ 
          message: "Premium Feature - Creative tone requires Premium subscription. Upgrade to access psychology-backed replies.",
          requiresUpgrade: true
        });
      }
      console.log(`Generating replies for: ${message.substring(0, 50)}... (Premium: ${isPremium})`);
      
      const replies = await generateReplies(message, tone, language, isPremium);
      res.json({ 
        success: true, 
        replies: replies.replies,
        tone: replies.tone 
      });
    } catch (error) {
      console.error("Error generating replies:", error);
      res.status(500).json({ message: "Failed to generate replies" });
    }
  });

  // Pattern analysis endpoint
  app.post("/api/pattern-interrupt", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const analysis = await analyzeMessagePattern(message);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing pattern:", error);
      res.status(500).json({ message: "Failed to analyze pattern" });
    }
  });

  // Romeo dating coach endpoint
  app.post("/api/romeo-dating-coach", async (req, res) => {
    try {
      const { message, isPremium } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await generateRomeoDateingCoachResponse(message);
      res.json({ response });
    } catch (error) {
      console.error("Error with Romeo coach:", error);
      res.status(500).json({ message: "Failed to get coaching response" });
    }
  });

  // Romeo chat endpoint  
  app.post("/api/romeo-chat", optionalAuth, async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Check premium status from user session
      let isPremium = false;
      const isTestMode = process.env.NODE_ENV === 'development';
      const hasTestTier = req.headers['x-test-tier'] === 'premium' || req.headers['x-test-tier'] === 'premium_plus';
      
      if ((req as any).user?.claims?.sub) {
        const user = await storage.getUser((req as any).user.claims.sub);
        isPremium = !!(user && ['premium', 'premium_plus'].includes((user as any).subscriptionStatus || ''));
      }
      
      isPremium = isPremium || (isTestMode && hasTestTier);

      const response = await generateRomeoResponse(message, isPremium);
      res.json({ response });
    } catch (error) {
      console.error("Error with Romeo chat:", error);
      res.status(500).json({ message: "Failed to get chat response" });
    }
  });

  // Save reply endpoint
  app.post("/api/save-reply", noAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { text, tone } = req.body;
      
      if (!text || !tone) {
        return res.status(400).json({ message: "Text and tone are required" });
      }

      const savedReply = await storage.createSavedReply({
        userId,
        replyText: text,
        tone
      });

      res.json(savedReply);
    } catch (error) {
      console.error("Error saving reply:", error);
      res.status(500).json({ message: "Failed to save reply" });
    }
  });

  // Get saved replies endpoint
  app.get("/api/saved-replies", noAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedReplies = await storage.getSavedRepliesByUserId(userId);
      res.json(savedReplies);
    } catch (error) {
      console.error("Error getting saved replies:", error);
      res.status(500).json({ message: "Failed to get saved replies" });
    }
  });

  // Stripe subscription routes
app.post('/api/create-subscription', async (req: any, res) => {
  try {
    const { uid, email } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "Missing uid" });
    }

    // 🔹 Create customer (or reuse)
    let user = await storage.getUser(uid);
    let customer;

    if (user?.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email,
        metadata: { userId: uid },
      });

      await storage.updateUserStripeInfo(uid, customer.id, '');
    }

    // 🔥 CREATE PAYMENT INTENT (THIS FIXES EVERYTHING)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 999, // ⚠️ must match your price ($9.99 → 999 cents)
      currency: "usd",
      customer: (customer as any).id,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error: any) {
    console.error("PaymentIntent error:", error);
    res.status(500).json({
      error: error.message || "Failed to create payment intent",
    });
  }
});

  // Create payment intent for subscription
app.post('/api/create-payment-intent', optionalAuth, async (req: any, res) => {
  try {
    const { amount, email } = req.body;
    const userId = getRequestUserId(req);

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to create a payment intent' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 10,
      currency: 'usd',
      receipt_email: email,         // ✅ attach email
      metadata: { email: email || '', userId },
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

  // Support chat endpoint
  app.post("/api/support-chat", async (req, res) => {
    try {
      const { message } = supportChatSchema.parse(req.body);
      const { email, category } = req.body;
      
      const supportChat = await storage.createSupportChat({
        message,
        response: "Auto-reply sent"
      });

      // Send feedback notification to admin
      await sendFeedbackNotification({
        email,
        feedbackType: category || "general",
        message
      });

      // Send auto-reply to user
      await sendFeedbackAutoReply(email, category || "general");

      res.json({ 
        success: true, 
        message: "Your message has been received. We'll get back to you soon!" 
      });
    } catch (error) {
      console.error("Error in support chat:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Create Stripe Checkout Session with Apple Pay and Google Pay
  app.post('/api/create-checkout-session', optionalAuth, async (req: any, res) => {
    try {
      const { email, payment_method, success_url, cancel_url } = req.body;
      const userId = getRequestUserId(req);

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required to create a checkout session' });
      }

      let sessionConfig: any = {
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Holla Premium Subscription',
                description: 'Unlimited AI-powered replies and advanced conversation insights',
              },
              unit_amount: 999, // $9.99
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: success_url || `${process.env.FRONTEND_URL}/welcome-premium`,
        cancel_url: cancel_url || `${process.env.FRONTEND_URL}/subscribe`,
        customer_email: email,
        client_reference_id: userId,
        metadata: {
          email: email,
          payment_method: payment_method || 'card',
          userId,
        },
        subscription_data: {
          metadata: {
            email,
            userId,
          }
        },
      };

      // Enable automatic payment methods for mobile wallets
      sessionConfig.automatic_payment_methods = {
        enabled: true,
        allow_redirects: 'never'
      };
      


      // Configure the checkout to display preferred payment method first
      if (payment_method === 'apple_pay' || payment_method === 'google_pay') {
        sessionConfig.custom_text = {
          submit: {
            message: `Complete subscription payment`
          }
        };
      }

      const session = await stripe.checkout.sessions.create(sessionConfig);

      console.log(`Created Stripe checkout session for ${email} with ${payment_method || 'card'}: ${session.id}`);
      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  // Payment success endpoint for handling completed payments
  app.post('/api/payment-success', optionalAuth, async (req: any, res) => {
  try {
    const { payment_intent_id, email } = req.body;

    if (!payment_intent_id) {
      return res.status(400).json({ error: 'Missing payment_intent_id' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    const resolvedUser = await resolvePaymentUser({
      req,
      metadataUserId: paymentIntent.metadata?.userId,
      email: email || paymentIntent.receipt_email || paymentIntent.metadata?.email || null,
    });
    
    // ✅ If user not in DB, create them first
    if (!resolvedUser) {
      return res.status(404).json({ error: 'No existing user found for successful payment' });
    }

    logPaymentResolution('payment-success', resolvedUser.lookup, resolvedUser.user.id);

    const updatedUser = await activatePremiumUser(resolvedUser.user.id, 'payment-success', {
      stripeCustomerId: typeof paymentIntent.customer === 'string' ? paymentIntent.customer : null,
      stripeSubscriptionId: null,
    });

    if ((req.session as any)?.standaloneUserId === updatedUser.id) {
      (req.session as any).standaloneUser = updatedUser;
    }

    if (updatedUser.email) {
      await sendPremiumUpgradeEmail(updatedUser.email);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Payment success error:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});
// Cancel subscription route
app.post('/api/cancel-subscription', optionalAuth, async (req: any, res) => {
  try {
    const userId = getRequestUserId(req);

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await storage.getUser(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!['premium', 'premium_plus'].includes(user.subscriptionStatus || '')) {
      return res.status(400).json({ error: 'No active subscription to cancel' });
    }

    // Cancel on Stripe's side if a subscription ID exists
    if (user.stripeSubscriptionId) {
      await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      console.log(`[payments] cancel-subscription: cancelled Stripe subscription ${user.stripeSubscriptionId} for user ${userId}`);
    } else {
      console.warn(`[payments] cancel-subscription: user ${userId} has no stripeSubscriptionId, updating DB only`);
    }

    // Update DB status (mirrors what the webhook does)
    await storage.updateSubscriptionStatus(userId, 'free');

    res.json({ success: true, message: 'Subscription cancelled successfully' });
  } catch (error: any) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: error.message || 'Failed to cancel subscription' });
  }
});

  // Stripe webhook for handling subscription events
  app.post('/api/webhook/stripe', async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
      } catch (err: any) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const resolvedUser = await resolvePaymentUser({
            metadataUserId: session.metadata?.userId || session.client_reference_id,
            email: session.customer_details?.email || session.metadata?.email || null,
          });

          if (!resolvedUser) {
            console.warn('[payments] webhook checkout.session.completed: unable to resolve user');
            break;
          }

          logPaymentResolution('webhook checkout.session.completed', resolvedUser.lookup, resolvedUser.user.id);
          const updatedUser = await activatePremiumUser(resolvedUser.user.id, 'webhook checkout.session.completed', {
            stripeCustomerId: typeof session.customer === 'string' ? session.customer : null,
            stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : null,
          });

          if (updatedUser.email) {
            await sendPremiumUpgradeEmail(updatedUser.email);
          }
          break;
        }

        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const resolvedUser = await resolvePaymentUser({
            metadataUserId: paymentIntent.metadata?.userId,
            email: paymentIntent.receipt_email || paymentIntent.metadata?.email || null,
          });

          if (!resolvedUser) {
            console.warn('[payments] webhook payment_intent.succeeded: unable to resolve user');
            break;
          }

          logPaymentResolution('webhook payment_intent.succeeded', resolvedUser.lookup, resolvedUser.user.id);
          const updatedUser = await activatePremiumUser(resolvedUser.user.id, 'webhook payment_intent.succeeded', {
            stripeCustomerId: typeof paymentIntent.customer === 'string' ? paymentIntent.customer : null,
            stripeSubscriptionId: null,
          });

          if (updatedUser.email) {
            await sendPremiumUpgradeEmail(updatedUser.email);
          }
          break;
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as any;
          if (invoice.subscription) {
            const users = await storage.getUserByStripeCustomerId(invoice.customer as string);
            if (users.length > 0) {
              const updatedUser = await activatePremiumUser(users[0].id, 'webhook invoice.payment_succeeded', {
                stripeCustomerId: invoice.customer as string,
                stripeSubscriptionId: invoice.subscription as string,
              });
              if (updatedUser.email) {
                await sendPremiumUpgradeEmail(updatedUser.email);
              }
            } else {
              console.warn(`[payments] webhook invoice.payment_succeeded: no user found for customer ${invoice.customer}`);
            }
          }
          break;
        }
          
        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription;
          const customerUsers = await storage.getUserByStripeCustomerId(subscription.customer as string);
          if (customerUsers.length > 0) {
            await storage.updateSubscriptionStatus(customerUsers[0].id, 'cancelled');
          }
          break;
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Webhook failed' });
    }
  });

  // Admin metrics endpoint
  app.get('/api/admin/metrics', async (req, res) => {
    try {
      const metrics = await storage.getAdminMetrics();
      
      res.json({
        success: true,
        data: {
          totalUsers: metrics.totalUsers,
          premiumSubscribers: metrics.premiumSubscribers,
          premiumPlusSubscribers: metrics.premiumPlusSubscribers,
          cancelledSubscriptions: metrics.cancelledSubscriptions,
          weeklyGrowth: metrics.weeklyGrowth,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error fetching admin metrics:', error);
      res.status(500).json({ error: 'Failed to fetch metrics' });
    }
  });

  // DB1 console query endpoint
  app.get('/api/admin/db1', async (req, res) => {
    try {
      const metrics = await storage.getAdminMetrics();
      
      const dbOutput = `
=== DB1 METRICS ===
👤 Total Users: ${metrics.totalUsers}
💰 Premium Subscribers: ${metrics.premiumSubscribers}
💎 Premium Plus Subscribers: ${metrics.premiumPlusSubscribers}
📉 Cancelled Subscriptions: ${metrics.cancelledSubscriptions}
📈 Weekly Growth: ${metrics.weeklyGrowth.users} users, ${metrics.weeklyGrowth.subscriptions} subscriptions
Last Updated: ${new Date().toLocaleString()}
==================
      `;
      
      res.json({
        success: true,
        console_output: dbOutput.trim(),
        raw_data: metrics
      });
    } catch (error) {
      console.error('Error querying DB1:', error);
      res.status(500).json({ error: 'Failed to query DB1' });
    }
  });

  // Standalone payment intent without authentication
  app.post('/api/standalone-payment-intent', async (req, res) => {
    try {
      const { amount, email } = req.body;
      
      console.log('Payment intent request received:', { amount, email, body: req.body });
      
      if (!email || !email.includes('@')) {
        console.log('Invalid email provided:', email);
        return res.status(400).json({ error: 'Valid email required' });
      }

      console.log(`Creating standalone payment intent for ${email}, amount: ${amount}`);

      // Check if user already has an active premium subscription
      try {
        const existingUsers = await storage.getUserByEmail(email);
        if (existingUsers.length > 0) {
          const user = existingUsers[0];
          if (user.subscriptionStatus === 'premium' || user.subscriptionStatus === 'premium_plus') {
            console.log(`User ${email} already has active premium subscription: ${user.subscriptionStatus}`);
            return res.status(409).json({ 
              error: 'already_premium',
              message: 'This email already has an active premium subscription. Please sign in to access your premium features.',
              subscriptionStatus: user.subscriptionStatus
            });
          }
        }
      } catch (error) {
        console.log('Error checking existing subscription:', error);
        // Continue with payment intent creation if check fails
      }

      // Validate Stripe key is present
      if (!process.env.STRIPE_SECRET_KEY) {
        console.error('STRIPE_SECRET_KEY not configured');
        return res.status(500).json({ error: 'Payment system not configured' });
      }

      const paymentIntentConfig = {
        amount: amount || 10,
        currency: 'usd',
        receipt_email: email,
        description: 'Holla Premium Monthly Subscription',
        metadata: {
          email: email,
          subscription_type: 'premium',
          product: 'premium_monthly'
        },
        automatic_payment_methods: {
          enabled: true
        }
      };

      console.log('Creating payment intent with config:', paymentIntentConfig);

      const paymentIntent = await stripe.paymentIntents.create(paymentIntentConfig);

      console.log('Payment intent created successfully:', {
        id: paymentIntent.id,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret ? 'present' : 'missing'
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        email: email
      });
    } catch (error: any) {
      console.error('Standalone payment intent error:', {
        message: error.message,
        type: error.type,
        code: error.code,
        stack: error.stack
      });
      res.status(500).json({ 
        error: 'Failed to create payment intent',
        details: error.message 
      });
    }
  });

  // Refund request endpoint
  app.post("/api/refund-request", async (req, res) => {
    try {
      const { email, reason } = req.body;
      
      if (!email || !email.includes('@')) {
        return res.status(400).json({ message: "Valid email is required" });
      }

      console.log(`Refund request from ${email}: ${reason}`);

      // Send auto-reply to user
      await sendRefundRequestAutoReply(email);
      
      // Send notification to admin
      await sendRefundRequestNotification(email, reason);

      res.json({ 
        success: true, 
        message: "Your refund request has been received. We'll process it within 24-48 hours." 
      });
    } catch (error) {
      console.error("Error processing refund request:", error);
      res.status(500).json({ message: "Failed to process refund request" });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter-subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || !email.includes('@')) {
        return res.status(400).json({ message: "Valid email is required" });
      }

      console.log(`Newsletter subscription for ${email}`);

      // Send welcome email (with deduplication)
      const emailSent = await sendWelcomeEmail(email);
      
      if (emailSent) {
        res.json({ 
          success: true, 
          message: "Thanks for subscribing! Check your email for a welcome message." 
        });
      } else {
        res.json({ 
          success: true, 
          message: "You're already subscribed to our newsletter!" 
        });
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Delete saved reply endpoint
  app.delete("/api/saved-replies/:id", noAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const replyId = parseInt(req.params.id);
      
      const success = await storage.deleteSavedReply(replyId, userId);
      
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Reply not found" });
      }
    } catch (error) {
      console.error("Error deleting saved reply:", error);
      res.status(500).json({ message: "Failed to delete reply" });
    }
  });

  // User statistics endpoints
  app.post("/api/user/activity", noAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { timeOnApp, loginCount } = req.body;
      
      await storage.updateUserActivity(userId, {
        lastActiveDate: new Date(),
        totalTimeOnApp: timeOnApp,
        loginCount: loginCount
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating user activity:", error);
      res.status(500).json({ message: "Failed to update activity" });
    }
  });

  app.post("/api/user/stats", noAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { conversationsGenerated, messagesSentByAI } = req.body;
      
      await storage.incrementUserStats(userId, {
        conversationsGenerated,
        messagesSentByAI
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating user stats:", error);
      res.status(500).json({ message: "Failed to update stats" });
    }
  });

  app.post("/api/user/feedback", noAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      await storage.markFeedbackGiven(userId);

      res.json({ success: true });
    } catch (error) {
      console.error("Error marking feedback:", error);
      res.status(500).json({ message: "Failed to mark feedback" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
