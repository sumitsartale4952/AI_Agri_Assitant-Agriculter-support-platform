import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-textDark text-white mt-16" role="contentinfo">
      {/* Main Footer Columns */}
      <div className="px-4 lg:px-6 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: About */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wide">
              {t('footer.about_heading')}
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              {t('footer.about_text')}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-primaryGreen rounded-full flex items-center justify-center hover:bg-accentGreen transition-smooth focus-ring text-white"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642L17 12h-3v-1.741c0-.516.374-.741.997-.741H17V5.009C16.657 5.002 15.254 5 13.681 5c-2.814 0-4.681 1.72-4.681 4.868V12H7v4z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-primaryGreen rounded-full flex items-center justify-center hover:bg-accentGreen transition-smooth focus-ring text-white"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7s1.5 4-7 7" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-primaryGreen rounded-full flex items-center justify-center hover:bg-accentGreen transition-smooth focus-ring text-white"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Government Links */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wide">
              {t('footer.government_links')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://agmarknet.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-accentGreen transition-smooth inline-flex items-center gap-1"
                >
                  {t('footer.agmarknet')}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://enam.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-accentGreen transition-smooth inline-flex items-center gap-1"
                >
                  {t('footer.enam')}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://pmfby.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-accentGreen transition-smooth inline-flex items-center gap-1"
                >
                  {t('footer.pmfby')}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://soilhealth.dac.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-accentGreen transition-smooth inline-flex items-center gap-1"
                >
                  {t('footer.soil_health_card')}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.icar.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-accentGreen transition-smooth inline-flex items-center gap-1"
                >
                  {t('footer.icar')}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wide">
              {t('footer.resources')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-accentGreen transition-smooth">
                  {t('footer.faqs')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-accentGreen transition-smooth">
                  {t('footer.how_to_photo')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-accentGreen transition-smooth">
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-accentGreen transition-smooth">
                  {t('footer.support')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-accentGreen transition-smooth">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wide">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primaryGreen flex-shrink-0 mt-1">📞</span>
                <span className="text-gray-300">{t('footer.helpline')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primaryGreen flex-shrink-0 mt-1">✉️</span>
                <a href="mailto:support@aiagriastant.gov.in" className="text-gray-300 hover:text-accentGreen transition-smooth">
                  {t('footer.email')}
                </a>
              </li>
              <li className="text-gray-400 text-xs mt-3">
                <span className="font-medium text-gray-300">Available:</span>
                <br />
                Mon-Sat, 8 AM - 8 PM IST
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 px-4 lg:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-8">
            {/* Copyright & Credits */}
            <div className="text-xs text-gray-400 text-center md:text-left">
              <p className="font-semibold text-gray-300 mb-2">{t('footer.copyright')}</p>
              <p className="text-gray-400">
                🎨 <span className="text-primaryGreen font-semibold">Created by</span>
              </p>
              <p className="mt-2 text-white font-bold text-sm">Sumit Sartale</p>
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primaryGreen rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">AI</span>
                </div>
                <span className="text-sm font-semibold text-white">Agri Assistant</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="text-xs text-gray-400 text-center md:text-right">
              <p className="text-gray-300 font-semibold mb-2">📞 Contact Developer</p>
              <p className="flex items-center justify-end gap-1 mb-1">
                <span className="text-primaryGreen">📱</span>
                <a href="tel:+919130674198" className="hover:text-accentGreen transition-smooth">
                  +91 9130674198
                </a>
              </p>
              <p className="flex items-center justify-end gap-1">
                <span className="text-primaryGreen">✉️</span>
                <a href="mailto:ssartale6@gmail.com" className="hover:text-accentGreen transition-smooth">
                  ssartale6@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Version Info */}
              <div className="text-xs text-gray-500 text-center md:text-left">
                <p>{t('footer.version')}</p>
                <p className="mt-1 text-gray-600">β Version 1.0.0</p>
              </div>

              {/* Developer Credit */}
              <div className="text-xs text-center text-gray-400">
                <p className="mb-2">
                  <span className="text-primaryGreen font-bold">🌾 AI Agri Assistant</span>
                </p>
                <p className="text-gray-500">
                  Empowering Indian Farmers with Technology
                </p>
              </div>

              {/* Legal Links */}
              <div className="text-xs text-gray-400 text-center md:text-right">
                <a href="#" className="hover:text-accentGreen transition-smooth mr-4">
                  {t('footer.terms')}
                </a>
                <span className="mx-2">•</span>
                <a href="#" className="hover:text-accentGreen transition-smooth">
                  {t('footer.privacy_policy')}
                </a>
              </div>
            </div>
          </div>

          {/* Developer Note */}
          <div className="mt-6 pt-4 border-t border-gray-700 text-center">
            <p className="text-xs text-gray-500">
              <span className="text-primaryGreen">💻</span> Developed with ❤️ for Indian Agriculture | 
              <span className="ml-2">
                <a href="mailto:ssartale6@gmail.com" className="text-primaryGreen hover:text-accentGreen font-semibold">
                  Get in Touch
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
