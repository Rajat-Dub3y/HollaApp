import posthog from 'posthog-js';

// Initialize PostHog
if (typeof window !== 'undefined') {
  posthog.init('phc_5jXTuWdewonwC8LJZqXY1yThedVGUNQrOHe3aDOkfqt', {
    api_host: 'https://us.i.posthog.com',
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: {
        password: true,
        email: false,
      },
    },
  });
}

// Analytics event tracking
export const analytics = {
  // Page views
  trackPageView: (pageName: string) => {
    posthog.capture('page_viewed', { page: pageName });
  },

  // User authentication
  trackSignIn: () => {
    posthog.capture('user_signed_in');
  },

  trackSignOut: () => {
    posthog.capture('user_signed_out');
  },

  // Premium conversion tracking
  trackUpgradeClick: (plan: 'premium' | 'premium_plus') => {
    posthog.capture('upgrade_button_clicked', { plan });
  },

  trackPricingPageView: () => {
    posthog.capture('pricing_page_viewed');
  },

  trackSubscriptionStart: (plan: 'premium' | 'premium_plus') => {
    posthog.capture('subscription_started', { plan });
  },

  trackSubscriptionComplete: (plan: 'premium' | 'premium_plus', amount: number) => {
    posthog.capture('subscription_completed', { plan, amount });
  },

  // Feature usage
  trackReplyGenerated: (tone: string, isPremium: boolean) => {
    posthog.capture('reply_generated', { tone, is_premium: isPremium });
  },

  trackPatternInterruptUsed: () => {
    posthog.capture('pattern_interrupt_used');
  },

  trackRomeoCoachUsed: (isPremium: boolean) => {
    posthog.capture('romeo_coach_used', { is_premium: isPremium });
  },

  // Engagement metrics
  trackReplyCopied: (replyText: string) => {
    posthog.capture('reply_copied', { reply_length: replyText.length });
  },

  trackReplyRated: (rating: number) => {
    posthog.capture('reply_rated', { rating });
  },

  trackShareClick: () => {
    posthog.capture('share_clicked');
  },

  // Dropoff tracking
  trackPricingDropoff: (lastAction: string) => {
    posthog.capture('pricing_dropoff', { last_action: lastAction });
  },

  trackCheckoutAbandoned: (step: string) => {
    posthog.capture('checkout_abandoned', { step });
  },

  // User properties
  setUserProperties: (userId: string, properties: Record<string, any>) => {
    posthog.identify(userId, properties);
  },
};

export default analytics;