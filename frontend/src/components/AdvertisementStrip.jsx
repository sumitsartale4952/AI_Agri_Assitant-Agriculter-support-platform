import { useTranslation } from 'react-i18next';

export default function AdvertisementStrip() {
  const { t } = useTranslation();

  return (
    <section
      className="py-6 px-4 lg:px-6 max-w-7xl mx-auto"
      role="region"
      aria-label={t('advertisement.advertisement')}
    >
      {/* Labeled Sponsored Strip */}
      <div className="relative bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
        {/* Sponsored Label */}
        <div className="absolute top-2 left-4">
          <span className="text-xs font-bold text-textLight uppercase tracking-wider bg-white px-2 py-1">
            {t('advertisement.sponsored')}
          </span>
        </div>

        {/* Content Container */}
        <div className="mt-6 flex flex-col md:flex-row items-center gap-6">
          {/* Left: Placeholder Image / Logo */}
          <div className="w-full md:w-40 h-32 bg-neutralGray rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="text-center">
              <div className="text-3xl mb-1">🌾</div>
              <div className="text-xs text-textLight font-medium">Partner Logo</div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-textDark mb-2">
              Premium Fertilizer Packages for Your Crops
            </h3>
            <p className="text-sm text-textLight mb-4">
              Get expert-recommended, soil-tested fertilizer blends delivered to your doorstep. Special discounts for registered farmers on the AI Agri Assistant platform.
            </p>

            {/* Offer Highlights */}
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="inline-block bg-neutralGray text-primaryGreen px-3 py-1 rounded text-xs font-medium">
                ✓ Free soil analysis
              </span>
              <span className="inline-block bg-neutralGray text-primaryGreen px-3 py-1 rounded text-xs font-medium">
                ✓ 20% discount
              </span>
              <span className="inline-block bg-neutralGray text-primaryGreen px-3 py-1 rounded text-xs font-medium">
                ✓ Fast delivery
              </span>
            </div>

            {/* CTA Button */}
            <button className="px-6 py-2 bg-primaryGreen text-white rounded font-medium text-sm hover:bg-accentGreen transition-smooth focus-ring">
              Learn More →
            </button>
          </div>
        </div>

        {/* Close / Dismiss Option (optional, for user control) */}
        <button
          className="absolute top-3 right-3 p-1 text-textLight hover:text-textDark transition-smooth opacity-60 hover:opacity-100"
          aria-label="Close advertisement"
          onClick={(e) => {
            e.currentTarget.closest('section').style.display = 'none';
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Compliance note */}
      <p className="text-xs text-textLight mt-3 text-center">
        This is a sponsored placement. The AI Agri Assistant maintains editorial independence and recommends products based on farmer benefit.
      </p>
    </section>
  );
}
