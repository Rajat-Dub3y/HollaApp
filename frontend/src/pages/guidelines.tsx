import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Users, Heart, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";

export default function Guidelines() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back To Home
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Community Guidelines</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Building respectful connections through responsible AI-assisted communication
          </p>
        </div>

        <div className="space-y-12">
          <div className="bg-green-50 rounded-xl p-8">
            <div className="flex items-center mb-6">
              <Heart className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Our Core Values</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Respect</h3>
                <p className="text-gray-700">All interactions should be respectful, consensual, and focused on building genuine connections.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Authenticity</h3>
                <p className="text-gray-700">Use Holla to enhance your natural communication style, not to deceive or misrepresent yourself.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety</h3>
                <p className="text-gray-700">Never use our suggestions for harassment, manipulation, or any form of harmful behavior.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth</h3>
                <p className="text-gray-700">Learn from our AI suggestions to improve your own communication skills over time.</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-6">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Acceptable Use</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-4">✓ Encouraged</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Building genuine romantic connections</li>
                    <li>• Learning better communication skills</li>
                    <li>• Expressing your authentic personality</li>
                    <li>• Creating engaging, respectful conversations</li>
                    <li>• Moving conversations toward real meetings</li>
                    <li>• Asking thoughtful, getting-to-know-you questions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-4">✗ Prohibited</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Harassment or aggressive messaging</li>
                    <li>• Deceptive or manipulative behavior</li>
                    <li>• Sending inappropriate or explicit content</li>
                    <li>• Using replies to catfish or misrepresent yourself</li>
                    <li>• Spamming multiple people with identical messages</li>
                    <li>• Ignoring clear signs of disinterest</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Best Practices</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Using AI Suggestions Responsibly</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Adapt suggestions to match your authentic voice and personality</li>
                  <li>• Use replies as inspiration, not as exact scripts to copy</li>
                  <li>• Consider the context and her communication style before sending</li>
                  <li>• Be prepared to continue conversations naturally after using suggestions</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Building Real Connections</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Focus on quality conversations over quantity of matches</li>
                  <li>• Ask follow-up questions that show genuine interest</li>
                  <li>• Share authentic details about yourself when appropriate</li>
                  <li>• Respect boundaries and respond appropriately to her comfort level</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-8">
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Consequences</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Violations of these guidelines may result in:
            </p>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>• Warning and account review</li>
              <li>• Temporary suspension of Premium features</li>
              <li>• Permanent account termination for serious violations</li>
              <li>• Reporting to relevant authorities if illegal activity is suspected</li>
            </ul>
            <p className="text-gray-700">
              We reserve the right to investigate reported misuse and take appropriate action to maintain a safe, respectful community.
            </p>
          </div>

          <div className="text-center bg-blue-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions or Concerns?</h2>
            <p className="text-gray-600 mb-6">
              If you encounter inappropriate use of Holla or need clarification on our guidelines, contact us immediately.
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Report Issues:</strong> support@holla.com</p>
              <p><strong>Community Safety:</strong> Chat with Romeo AI or use our report system</p>
              <p><strong>Response Time:</strong> Community safety reports reviewed within 2 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}