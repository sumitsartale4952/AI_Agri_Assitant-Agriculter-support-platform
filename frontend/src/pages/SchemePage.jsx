import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SchemePage() {
  const [activeTab, setActiveTab] = useState('search');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [allSchemes, setAllSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [personalizedSchemes, setPersonalizedSchemes] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [stats, setStats] = useState({
    totalSchemes: 0,
    totalBeneficiaries: 0,
    totalBenefits: '₹ 0'
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [applySteps, setApplySteps] = useState([]);
  const [stepsLoading, setStepsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    schemeType: '',
    crop: '',
    state: '',
    searchText: ''
  });
  const [eligibilityForm, setEligibilityForm] = useState({
    landSize: '',
    state: '',
    crop: '',
    income: '',
    isOrganic: false,
    hasIrrigation: false,
    farmingType: 'conventional',
    age: ''
  });
  const [recommendedSchemes, setRecommendedSchemes] = useState([]);

  // Deadlines data
  const deadlines = [
    {
      name: 'PM Fasal Bima Yojana (PMFBY)',
      date: '2025-12-31',
      priority: 'HIGH',
      emoji: '🌾'
    },
    {
      name: 'Kisan Credit Card (KCC)',
      date: '2025-01-15',
      priority: 'HIGH',
      emoji: '💳'
    },
    {
      name: 'Soil Health Card Scheme',
      date: '2025-06-30',
      priority: 'MEDIUM',
      emoji: '🌱'
    },
    {
      name: 'PM-KUSUM (Solar Schemes)',
      date: '2025-02-28',
      priority: 'MEDIUM',
      emoji: '🚜'
    },
    {
      name: 'PM-KISAN Supplementary (Direct Income)',
      date: '2025-03-15',
      priority: 'MEDIUM',
      emoji: '💰'
    }
  ];

  // Function to generate ICS file for calendar
  const generateICSFile = () => {
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AI Agri Assistant//Scheme Deadlines//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Government Scheme Deadlines
X-WR-TIMEZONE:UTC
X-WR-CALDESC:Important deadlines for government agricultural schemes
`;

    deadlines.forEach((deadline) => {
      const dateObj = new Date(deadline.date);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      
      icsContent += `BEGIN:VEVENT
UID:${deadline.name.replace(/\s/g, '')}@aiagriastistant.com
DTSTAMP:${year}${month}${day}T000000Z
DTSTART:${year}${month}${day}T000000Z
SUMMARY:${deadline.emoji} ${deadline.name} - Application Deadline
DESCRIPTION:Last date to apply for ${deadline.name}. Priority: ${deadline.priority}
LOCATION:Government Portal
STATUS:CONFIRMED
END:VEVENT
`;
    });

    icsContent += `END:VCALENDAR`;
    return icsContent;
  };

  // Function to download ICS file
  const downloadCalendarFile = () => {
    const icsContent = generateICSFile();
    const element = document.createElement('a');
    const file = new Blob([icsContent], { type: 'text/calendar' });
    element.href = URL.createObjectURL(file);
    element.download = 'scheme-deadlines.ics';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Function to add to Google Calendar
  const addToGoogleCalendar = () => {
    const baseUrl = 'https://calendar.google.com/calendar/u/0/r/eventedit';
    const events = deadlines.map((deadline) => {
      const [year, month, day] = deadline.date.split('-');
      const params = new URLSearchParams({
        dates: `${year}${month}${day}/${year}${month}${day}`,
        text: `${deadline.emoji} ${deadline.name} - Deadline`,
        details: `Last date to apply for ${deadline.name}. Priority: ${deadline.priority}`
      });
      return `${baseUrl}?${params.toString()}`;
    });
    
    // Open first deadline in Google Calendar
    window.open(events[0], '_blank');
  };

  // Load personalized schemes for logged-in user
  useEffect(() => {
    if (activeTab === 'myschemes') {
      loadPersonalizedSchemes();
    }
  }, [activeTab]);

  // Load statistics on component mount
  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/schemes/stats/detailed');
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      
      // Format the statistics
      const formatNumber = (num) => {
        if (num >= 10000000) return (num / 10000000).toFixed(1) + ' Cr';
        if (num >= 100000) return (num / 100000).toFixed(1) + ' L';
        return num.toString();
      };

      setStats({
        totalSchemes: data.total_active_schemes || 0,
        totalBeneficiaries: formatNumber(data.total_beneficiaries || 0) + '+',
        totalBenefits: '₹ ' + formatNumber(data.total_benefits_distributed || 0) + '+'
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
      // Fallback: try to get count from schemes endpoint
      try {
        const schemesResponse = await fetch('http://localhost:8000/api/schemes/');
        if (schemesResponse.ok) {
          const schemesData = await schemesResponse.json();
          const totalCount = schemesData.total || 61;
          setStats({
            totalSchemes: totalCount,
            totalBeneficiaries: '2 Cr+',
            totalBenefits: '₹ 10L Cr+'
          });
        } else {
          throw new Error('Failed to fetch schemes');
        }
      } catch (fallbackError) {
        // Last resort fallback
        setStats({
          totalSchemes: 61,
          totalBeneficiaries: '2 Cr+',
          totalBenefits: '₹ 10L Cr+'
        });
      }
    } finally {
      setStatsLoading(false);
    }
  };

  const loadPersonalizedSchemes = async () => {
    setProfileLoading(true);
    setProfileError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setProfileError('Please login to view schemes suited for your profile');
        setProfileLoading(false);
        return;
      }

      // Fetch dashboard with personalized schemes
      const response = await fetch('http://localhost:8000/api/auth/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch personalized schemes');
      }

      const data = await response.json();
      setUserProfile(data.profile);
      setPersonalizedSchemes(data.recommended_schemes || []);
    } catch (error) {
      console.error('Error loading personalized schemes:', error);
      setProfileError('Unable to load your personalized schemes. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  const loadApplySteps = async (schemeName) => {
    setStepsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/schemes/apply-steps/${encodeURIComponent(schemeName)}`);
      if (!response.ok) throw new Error('Failed to fetch apply steps');
      const data = await response.json();
      setApplySteps(data.apply_steps || []);
    } catch (error) {
      console.error('Error loading apply steps:', error);
      setApplySteps([]);
    } finally {
      setStepsLoading(false);
    }
  };

  const handleViewApplySteps = (scheme) => {
    setSelectedScheme(scheme);
    loadApplySteps(scheme.name);
  };

  // Cosine Similarity Function for semantic matching
  const getTokens = (text) => {
    return text.toLowerCase().match(/\b\w+\b/g) || [];
  };

  const cosineSimilarity = (text1, text2) => {
    const tokens1 = getTokens(text1);
    const tokens2 = getTokens(text2);
    
    const allTokens = new Set([...tokens1, ...tokens2]);
    if (allTokens.size === 0) return 0;
    
    const vec1 = Array.from(allTokens).map(token => tokens1.includes(token) ? 1 : 0);
    const vec2 = Array.from(allTokens).map(token => tokens2.includes(token) ? 1 : 0);
    
    const dotProduct = vec1.reduce((sum, val, idx) => sum + val * vec2[idx], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    return dotProduct / (magnitude1 * magnitude2);
  };

  // Semantic crop matching
  const cropSimilarity = (userCrop, schemeCrop) => {
    if (!userCrop || !schemeCrop) return 0;
    const similarity = cosineSimilarity(userCrop, schemeCrop);
    return similarity > 0.4 ? similarity : 0; // Threshold for relevance
  };

  // Check eligibility with intelligent scoring
  const checkEligibility = () => {
    const recommended = [];
    const schemes = [
      {
        name: 'PM Fasal Bima Yojana (PMFBY)',
        description: 'Crop insurance scheme',
        criteria: {
          requiresCrop: true,
          requiresState: true,
          requiresLandSize: false,
          requiresIncome: false,
          requiresOrganic: false,
          requiresIrrigation: false
        },
        incomeLimit: Infinity,
        landSizeRange: [0, Infinity]
      },
      {
        name: 'Kisan Credit Card (KCC)',
        description: 'Credit facility for farmers',
        criteria: {
          requiresCrop: false,
          requiresState: true,
          requiresLandSize: true,
          requiresIncome: false,
          requiresOrganic: false,
          requiresIrrigation: false
        },
        incomeLimit: Infinity,
        landSizeRange: [0, Infinity]
      },
      {
        name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
        description: 'Direct income support for farmers',
        criteria: {
          requiresCrop: false,
          requiresState: false,
          requiresLandSize: true,
          requiresIncome: true,
          requiresOrganic: false,
          requiresIrrigation: false
        },
        incomeLimit: 200000,
        landSizeRange: [0, Infinity]
      },
      {
        name: 'PMKSY (Pradhan Mantri Krishi Sinchayee Yojana)',
        description: 'Irrigation development scheme',
        criteria: {
          requiresCrop: false,
          requiresState: true,
          requiresLandSize: true,
          requiresIncome: false,
          requiresOrganic: false,
          requiresIrrigation: true
        },
        incomeLimit: Infinity,
        landSizeRange: [0.5, Infinity]
      },
      {
        name: 'Soil Health Card Scheme',
        description: 'Free soil testing and health monitoring',
        criteria: {
          requiresCrop: true,
          requiresState: true,
          requiresLandSize: false,
          requiresIncome: false,
          requiresOrganic: false,
          requiresIrrigation: false
        },
        incomeLimit: Infinity,
        landSizeRange: [0, Infinity]
      },
      {
        name: 'National Mission for Sustainable Agriculture',
        description: 'Organic and sustainable farming support',
        criteria: {
          requiresCrop: true,
          requiresState: true,
          requiresLandSize: true,
          requiresIncome: false,
          requiresOrganic: true,
          requiresIrrigation: false
        },
        incomeLimit: Infinity,
        landSizeRange: [0, Infinity]
      }
    ];

    // Score each scheme based on user's eligibility profile
    schemes.forEach(scheme => {
      let matchScore = 0;
      let matchFactors = [];
      let maxScore = 0;

      // 1. Crop Matching (25 points max)
      if (scheme.criteria.requiresCrop && eligibilityForm.crop) {
        const cropMatch = cropSimilarity(eligibilityForm.crop, scheme.description);
        const cropScore = cropMatch * 25;
        matchScore += cropScore;
        matchFactors.push(`Crop: ${(cropMatch * 100).toFixed(0)}%`);
        maxScore += 25;
      } else if (!scheme.criteria.requiresCrop) {
        matchScore += 25;
        maxScore += 25;
      } else {
        maxScore += 25;
      }

      // 2. State Availability (20 points max)
      if (scheme.criteria.requiresState && eligibilityForm.state) {
        matchScore += 20;
        matchFactors.push('State: Match');
        maxScore += 20;
      } else if (!scheme.criteria.requiresState) {
        matchScore += 20;
        maxScore += 20;
      } else {
        maxScore += 20;
      }

      // 3. Land Size Eligibility (20 points max)
      if (scheme.criteria.requiresLandSize && eligibilityForm.landSize) {
        const landSize = parseFloat(eligibilityForm.landSize);
        const [minLand, maxLand] = scheme.landSizeRange;
        if (landSize >= minLand && landSize <= maxLand) {
          matchScore += 20;
          matchFactors.push(`Land: ${landSize}ha ✓`);
        } else {
          matchFactors.push(`Land: Out of range`);
        }
        maxScore += 20;
      } else if (!scheme.criteria.requiresLandSize) {
        matchScore += 20;
        maxScore += 20;
      } else {
        maxScore += 20;
      }

      // 4. Income Eligibility (15 points max)
      if (scheme.criteria.requiresIncome && eligibilityForm.income) {
        const income = parseFloat(eligibilityForm.income);
        if (income <= scheme.incomeLimit) {
          matchScore += 15;
          matchFactors.push(`Income: ₹${income} ✓`);
        } else {
          matchFactors.push(`Income: Exceeds limit`);
        }
        maxScore += 15;
      } else if (!scheme.criteria.requiresIncome) {
        matchScore += 15;
        maxScore += 15;
      } else {
        maxScore += 15;
      }

      // 5. Organic Farming (10 points max)
      if (scheme.criteria.requiresOrganic) {
        if (eligibilityForm.isOrganic) {
          matchScore += 10;
          matchFactors.push('Organic: Yes');
        }
        maxScore += 10;
      } else {
        matchScore += 10;
        maxScore += 10;
      }

      // 6. Irrigation (10 points max)
      if (scheme.criteria.requiresIrrigation) {
        if (eligibilityForm.hasIrrigation) {
          matchScore += 10;
          matchFactors.push('Irrigation: Yes');
        }
        maxScore += 10;
      } else {
        matchScore += 10;
        maxScore += 10;
      }

      // Calculate percentage match
      const percentageMatch = Math.round((matchScore / maxScore) * 100);

      // Only recommend if match score is above 60%
      if (percentageMatch >= 60) {
        recommended.push({
          name: scheme.name,
          reason: `✓ ${matchFactors.join(' | ')}`,
          match: percentageMatch,
          description: scheme.description
        });
      }
    });

    setRecommendedSchemes(recommended.sort((a, b) => b.match - a.match));
  };

  // Load schemes from backend API
  useEffect(() => {
    const loadSchemes = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/schemes/');
        if (!response.ok) throw new Error('Failed to fetch schemes');
        const data = await response.json();
        setAllSchemes(data.schemes || []);
        // Show only 5 schemes by default - user must search for more
        setFilteredSchemes((data.schemes || []).slice(0, 5));
      } catch (error) {
        console.error('Error loading schemes from API:', error);
        // Fallback to embedded schemes if API fails
        setAllSchemes(embeddedSchemes);
        // Show only 5 by default
        setFilteredSchemes(embeddedSchemes.slice(0, 5));
      }
    };
    loadSchemes();
  }, []);

  // Filter schemes based on search parameters
  const handleSearch = (params) => {
    setSearchParams(params);
    let filtered = allSchemes;

    // Filter by scheme type
    if (params.schemeType) {
      filtered = filtered.filter(s => 
        s.type.toLowerCase().includes(params.schemeType.toLowerCase())
      );
    }

    // Filter by crop
    if (params.crop) {
      filtered = filtered.filter(s => 
        s.applicable_crops.toLowerCase().includes(params.crop.toLowerCase()) ||
        s.applicable_crops === 'All'
      );
    }

    // Filter by state/central
    if (params.state) {
      filtered = filtered.filter(s => 
        s.central_or_state.toLowerCase().includes(params.state.toLowerCase())
      );
    }

    // Filter by search text
    if (params.searchText) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(params.searchText.toLowerCase()) ||
        s.benefits.toLowerCase().includes(params.searchText.toLowerCase())
      );
    }

    setFilteredSchemes(filtered);
  };

  const handleFilterChange = (key, value) => {
    const newParams = { ...searchParams, [key]: value };
    handleSearch(newParams);
  };

  // Fallback embedded schemes if JSON fails to load
  const embeddedSchemes = [
    {
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      type: 'Crop insurance',
      benefits: 'Insurance coverage for crop losses due to natural calamities, pests, and diseases',
      premium: '1.5-5% of sum insured',
      coverage_limit: 'Varies',
      eligibility: 'All farmers growing notified crops',
      central_or_state: 'Central',
      applicable_crops: 'Notified crops',
      landholding: 'All',
      source_link: 'https://pmfby.gov.in/'
    },
    {
      name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      type: 'Direct income support',
      benefits: '₹6,000/year paid in 3 instalments',
      premium: 'No premium',
      coverage_limit: '₹6,000/year',
      eligibility: 'Land-owning farmers',
      central_or_state: 'Central',
      applicable_crops: 'All',
      landholding: 'As per scheme',
      source_link: 'https://pmkisan.gov.in/'
    },
    {
      name: 'Kisan Credit Card (KCC)',
      type: 'Credit/Loan',
      benefits: 'Short-term crop loans and working capital',
      premium: '4% interest rate',
      coverage_limit: 'Upto ₹5-10 lakhs',
      eligibility: 'All farmers',
      central_or_state: 'Central',
      applicable_crops: 'All',
      landholding: 'All',
      source_link: 'https://www.rbi.org.in/'
    }
  ];

  const tabs = [
    { id: 'search', label: 'Search Schemes', icon: '🔍' },
    { id: 'popular', label: 'Popular Schemes', icon: '⭐' },
    { id: 'eligibility', label: 'Check Eligibility', icon: '✅' },
    { id: 'myschemes', label: 'Find Your Scheme', icon: '🎯' },
    { id: 'apply', label: 'How to Apply', icon: '📝' },
    { id: 'deadlines', label: 'Scheme Deadlines', icon: '⏱️' },
  ];

  const schemes = [
    {
      name: 'PM Fasal Bima Yojana (PMFBY)',
      coverage: 'Crop insurance',
      premium: '1.5-5% of sum insured',
      benefits: '₹ 30-100 lakhs coverage',
      eligibility: 'All farmers',
      rating: 4.8,
      description: 'Provides insurance coverage for crop losses due to natural calamities, pests, and diseases',
      link: 'https://pmfby.gov.in/',
      officialSite: 'pmfby.gov.in',
    },
    {
      name: 'Kisan Credit Card (KCC)',
      coverage: 'Credit facility',
      premium: '4% interest rate',
      benefits: 'Upto ₹5-10 lakhs credit',
      eligibility: 'All farmers with landholding',
      rating: 4.6,
      description: 'Easy credit access for agricultural purposes with minimal documentation',
      link: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1695882',
      officialSite: 'Your Bank Website',
    },
    {
      name: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
      coverage: 'Irrigation investment',
      premium: '50% subsidy',
      benefits: 'Irrigation infrastructure',
      eligibility: 'Landholders with suitable projects',
      rating: 4.7,
      description: 'Promotes efficient irrigation through subsidized drip and sprinkler systems',
      link: 'https://pmksy.gov.in/',
      officialSite: 'pmksy.gov.in',
    },
    {
      name: 'Soil Health Card Scheme',
      coverage: 'Free soil testing',
      premium: 'FREE',
      benefits: 'Soil report + NPK advice',
      eligibility: 'All farmers',
      rating: 4.9,
      description: 'Free soil testing to improve crop productivity with scientific recommendations',
      link: 'https://soilhealth.dac.gov.in/',
      officialSite: 'soilhealth.dac.gov.in',
    },
    {
      name: 'National Mission for Sustainable Agriculture',
      coverage: 'Sustainable farming',
      premium: '60-75% subsidy',
      benefits: 'Training & equipment',
      eligibility: 'Progressive farmers',
      rating: 4.5,
      description: 'Promotes sustainable and climate-resilient agricultural practices',
      link: 'https://nmsa.dac.gov.in/',
      officialSite: 'nmsa.dac.gov.in',
    },
    {
      name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      coverage: 'Direct income transfer',
      premium: 'Govt funded',
      benefits: '₹6,000 per year',
      eligibility: 'Landholding farmers',
      rating: 4.8,
      description: 'Direct income support of ₹500 per month (₹6,000 per year) to farmers',
      link: 'https://pmkisan.gov.in/',
      officialSite: 'pmkisan.gov.in',
    },
  ];

  const faqs = [
    {
      q: 'How do I find schemes I\'m eligible for?',
      a: 'Enter your state, crop type, and landholding details. Our system will show schemes suited for you.',
    },
    {
      q: 'Can I apply for multiple schemes?',
      a: 'Yes! Most schemes are independent. Apply for multiple if eligible. Check overlap restrictions.',
    },
    {
      q: 'What documents do I need?',
      a: 'Land papers, Aadhaar, bank details, crop insurance papers. Exact docs depend on scheme. Check before applying.',
    },
    {
      q: 'How long is the approval process?',
      a: 'Typically 15-30 days after application. Follow up with local agricultural office or check online portal.',
    },
  ];

  return (
    <div className="min-h-screen bg-white bg-cover bg-fixed" style={{ backgroundImage: 'url(/images/services/govt_schemes.jpg)' }}>
      <Navbar />

      {/* Apply Steps Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-indigo-600 text-white px-6 py-4 flex items-center justify-between border-b">
              <div>
                <h2 className="text-2xl font-bold">{selectedScheme.name}</h2>
                <p className="text-sm opacity-90">Step-by-step application process</p>
              </div>
              <button 
                onClick={() => setSelectedScheme(null)}
                className="text-white hover:bg-indigo-700 rounded-full p-2 transition-smooth"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {stepsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-textLight">Loading application steps...</p>
                  </div>
                </div>
              ) : applySteps && applySteps.length > 0 ? (
                <div className="space-y-4">
                  {applySteps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-textDark mb-1">{step.title}</h3>
                        <p className="text-sm text-textLight">{step.details}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <a 
                      href={selectedScheme.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-smooth text-center"
                    >
                      🔗 Apply Now on Official Portal
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-textLight">Application steps not available for this scheme.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Sticky */}
      <section 
        className="sticky top-20 z-40 text-white pt-8 pb-8 px-4 lg:px-6"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="text-6xl drop-shadow-lg">📋</div>
            <div>
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">Government Schemes & Subsidies</h1>
              <p className="text-lg drop-shadow">
                Find & apply for schemes that help your farming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 bg-white/98 backdrop-blur-sm rounded-t-2xl relative z-10">
        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-smooth flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
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
          <div className="lg:col-span-2">
            {/* Search Tab */}
            {activeTab === 'search' && (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-8 border border-indigo-200">
                  <h3 className="text-h3 font-bold text-textDark mb-4">🔍 Find Government Schemes for Your Farm</h3>
                  <p className="text-textLight mb-6">Search through {allSchemes.length}+ government schemes and find the best match for your farming profile</p>
                  
                  <div className="space-y-4">
                    {/* Search Text Field */}
                    <div>
                      <label className="block text-sm font-semibold text-textDark mb-2">Search Scheme Name or Benefits</label>
                      <input 
                        type="text"
                        placeholder="e.g., PMFBY, irrigation, income support, loan..."
                        value={searchParams.searchText}
                        onChange={(e) => handleFilterChange('searchText', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                      />
                    </div>

                    {/* Filters Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-textDark mb-2">Scheme Type</label>
                        <select 
                          value={searchParams.schemeType}
                          onChange={(e) => handleFilterChange('schemeType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none text-sm"
                        >
                          <option value="">All Types</option>
                          <option value="insurance">Insurance</option>
                          <option value="income">Income Support</option>
                          <option value="loan">Loans & Credit</option>
                          <option value="irrigation">Irrigation</option>
                          <option value="energy">Energy/Solar</option>
                          <option value="organic">Organic Farming</option>
                          <option value="sustainable">Sustainable</option>
                          <option value="testing">Testing/Advisory</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-textDark mb-2">Applicable Crop</label>
                        <select 
                          value={searchParams.crop}
                          onChange={(e) => handleFilterChange('crop', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none text-sm"
                        >
                          <option value="">All Crops</option>
                          <option value="wheat">Wheat</option>
                          <option value="rice">Rice</option>
                          <option value="cotton">Cotton</option>
                          <option value="sugarcane">Sugarcane</option>
                          <option value="vegetables">Vegetables</option>
                          <option value="pulses">Pulses</option>
                          <option value="oilseeds">Oilseeds</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-textDark mb-2">Scheme Level</label>
                        <select 
                          value={searchParams.state}
                          onChange={(e) => handleFilterChange('state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none text-sm"
                        >
                          <option value="">All Levels</option>
                          <option value="Central">Central Government</option>
                          <option value="State">State Government</option>
                          <option value="Sponsored">Centrally Sponsored</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleSearch({schemeType: '', crop: '', state: '', searchText: ''})}
                      className="w-full px-6 py-2 bg-gray-300 text-textDark font-semibold rounded-lg hover:bg-gray-400 transition-smooth"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                {filteredSchemes.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-textDark">Featured Schemes</h4>
                        {filteredSchemes.length === 5 && allSchemes.length > 5 && !searchParams.searchText && !searchParams.schemeType && !searchParams.crop && !searchParams.state && (
                          <p className="text-xs text-textLight mt-1">Showing 5 of {allSchemes.length} schemes. Use search to find more!</p>
                        )}
                        {(searchParams.searchText || searchParams.schemeType || searchParams.crop || searchParams.state) && (
                          <p className="text-xs text-textLight mt-1">Found {filteredSchemes.length} matching scheme{filteredSchemes.length !== 1 ? 's' : ''}</p>
                        )}
                      </div>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-bold rounded-full">
                        {filteredSchemes.length}
                      </span>
                    </div>

                    {filteredSchemes.map((scheme, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h5 className="font-bold text-textDark text-base">{scheme.name}</h5>
                            <p className="text-xs text-indigo-600 font-semibold mt-1">{scheme.type}</p>
                          </div>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                            {scheme.central_or_state}
                          </span>
                        </div>

                        <p className="text-sm text-textDark mb-3">{scheme.benefits}</p>

                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                          <div className="bg-blue-50 p-2 rounded">
                            <p className="text-blue-600 font-semibold">Cost: {scheme.premium}</p>
                          </div>
                          <div className="bg-green-50 p-2 rounded">
                            <p className="text-green-600 font-semibold">Crops: {scheme.applicable_crops}</p>
                          </div>
                          <div className="bg-purple-50 p-2 rounded col-span-2">
                            <p className="text-purple-600 font-semibold">Eligibility: {scheme.eligibility}</p>
                          </div>
                        </div>

                        <a 
                          href={scheme.source_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-smooth"
                        >
                          <span>🔗</span>
                          Official Website
                        </a>
                        <button 
                          onClick={() => handleViewApplySteps(scheme)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-smooth ml-2"
                        >
                          <span>📋</span>
                          How to Apply
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-textLight text-lg mb-2">No schemes found matching your filters</p>
                    <p className="text-textLight text-sm mb-4">Try adjusting your search criteria</p>
                    <button 
                      onClick={() => handleSearch({schemeType: '', crop: '', state: '', searchText: ''})}
                      className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                    >
                      Reset Search
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Popular Schemes Tab */}
            {activeTab === 'popular' && (
              <div className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-h3 font-bold text-textDark mb-2">Popular Government Schemes</h3>
                  <p className="text-textLight">Direct links to official scheme websites - Apply now and get benefits</p>
                </div>
                {schemes.map((scheme, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all bg-white">
                    {/* Header with Rating */}
                    <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-200">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-textDark">{scheme.name}</h4>
                        <p className="text-xs text-textLight mt-1">{scheme.description}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                        <span className="text-yellow-500 text-lg">⭐</span>
                        <span className="text-sm font-bold text-textDark">{scheme.rating}</span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                      <div className="bg-blue-50 rounded p-3">
                        <p className="text-xs text-blue-600 font-semibold">Coverage Type</p>
                        <p className="text-sm font-bold text-textDark mt-1">{scheme.coverage}</p>
                      </div>
                      <div className="bg-green-50 rounded p-3">
                        <p className="text-xs text-green-600 font-semibold">Cost/Premium</p>
                        <p className="text-sm font-bold text-textDark mt-1">{scheme.premium}</p>
                      </div>
                      <div className="bg-purple-50 rounded p-3">
                        <p className="text-xs text-purple-600 font-semibold">Benefits</p>
                        <p className="text-sm font-bold text-textDark mt-1">{scheme.benefits}</p>
                      </div>
                    </div>

                    {/* Eligibility */}
                    <div className="bg-orange-50 rounded p-3 mb-4 border border-orange-100">
                      <p className="text-xs text-orange-600 font-semibold">✓ Eligibility</p>
                      <p className="text-sm text-textDark mt-1">{scheme.eligibility}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      <button 
                        onClick={() => handleViewApplySteps(scheme)}
                        className="flex-1 min-w-[120px] px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-smooth text-center flex items-center justify-center gap-2"
                      >
                        <span>📋</span>
                        How to Apply
                      </button>
                      <a 
                        href={scheme.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[120px] px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-smooth text-center flex items-center justify-center gap-2"
                      >
                        <span>🔗</span>
                        Visit Site
                      </a>
                      <button 
                        onClick={() => window.open(scheme.link, '_blank')}
                        className="flex-1 min-w-[120px] px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-smooth flex items-center justify-center gap-2"
                      >
                        <span>📝</span>
                        Apply Now
                      </button>
                    </div>

                    {/* Website Info */}
                    <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-textLight">
                      <span>Official: {scheme.officialSite}</span>
                      <span className="text-green-600 font-semibold">✓ Verified</span>
                    </div>
                  </div>
                ))}

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                  <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <span>ℹ️</span> Important Information
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>✓ All links open official government websites</li>
                    <li>✓ Always apply through official portals for safety</li>
                    <li>✓ No registration fees or agent charges - schemes are FREE</li>
                    <li>✓ Benefits are directly transferred to your bank account</li>
                    <li>✓ Keep all documents and application receipts safe</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Find Your Scheme Tab - Personalized Recommendations */}
            {activeTab === 'myschemes' && (
              <div className="space-y-6">
                {profileLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                      <p className="text-textLight">Loading your personalized schemes...</p>
                    </div>
                  </div>
                ) : profileError ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <p className="text-amber-800 font-medium flex items-center gap-2">
                      <span>⚠️</span>
                      {profileError}
                    </p>
                    {!localStorage.getItem('token') && (
                      <button
                        onClick={() => window.location.href = '/login'}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-smooth"
                      >
                        Go to Login
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {/* User Profile Summary */}
                    {userProfile && (
                      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6 mb-6">
                        <h4 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                          <span>👨‍🌾</span>
                          Your Farming Profile
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {userProfile.state && (
                            <div className="bg-white rounded p-3 border border-indigo-100">
                              <p className="text-xs text-indigo-600 font-semibold">State</p>
                              <p className="text-sm font-bold text-textDark mt-1">{userProfile.state}</p>
                            </div>
                          )}
                          {userProfile.district && (
                            <div className="bg-white rounded p-3 border border-indigo-100">
                              <p className="text-xs text-indigo-600 font-semibold">District</p>
                              <p className="text-sm font-bold text-textDark mt-1">{userProfile.district}</p>
                            </div>
                          )}
                          {userProfile.crops_growing && userProfile.crops_growing.length > 0 && (
                            <div className="bg-white rounded p-3 border border-indigo-100">
                              <p className="text-xs text-indigo-600 font-semibold">Crops</p>
                              <p className="text-sm font-bold text-textDark mt-1">{userProfile.crops_growing.slice(0, 2).join(', ')}</p>
                            </div>
                          )}
                          {userProfile.landholding && (
                            <div className="bg-white rounded p-3 border border-indigo-100">
                              <p className="text-xs text-indigo-600 font-semibold">Landholding</p>
                              <p className="text-sm font-bold text-textDark mt-1">{userProfile.landholding}</p>
                            </div>
                          )}
                          {userProfile.irrigation_type && (
                            <div className="bg-white rounded p-3 border border-indigo-100">
                              <p className="text-xs text-indigo-600 font-semibold">Irrigation</p>
                              <p className="text-sm font-bold text-textDark mt-1">{userProfile.irrigation_type}</p>
                            </div>
                          )}
                          {userProfile.soil_type && (
                            <div className="bg-white rounded p-3 border border-indigo-100">
                              <p className="text-xs text-indigo-600 font-semibold">Soil Type</p>
                              <p className="text-sm font-bold text-textDark mt-1">{userProfile.soil_type}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Personalized Schemes */}
                    <div>
                      <h3 className="text-h3 font-bold text-textDark mb-2">Schemes Suited for You</h3>
                      <p className="text-textLight mb-4">
                        These schemes are personalized based on your farming profile. Match score shows relevance.
                      </p>

                      {personalizedSchemes && personalizedSchemes.length > 0 ? (
                        <div className="space-y-4">
                          {personalizedSchemes.map((scheme, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all bg-white">
                              {/* Header with Match Score */}
                              <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-200">
                                <div className="flex-1">
                                  <h4 className="text-lg font-bold text-textDark">{scheme.name}</h4>
                                  <p className="text-xs text-textLight mt-1">{scheme.description}</p>
                                </div>
                                <div className="flex items-center gap-2 ml-4 flex-shrink-0 bg-green-100 rounded-lg px-3 py-2">
                                  <span className="text-green-600 font-bold text-lg">{scheme.match_score || 0}%</span>
                                  <span className="text-xs text-green-700 font-semibold">Match</span>
                                </div>
                              </div>

                              {/* Match Reason */}
                              {scheme.match_reason && (
                                <div className="bg-green-50 rounded p-3 mb-4 border border-green-100">
                                  <p className="text-xs text-green-700 font-semibold">✓ Why this scheme for you</p>
                                  <p className="text-sm text-textDark mt-1">{scheme.match_reason}</p>
                                </div>
                              )}

                              {/* Details Grid */}
                              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                                <div className="bg-blue-50 rounded p-3">
                                  <p className="text-xs text-blue-600 font-semibold">Type</p>
                                  <p className="text-sm font-bold text-textDark mt-1">{scheme.scheme_type || 'Government'}</p>
                                </div>
                                <div className="bg-green-50 rounded p-3">
                                  <p className="text-xs text-green-600 font-semibold">Cost/Subsidy</p>
                                  <p className="text-sm font-bold text-textDark mt-1">{scheme.premium || 'Varies'}</p>
                                </div>
                                <div className="bg-purple-50 rounded p-3">
                                  <p className="text-xs text-purple-600 font-semibold">Coverage Area</p>
                                  <p className="text-sm font-bold text-textDark mt-1">{scheme.coverage || 'All India'}</p>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2 flex-wrap">
                                <button 
                                  onClick={() => handleViewApplySteps(scheme)}
                                  className="flex-1 min-w-[100px] px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-smooth text-center flex items-center justify-center gap-2"
                                >
                                  <span>📋</span>
                                  How to Apply
                                </button>
                                <a 
                                  href={scheme.link || '#'} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex-1 min-w-[100px] px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-smooth text-center flex items-center justify-center gap-2"
                                >
                                  <span>🔗</span>
                                  Learn More
                                </a>
                                <button 
                                  onClick={() => alert('Redirect to application portal')}
                                  className="flex-1 min-w-[100px] px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-smooth flex items-center justify-center gap-2"
                                >
                                  <span>📝</span>
                                  Apply Now
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                          <p className="text-textLight">No schemes found matching your profile.</p>
                          <p className="text-xs text-textLight mt-2">Complete your profile to see personalized recommendations.</p>
                          <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-smooth"
                          >
                            Update Profile
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <span>ℹ️</span> Personalization Note
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-2">
                        <li>✓ Schemes are matched based on your location, crops, and farming type</li>
                        <li>✓ Higher match score means greater relevance to your profile</li>
                        <li>✓ Always verify eligibility before applying</li>
                        <li>✓ Update your profile to see new scheme recommendations</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Scheme Deadlines Tab */}
            {activeTab === 'deadlines' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-8 border border-red-200">
                  <h3 className="text-h3 font-bold text-textDark mb-4">⏱️ Scheme Deadlines</h3>
                  <p className="text-textLight mb-6">Don't miss important scheme application deadlines. Check upcoming deadlines and plan your applications accordingly.</p>
                </div>

                {/* Deadline Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs text-blue-600 font-semibold mb-2">Total Schemes</p>
                    <p className="text-3xl font-bold text-blue-700">50</p>
                    <p className="text-xs text-blue-600 mt-2">Active government schemes</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border-2 border-red-400">
                    <p className="text-xs text-red-600 font-semibold mb-2">Upcoming Deadlines</p>
                    <p className="text-3xl font-bold text-red-700">5</p>
                    <p className="text-xs text-red-600 mt-2">Schemes with deadlines</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <p className="text-xs text-green-600 font-semibold mb-2">Ongoing Schemes</p>
                    <p className="text-3xl font-bold text-green-700">45</p>
                    <p className="text-xs text-green-600 mt-2">No deadline pressure</p>
                  </div>
                </div>

                {/* Upcoming Deadlines List */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-textDark">Upcoming Scheme Deadlines</h4>
                  
                  <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-bold text-textDark">🌾 PM Fasal Bima Yojana (PMFBY)</h5>
                        <p className="text-sm text-textLight mt-1">Crop insurance coverage for natural calamities and pests</p>
                      </div>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2">URGENT</span>
                    </div>
                    <p className="text-xs text-textLight mb-2">Last Date: <span className="font-bold text-red-600">31st Dec 2025</span></p>
                    <p className="text-xs text-textLight mb-3">Priority: <span className="font-bold text-orange-600">HIGH</span></p>
                    <a 
                      href="https://pmfby.gov.in/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded font-semibold transition-smooth inline-block"
                    >
                      Apply Now →
                    </a>
                  </div>

                  <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-bold text-textDark">💳 Kisan Credit Card (KCC)</h5>
                        <p className="text-sm text-textLight mt-1">Short-term crop loans and working capital for farmers</p>
                      </div>
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2">SOON</span>
                    </div>
                    <p className="text-xs text-textLight mb-2">Last Date: <span className="font-bold text-red-600">15th Jan 2025</span></p>
                    <p className="text-xs text-textLight mb-3">Priority: <span className="font-bold text-blue-600">HIGH</span></p>
                    <a 
                      href="https://www.rbi.org.in/Scripts/FAQView.aspx?Id=87" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded font-semibold transition-smooth inline-block"
                    >
                      Apply Now →
                    </a>
                  </div>

                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-bold text-textDark">🌱 Soil Health Card Scheme</h5>
                        <p className="text-sm text-textLight mt-1">Free soil testing and scientific recommendations</p>
                      </div>
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2">MEDIUM</span>
                    </div>
                    <p className="text-xs text-textLight mb-2">Last Date: <span className="font-bold text-red-600">30th June 2025</span></p>
                    <p className="text-xs text-textLight mb-3">Priority: <span className="font-bold text-green-600">MEDIUM</span></p>
                    <a 
                      href="https://soilhealth.dac.gov.in/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded font-semibold transition-smooth inline-block"
                    >
                      Apply Now →
                    </a>
                  </div>

                  <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-bold text-textDark">🚜 PM-KUSUM (Solar Schemes)</h5>
                        <p className="text-sm text-textLight mt-1">Solar pump subsidy and renewable energy support</p>
                      </div>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2">LOW</span>
                    </div>
                    <p className="text-xs text-textLight mb-2">Last Date: <span className="font-bold text-red-600">28th Feb 2025</span></p>
                    <p className="text-xs text-textLight mb-3">Priority: <span className="font-bold text-purple-600">MEDIUM</span></p>
                    <a 
                      href="https://pmkusum.mnre.gov.in/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded font-semibold transition-smooth inline-block"
                    >
                      Apply Now →
                    </a>
                  </div>

                  <div className="border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-bold text-textDark">💰 PM-KISAN Supplementary (Direct Income)</h5>
                        <p className="text-sm text-textLight mt-1">Additional income support for eligible farmers</p>
                      </div>
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2">MEDIUM</span>
                    </div>
                    <p className="text-xs text-textLight mb-2">Last Date: <span className="font-bold text-red-600">15th March 2025</span></p>
                    <p className="text-xs text-textLight mb-3">Priority: <span className="font-bold text-indigo-600">MEDIUM</span></p>
                    <a 
                      href="https://pmkisan.gov.in/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded font-semibold transition-smooth inline-block"
                    >
                      Apply Now →
                    </a>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h4 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                    <span>⚠️</span> Important Reminders
                  </h4>
                  <ul className="text-sm text-yellow-800 space-y-2">
                    <li>✓ Always apply through official government channels only</li>
                    <li>✓ Verify exact deadline dates on official scheme websites (may vary by state)</li>
                    <li>✓ Submit applications before the deadline - late submissions are rejected</li>
                    <li>✓ Keep all application receipts and documents for reference</li>
                    <li>✓ Check scheme eligibility criteria before applying</li>
                  </ul>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg p-6">
                  <h4 className="font-bold text-lg mb-2">📅 Mark Your Calendar!</h4>
                  <p className="text-sm mb-4 opacity-90">Set reminders for upcoming deadlines to never miss a scheme application opportunity.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={downloadCalendarFile}
                      className="flex-1 bg-white text-indigo-600 font-bold py-2 rounded-lg hover:bg-gray-100 transition-smooth flex items-center justify-center gap-2"
                    >
                      <span>📥</span>
                      Download to Calendar
                    </button>
                    <button 
                      onClick={addToGoogleCalendar}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-smooth flex items-center justify-center gap-2"
                    >
                      <span>🔗</span>
                      Add to Google Calendar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* How to Apply Tab */}
            {activeTab === 'eligibility' && (
              <div className="space-y-6">
                <h3 className="text-h3 font-bold text-textDark mb-2">Check Your Eligibility</h3>
                <p className="text-textLight mb-6">Fill in your farming details to find schemes you're eligible for</p>
                
                {/* Eligibility Form */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Land Size */}
                    <div>
                      <label className="block text-sm font-semibold text-textDark mb-2">Farm Size (hectares)</label>
                      <input
                        type="number"
                        placeholder="e.g., 2.5"
                        value={eligibilityForm.landSize}
                        onChange={(e) => setEligibilityForm({...eligibilityForm, landSize: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-semibold text-textDark mb-2">State</label>
                      <select
                        value={eligibilityForm.state}
                        onChange={(e) => setEligibilityForm({...eligibilityForm, state: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select State</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Primary Crop */}
                    <div>
                      <label className="block text-sm font-semibold text-textDark mb-2">Primary Crop</label>
                      <select
                        value={eligibilityForm.crop}
                        onChange={(e) => setEligibilityForm({...eligibilityForm, crop: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select Crop</option>
                        <option value="Wheat">Wheat</option>
                        <option value="Rice">Rice</option>
                        <option value="Corn">Corn</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Sugarcane">Sugarcane</option>
                        <option value="Soybeans">Soybeans</option>
                        <option value="Pulses">Pulses</option>
                        <option value="Potato">Potato</option>
                        <option value="Onion">Onion</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Annual Income */}
                    <div>
                      <label className="block text-sm font-semibold text-textDark mb-2">Annual Income (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g., 150000"
                        value={eligibilityForm.income}
                        onChange={(e) => setEligibilityForm({...eligibilityForm, income: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block text-sm font-semibold text-textDark mb-2">Your Age</label>
                      <input
                        type="number"
                        placeholder="e.g., 35"
                        value={eligibilityForm.age}
                        onChange={(e) => setEligibilityForm({...eligibilityForm, age: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Farming Type */}
                    <div>
                      <label className="block text-sm font-semibold text-textDark mb-2">Farming Type</label>
                      <select
                        value={eligibilityForm.farmingType}
                        onChange={(e) => setEligibilityForm({...eligibilityForm, farmingType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="conventional">Conventional</option>
                        <option value="organic">Organic</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eligibilityForm.isOrganic}
                        onChange={(e) => setEligibilityForm({...eligibilityForm, isOrganic: e.target.checked})}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                      />
                      <span className="text-sm font-medium text-textDark">Practice Organic Farming</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eligibilityForm.hasIrrigation}
                        onChange={(e) => setEligibilityForm({...eligibilityForm, hasIrrigation: e.target.checked})}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                      />
                      <span className="text-sm font-medium text-textDark">Have Irrigation Facility</span>
                    </label>
                  </div>

                  {/* Check Eligibility Button */}
                  <button
                    onClick={checkEligibility}
                    className="w-full mt-4 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-smooth text-center"
                  >
                    🎯 Check Eligibility & Get Recommendations
                  </button>
                </div>

                {/* Recommendations */}
                {recommendedSchemes.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-textDark">✅ Schemes You're Eligible For</h4>
                    <p className="text-sm text-textLight">Based on your farming profile, here are the government schemes you can apply for:</p>
                    
                    {recommendedSchemes.map((scheme, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h5 className="text-base font-bold text-textDark">{scheme.name}</h5>
                            <p className="text-sm text-textLight mt-1">{scheme.reason}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                            <div className="bg-white border-2 border-green-500 rounded-full w-16 h-16 flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-lg font-bold text-green-600">{scheme.match}%</p>
                                <p className="text-xs text-green-600 font-semibold">Match</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all"
                              style={{ width: `${scheme.match}%` }}
                            ></div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleViewApplySteps(schemes.find(s => s.name.includes(scheme.name.split('(')[0].trim())) || {})}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-smooth text-sm"
                        >
                          <span>📋</span>
                          View Application Steps
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        setRecommendedSchemes([]);
                        setEligibilityForm({
                          landSize: '', state: '', crop: '', income: '',
                          isOrganic: false, hasIrrigation: false,
                          farmingType: 'conventional', age: ''
                        });
                      }}
                      className="w-full mt-4 px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-smooth"
                    >
                      ↻ Reset & Check Again
                    </button>
                  </div>
                )}

                {/* Empty State */}
                {recommendedSchemes.length === 0 && eligibilityForm.state && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <p className="text-blue-800 font-medium">👤 Fill in your details above and click "Check Eligibility" to see recommended schemes</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'apply' && (
              <div className="space-y-6">
                <h3 className="text-h3 font-bold text-textDark mb-6">How to Apply for Schemes</h3>
                <p className="text-textLight mb-6">Select a scheme below to view its step-by-step application process</p>
                
                {allSchemes.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {allSchemes.slice(0, 10).map((scheme, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleViewApplySteps(scheme)}
                          className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-smooth group"
                        >
                          <h5 className="font-bold text-textDark group-hover:text-indigo-600">{scheme.name}</h5>
                          <p className="text-xs text-textLight mt-1">{scheme.type}</p>
                          <p className="text-xs text-indigo-600 font-semibold mt-2">Click to view application steps →</p>
                        </button>
                      ))}
                    </div>
                    
                    {allSchemes.length > 10 && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-blue-800">
                          ℹ️ Showing 10 of {allSchemes.length} schemes. Use the <strong>Search Schemes</strong> tab to find more specific schemes.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                    <p className="text-textLight">Loading schemes...</p>
                  </div>
                )}

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mt-6">
                  <h4 className="font-bold text-blue-900 mb-3">General Application Process</h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>✓ <strong>Check Eligibility:</strong> Verify your state, crop, landholding size, and income limits</li>
                    <li>✓ <strong>Gather Documents:</strong> Collect Aadhaar, land records, bank details, and farm certificates</li>
                    <li>✓ <strong>Fill Application:</strong> Complete the form through official portal or CSC (Common Service Center)</li>
                    <li>✓ <strong>Submit & Verify:</strong> Submit documents for verification at block/taluka office</li>
                    <li>✓ <strong>Wait for Approval:</strong> Typically 15-30 days for decision</li>
                    <li>✓ <strong>Receive Benefits:</strong> Approved benefits are credited to your registered bank account</li>
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                  <h4 className="font-bold text-orange-900 mb-3">Important Tips</h4>
                  <ul className="text-sm text-orange-800 space-y-2">
                    <li>⚠️ Always apply through official government channels only</li>
                    <li>⚠️ Never pay any "facilitation fees" to agents - all schemes are FREE</li>
                    <li>⚠️ Keep all documents and application receipts safely</li>
                    <li>⚠️ Check scheme deadlines before applying</li>
                    <li>⚠️ Verify all information in the form before submitting</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* CTA Box */}
              <div className="bg-indigo-600 text-white rounded-lg p-6 space-y-4">
                <h4 className="font-bold text-lg">Find Your Scheme</h4>
                <p className="text-sm opacity-90">Get schemes suited for your farming profile</p>
                <button 
                  onClick={() => setActiveTab('myschemes')}
                  className="w-full bg-white text-indigo-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-smooth focus-ring"
                >
                  Search Now
                </button>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-4">
                <h4 className="font-bold text-textDark">Scheme Statistics</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-textLight">Active Schemes</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {statsLoading ? '...' : stats.totalSchemes + '+'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-textLight">Total Benefits Distributed</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {statsLoading ? '...' : stats.totalBenefits}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-textLight">Beneficiaries</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {statsLoading ? '...' : stats.totalBeneficiaries}
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Dates */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h5 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 16H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V16H5.5z" />
                  </svg>
                  Scheme Deadlines
                </h5>
                <div className="text-xs text-orange-800 space-y-3">
                  <div className="bg-white p-2 rounded border border-orange-100">
                    <p className="font-semibold text-orange-900">🌾 PMFBY Premium</p>
                    <p className="text-orange-700 font-bold">31st Dec 2025</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-orange-100">
                    <p className="font-semibold text-orange-900">💳 KCC Renewal</p>
                    <p className="text-orange-700 font-bold">15th Jan 2025</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-orange-100">
                    <p className="font-semibold text-orange-900">🌱 Soil Health Card</p>
                    <p className="text-orange-700 font-bold">30th June 2025</p>
                  </div>
                  <button
                    onClick={() => window.location.href = '/deadlines'}
                    className="w-full mt-2 text-xs font-bold bg-orange-400 hover:bg-orange-500 text-white py-2 rounded transition-smooth"
                  >
                    View All Deadlines →
                  </button>
                </div>
              </div>

              {/* FAQs */}
              <div className="space-y-3">
                <h4 className="font-bold text-textDark">FAQs</h4>
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                      className="w-full px-3 py-3 flex items-start gap-2 hover:bg-gray-50 transition-smooth text-left"
                    >
                      <span className="flex-shrink-0">❓</span>
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
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
