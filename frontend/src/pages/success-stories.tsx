import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Heart, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function SuccessStories() {
  const [, setLocation] = useLocation();

  const stories = [
    {
      name: "Alex M.",
      age: 28,
      story: "Holla's Creative tone helped me move past small talk immediately. Used the psychology-backed responses and got her number within 3 messages. We've been dating for 2 months now!",
      tone: "Creative",
      rating: 5
    },
    {
      name: "Jordan T.", 
      age: 25,
      story: "The Confident tone gave me the boost I needed. Instead of my usual boring replies, I started getting responses that actually led somewhere. Went on 5 dates this month alone.",
      tone: "Confident",
      rating: 5
    },
    {
      name: "Sam R.",
      age: 31,
      story: "Was terrible at being funny in texts. Holla's Funny tone taught me how to be witty without trying too hard. Now my matches actually laugh and want to meet up.",
      tone: "Funny", 
      rating: 5
    },
    {
      name: "Chris L.",
      age: 29,
      story: "The Flirty tone helped me create the right amount of tension without being creepy. Finally learned how to build romantic interest through text. Game changer!",
      tone: "Flirty",
      rating: 5
    }
  ];

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
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Success Stories</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real results from users who transformed their dating conversations with Holla
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {stories.map((story, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {story.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{story.name}</h3>
                  <p className="text-sm text-gray-600">Age {story.age}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                {[...Array(story.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-gray-600">Used {story.tone} Tone</span>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">"{story.story}"</p>
              
              <div className="text-xs text-gray-500">
                Results may vary. Individual experiences depend on multiple factors.
              </div>
            </div>
          ))}
        </div>

        <div className="bg-purple-50 rounded-xl p-8 mb-12">
          <div className="text-center">
            <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join The Success Stories</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Over 10,000+ users have improved their dating conversations with Holla's AI-powered suggestions. 
              Start building meaningful connections today.
            </p>
            <Button 
              onClick={() => setLocation("/")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Try Holla Free
            </Button>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Why Users Love Holla</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">💬</div>
              <h4 className="font-semibold text-gray-900 mb-2">Better Conversations</h4>
              <p className="text-sm text-gray-600">Move beyond "hey" and create engaging dialogue</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">🧠</div>
              <h4 className="font-semibold text-gray-900 mb-2">Psychology-Backed</h4>
              <p className="text-sm text-gray-600">Based on proven relationship and communication research</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">❤️</div>
              <h4 className="font-semibold text-gray-900 mb-2">Real Connections</h4>
              <p className="text-sm text-gray-600">Build authentic relationships, not just matches</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}