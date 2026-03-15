import { AlertTriangle } from "lucide-react";

interface DisclaimerSectionProps {
  onAccept: () => void;
}

export default function DisclaimerSection({ onAccept }: DisclaimerSectionProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-8 border-l-4 border-purple-600 max-w-3xl mx-auto animate-slide-up">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <AlertTriangle className="text-purple-600 text-xl mt-1" />
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-lg mb-3 text-gray-900">Important Notice</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            This app is for men seeking to improve how they communicate with women online — whether casually or seriously — always respectfully. Use it only if your intention is to build a real connection, even if it's short-lived. <span className="text-purple-600 font-medium">Respect is key.</span>
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            We respect all orientations and identities. This app is designed specifically around how women typically respond to online messages, based on dating data and expert insight. Please only use this tool if you intend to connect respectfully and treat others with kindness — no matter the outcome.
          </p>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button 
          onClick={onAccept}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          ✓ I Agree & Continue
        </button>
      </div>
    </div>
  );
}
