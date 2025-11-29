import { useTranslation } from 'react-i18next';
import WeatherWidget from './WeatherWidget';
import PriceSnapshot from './PriceSnapshot';

export default function SnapshotBar() {
  const { t } = useTranslation();

  // Mock data - in production, fetch from weather_service, agmarknet, MCP services
  const userCity = 'Mumbai'; // In production, get from user profile/location

  const hasAlert = true;
  const alertMessage = 'Fall Armyworm detected in your region. Click to view details.';

  return (
    <section
      className="mt-20 pt-6 pb-4 px-4 lg:px-6 max-w-7xl mx-auto"
      role="region"
      aria-label={t('snapshot_bar.weather')}
    >
      {/* Full-width Weather Widget */}
      <div className="mb-6">
        <WeatherWidget city={userCity} />
      </div>

      {/* Other Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

        {/* Price Snapshot Card - Live Paddy Prices */}
        <PriceSnapshot />

        {/* Soil Upload Card */}
        <div className="bg-soilBrown rounded-lg p-4 shadow-sm hover:shadow-md transition-smooth cursor-pointer text-white">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-semibold text-orange-100 uppercase tracking-wide">
              {t('snapshot_bar.soil_upload')}
            </span>
            <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </div>
          <div className="text-sm font-medium mb-1">{t('snapshot_bar.upload_pdf_photo')}</div>
          <div className="text-xs text-orange-100">{t('snapshot_bar.get_npk_2_mins')}</div>
          <button className="mt-2 bg-white text-soilBrown px-3 py-1 rounded text-xs font-medium hover:bg-orange-50 transition-smooth">
            {t('common.upload')}
          </button>
        </div>

        {/* Emergency Alert Card */}
        {hasAlert && (
          <div className="bg-alertOrange rounded-lg p-4 shadow-md hover:shadow-lg transition-smooth cursor-pointer text-white">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-semibold text-orange-100 uppercase tracking-wide">
                {t('snapshot_bar.emergency_alert')}
              </span>
              <svg className="w-5 h-5 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </div>
            <div className="text-sm font-medium mb-1">Critical Alert</div>
            <div className="text-xs text-orange-50">{alertMessage}</div>
            <button className="mt-2 bg-white text-alertOrange px-3 py-1 rounded text-xs font-medium hover:bg-orange-50 transition-smooth">
              {t('snapshot_bar.view_details')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
