import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative pt-8 pb-12 px-4 lg:px-6 overflow-hidden bg-gradient-to-br from-primaryGreen/5 to-transparent">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primaryGreen rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accentGreen rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div>
            <div className="mb-4">
              <span className="inline-block bg-primaryGreen/10 text-primaryGreen px-4 py-2 rounded-full text-sm font-semibold">
                🌾 Welcome to AI Agri Assistant
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-textDark mb-4 leading-tight">
              Smart Technology for Smart Farming
            </h1>

            <p className="text-lg text-textLight mb-6 leading-relaxed">
              Empower your agricultural decisions with AI-driven insights. Get real-time disease detection, soil health analysis, yield predictions, and government scheme information—all in one platform.
            </p>

            {/* Key Features List */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-primaryGreen rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-textDark font-medium">AI-Powered Crop Disease Detection</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-primaryGreen rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-textDark font-medium">Real-time Soil Health Analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-primaryGreen rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-textDark font-medium">Yield Prediction & Optimization</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/crop-disease')}
                className="px-8 py-3 bg-primaryGreen text-white rounded-lg font-semibold hover:bg-accentGreen transition-smooth shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started →
              </button>
              <button
                onClick={() => navigate('/schemes')}
                className="px-8 py-3 bg-white text-primaryGreen rounded-lg font-semibold border-2 border-primaryGreen hover:bg-primaryGreen hover:text-white transition-smooth"
              >
                Explore Schemes
              </button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden md:block">
            <div className="relative w-full aspect-square">
              {/* Main Circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-primaryGreen/20 to-accentGreen/20 rounded-full blur-2xl"></div>

              {/* Icons Grid */}
              <div className="absolute inset-10 flex items-center justify-center flex-col gap-8">
                <div className="text-6xl animate-bounce">🌾</div>
                <div className="flex gap-8">
                  <div className="text-5xl animate-pulse">🤖</div>
                  <div className="text-5xl animate-pulse" style={{ animationDelay: '0.2s' }}>
                    📊
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="text-5xl animate-pulse" style={{ animationDelay: '0.4s' }}>
                    🧪
                  </div>
                  <div className="text-5xl animate-pulse" style={{ animationDelay: '0.6s' }}>
                    💡
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute top-8 left-0 bg-white rounded-lg shadow-lg p-3 border-l-4 border-primaryGreen animate-float">
                <p className="text-xs font-semibold text-textDark">Disease Alert</p>
                <p className="text-xs text-textLight">Early Blight detected</p>
              </div>

              <div className="absolute bottom-8 right-0 bg-white rounded-lg shadow-lg p-3 border-l-4 border-accentGreen animate-float" style={{ animationDelay: '0.5s' }}>
                <p className="text-xs font-semibold text-textDark">Yield Forecast</p>
                <p className="text-xs text-textLight">+15% expected yield</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mt-16 pt-12 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-primaryGreen mb-2">50K+</div>
            <div className="text-sm text-textLight">Farmers Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primaryGreen mb-2">95%</div>
            <div className="text-sm text-textLight">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primaryGreen mb-2">24/7</div>
            <div className="text-sm text-textLight">Support Available</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}
