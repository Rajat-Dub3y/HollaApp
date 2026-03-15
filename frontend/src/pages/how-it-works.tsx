import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Wand2, Copy, Heart } from "lucide-react";
import { useLocation } from "wouter";

export default function HowItWorks() {
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

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">How Holla Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your conversations in four simple steps with AI-powered assistance
          </p>
        </div>

        <div className="space-y-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 1: Paste Her Message</h2>
              <p className="text-gray-600 text-lg">
                Copy and paste the message she sent you into Holla. Whether it's a simple "Hey" or a detailed question, our AI analyzes the context to understand the conversation flow.
              </p>
            </div>
            <div className="w-full md:w-1/2 bg-gray-50 rounded-xl p-6">
              <div className="text-sm text-gray-500 mb-2">Example:</div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-gray-900">"Hey! How's your day going? 😊"</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="w-full md:w-1/2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Wand2 className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 2: Choose Your Tone</h2>
              <p className="text-gray-600 text-lg">
                Select from four expertly crafted tones: Confident, Funny, Flirty, or Creative (Premium). Each tone is backed by relationship psychology and proven conversation techniques.
              </p>
            </div>
            <div className="w-full md:w-1/2 bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-2xl mb-1">😎</div>
                  <div className="text-sm font-semibold">Confident</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-2xl mb-1">😂</div>
                  <div className="text-sm font-semibold">Funny</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-2xl mb-1">👀</div>
                  <div className="text-sm font-semibold">Flirty</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200">
                  <div className="text-2xl mb-1">🧠</div>
                  <div className="text-sm font-semibold">Creative</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Copy className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 3: Get AI Replies</h2>
              <p className="text-gray-600 text-lg">
                Our AI generates three unique reply options tailored to your chosen tone. Each response is crafted using dating psychology principles and proven conversation frameworks.
              </p>
            </div>
            <div className="w-full md:w-1/2 bg-gray-50 rounded-xl p-6">
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-900 text-sm">"Day's been solid, thanks! Just wrapped up a workout. What's the highlight of yours so far?"</p>
                  <div className="text-xs text-green-600 mt-2">Confidence: 88%</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-900 text-sm">"Can't complain! Living the dream one coffee at a time ☕ How about you?"</p>
                  <div className="text-xs text-green-600 mt-2">Confidence: 92%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="w-full md:w-1/2">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 4: Build Connection</h2>
              <p className="text-gray-600 text-lg">
                Copy your favorite reply and send it with confidence. Our responses are designed to create genuine engagement and move conversations toward meaningful connections.
              </p>
            </div>
            <div className="w-full md:w-1/2 bg-green-50 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Result</h3>
              <p className="text-gray-700">More engaging conversations that lead to real connections</p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-purple-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready To Get Started?</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of users who've improved their online dating conversations with Holla
          </p>
          <Button 
            onClick={() => setLocation("/")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
          >
            Try Holla Now
          </Button>
        </div>
      </div>
    </div>
  );
}