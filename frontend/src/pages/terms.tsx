import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Terms() {
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
            Terms of Service
          </h1>
          <p className="text-gray-600">Last updated: June 2025</p>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Holla™ ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2>2. Intellectual Property Rights</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of Holla™ and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
          </p>

          <h2>3. Prohibited Uses</h2>
          <p>You may not use our Service:</p>
          <ul>
            <li>To reverse engineer, decompile, or disassemble any part of the Service</li>
            <li>To replicate, copy, or resell our AI prompt flows, algorithms, or proprietary methods</li>
            <li>To create derivative works or competing services based on our technology</li>
            <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
          </ul>

          <h2>4. Privacy and Data Protection</h2>
          <p>
            Your privacy is important to us. User-generated data and conversations are private and not stored for resale or distribution to third parties. We collect and use information in accordance with our Privacy Policy.
          </p>

          <h2>5. AI-Generated Content</h2>
          <p>
            Our Service provides AI-generated suggestions and content. While we strive for accuracy and helpfulness, you are responsible for reviewing and using this content appropriately. We do not guarantee the accuracy, completeness, or suitability of AI-generated responses.
          </p>

          <h2>6. Subscription Terms</h2>
          <p>
            Premium subscriptions are billed monthly and automatically renew unless cancelled. You may cancel your subscription at any time through your account settings.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            In no event shall Holla™, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>

          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
          </p>

          <h2>10. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us through our support channels.
          </p>
        </div>
      </div>
    </div>
  );
}