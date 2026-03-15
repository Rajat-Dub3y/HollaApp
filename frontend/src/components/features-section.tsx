import { TrendingUp, Brain, Bookmark, Heart } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: TrendingUp,
      title: "Boost Response Rate",
      description: "AI-backed replies that actually get responses based on real conversation data.",
      gradient: "from-purple-600 to-blue-600",
    },
    {
      icon: Brain,
      title: "Understand Her Mind",
      description: "Learn how women think through psychology-based insights and expert analysis.",
      gradient: "from-pink-500 to-purple-600",
    },
    {
      icon: Bookmark,
      title: "Save Your Best",
      description: "Keep your top-performing replies for future conversations.",
      gradient: "from-blue-600 to-cyan-400",
    },
    {
      icon: Heart,
      title: "Vibe Check",
      description: "Premium feature: Upload full conversations for tone analysis and suggestions.",
      gradient: "from-green-400 to-blue-600",
      isPremium: true,
    },
  ];

  const premiumPlusFeatures = [
    {
      icon: "🧠",
      title: "Advanced Pattern Analysis",
      description: "Deep psychological insights into message patterns and conversation flow.",
    },
    {
      icon: "⚡",
      title: "Real-time Response Optimization",
      description: "AI analyzes ongoing conversations and suggests perfect follow-ups.",
    },
    {
      icon: "📊",
      title: "Success Analytics Dashboard",
      description: "Track your conversation success rates and improvement metrics.",
    },
  ];

  return (
    <section id="features" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Why Use <span className="gradient-text">Holla</span>?
          </h2>
          <p className="text-xl text-gray-800 dark:text-gray-200 max-w-3xl mx-auto">
            Transform your online conversations with AI-powered insights and proven response strategies.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="glass-card rounded-2xl p-6 text-center hover:border-purple-600/50 transition-all duration-300 group">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
                {feature.isPremium && (
                  <div className="mt-3">
                    <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded-full">Premium</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Premium Plus Preview */}
        <div className="mt-16 glass-card rounded-2xl p-8 border border-purple-600/30">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              <span className="gradient-text">Premium Plus</span> - Coming Soon
            </h3>
            <p className="text-gray-800 dark:text-gray-200">
              Take your game to the next level with expert coaching and proven frameworks.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {premiumPlusFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">{feature.icon}</span>
                </div>
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
