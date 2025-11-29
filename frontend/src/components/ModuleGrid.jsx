import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function ModuleGrid() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const modules = [
    {
      id: 'disease',
      title: t('modules.crop_disease'),
      desc: t('modules.crop_disease_desc'),
      icon: '🦠',
      quickAction: t('modules.quick_action'),
      path: '/crop-disease',
      backgroundImage: '/images/services/crop_diseases.jpg',
    },
    {
      id: 'soil',
      title: t('modules.soil_health'),
      desc: t('modules.soil_health_desc'),
      icon: '🌱',
      quickAction: t('modules.quick_action'),
      path: '/soil-health',
      backgroundImage: '/images/services/soil health.jpg',
    },
    {
      id: 'irrigation',
      title: t('modules.irrigation'),
      desc: t('modules.irrigation_desc'),
      icon: '💧',
      quickAction: t('modules.quick_action'),
      path: '/irrigation',
      backgroundImage: '/images/services/Pesticide Fertilizer.avif',
    },
    {
      id: 'yield',
      title: t('modules.yield_prediction'),
      desc: t('modules.yield_prediction_desc'),
      icon: '📈',
      quickAction: t('modules.quick_action'),
      path: '/yield-prediction',
      backgroundImage: '/images/services/yield.jpg',
    },
    {
      id: 'pest',
      title: t('modules.pest_weed'),
      desc: t('modules.pest_weed_desc'),
      icon: '🐛',
      quickAction: t('modules.quick_action'),
      path: '/pest-weed',
      backgroundImage: '/images/services/pest.jpg',
    },
    {
      id: 'schemes',
      title: t('modules.schemes'),
      desc: t('modules.schemes_desc'),
      icon: '📋',
      quickAction: t('modules.quick_action'),
      path: '/schemes',
      backgroundImage: '/images/services/govt_schemes.jpg',
    },
    {
      id: 'seeds',
      title: t('modules.seed_selection'),
      desc: t('modules.seed_selection_desc'),
      icon: '🌾',
      quickAction: t('modules.quick_action'),
      path: '/seed-selection',
      backgroundImage: '/images/services/Seed Selection & Crop Planning.jpg',
    },
    {
      id: 'safety',
      title: t('modules.safety'),
      desc: t('modules.safety_desc'),
      icon: '⚠️',
      quickAction: t('modules.quick_action'),
      path: '/safety',
      backgroundImage: '/images/services/pest.jpg',
    },
    {
      id: 'insurance',
      title: t('modules.insurance'),
      desc: t('modules.insurance_desc'),
      icon: '🛡️',
      quickAction: t('modules.quick_action'),
      path: '/insurance',
      backgroundImage: '/images/services/Insurance Advisory (PMFBY).jpg',
    },
    {
      id: 'loan',
      title: t('modules.loan'),
      desc: t('modules.loan_desc'),
      icon: '💰',
      quickAction: t('modules.quick_action'),
      path: '/loan',
      backgroundImage: '/images/services/Loan & Credit Guidance.webp',
    },
    {
      id: 'calendar',
      title: 'Agricultural Calendar',
      desc: 'Track farming activities: schemes, irrigation, fertilizer, seasons & harvest dates',
      icon: '📅',
      quickAction: t('modules.quick_action'),
      path: '/calendar',
      backgroundImage: '/images/services/govt_schemes.jpg',
    },
  ];

  return (
    <section
      className="py-8 px-4 lg:px-6 max-w-7xl mx-auto"
      role="region"
      aria-label="Feature Modules"
    >
      <div className="mb-8">
        <h2 className="text-h2 font-bold text-textDark mb-2">
          All Services
        </h2>
        <p className="text-body text-textLight">
          Explore our complete suite of agricultural tools and resources.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <div
            key={module.id}
            className="relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-smooth group h-48"
            role="article"
            style={{
              backgroundImage: `url('${module.backgroundImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80 group-hover:from-black/50 group-hover:via-black/60 group-hover:to-black/70 transition-smooth"></div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-5 text-white z-10">
              {/* Icon & Header */}
              <div className="flex items-start justify-between">
                <div className="text-3xl drop-shadow-lg">{module.icon}</div>
                <svg className="w-4 h-4 text-white opacity-80 group-hover:opacity-100 transition-smooth" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Bottom Content */}
              <div>
                {/* Title */}
                <h3 className="text-sm font-bold mb-2 line-clamp-2 drop-shadow-lg">
                  {module.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-100 mb-3 line-clamp-2 drop-shadow">
                  {module.desc}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    className="flex-1 px-3 py-2 bg-white/90 text-primaryGreen font-medium text-xs rounded transition-smooth hover:bg-white focus-ring backdrop-blur-sm"
                    onClick={() => navigate(module.path)}
                  >
                    {t('modules.open')}
                  </button>
                  <button
                    className="flex-1 px-3 py-2 bg-primaryGreen text-white font-medium text-xs rounded transition-smooth hover:bg-accentGreen focus-ring"
                    onClick={() => navigate(module.path)}
                  >
                    {module.quickAction}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
