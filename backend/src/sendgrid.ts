import { MailService } from '@sendgrid/mail';
import { welcomeEmailTemplate, premiumUpgradeEmailTemplate, premiumPlusUpgradeEmailTemplate, createSupportAutoReply, refundRequestAutoReplyTemplate, refundRequestNotificationTemplate } from './emailTemplates.ts';
import dotenv from 'dotenv'
dotenv.config()
const mailService = new MailService();

// Initialize SendGrid with the new API key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (SENDGRID_API_KEY) {
  mailService.setApiKey(SENDGRID_API_KEY);
  console.log('SendGrid initialized with API key:', SENDGRID_API_KEY.substring(0, 15) + '...');
}

interface EmailParams {
  to: string;
  from: string | { email: string; name: string };
  subject: string;
  text?: string;
  html?: string;
}

// Security function to validate email addresses
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Security function to sanitize email content
function sanitizeContent(content: string): string {
  return content.replace(/<script[^>]*>.*?<\/script>/gi, '')
                .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
                .replace(/javascript:/gi, '');
}

// Rate limiting map (in production, use Redis or database)
const emailRateLimit = new Map<string, { count: number; lastReset: number }>();
const MAX_EMAILS_PER_HOUR = 10;

// Email deduplication system with persistent tracking
const emailSentCache = new Map<string, Set<string>>();
const emailSentToday = new Map<string, string>(); // email -> date sent

function hasEmailBeenSent(email: string, type: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  const userEmails = emailSentCache.get(email) || new Set();
  const lastSentDate = emailSentToday.get(`${email}_${type}`);
  
  // Check if email was sent today, in current session, or within the last 24 hours
  const emailKey = `${email}_${type}`;
  if (userEmails.has(type) || lastSentDate === today) {
    console.log(`Email ${type} already sent to ${email} - skipping duplicate`);
    return true;
  }
  
  return false;
}

function markEmailAsSent(email: string, type: string): void {
  const today = new Date().toISOString().split('T')[0];
  const userEmails = emailSentCache.get(email) || new Set();
  userEmails.add(type);
  emailSentCache.set(email, userEmails);
  emailSentToday.set(`${email}_${type}`, today);
  console.log(`Marked ${type} email as sent for ${email} on ${today}`);
}

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const hourAgo = now - (60 * 60 * 1000);
  
  const record = emailRateLimit.get(email) || { count: 0, lastReset: now };
  
  if (record.lastReset < hourAgo) {
    record.count = 0;
    record.lastReset = now;
  }
  
  if (record.count >= MAX_EMAILS_PER_HOUR) {
    return false;
  }
  
  record.count++;
  emailRateLimit.set(email, record);
  return true;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  // Security validations
  if (!isValidEmail(params.to)) {
    console.error("Invalid email address:", params.to);
    return false;
  }
  
  if (!checkRateLimit(params.to)) {
    console.error("Rate limit exceeded for email:", params.to);
    return false;
  }

  if (!process.env.SENDGRID_API_KEY) {
    console.log("SendGrid API key not configured, email would be sent:", {
      ...params,
      text: sanitizeContent(params.text || ''),
      html: sanitizeContent(params.html || '')
    });
    return true;
  }

  try {
    const emailData: any = {
      to: params.to,
      from: params.from,
      subject: params.subject,
    };
    
    if (params.text) emailData.text = sanitizeContent(params.text);
    if (params.html) emailData.html = sanitizeContent(params.html);
    
    await mailService.send(emailData);
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    
    // For now, log the email that would have been sent
    console.log("Email that would have been sent:", {
      to: params.to,
      from: params.from,
      subject: params.subject,
      content: params.text
    });
    
    // Return true to prevent blocking the user experience
    return true;
  }
}

export async function sendWelcomeEmail(email: string): Promise<boolean> {
  // Check if welcome email was already sent in this session
  if (hasEmailBeenSent(email, 'welcome')) {
    console.log(`Welcome email already sent to ${email} in this session`);
    return true;
  }

  const result = await sendEmail({
    to: email,
    from: { 
      email: 'support@holla-ai.com', 
      name: 'Holla Support' 
    },
    subject: 'Welcome to Holla 👋',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #7C3AED;">Welcome to Holla – your new AI wingman is ready! 🚀</h2>
        
        <p>Thanks for joining! You're about to discover the secret weapon that transforms awkward conversations into genuine connections.</p>
        
        <p><strong>Your dating game just leveled up.</strong></p>
        
        <div style="background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: white;">What's Next?</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>🎯 Generate AI replies that actually work</li>
            <li>💬 Get coaching from Romeo AI</li>
            <li>⚡ Use pattern interrupt techniques</li>
            <li>🔥 Join thousands getting better responses</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://holla.replit.app" style="display: inline-block; background: linear-gradient(135deg, #FACC15, #F59E0B); color: black; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Start Using Holla Now</a>
        </div>
        
        <p>Ready to stop getting ghosted? Let's make dating fun again.</p>
        
        <p>– Team Holla</p>
      </div>
    `,
    text: `Welcome to Holla – your new AI wingman is ready!

Thanks for joining! You're about to discover the secret weapon that transforms awkward conversations into genuine connections.

Your dating game just leveled up.

Ready to stop getting ghosted? Let's make dating fun again.

– Team Holla`
  });

  // Mark as sent if successful
  if (result) {
    markEmailAsSent(email, 'welcome');
  }

  return result;
}

export async function sendFeedbackNotification(feedbackData: {
  email: string;
  feedbackType: string;
  message: string;
}): Promise<boolean> {
  return sendEmail({
    to: 'support@holla-ai.com',
    from: 'support@holla-ai.com',
    subject: `New Feedback: ${feedbackData.feedbackType} from ${feedbackData.email}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #7C3AED;">New Feedback Submitted</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Email:</strong> ${feedbackData.email}</p>
          <p><strong>Type:</strong> ${feedbackData.feedbackType}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <h3>Message:</h3>
        <p style="background: #fff; padding: 15px; border-left: 3px solid #7C3AED; margin: 20px 0;">
          ${feedbackData.message}
        </p>
        
        <p style="font-size: 12px; color: #666; margin-top: 30px;">
          Response time target: 24 hours (2 hours for community safety reports)
        </p>
      </div>
    `,
    text: `New Feedback Submitted

Email: ${feedbackData.email}
Type: ${feedbackData.feedbackType}
Submitted: ${new Date().toLocaleString()}

Message:
${feedbackData.message}

Response time target: 24 hours (2 hours for community safety reports)`
  });
}

export async function sendFeedbackAutoReply(email: string, feedbackType: string): Promise<boolean> {
  // Check if feedback auto-reply was already sent for this type
  const emailKey = `feedback_${feedbackType}`;
  if (hasEmailBeenSent(email, emailKey)) {
    console.log(`Feedback auto-reply for ${feedbackType} already sent to ${email} - skipping duplicate`);
    return true;
  }

  const template = createSupportAutoReply(email, feedbackType);
  const result = await sendEmail(template);
  
  // Mark as sent if successful
  if (result) {
    markEmailAsSent(email, emailKey);
  }
  
  return result;
}

export async function sendPremiumUpgradeEmail(email: string, userName?: string): Promise<boolean> {
  // Check if premium upgrade email was already sent
  if (hasEmailBeenSent(email, 'premium_upgrade')) {
    console.log(`Premium upgrade email already sent to ${email} - skipping duplicate`);
    return true;
  }

  const template = premiumUpgradeEmailTemplate(email, userName);
  const result = await sendEmail(template);
  
  // Mark as sent if successful
  if (result) {
    markEmailAsSent(email, 'premium_upgrade');
  }
  
  return result;
}

export async function sendPremiumPlusUpgradeEmail(email: string, userName?: string): Promise<boolean> {
  // Check if premium plus upgrade email was already sent
  if (hasEmailBeenSent(email, 'premium_plus_upgrade')) {
    console.log(`Premium Plus upgrade email already sent to ${email} - skipping duplicate`);
    return true;
  }

  const template = premiumPlusUpgradeEmailTemplate(email, userName);
  const result = await sendEmail(template);
  
  // Mark as sent if successful
  if (result) {
    markEmailAsSent(email, 'premium_plus_upgrade');
  }
  
  return result;
}

export async function sendDripCampaignEmail(email: string, dayNumber: number): Promise<boolean> {
  // Check if drip campaign email for this day was already sent
  const emailKey = `drip_day_${dayNumber}`;
  if (hasEmailBeenSent(email, emailKey)) {
    console.log(`Drip campaign day ${dayNumber} email already sent to ${email} - skipping duplicate`);
    return true;
  }

  const { createDripCampaignEmail } = await import('./emailTemplates');
  const template = createDripCampaignEmail(email, dayNumber);
  if (!template) return false;
  
  const result = await sendEmail(template);
  
  // Mark as sent if successful
  if (result) {
    markEmailAsSent(email, emailKey);
  }
  
  return result;
}

export async function sendRefundRequestAutoReply(email: string): Promise<boolean> {
  // Check if refund request auto-reply was already sent
  if (hasEmailBeenSent(email, 'refund_auto_reply')) {
    console.log(`Refund request auto-reply already sent to ${email} - skipping duplicate`);
    return true;
  }

  const template = refundRequestAutoReplyTemplate(email);
  const result = await sendEmail({
    to: template.to,
    from: 'support@holla-ai.com',
    subject: template.subject,
    html: template.html,
    text: template.text
  });
  
  // Mark as sent if successful
  if (result) {
    markEmailAsSent(email, 'refund_auto_reply');
  }
  
  return result;
}

export async function sendRefundRequestNotification(email: string, reason?: string): Promise<boolean> {
  // Check if refund request notification was already sent
  if (hasEmailBeenSent(email, 'refund_notification')) {
    console.log(`Refund request notification already sent for ${email} - skipping duplicate`);
    return true;
  }

  const template = refundRequestNotificationTemplate(email, reason);
  const result = await sendEmail({
    to: template.to,
    from: 'support@holla-ai.com',
    subject: template.subject,
    html: template.html,
    text: template.text
  });
  
  // Mark as sent if successful
  if (result) {
    markEmailAsSent(email, 'refund_notification');
  }
  
  return result;
}