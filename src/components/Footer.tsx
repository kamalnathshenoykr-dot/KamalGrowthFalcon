import React from 'react';
import { Flame, ShieldCheck, HeartHandshake, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-xs text-[#7A6A5C] border-t border-orange-200/80 text-xs py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-semibold text-[#3A2E25]">
                Growth Falcon — Prototype for case competition. All data is simulated.
              </p>
              <p className="text-[11px] text-[#7A6A5C]">
                Bangalore Cloud Kitchen Collective: Koramangala • Indiranagar • HSR Layout • Whitefield • Bellandur
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-[#7A6A5C]">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Consent-Based AA Rail</span>
            </span>
            <span className="text-orange-200">|</span>
            <span className="flex items-center space-x-1">
              <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
              <span>Partner Bank Embedded Finance</span>
            </span>
            <span className="text-orange-200">|</span>
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>₹ INR Pricing</span>
            </span>
            <span className="text-orange-200">|</span>
            <a
              href="/api/download-html"
              download="growth-falcon-app.html"
              className="text-orange-600 hover:text-orange-700 font-bold underline"
              title="Download standalone HTML file"
            >
              Download Standalone .html
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
