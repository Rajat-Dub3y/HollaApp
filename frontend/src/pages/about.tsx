import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Users, Shield } from "lucide-react";
import { useLocation } from "wouter";

export default function About() {
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#2563EB] bg-clip-text text-transparent mb-6">About Holla™</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering authentic connections through AI-powered communication guidance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Respectful Communication</h3>
            <p className="text-gray-600">
              We believe in fostering genuine connections built on respect and authentic interaction.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Meaningful Connections</h3>
            <p className="text-gray-600">
              Our AI helps you express yourself authentically to build lasting relationships.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Privacy First</h3>
            <p className="text-gray-600">
              Your conversations and data are protected with enterprise-grade security.
            </p>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            Holla was created to help people communicate more effectively in the digital dating world. 
            We understand that starting conversations and maintaining engaging dialogue can be challenging, 
            especially when you want to make a genuine connection.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Help</h2>
          <p className="text-gray-700 mb-6">
            Our AI is trained on proven communication principles from relationship psychology, 
            dating expertise, and social dynamics research. We provide suggestions that help you:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li>Express your personality authentically</li>
            <li>Create engaging conversations that stand out</li>
            <li>Build genuine connections based on mutual interest</li>
            <li>Navigate different conversation styles and tones</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
          <p className="text-gray-700 mb-6">
            We are committed to promoting respectful, authentic communication. Holla is designed 
            to enhance your natural communication style, not replace your personality. We believe 
            the best connections happen when people can express themselves genuinely and confidently.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700">
            Have questions or feedback? Chat with Romeo, our AI assistant, or reach out to us at support@holla.com
          </p>
        </div>
      </div>
    </div>
  );
}