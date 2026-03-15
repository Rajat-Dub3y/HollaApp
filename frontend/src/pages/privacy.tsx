import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#2563EB] bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600">Last updated: June 2025</p>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2>1. Information We Collect</h2>
          <p>
            When you use Holla™, we collect information you provide directly to us, including:
          </p>
          <ul>
            <li>Account information (email, profile details)</li>
            <li>Messages and conversations you input for AI analysis</li>
            <li>Usage data and preferences</li>
            <li>Payment information (processed securely through Stripe)</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and improve our AI-powered communication services</li>
            <li>Process your subscription and payments</li>
            <li>Send service updates and support communications</li>
            <li>Analyze usage patterns to enhance user experience</li>
          </ul>

          <h2>3. Data Privacy and Storage</h2>
          <p>
            <strong>Your conversations and data are private.</strong> We do not:
          </p>
          <ul>
            <li>Store your personal messages for resale or distribution</li>
            <li>Share your conversation data with third parties</li>
            <li>Use your personal content for marketing to others</li>
            <li>Retain message content longer than necessary for service delivery</li>
          </ul>

          <h2>4. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties except:
          </p>
          <ul>
            <li>With your explicit consent</li>
            <li>To trusted service providers who assist in operating our platform</li>
            <li>When required by law or to protect our rights</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard security measures including encryption, secure servers, and access controls to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2>6. AI Processing</h2>
          <p>
            Our AI services process your messages to generate responses and insights. This processing happens on secure servers and data is not stored permanently or used to train models that could expose your personal information.
          </p>

          <h2>7. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance your experience, remember preferences, and analyze site usage. You can control cookie settings through your browser.
          </p>

          <h2>8. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and update your personal information</li>
            <li>Delete your account and associated data</li>
            <li>Opt out of non-essential communications</li>
            <li>Request data portability</li>
          </ul>

          <h2>9. Children's Privacy</h2>
          <p>
            Our service is not intended for users under 18. We do not knowingly collect personal information from children under 18.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our data practices, please contact us through our support channels or email us directly.
          </p>
        </div>
      </div>
    </div>
  );
}