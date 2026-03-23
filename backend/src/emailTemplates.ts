// Email templates for automated support system
import dotenv from "dotenv"
dotenv.config()
export const welcomeEmailTemplate = (email: string) => ({
  to: email,
  from: 'hollasupp444@gmail.com',
  subject: 'Welcome to Holla™ – Let\'s Fix Your DMs 😎',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #7C3AED;">Hey there,</h2>
      
      <p>Thanks for signing up! You'll now receive expert-level dating tips, new feature drops, and early Premium Plus access.</p>
      
      <p><strong>Your next message could be the one that actually works 😉</strong></p>
      
      <p>Stay tuned — let's make dating smoother, smarter, and actually fun.</p>
      
      <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">
        <p style="margin: 0; font-style: italic;">Holla™ was built for guys tired of getting ghosted. This might just be the best thing you try this week.</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/auth/callback" style="display: inline-block; background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Try Holla™ Now</a>
      </div>
      
      <p>– Team Holla™</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #666;">
        Ready to share Holla™? <a href="${process.env.FRONTEND_URL}/auth/callback" style="color: #7C3AED;">Tell your friends</a> about smarter messaging.
      </p>
    </div>
  `,
  text: `Hey there,

Thanks for signing up! You'll now receive expert-level dating tips, new feature drops, and early Premium Plus access.

Your next message could be the one that actually works 😉

Stay tuned — let's make dating smoother, smarter, and actually fun.

– Team Holla™`
});

export const premiumUpgradeEmailTemplate = (email: string, userName?: string) => ({
  to: email,
  from: 'support@holla-ai.com',
  subject: 'You\'re Premium 🔥',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #7C3AED;">Welcome to Premium! 🚀 Now you're dating like a pro.</h2>
      
      <p>Enjoy unlimited replies, exclusive tools and more. You just unlocked the dating cheat codes.</p>
      
      <div style="background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 15px 0; color: white;">Your Premium Arsenal:</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>🚀 Unlimited AI replies (no more limits)</li>
          <li>🎯 Advanced conversation starters</li>
          <li>💬 Romeo AI personal coach</li>
          <li>⚡ Priority everything</li>
        </ul>
      </div>
      
      <p><strong>Fun fact:</strong> 75% of women say the first message matters most. You now have the tools to nail it every time.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/auth/callback" style="display: inline-block; background: linear-gradient(135deg, #FACC15, #F59E0B); color: black; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Start Your Premium Experience</a>
      </div>
      
      <p>Time to show the dating world what you're made of.</p>
      
      <p>– Team Holla</p>
    </div>
  `,
  text: `Welcome to Premium! Now you're dating like a pro.

Enjoy unlimited replies, exclusive tools and more. You just unlocked the dating cheat codes.

Your Premium Arsenal:
• Unlimited AI replies (no more limits)
• Advanced conversation starters
• Romeo AI personal coach
• Priority everything

Fun fact: 75% of women say the first message matters most. You now have the tools to nail it every time.

Time to show the dating world what you're made of.

– Team Holla`
});

export const premiumPlusUpgradeEmailTemplate = (email: string, userName?: string) => ({
  to: email,
  from: 'hollasupp444@gmail.com',
  subject: 'Welcome to Holla™ Premium Plus – The Ultimate Dating Arsenal! 💎',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #7C3AED;">Welcome to the Elite Club${userName ? `, ${userName}` : ''}!</h2>
      
      <p>You've unlocked <strong>Holla™ Premium Plus</strong> – the ultimate dating experience.</p>
      
      <div style="background: linear-gradient(135deg, #FACC15, #F59E0B); color: black; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 15px 0;">Your Premium Plus Arsenal:</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>📚 Proven Techniques</li>
          <li>💬 Conversation Frameworks</li>
          <li>🧠 Mastering the Psychology of Online Dating</li>
          <li>⚡ Everything from Premium</li>
        </ul>
      </div>
      
      <p>You now have access to the same strategies that top dating coaches charge hundreds for.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/auth/callback" style="display: inline-block; background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Access Premium Plus Features</a>
      </div>
      
      <p>– Team Holla™</p>
    </div>
  `,
  text: `Welcome to the Elite Club${userName ? `, ${userName}` : ''}!

You've unlocked Holla™ Premium Plus – the ultimate dating experience.

Your Premium Plus Arsenal:
• Proven Techniques
• Conversation Frameworks
• Mastering the Psychology of Online Dating
• Everything from Premium

You now have access to the same strategies that top dating coaches charge hundreds for.

– Team Holla™`
});

export const supportAutoReplyTemplates = {
  'ai_replies_not_generating': {
    subject: 'We Got Your Feedback 🙌',
    message: 'Thanks for helping us improve Holla. We\'re already on it – expect a fix soon. In the meantime, try switching to a different tone or refresh the page.',
    cta: 'Try again now',
    responseTime: '24 hours'
  },
  'payment_billing_problem': {
    subject: 'We Got Your Feedback 🙌', 
    message: 'Thanks for helping us improve Holla. No worries about billing – we\'ve got your back and will sort this out quickly. You\'ll never be overcharged.',
    cta: 'Check your account',
    responseTime: '24 hours'
  },
  'login_auth_problem': {
    subject: 'We Got Your Feedback 🙌',
    message: 'Thanks for helping us improve Holla. Let\'s get you back in! First, try resetting your password. Still stuck? Our team will personally help you out.',
    cta: 'Reset password',
    responseTime: '24 hours'
  },
  'feature_not_working': {
    subject: 'We Got Your Feedback 🙌',
    message: 'Thanks for helping us improve Holla. We\'re already reviewing this feature and will have it working perfectly soon.',
    cta: 'Try Premium features',
    responseTime: '24 hours'
  },
  'page_loading_error': {
    subject: 'We Got Your Feedback 🙌',
    message: 'Thanks for helping us improve Holla. Try refreshing first – if it\'s still acting up, we\'ll squash that bug fast.',
    cta: 'Reload app',
    responseTime: '24 hours'
  },
  'community_safety_report': {
    subject: 'We\'ve received your support request ✅',
    message: 'Our team will respond shortly. We\'ve got your back. Community safety is our top priority and we take every report seriously.',
    cta: 'Learn about safety',
    responseTime: '2 hours'
  },
  'other': {
    subject: 'We\'ve received your support request ✅',
    message: 'Our team will respond shortly. We\'ve got your back. Thanks for taking the time to reach out.',
    cta: 'Explore Premium features',
    responseTime: '24 hours'
  }
};

export const createSupportAutoReply = (email: string, feedbackType: string) => {
  const template = supportAutoReplyTemplates[feedbackType as keyof typeof supportAutoReplyTemplates] || supportAutoReplyTemplates.other;
  
  return {
    to: email,
    from: 'support@holla-ai.com',
    subject: template.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #7C3AED;">Thanks for reaching out!</h2>
        
        <p>${template.message}</p>
        
        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">
          <p style="margin: 0; font-style: italic;">Holla™ was built for guys tired of getting ghosted. This might just be the best thing you try this week.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/auth/callback" style="display: inline-block; background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">${template.cta}</a>
        </div>
        
        <p>Need faster help? Just reply to this email.</p>
        
        <p>– Team Holla™</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          Response time: ${template.responseTime} ${feedbackType === 'community_safety_report' ? '(priority)' : ''}
        </p>
      </div>
    `,
    text: `Thanks for reaching out!

${template.message}

Holla™ was built for guys tired of getting ghosted. This might just be the best thing you try this week.

${template.cta}: ${process.env.FRONTEND_URL}

Need faster help? Just reply to this email.

Response time: ${template.responseTime} ${feedbackType === 'community_safety_report' ? '(priority)' : ''}

– Team Holla`
  };
};

// Drip campaign templates for Premium users
export const dripCampaignTemplates = [
  {
    day: 3,
    subject: 'Want better replies? Start here…',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #7C3AED;">Ready to unlock Holla's secret weapon?</h2>
        
        <p>You've got Premium, which means you have access to something most guys don't: <strong>tone control with psychology-backed replies</strong>.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #7C3AED; margin: 0 0 15px 0;">Here's how to use it like a pro:</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li><strong>Confident:</strong> For career-focused profiles and ambitious women</li>
            <li><strong>Funny:</strong> When her bio mentions humor or she seems playful</li>
            <li><strong>Flirty:</strong> For casual vibes and when the energy feels right</li>
            <li><strong>Creative:</strong> For artists, free spirits, and unique personalities</li>
          </ul>
        </div>
        
        <p>The AI doesn't just generate replies – it understands <em>psychology</em>. Each tone triggers different emotional responses.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/auth/callback" style="display: inline-block; background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Try Different Tones Now</a>
        </div>
        
        <p>– Team Holla</p>
      </div>
    `,
    text: `Ready to unlock Holla's secret weapon?

You've got Premium, which means you have access to something most guys don't: tone control with psychology-backed replies.

Here's how to use it like a pro:
• Confident: For career-focused profiles and ambitious women
• Funny: When her bio mentions humor or she seems playful
• Flirty: For casual vibes and when the energy feels right
• Creative: For artists, free spirits, and unique personalities

The AI doesn't just generate replies – it understands psychology. Each tone triggers different emotional responses.

– Team Holla`
  },
  {
    day: 6,
    subject: 'Why she\'s ignoring your message (and how to fix it)',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #7C3AED;">She's ignoring you because you're doing what everyone else does...</h2>
        
        <p>Most guys send generic messages. You have <strong>Premium tools that decode what she actually wants to hear</strong>.</p>
        
        <div style="background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: white;">Your Secret Weapons:</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li><strong>Emotional Trigger Library:</strong> Know which emotions to target</li>
            <li><strong>Romeo Decoder:</strong> Understand what her profile really means</li>
            <li><strong>Pattern Interrupts:</strong> Break through her mental autopilot</li>
          </ul>
        </div>
        
        <p>These aren't just features – they're based on dating psychology that works. Use Romeo to decode her profile, then let the Pattern Interrupt Engine create replies that actually get responses.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/auth/callback" style="display: inline-block; background: linear-gradient(135deg, #FACC15, #F59E0B); color: black; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Try These Tools Now</a>
        </div>
        
        <p>– Team Holla</p>
      </div>
    `,
    text: `She's ignoring you because you're doing what everyone else does...

Most guys send generic messages. You have Premium tools that decode what she actually wants to hear.

Your Secret Weapons:
• Emotional Trigger Library: Know which emotions to target
• Romeo Decoder: Understand what her profile really means
• Pattern Interrupts: Break through her mental autopilot

These aren't just features – they're based on dating psychology that works. Use Romeo to decode her profile, then let the Pattern Interrupt Engine create replies that actually get responses.

– Team Holla`
  },
  {
    day: 9,
    subject: 'What if Holla was the reason she replied?',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #7C3AED;">Imagine if every message you sent got a reply...</h2>
        
        <p>That's not a fantasy – it's what happens when you have <strong>AI that understands dating psychology</strong>.</p>
        
        <div style="background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: white;">Here's what Holla is really about:</h3>
          <p style="margin: 0;">We're not just generating replies. We're giving you the confidence to be yourself, the tools to connect authentically, and the psychology insights that actually work. This is about transforming how you communicate.</p>
        </div>
        
        <p>Every conversation you have with Holla makes you better at dating. The AI learns, you learn, and suddenly dating becomes something you're excited about instead of stressed about.</p>
        
        <p><strong>The future?</strong> We're building tools that will make every interaction feel natural and confident. You're part of something bigger.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/auth/callback" style="display: inline-block; background: linear-gradient(135deg, #FACC15, #F59E0B); color: black; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Continue Your Journey</a>
        </div>
        
        <p>Thanks for being part of the Holla family.</p>
        <p>– Team Holla</p>
      </div>
    `,
    text: `Imagine if every message you sent got a reply...

That's not a fantasy – it's what happens when you have AI that understands dating psychology.

Here's what Holla is really about:
We're not just generating replies. We're giving you the confidence to be yourself, the tools to connect authentically, and the psychology insights that actually work. This is about transforming how you communicate.

Every conversation you have with Holla makes you better at dating. The AI learns, you learn, and suddenly dating becomes something you're excited about instead of stressed about.

The future? We're building tools that will make every interaction feel natural and confident. You're part of something bigger.

Thanks for being part of the Holla family.
– Team Holla`
  }
];

export const createDripCampaignEmail = (email: string, dayNumber: number) => {
  const template = dripCampaignTemplates.find(t => t.day === dayNumber);
  if (!template) return null;
  
  return {
    to: email,
    from: 'support@holla-ai.com',
    subject: template.subject,
    html: template.html,
    text: template.text
  };
};

export const refundRequestAutoReplyTemplate = (email: string) => ({
  to: email,
  from: {
    email: 'support@holla-ai.com',
    name: 'Holla Support'
  },
  subject: 'Refund Request Received ✅',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 20px; border-radius: 12px;">
          <h1 style="margin: 0; font-size: 24px;">Refund Request Confirmed</h1>
        </div>
      </div>
      
      <p>Hi there,</p>
      
      <p>We've received your refund request and wanted to confirm it's being processed.</p>
      
      <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 15px 0; color: #374151;">What happens next:</h3>
        <ul style="margin: 0; padding-left: 20px; color: #6B7280;">
          <li><strong>Manual Review:</strong> Your request will be reviewed within 24 hours</li>
          <li><strong>Processing Time:</strong> Approved refunds are processed within 3-5 business days</li>
          <li><strong>Subscription Cancellation:</strong> Your subscription will be cancelled upon approval</li>
          <li><strong>Payment Method:</strong> Refund will be sent to your original payment method</li>
        </ul>
      </div>
      
      <p>Our team manually reviews each refund request to ensure everything is handled properly. You'll receive another email once your refund has been processed.</p>
      
      <p>If you have any questions or concerns, simply reply to this email and we'll help you out.</p>
      
      <p>Thanks for giving Holla a try!</p>
      
      <p>– Team Holla™</p>
      
      <div style="text-align: center; margin-top: 30px; padding: 20px; background: #F9FAFB; border-radius: 8px;">
        <p style="margin: 0; font-size: 12px; color: #6B7280;">
          This is an automated confirmation. Refunds are manually reviewed and processed by our team.
        </p>
      </div>
    </div>
  `,
  text: `Refund Request Confirmed

Hi there,

We've received your refund request and wanted to confirm it's being processed.

What happens next:
• Manual Review: Your request will be reviewed within 24 hours
• Processing Time: Approved refunds are processed within 3-5 business days  
• Subscription Cancellation: Your subscription will be cancelled upon approval
• Payment Method: Refund will be sent to your original payment method

Our team manually reviews each refund request to ensure everything is handled properly. You'll receive another email once your refund has been processed.

If you have any questions or concerns, simply reply to this email and we'll help you out.

Thanks for giving Holla a try!

– Team Holla™`
});

export const refundRequestNotificationTemplate = (email: string, reason?: string) => ({
  to: 'support@holla-ai.com',
  from: {
    email: 'support@holla-ai.com',
    name: 'Holla Support'
  },
  subject: `🔔 Refund Request from ${email}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #DC2626;">Refund Request Received</h2>
      
      <div style="background: #FEF2F2; border-left: 4px solid #DC2626; padding: 15px; margin: 20px 0;">
        <p><strong>Customer Email:</strong> ${email}</p>
        <p><strong>Request Time:</strong> ${new Date().toLocaleString()}</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      </div>
      
      <div style="background: #F3F4F6; padding: 20px; border-radius: 8px;">
        <h3>Action Required:</h3>
        <ol>
          <li>Review customer's subscription in Stripe dashboard</li>
          <li>Verify refund eligibility (within 7 days)</li>
          <li>Process refund and cancel subscription if approved</li>
          <li>Send confirmation email to customer</li>
        </ol>
      </div>
      
      <p style="margin-top: 20px; font-size: 12px; color: #6B7280;">
        Auto-reply confirmation has been sent to the customer.
      </p>
    </div>
  `,
  text: `Refund Request Received

Customer Email: ${email}
Request Time: ${new Date().toLocaleString()}
${reason ? `Reason: ${reason}` : ''}

Action Required:
1. Review customer's subscription in Stripe dashboard
2. Verify refund eligibility (within 7 days)  
3. Process refund and cancel subscription if approved
4. Send confirmation email to customer

Auto-reply confirmation has been sent to the customer.`
});