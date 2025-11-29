import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrimaryActions() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedScheme, setSelectedScheme] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [showSchemeSearch, setShowSchemeSearch] = useState(false);

  const actions = [
    {
      id: 'disease',
      title: t('primary_actions.diagnose_disease'),
      desc: t('primary_actions.diagnose_disease_desc'),
      icon: '🔬',
      color: 'bg-primaryGreen',
      hoverColor: 'hover:bg-accentGreen',
    },
    {
      id: 'yield',
      title: t('primary_actions.predict_yield'),
      desc: t('primary_actions.predict_yield_desc'),
      icon: '📊',
      color: 'bg-primaryGreen',
      hoverColor: 'hover:bg-accentGreen',
    },
    {
      id: 'soil',
      title: t('primary_actions.upload_soil'),
      desc: t('primary_actions.upload_soil_desc'),
      icon: '🌱',
      color: 'bg-soilBrown',
      hoverColor: 'hover:opacity-90',
    },
    {
      id: 'schemes',
      title: t('primary_actions.check_schemes'),
      desc: t('primary_actions.check_schemes_desc'),
      icon: '📋',
      color: 'bg-primaryGreen',
      hoverColor: 'hover:bg-accentGreen',
    },
  ];

  const schemes = [
    { name: 'PMFBY', label: 'PM Fasal Bima Yojana' },
    { name: 'DBT', label: 'Direct Benefit Transfer' },
    { name: 'KCC', label: 'Kisan Credit Card' },
    { name: 'PM-KISAN', label: 'PM-KISAN' },
  ];

  const states = [
    'Maharashtra', 'Karnataka', 'Madhya Pradesh', 'Rajasthan', 
    'Punjab', 'Uttar Pradesh', 'Gujarat', 'Haryana', 'Bihar', 'Tamil Nadu'
  ];

  const handleSchemeSearch = () => {
    if (selectedScheme && selectedState) {
      navigate(`/schemes?search=${selectedScheme}&state=${selectedState}`);
      setShowSchemeSearch(false);
      setSelectedScheme('');
      setSelectedState('');
    }
  };

  return (
    <section
      className="py-8 px-4 lg:px-6 max-w-7xl mx-auto"
      role="region"
      aria-label="Primary Actions"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => {
              if (action.id === 'schemes') {
                setShowSchemeSearch(!showSchemeSearch);
              }
            }}
            className={`${action.color} ${action.hoverColor} text-white rounded-lg p-6 shadow-md transition-smooth focus-ring flex flex-col items-start justify-between min-h-44 relative group`}
            aria-label={action.title}
          >
            {/* Icon & Top content */}
            <div className="w-full flex items-start justify-between mb-4">
              <span className="text-4xl">{action.icon}</span>
              <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>

            {/* Title & Description */}
            <div className="w-full text-left">
              <div className="text-lg font-bold mb-1">{action.title}</div>
              <div className="text-sm opacity-90 leading-tight">{action.desc}</div>
            </div>

            {/* Dropdown Popup for Schemes */}
            {action.id === 'schemes' && showSchemeSearch && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white text-textDark rounded-lg shadow-xl p-4 w-full md:w-96 z-50">
                <h3 className="font-bold text-lg mb-4 text-textDark">🔍 Search PMFBY/DBT by State</h3>
                
                <div className="space-y-4">
                  {/* Scheme Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-textDark mb-2">Select Scheme</label>
                    <div className="grid grid-cols-2 gap-2">
                      {schemes.map((scheme) => (
                        <button
                          key={scheme.name}
                          onClick={() => setSelectedScheme(scheme.name)}
                          className={`p-2 rounded-lg text-sm font-medium transition-smooth ${
                            selectedScheme === scheme.name
                              ? 'bg-primaryGreen text-white'
                              : 'bg-gray-100 text-textDark hover:bg-gray-200'
                          }`}
                        >
                          {scheme.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* State Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-textDark mb-2">Select State</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-textDark focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                    >
                      <option value="">Choose a state...</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSchemeSearch}
                      disabled={!selectedScheme || !selectedState}
                      className="flex-1 px-4 py-2 bg-primaryGreen text-white rounded-lg hover:bg-accentGreen disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-smooth"
                    >
                      Search
                    </button>
                    <button
                      onClick={() => {
                        setShowSchemeSearch(false);
                        setSelectedScheme('');
                        setSelectedState('');
                      }}
                      className="flex-1 px-4 py-2 bg-gray-200 text-textDark rounded-lg hover:bg-gray-300 font-semibold transition-smooth"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Bottom text - Optional motivational message */}
      <div className="mt-6 text-center text-sm text-textLight">
        <p>
          Choose a service above or explore the module grid below to get started.
        </p>
      </div>
    </section>
  );
}
