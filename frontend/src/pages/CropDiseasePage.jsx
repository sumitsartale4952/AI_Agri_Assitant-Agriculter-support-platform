import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = 'http://localhost:8000/api';

export default function CropDiseasePage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('how-it-works');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
      
      // Call backend disease detection API
      setLoading(true);
      setError(null);
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        console.log('🔍 Sending image to disease detection API...');
        const response = await fetch(`${API_BASE_URL}/disease/detect`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Disease detection result:', data);
        
        setDetectionResult({
          disease: data.disease,
          confidence: data.confidence,
          severity: data.confidence >= 80 ? 'High' : data.confidence >= 60 ? 'Moderate' : 'Low',
          crop: 'Detected from image',
          treatment: data.treatment || ['Consult local agricultural expert'],
          preventive: data.prevention || ['Maintain field hygiene', 'Regular monitoring'],
          description: data.description,
          symptoms: data.symptoms || [],
          scientific_name: data.scientific_name || '',
          all_suggestions: data.all_suggestions || []
        });
      } catch (err) {
        console.error('❌ Disease detection error:', err);
        setError(`Failed to detect disease: ${err.message}`);
        setDetectionResult(null);
      } finally {
        setLoading(false);
      }
    }
  };

  const commonDiseases = [
    {
      name: 'Powdery Mildew',
      crops: 'Wheat, Barley, Grapes',
      symptoms: 'White powder-like coating on leaves',
      treatment: 'Sulfur dust, Neem oil, Fungicides',
    },
    {
      name: 'Early Blight',
      crops: 'Potato, Tomato',
      symptoms: 'Brown concentric rings on lower leaves',
      treatment: 'Copper fungicides, Remove infected leaves',
    },
    {
      name: 'Rust',
      crops: 'Wheat, Rice, Maize',
      symptoms: 'Orange/reddish pustules on leaves',
      treatment: 'Resistant varieties, Fungicides',
    },
    {
      name: 'Leaf Spot',
      crops: 'Rice, Maize, Sugarcane',
      symptoms: 'Circular or angular spots on leaves',
      treatment: 'Bordeaux mixture, Fungicides',
    },
  ];

  const tabs = [
    { id: 'how-it-works', label: 'How It Works', icon: '📸' },
    { id: 'diseases', label: 'Common Diseases', icon: '🦠' },
    { id: 'prevention', label: 'Prevention Tips', icon: '🛡️' },
  ];

  const faqs = [
    {
      q: 'What image quality do I need for accurate detection?',
      a: 'Clear, well-lit photos of affected leaf area work best. Avoid blurry or low-light images.',
    },
    {
      q: 'How accurate is the AI detection?',
      a: 'Our AI model is 90%+ accurate on common diseases. Always verify with local agricultural experts.',
    },
    {
      q: 'Can it detect multiple diseases?',
      a: 'The system identifies the primary disease. If multiple diseases are present, upload separate photos.',
    },
    {
      q: 'What do I do if detection is unclear?',
      a: 'Contact your local agricultural extension office or upload a clearer image.',
    },
  ];

  return (
    <div className="min-h-screen bg-white bg-cover bg-fixed" style={{ backgroundImage: 'url(/images/services/crop_diseases.jpg)' }}>
      <Navbar />

      {/* Hero Section - Sticky */}
      <section 
        className="sticky top-20 z-40 text-white pt-8 pb-8 px-4 lg:px-6"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="text-6xl drop-shadow-lg">🦠</div>
            <div>
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">Crop Disease Detection</h1>
              <p className="text-lg drop-shadow">
                Identify diseases from photos. Get treatment recommendations instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 bg-white/98 backdrop-blur-sm rounded-t-2xl relative z-10">
        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 border-b-2 border-gray-300 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-smooth flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-red-600 text-red-600'
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
            {/* How It Works Tab */}
            {activeTab === 'how-it-works' && (
              <div className="space-y-8">
                {/* Upload Section */}
                <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300 text-center">
                  {!uploadedImage ? (
                    <div className="space-y-4">
                      <div className="text-5xl">📸</div>
                      <h3 className="text-h3 font-bold text-textDark">Upload a Photo</h3>
                      <p className="text-textLight">Take a photo of affected plant leaves</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-smooth"
                      >
                        Choose Image
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        aria-label="Upload crop disease image"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <img
                        src={uploadedImage}
                        alt="Uploaded crop image"
                        className="max-w-full h-auto rounded-lg mx-auto max-h-80"
                      />
                      {loading && (
                        <div className="flex justify-center items-center gap-2 p-4 bg-blue-50 rounded-lg">
                          <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-sm font-medium text-blue-700">Analyzing image... this may take a few seconds</span>
                        </div>
                      )}
                      {error && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <span className="text-red-600 font-bold">✕</span>
                          <div>
                            <p className="text-sm font-medium text-red-800">Detection Error</p>
                            <p className="text-xs text-red-700 mt-1">{error}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => {
                            setUploadedImage(null);
                            setDetectionResult(null);
                            setError(null);
                            setLoading(false);
                            fileInputRef.current?.click();
                          }}
                          disabled={loading}
                          className="px-4 py-2 bg-gray-300 text-textDark font-medium rounded-lg hover:bg-gray-400 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Upload Different
                        </button>
                        {detectionResult && (
                          <button
                            onClick={() => {
                              setUploadedImage(null);
                              setDetectionResult(null);
                              setError(null);
                              setLoading(false);
                            }}
                            className="px-4 py-2 bg-gray-300 text-textDark font-medium rounded-lg hover:bg-gray-400 transition-smooth"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Results Section */}
                {detectionResult && (
                  <div className={`border rounded-lg p-6 space-y-4 ${
                    detectionResult.disease === 'No disease detected'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-orange-50 border-orange-200'
                  }`}>
                    <h3 className={`text-h3 font-bold flex items-center gap-2 ${
                      detectionResult.disease === 'No disease detected'
                        ? 'text-green-900'
                        : 'text-orange-900'
                    }`}>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {detectionResult.disease === 'No disease detected' ? '✓ Plant Looks Healthy' : '⚠️ Disease Detected'}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Disease/Condition</p>
                        <p className="text-lg font-bold text-textDark">{detectionResult.disease}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Confidence</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold text-textDark">{detectionResult.confidence}%</p>
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                detectionResult.confidence >= 80 ? 'bg-red-500' :
                                detectionResult.confidence >= 60 ? 'bg-orange-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${detectionResult.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Severity</p>
                        <p className={`text-lg font-bold ${
                          detectionResult.severity === 'High' ? 'text-red-600' :
                          detectionResult.severity === 'Moderate' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`}>{detectionResult.severity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="text-lg font-bold text-textDark">{detectionResult.crop}</p>
                      </div>
                    </div>

                    {detectionResult.description && (
                      <div className={`p-3 rounded ${
                        detectionResult.disease === 'No disease detected'
                          ? 'bg-green-100'
                          : 'bg-orange-100'
                      }`}>
                        <p className="text-sm text-textDark">{detectionResult.description}</p>
                      </div>
                    )}

                    {detectionResult.disease !== 'No disease detected' && (
                      <div className="space-y-4 mt-6 pt-6 border-t border-orange-200">
                        <div>
                          <h4 className="font-semibold text-textDark mb-3 flex items-center gap-2">
                            <span>💊</span> Recommended Treatment
                          </h4>
                          <ul className="space-y-2">
                            {(detectionResult.treatment || []).map((item, idx) => (
                              <li key={idx} className="flex gap-2 text-sm text-textDark">
                                <span className="text-green-600 font-bold">✓</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-textDark mb-3 flex items-center gap-2">
                            <span>🛡️</span> Preventive Measures
                          </h4>
                          <ul className="space-y-2">
                            {(detectionResult.preventive || []).map((item, idx) => (
                              <li key={idx} className="flex gap-2 text-sm text-textDark">
                                <span className="text-blue-600 font-bold">→</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Symptoms Section */}
                        {detectionResult.symptoms && detectionResult.symptoms.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-textDark mb-3 flex items-center gap-2">
                              <span>⚠️</span> Symptoms & Signs
                            </h4>
                            <ul className="space-y-2">
                              {detectionResult.symptoms.map((item, idx) => (
                                <li key={idx} className="flex gap-2 text-sm text-textDark">
                                  <span className="text-yellow-600 font-bold">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Alternative Suggestions */}
                        {detectionResult.all_suggestions && detectionResult.all_suggestions.length > 1 && (
                          <div className="border-t border-orange-200 pt-4">
                            <h4 className="font-semibold text-textDark mb-3 flex items-center gap-2">
                              <span>🔍</span> Other Possible Diseases
                            </h4>
                            <div className="space-y-2">
                              {detectionResult.all_suggestions.map((suggestion, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-orange-50 rounded border border-orange-200">
                                  <div>
                                    <p className="font-semibold text-textDark">{suggestion.name}</p>
                                    {suggestion.scientific_name && (
                                      <p className="text-xs text-gray-500 italic">{suggestion.scientific_name}</p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-orange-700">{suggestion.probability}%</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Steps */}
                <div className="space-y-4">
                  <h3 className="text-h3 font-bold text-textDark">Step-by-Step Guide</h3>
                  {[
                    { step: 1, title: 'Take a Photo', desc: 'Photograph the affected leaf in natural light' },
                    { step: 2, title: 'Upload Image', desc: 'Click above to upload or take a photo directly' },
                    { step: 3, title: 'AI Analysis', desc: 'Our model analyzes the image in seconds' },
                    { step: 4, title: 'Get Treatment', desc: 'Receive personalized treatment recommendations' },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-textDark">{item.title}</h4>
                        <p className="text-sm text-textLight">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Diseases Tab */}
            {activeTab === 'diseases' && (
              <div className="space-y-4">
                <h3 className="text-h3 font-bold text-textDark mb-6">Common Crop Diseases</h3>
                {commonDiseases.map((disease, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-smooth">
                    <h4 className="font-bold text-textDark mb-2">{disease.name}</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold text-textDark">Crops: </span>
                        <span className="text-textLight">{disease.crops}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-textDark">Symptoms: </span>
                        <span className="text-textLight">{disease.symptoms}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-textDark">Treatment: </span>
                        <span className="text-textLight">{disease.treatment}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Prevention Tips Tab */}
            {activeTab === 'prevention' && (
              <div className="space-y-4">
                <h3 className="text-h3 font-bold text-textDark mb-6">Disease Prevention Tips</h3>
                {[
                  {
                    title: 'Crop Rotation',
                    desc: 'Rotate crops annually to break disease cycles and reduce pathogen buildup in soil.',
                  },
                  {
                    title: 'Seed Selection',
                    desc: 'Use certified disease-resistant seed varieties recommended for your region.',
                  },
                  {
                    title: 'Sanitation',
                    desc: 'Remove infected plants immediately and clean tools to prevent spread.',
                  },
                  {
                    title: 'Irrigation Management',
                    desc: 'Water at soil level early morning to keep foliage dry and reduce fungal growth.',
                  },
                  {
                    title: 'Spacing & Ventilation',
                    desc: 'Plant at proper spacing to ensure good air circulation around plants.',
                  },
                  {
                    title: 'Monitoring',
                    desc: 'Regularly inspect crops and catch early signs of disease for quick action.',
                  },
                ].map((tip, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-bold text-textDark mb-2">{tip.title}</h4>
                    <p className="text-sm text-textLight">{tip.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* CTA Box */}
              <div className="bg-red-600 text-white rounded-lg p-6 space-y-4">
                <h4 className="font-bold text-lg">Analyze Now</h4>
                <p className="text-sm opacity-90">Upload a photo to identify crop diseases instantly</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-white text-red-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-smooth focus-ring"
                >
                  Upload Image
                </button>
              </div>

              {/* Quick Facts */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h4 className="font-bold text-textDark">Quick Facts</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-textLight">Supported Crops</p>
                    <p className="text-sm font-semibold text-textDark">50+ varieties</p>
                  </div>
                  <div>
                    <p className="text-xs text-textLight">Diseases Detected</p>
                    <p className="text-sm font-semibold text-textDark">100+ diseases</p>
                  </div>
                  <div>
                    <p className="text-xs text-textLight">Average Accuracy</p>
                    <p className="text-sm font-semibold text-textDark">92%</p>
                  </div>
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
                      <span className="flex-shrink-0 text-lg">❓</span>
                      <span className="font-medium text-sm text-textDark">{faq.q}</span>
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
