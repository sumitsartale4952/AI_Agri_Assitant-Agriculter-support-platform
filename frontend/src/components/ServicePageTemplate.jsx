import { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ServicePageTemplate({
  title,
  subtitle,
  icon,
  primaryColor = 'bg-primaryGreen',
  sections = [],
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className={`${primaryColor} text-white pt-24 pb-12 px-4 lg:px-6 mt-16`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-6">
            <div className="text-6xl">{icon}</div>
            <div>
              <h1 className="text-h1 font-bold mb-2">{title}</h1>
              <p className="text-lg opacity-90">{subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        {/* Tabs Navigation */}
        {sections.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-8">
              {sections.map((section, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTab(idx);
                    setExpandedSection(null);
                  }}
                  className={`px-4 py-3 font-medium text-sm border-b-2 transition-smooth ${
                    activeTab === idx
                      ? 'border-primaryGreen text-primaryGreen'
                      : 'border-transparent text-textLight hover:text-textDark'
                  }`}
                  aria-selected={activeTab === idx}
                  role="tab"
                >
                  {section.tabName}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {sections[activeTab]?.content && (
                  <div className="space-y-6">
                    {typeof sections[activeTab].content === 'function'
                      ? sections[activeTab].content()
                      : sections[activeTab].content}
                  </div>
                )}

                {/* Expandable Items */}
                {sections[activeTab]?.items && (
                  <div className="space-y-3">
                    {sections[activeTab].items.map((item, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-smooth"
                      >
                        <button
                          onClick={() =>
                            setExpandedSection(expandedSection === idx ? null : idx)
                          }
                          className="w-full px-4 py-4 flex items-center justify-between hover:bg-neutralGray transition-smooth"
                          aria-expanded={expandedSection === idx}
                        >
                          <h3 className="text-left font-semibold text-textDark">
                            {item.title}
                          </h3>
                          <svg
                            className={`w-5 h-5 text-primaryGreen transition-transform ${
                              expandedSection === idx ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        </button>
                        {expandedSection === idx && (
                          <div className="px-4 py-4 bg-neutralGray border-t border-gray-200">
                            <div className="text-textLight text-sm space-y-2">
                              {typeof item.description === 'function'
                                ? item.description()
                                : item.description}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {sections[activeTab]?.sidebar && (
                  <div className="sticky top-24 space-y-6">
                    {/* Quick Stats */}
                    {sections[activeTab].sidebar.stats && (
                      <div className="bg-neutralGray rounded-lg p-6 space-y-4">
                        <h4 className="font-bold text-textDark">Key Metrics</h4>
                        {sections[activeTab].sidebar.stats.map((stat, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="text-sm text-textLight">{stat.label}</span>
                            <span className="text-lg font-bold text-primaryGreen">
                              {stat.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA Box */}
                    {sections[activeTab].sidebar.cta && (
                      <div className={`${primaryColor} text-white rounded-lg p-6 space-y-4`}>
                        <h4 className="font-bold">{sections[activeTab].sidebar.cta.title}</h4>
                        <p className="text-sm opacity-90">
                          {sections[activeTab].sidebar.cta.description}
                        </p>
                        <button className="w-full bg-white text-primaryGreen font-semibold py-2 rounded-lg hover:bg-gray-100 transition-smooth focus-ring">
                          {sections[activeTab].sidebar.cta.buttonText}
                        </button>
                      </div>
                    )}

                    {/* Additional Info */}
                    {sections[activeTab].sidebar.info && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          Info
                        </h5>
                        <p className="text-sm text-blue-800">
                          {sections[activeTab].sidebar.info}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
