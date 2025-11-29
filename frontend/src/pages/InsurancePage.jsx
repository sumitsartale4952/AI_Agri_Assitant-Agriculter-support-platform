import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import pmfbyData from '../data/PMFBY_insurance.json';
import claimData from '../data/File_Claim.json';

export default function InsurancePage() {
  const [activeTab, setActiveTab] = useState('pmfby');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [selectedState, setSelectedState] = useState(0);

  const tabs = [
    { id: 'pmfby', label: 'PMFBY Scheme', icon: '🛡️' },
    { id: 'states', label: 'State Coverage', icon: '🗺️' },
    { id: 'eligibility', label: 'Eligibility & Documents', icon: '✓' },
    { id: 'claim', label: 'File a Claim', icon: '📋' },
  ];

  const faqs = [
    {
      q: 'Who is eligible for PMFBY?',
      a: 'All farmers including loanee farmers (with mandatory enrolment) and non-loanee farmers who grow government-notified crops in notified areas.',
    },
    {
      q: 'What risks are covered?',
      a: 'Drought, dry spells, floods, inundation, hailstorms, cyclones, widespread pest and disease attacks, natural fire, and lightning.',
    },
    {
      q: 'How much premium do I pay?',
      a: `Kharif: 2% of sum insured, Rabi: 1.5% of sum insured, Annual Commercial: 5%. Government subsidizes the remaining premium.`,
    },
    {
      q: 'What is the sum insured?',
      a: 'Sum insured is based on Scale of Finance per hectare, typically ₹50,000/ha. Varies by crop and state.',
    },
    {
      q: 'What is not covered?',
      a: 'Losses due to war, civil unrest, deliberate damage, negligence, and preventable damage are not covered.',
    },
  ];

  // Using claim steps from File_Claim.json
  const claimProcess = claimData.claim_process_steps;

  const eligibilityRequirements = [
    {
      requirement: 'Aadhaar ID',
      description: 'Mandatory for farmer enrollment',
      mandatory: true,
    },
    {
      requirement: 'Land Ownership Documents',
      description: '7/12, RTC, or land ownership papers for non-loanee farmers',
      mandatory: true,
    },
    {
      requirement: 'Bank Account',
      description: 'Aadhaar-linked active bank account for claim disbursement',
      mandatory: true,
    },
    {
      requirement: 'Crop Sowing Declaration',
      description: 'Certificate or declaration of crop sowing',
      mandatory: true,
    },
    {
      requirement: 'Govt. Notified Crop',
      description: 'Crop must be notified for insurance in your area',
      mandatory: true,
    },
    {
      requirement: 'Notified Area',
      description: 'Farming area must be within notified area for scheme',
      mandatory: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white bg-cover bg-fixed" style={{ backgroundImage: 'url(/images/services/Insurance\\ Advisory\\ \\(PMFBY\\).jpg)' }}>
      <Navbar />

      {/* Hero Section - Sticky */}
      <section 
        className="sticky top-20 z-40 text-white pt-8 pb-8 px-4 lg:px-6"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="text-6xl drop-shadow-lg">🛡️</div>
            <div>
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">{pmfbyData.scheme_name}</h1>
              <p className="text-lg drop-shadow">
                Comprehensive crop insurance to protect your farming investment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 bg-white/98 backdrop-blur-sm rounded-t-2xl relative z-10">
        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-smooth flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-textLight hover:text-textDark'
              }`}
              aria-selected={activeTab === tab.id}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* PMFBY Overview Tab */}
            {activeTab === 'pmfby' && (
              <div className="space-y-8">
                {/* Scheme Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-h3 font-bold text-textDark mb-4">Scheme Overview</h3>
                  <p className="text-sm text-textLight mb-6">
                    {pmfbyData.scheme_name} ({pmfbyData.year}) provides comprehensive crop insurance coverage to protect farmers against crop losses due to natural calamities, pests, and diseases.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded p-4 border border-blue-200">
                      <p className="text-xs text-textLight mb-1">Official Website</p>
                      <a
                        href={pmfbyData.official_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 font-semibold hover:underline break-all text-sm"
                      >
                        pmfby.gov.in
                      </a>
                    </div>
                    <div className="bg-white rounded p-4 border border-blue-200">
                      <p className="text-xs text-textLight mb-1">Apply Online</p>
                      <button
                        onClick={() => window.open(pmfbyData.apply_online_url, '_blank')}
                        className="text-blue-700 font-semibold hover:underline text-sm"
                      >
                        Start Registration →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Coverage & Premium */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-h4 font-bold text-textDark mb-4">Premium Rates by Season</h4>
                  <div className="space-y-3">
                    {[
                      { season: 'Kharif', rate: pmfbyData.common_details.premium_rates.kharif },
                      { season: 'Rabi', rate: pmfbyData.common_details.premium_rates.rabi },
                      { season: 'Commercial/Horticulture', rate: pmfbyData.common_details.premium_rates.annual_commercial_horticulture },
                    ].map((item) => (
                      <div key={item.season} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-semibold text-textDark">{item.season}</span>
                        <span className="text-lg font-bold text-blue-700">{item.rate}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-textLight mt-4 italic">
                    * Remaining premium paid by Government. This makes PMFBY highly affordable for farmers.
                  </p>
                </div>

                {/* Risks Covered */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                    <span>✓</span> Risks Covered
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pmfbyData.common_details.coverage_details.risks_covered.map((risk) => (
                      <div key={risk} className="flex gap-2 text-sm text-green-800">
                        <span className="text-green-600 font-bold">→</span>
                        {risk}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insurance Companies */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-bold text-textDark mb-4">Insurance Companies Offering PMFBY</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pmfbyData.insurance_companies.map((company) => (
                      <a
                        key={company.company}
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-gray-50 rounded border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-smooth"
                      >
                        <p className="text-sm font-semibold text-textDark">{company.company}</p>
                        <p className="text-xs text-blue-700 mt-1">Visit Website →</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* State Coverage Tab */}
            {activeTab === 'states' && (
              <div className="space-y-6">
                <h3 className="text-h3 font-bold text-textDark mb-6">PMFBY Coverage by State</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {pmfbyData.state_wise_details.map((state, idx) => (
                    <button
                      key={state.state}
                      onClick={() => setSelectedState(idx)}
                      className={`p-4 rounded-lg border-2 text-left transition-smooth ${
                        selectedState === idx
                          ? 'border-blue-700 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h5 className="font-bold text-textDark">{state.state}</h5>
                      <p className="text-xs text-textLight mt-1">
                        {state.farmer_applications_insured.toLocaleString()} farmers covered
                      </p>
                    </button>
                  ))}
                </div>

                {pmfbyData.state_wise_details[selectedState] && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-bold text-blue-900 mb-4">
                        {pmfbyData.state_wise_details[selectedState].state} - {pmfbyData.state_wise_details[selectedState].season}
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-textLight mb-2">Notified Crops</p>
                          <div className="flex flex-wrap gap-2">
                            {pmfbyData.state_wise_details[selectedState].crops_notified.map((crop) => (
                              <span key={crop} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white rounded p-4 border border-blue-200">
                            <p className="text-xs text-textLight">Farmers Insured</p>
                            <p className="text-xl font-bold text-blue-700 mt-1">
                              {(pmfbyData.state_wise_details[selectedState].farmer_applications_insured / 1000000).toFixed(1)}M
                            </p>
                          </div>
                          <div className="bg-white rounded p-4 border border-blue-200">
                            <p className="text-xs text-textLight">Claims Paid</p>
                            <p className="text-xl font-bold text-blue-700 mt-1">
                              ₹{pmfbyData.state_wise_details[selectedState].claims_paid_crore}Cr
                            </p>
                          </div>
                        </div>

                        <div className="bg-white rounded p-4 border border-blue-200 space-y-2">
                          <p className="text-xs text-textLight font-semibold">How to Apply in {pmfbyData.state_wise_details[selectedState].state}</p>
                          <a
                            href={pmfbyData.state_wise_details[selectedState].apply_links.state_portal}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-700 font-semibold hover:underline"
                          >
                            → State Portal
                          </a>
                          <a
                            href={pmfbyData.state_wise_details[selectedState].apply_links.csc_center}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-700 font-semibold hover:underline"
                          >
                            → CSC E-Governance Center
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Eligibility Tab */}
            {activeTab === 'eligibility' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-h3 font-bold text-textDark mb-4">Eligibility Criteria</h3>
                  <p className="text-sm text-textLight mb-6">
                    To be eligible for PMFBY, you must meet the following criteria:
                  </p>

                  <div className="space-y-3">
                    {pmfbyData.common_details.eligibility.conditions.map((condition, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-blue-50 rounded border border-blue-200">
                        <span className="text-blue-700 font-bold text-lg">✓</span>
                        <p className="text-sm text-textDark">
                          {condition.replace(/:contentReference.*?{.*?}/g, '')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-h4 font-bold text-textDark mb-4">Required Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pmfbyData.common_details.documents_required.map((doc, idx) => (
                      <div key={idx} className="flex gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                        <span className="text-blue-700 font-bold">📄</span>
                        <span className="text-sm text-textDark">
                          {doc.replace(/:contentReference.*?{.*?}/g, '')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Claim Tab */}
            {activeTab === 'claim' && (
              <div className="space-y-6">
                <h3 className="text-h3 font-bold text-textDark mb-6">How to File a Claim</h3>

                {claimProcess.map((item) => (
                  <div key={item.step} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-textDark">{item.title}</h4>
                      <p className="text-sm text-textLight mt-1">{item.description}</p>
                      <p className="text-xs text-blue-700 font-semibold mt-2">→ {item.details}</p>
                    </div>
                  </div>
                ))}

                <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 mt-6">
                  <h4 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                    <span>⏰</span> Claim Timeline
                  </h4>
                  <div className="space-y-2 text-sm text-yellow-800">
                    <p>• Report loss within 72 hours of occurrence</p>
                    <p>• File claim within 30 days from loss date</p>
                    <p>• Field survey completed within 10-15 days</p>
                    <p>• Settlement within 1-2 months via DBT</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h4 className="font-bold text-green-900 mb-3">Claim Process Details</h4>
                  <ul className="space-y-2 text-sm text-green-800">
                    {pmfbyData.common_details.claim_process.map((step, idx) => (
                      <li key={idx}>
                        <span className="font-semibold">Step {idx + 1}: </span>
                        {step.replace(/:contentReference.*?{.*?}/g, '')}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* CTA Box */}
              <div className="bg-blue-700 text-white rounded-lg p-6 space-y-4">
                <h4 className="font-bold text-lg">Enroll Now</h4>
                <p className="text-sm opacity-90">Get coverage for your crops in 15 minutes</p>
                <a
                  href={pmfbyData.apply_online_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white text-blue-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-smooth inline-block text-center"
                >
                  Register Here →
                </a>
              </div>

              {/* Key Facts */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-4">
                <h4 className="font-bold text-textDark">Quick Facts</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-textLight">Scheme Year</p>
                    <p className="text-xl font-bold text-blue-700">{pmfbyData.year}</p>
                  </div>
                  <div>
                    <p className="text-xs text-textLight">Premium You Pay</p>
                    <p className="text-lg font-bold text-blue-700">1.5% - 5%</p>
                  </div>
                  <div>
                    <p className="text-xs text-textLight">Government Subsidy</p>
                    <p className="text-lg font-bold text-blue-700">95% - 98.5%</p>
                  </div>
                </div>
              </div>

              {/* Coverage Info */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200 space-y-3">
                <h5 className="font-semibold text-green-900 flex items-center gap-2">
                  <span>🛡️</span> What's Covered
                </h5>
                <ul className="space-y-2 text-xs text-green-800">
                  {pmfbyData.common_details.coverage_details.risks_covered.slice(0, 4).map((risk) => (
                    <li key={risk} className="flex gap-2">
                      <span>✓</span> {risk}
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQs */}
              <div className="space-y-3">
                <h4 className="font-bold text-textDark">Frequently Asked Questions</h4>
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                      className="w-full px-3 py-3 flex items-start gap-2 hover:bg-gray-50 transition-smooth text-left"
                    >
                      <span className="flex-shrink-0 text-lg">❓</span>
                      <span className="font-medium text-xs text-textDark">{faq.q}</span>
                    </button>
                    {expandedFAQ === idx && (
                      <div className="px-3 py-3 bg-gray-50 border-t border-gray-200 text-xs text-textLight">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <span>☎️</span> Get Support
                </h5>
                <p className="text-xs text-blue-800">
                  Contact your state agriculture department or insurance agent for personalized assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
