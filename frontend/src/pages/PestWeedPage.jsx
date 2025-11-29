import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Image path base - serves from public/images/pests/
const PEST_IMAGE_BASE = '/images/pests/';

// Pest recommendations database
const PEST_RECOMMENDATIONS = {
  'aphids': {
    organic_control: [
      'Apply neem-oil spray (e.g. neem kernel suspension) (safe for natural enemies)',
      'Use Metarhizium anisopliae (entomopathogenic fungus)',
      'Encourage natural predators: lady beetles (Coccinellids), lacewings, parasitic wasps'
    ],
    chemical_control: [
      'Malathion spray (as last resort, following IPM recommendations)',
      'Carbaryl dust',
      'Lambda-cyhalothrin application (if necessary, but avoid when natural enemies are active)'
    ],
    preventive_measures: [
      'Maintain field cleanliness to reduce pest harborage',
      'Use crop rotation to break pest cycles',
      'Avoid over-fertilization (to not create lush growth that attracts aphids)',
      'Conserve natural enemy populations by minimizing broad-spectrum pesticide use'
    ]
  },
  'armyworm': {
    organic_control: [
      'Release or conserve parasitoids (e.g. Trichogramma chilonis, T. remus)',
      'Use azadirachtin (neem-based) biopesticide (10,000 ppm)',
      'Apply entomopathogenic fungus or other microbial biopesticides like Metarhizium anisopliae',
      'Use intercropping (e.g. maize + lady\'s finger) to reduce infestation'
    ],
    chemical_control: [
      'Malathion spray (only when necessary and according to threshold)',
      'Carbaryl dust',
      'Lambda-cyhalothrin (if other controls fail and population is high)'
    ],
    preventive_measures: [
      'Timely crop monitoring & pheromone / light traps (to detect moths)',
      'Maintain field hygiene and remove infested plant parts',
      'Conserve natural enemies by using selective interventions',
      'Crop rotation / push-pull strategies for stem-borer and armyworm pests'
    ]
  },
  'beetle': {
    organic_control: [
      'Manual removal (hand-pick beetles)',
      'Encourage predators like ladybugs, ground beetles',
      'Use botanical extracts (like neem) or biopesticides (fungal) if reported / available'
    ],
    chemical_control: [
      'Malathion spray (as last resort)',
      'Carbaryl dust',
      'Lambda-cyhalothrin application (if required)'
    ],
    preventive_measures: [
      'Maintain field cleanliness',
      'Crop rotation to reduce beetle buildup',
      'Use trap cropping (plant a beetle-attractive crop as trap)',
      'Avoid over-fertilization which can favor beetle pest populations'
    ]
  },
  'bollworm': {
    organic_control: [
      'Release Trichogramma chilonis parasitoids (egg parasitoid)',
      'Apply neem-based biopesticides (Azadirachtin)',
      'Use Bacillus thuringiensis (Bt) formulations (microbial control)'
    ],
    chemical_control: [
      'Malathion spray (last resort)',
      'Carbaryl dust',
      'Lambda-cyhalothrin application (if threshold crossed and after biocontrol)'
    ],
    preventive_measures: [
      'Crop rotation to disrupt bollworm life cycle',
      'Timely sowing (optimize planting time) to avoid peak pest periods',
      'Use of pheromone traps to monitor or mass trap moths',
      'Maintain field hygiene, remove infested bolls'
    ]
  },
  'grasshopper': {
    organic_control: [
      'Encourage natural predators (birds, beneficial insects)',
      'Use biopesticides if available (e.g. Metarhizium) — general biocontrol strategy',
      'Manual removal of nymph clusters, early deep tillage to destroy egg pods (cultural-mechanical)'
    ],
    chemical_control: [
      'Malathion spray (only if population is very high)',
      'Carbaryl dust',
      'Lambda-cyhalothrin (only when really needed)'
    ],
    preventive_measures: [
      'Deep ploughing in uncultivated areas to destroy egg pods (IPM principle)',
      'Maintain field sanitation',
      'Use trap crops or barrier crops to divert grasshoppers',
      'Avoid over-fertilization which may attract more insects'
    ]
  },
  'mites': {
    organic_control: [
      'Use sulfur dust or organic sulfur sprays (if allowed)',
      'Apply neem-oil (safe for many predatory mites)',
      'Conserve or release predatory mites and natural enemies via IPM'
    ],
    chemical_control: [
      'Malathion (acaricidal use) — but use carefully',
      'Carbaryl dust (if mite population is very high)',
      'Selective miticides (if available and absolutely necessary, but not broad insecticide)'
    ],
    preventive_measures: [
      'Avoid overuse of broad-spectrum insecticides which kill natural predators',
      'Maintain field hygiene',
      'Ensure good irrigation practices — avoid plant stress which favors mites',
      'Use resistant or tolerant varieties (if available) and avoid excessive fertilization'
    ]
  },
  'mosquito': {
    organic_control: [
      'Use Beauveria bassiana biocontrol (entomopathogenic fungus)',
      'Eliminate standing water (removal of breeding sites) to prevent mosquito breeding',
      'Encourage natural predators (e.g. insectivorous birds, dragonflies)'
    ],
    chemical_control: [
      'Malathion spray (if mosquitoes in high density and risk of disease)',
      'Larvicidal dust or chemical in water (if permitted / safe)',
      'Lambda-cyhalothrin (only as last resort, considering environmental risk)'
    ],
    preventive_measures: [
      'Remove or manage water collection points in and around fields / nurseries',
      'Use mosquito nets / screens in nursery areas',
      'Clean nursery trays and containers regularly',
      'Promote habitat for natural mosquito predators'
    ]
  },
  'sawfly': {
    organic_control: [
      'Collect and destroy sawfly larvae manually in early morning / evening',
      'Encourage parasitoids like Perilissus cingulator (or other natural enemies)',
      'Use botanical anti-feedant sprays (e.g. bitter gourd seed oil emulsion)'
    ],
    chemical_control: [
      'Malathion 50 EC spray (last resort)',
      'Other selective insecticides only if biological control fails',
      'Use of synthetic insecticides only considering impact on beneficials'
    ],
    preventive_measures: [
      'Maintain crop hygiene and remove alternate hosts / weeds',
      'Use light or pheromone traps if available to monitor adults',
      'Crop rotation to break sawfly life cycle',
      'Promote insect-friendly habitat to conserve parasitoids'
    ]
  },
  'stem_borer': {
    organic_control: [
      'Release Trichogramma japonicum parasitoids (egg parasitoid) for stem borer eggs',
      'Use "push–pull" strategy: intercropping push plants (e.g., Desmodium) and "pull" trap grasses like Napier grass',
      'Use entomopathogenic fly / parasitoid like Sturmiopsis inferens (tachinid) for sugarcane / borer control'
    ],
    chemical_control: [
      'Malathion or Quinalphos granules / spray (as last resort) following IPM thresholds',
      'Use selective insecticides if biocontrol is insufficient (minimize broad-spectrum)',
      'Apply insecticide only when moths / eggs are detected via traps'
    ],
    preventive_measures: [
      'Push-pull cropping to repel and trap borers (Desmodium + Napier)',
      'Maintain plant hygiene: remove and destroy infested stems or dead-hearts early',
      'Use light/pheromone traps to monitor pest populations',
      'Avoid overuse of insecticides so that natural enemies (parasitoids) are conserved'
    ]
  }
};

export default function PestWeedPage() {
  const [activeTab, setActiveTab] = useState('detection');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const handleUploadClick = () => {
    // Reset file input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Reset states
    setUploadedImage(null);
    setDetectionResult(null);
    setError(null);
    setLoading(false);
    // Open file picker
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 0);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);

      // Send to backend for AI detection
      setLoading(true);
      setError(null);
      setDetectionResult(null);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:8000/api/ml/kindwise-detect', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Pest detection result:', data);
        
        // Try to get detailed pest info from local database for better recommendations
        let enrichedData = {
          organic_control: data.treatment || ['Monitor regularly', 'Remove affected parts'],
          chemical_control: data.treatment || ['Consult local agricultural expert'],
          preventive_measures: data.prevention || ['Maintain field hygiene', 'Practice crop rotation'],
        };

        // Try to match detected pest to local database for enriched data
        const pestName = data.pest || 'Unknown';
        try {
          const pestInfoResponse = await fetch(`http://localhost:8000/api/ml/pest-info/${pestName.toLowerCase().replace(/\s+/g, '_')}`, {
            timeout: 2000
          });
          if (pestInfoResponse.ok) {
            const pestInfo = await pestInfoResponse.json();
            if (pestInfo.success) {
              enrichedData = {
                organic_control: pestInfo.organic_control || enrichedData.organic_control,
                chemical_control: pestInfo.chemical_control || enrichedData.chemical_control,
                preventive_measures: pestInfo.preventive_measures || enrichedData.preventive_measures,
              };
            }
          }
        } catch (enrichErr) {
          // Silently fail - use API data if local DB lookup fails
          console.log('Could not fetch local pest info:', enrichErr);
        }
        
        // Process the response
        setDetectionResult({
          pest: data.pest || 'Unknown Pest',
          confidence: data.confidence || 0,
          severity: data.confidence >= 80 ? 'High' : data.confidence >= 60 ? 'Moderate' : 'Low',
          crops: 'Detected from image',
          description: data.description || 'Unable to identify specific pest',
          organicControl: enrichedData.organic_control,
          chemicalControl: enrichedData.chemical_control,
          preventive: enrichedData.preventive_measures,
          scientific_name: data.scientific_name || '',
          symptoms: data.symptoms || [],
          similar_images: data.similar_images || [],
          common_names: data.common_names || [],
          taxonomy: data.taxonomy || {},
          urls: data.urls || [],
          all_suggestions: data.all_suggestions || [],
        });
      } catch (err) {
        console.error('Pest detection error:', err);
        setError('Failed to analyze image. Please try again with a clearer image of the affected area.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Load common pests from JSON data
  const commonPests = [
    {
      name: 'Aphids',
      image: 'aphids_img.jpg',
      crops: 'Cotton, Vegetables, Grains',
      damage: 'Sucks plant sap → yellowing leaves → stunted growth',
      control: 'Neem oil spray, Insecticidal soap, Yellow sticky traps',
      read_more: 'Aphids are small soft-bodied insects that feed on the sap of plant tissues. They reproduce rapidly and can form dense colonies on young leaves, stems, and buds. In addition to weakening the plant by sucking sap, they excrete honeydew, which can lead to sooty mold and attract ants. Some species can also transmit viral diseases between plants.',
      links: [
        { title: 'Ecological engineering in cauliflower for aphid management – ICAR', url: 'https://epubs.icar.org.in/ejournal/index.php/IJAgS/article/view/105621' },
        { title: 'ICAR Kharif Agro-Advisories (includes aphid-control) 2025', url: 'https://icar.org.in/sites/default/files/Circulars/ICAR-En-Kharif-Agro-Advisories-for-Farmers-2025.pdf' }
      ]
    },
    {
      name: 'Armyworm (Fall Armyworm)',
      image: 'Armyworm (Fall Armyworm)_img.jpg',
      crops: 'Maize, Rice, Sugarcane, Cotton',
      damage: 'Leaf damage, whorl feeding, ear damage',
      control: 'Pheromone traps, Neem spray, Spinosad',
      read_more: 'The Fall Armyworm (Spodoptera frugiperda) is an invasive caterpillar that feeds heavily on the leaves (especially whorls) of maize and other crops. It has a high reproductive rate and can spread rapidly, causing significant yield losses. Effective management requires early detection, field monitoring, and integrated control strategies.',
      links: [
        { title: 'Fall armyworm management in maize – Indian Farming / ICAR', url: 'https://epubs.icar.org.in/index.php/IndFarm/article/view/116540' },
        { title: 'Fall Armyworm control methods and symptoms – AgriFarming', url: 'https://www.agrifarming.in/fall-armyworm-control-methods-and-symptoms' }
      ]
    },
    {
      name: 'Beetle',
      image: 'Beetle_img.jpg',
      crops: 'Vegetables, Grains, Legumes',
      damage: 'Leaf holes, stem damage, reduced yield',
      control: 'Manual collection, Neem oil, Spinosad spray',
      read_more: 'Beetles (various species) feed on foliage or bore into stems of vegetable and grain crops. Their feeding can significantly reduce photosynthetic capacity and weaken structural parts of the plant, leading to lower yield. Management often involves physical removal combined with biopesticides.',
      links: [
        { title: 'Sustainable integrated pest management of vegetable crops – ICAR', url: 'https://epubs.icar.org.in/index.php/IndHort/article/download/105271/41166/272593' }
      ]
    },
    {
      name: 'Bollworm',
      image: 'Bollworm_img.jpg',
      crops: 'Cotton, Vegetables',
      damage: 'Flower and fruit damage, entry holes',
      control: 'Pheromone traps, Bacillus thuringiensis, Insecticides',
      read_more: 'Bollworms (for example, pink bollworm) lay eggs on cotton bolls, and their larvae bore into the fruit, damaging the internal structures and reducing yield. Resistance to Bt (Bacillus thuringiensis) has been observed in some regions, making integrated pest management (IPM) strategies particularly important.',
      links: [
        { title: 'Pink bollworm-management strategies – ICAR-CICR', url: 'https://icar.org.in/sites/default/files/Circulars/PBW-Management-strategies-2019.pdf' },
        { title: 'Evaluation of management practices against bollworms in cotton – ICAR', url: 'https://epubs.icar.org.in/index.php/IJAgS/article/view/110942' }
      ]
    },
    {
      name: 'Grasshopper',
      image: 'Grasshopper_img.jpg',
      crops: 'Grains, Pulses, Vegetables',
      damage: 'Defoliation, complete crop loss in severe cases',
      control: 'Neem oil, Spinosad, Carbaryl dust',
      read_more: 'Grasshoppers (Orthoptera) can swarm under favorable conditions and cause severe defoliation of young plants. Their feeding reduces leaf area drastically, which can lead to stunted growth or even total crop loss in heavy infestations.',
      links: [
        { title: 'Grasshopper pest control in paddy – TNAU Agritech', url: 'https://www.agritech.tnau.ac.in/expert_system/paddy/cppests_grasshopper.html' },
        { title: 'Grasshoppers, an Agricultural Pest – Bayer Crop Science', url: 'https://www.cropscience.bayer.us/articles/bayer/grasshoppers-an-agricultural-pest' }
      ]
    },
    {
      name: 'Mites',
      image: 'Mites_img.jpg',
      crops: 'Cotton, Vegetables, Fruits',
      damage: 'Discolored leaves, webbing, stunted growth',
      control: 'Sulfur dust, Neem oil, Miticides',
      read_more: 'Phytophagous mites are tiny arachnids that pierce plant cells to feed, causing bronzing or silvering of leaves, webbing, and stunted growth. They often proliferate when natural predators are disrupted (e.g. by broad-spectrum insecticides), making eco-friendly management very important.',
      links: [
        { title: 'Phytophagous Mites: Eco-friendly Management – ICAR', url: 'https://epubs.icar.org.in/index.php/IndHort/article/download/138759/54402/410709' },
        { title: 'Technologies for mass-rearing predatory mites – ICAR/NBAIR', url: 'https://nbair.res.in/sites/default/files/left%20menu/icbc-2018/ICAR-NBAIRtechnologiesforAgribusiness.pdf' }
      ]
    },
    {
      name: 'Mosquito',
      image: 'Mosquito_img.jpg',
      crops: 'Vegetables, Flowers',
      damage: 'Sap feeding, disease transmission potential',
      control: 'Neem spray, Insecticidal soap, Removal of breeding sites',
      read_more: 'Mosquitoes in the context of crop fields are not a classical crop pest in the same way as caterpillars or beetles, but their presence can be problematic in nurseries or flower beds. They may feed on sap and can also act as vectors for plant pathogens. Proper water management and biological or botanical sprays help control their populations.',
      links: [
        { title: 'ICAR Kharif Agro-Advisories (includes advice on water-management) 2025', url: 'https://icar.org.in/sites/default/files/Circulars/ICAR-En-Kharif-Agro-Advisories-for-Farmers-2025.pdf' }
      ]
    },
    {
      name: 'Sawfly',
      image: 'Sawfly_img.jpg',
      crops: 'Grains, Pulses, Oilseeds',
      damage: 'Leaf skeletonization, reduced photosynthesis',
      control: 'Neem oil, Spinosad, Manual removal',
      read_more: 'Sawfly larvae resemble caterpillars but have more legs, and they feed externally on leaves, often "skeletonizing" them (eating the tissue between veins). This reduces the plant\'s photosynthetic capacity and can limit growth, especially when infestations are heavy.',
      links: [
        { title: 'Sustainable integrated pest management of vegetable crops – ICAR (includes general IPM principles for sawfly-like pests)', url: 'https://epubs.icar.org.in/index.php/IndHort/article/download/105271/41166/272593' }
      ]
    },
    {
      name: 'Stem Borer',
      image: 'Stem Borer img.webp',
      crops: 'Maize, Rice, Sugarcane, Grains',
      damage: 'Dead hearts, drying of leaves, yield loss',
      control: 'Early planting, Pheromone traps, Carbofuran granules',
      read_more: 'Stem borers are moth larvae (for example, Chilo spp. in maize or rice) that bore into the stem, disrupting internal transport and causing \'dead heart\' in young plants or drying of the shoot in older plants. Their control often involves a combination of cultural practices, biological control, and judicious insecticide use.',
      links: [
        { title: 'Rice stem borer: symptoms and management – ICAR-CCARI Goa', url: 'https://ccari.res.in/dss/rice.html' },
        { title: 'AICRIP Entomology Report on Rice Pest Management – ICAR IIRR', url: 'https://www.icar-iirr.org/AICRIP/Progress%20Report%20Entomology%202019.pdf' }
      ]
    }
  ];

  const weeds = [
    {
      name: 'Parthenium (Congress Grass)',
      image: 'Parthenium (Congress Grass).jpeg',
      type: 'Broadleaf',
      damage: 'Reduces yield, releases toxic chemicals',
      control: 'Manual removal, Glyphosate, 2,4-D',
      read_more: 'Extremely invasive; spreads through seeds; harmful to skin and animals.',
      links: [
        { title: 'Advisory note on Parthenium – ICAR', url: 'https://dwr.icar.gov.in/PDF%20Document/Advisory%20note%20on%20Parthenium.pdf' }
      ]
    },
    {
      name: 'Bermuda Grass (Doob Grass)',
      image: 'Bermuda Grass (Doob Grass).jpeg',
      type: 'Grassy',
      damage: 'Competes for nutrients & water',
      control: 'Mulching, Repeated tillage, Quizalofop-p-ethyl',
      read_more: 'Grows fast through roots; difficult to eliminate.',
      links: [
        { title: 'Weed Management Guide – Indian Farming', url: 'https://epubs.icar.org.in/index.php/IndFarm/article/view/85350' }
      ]
    },
    {
      name: 'Water Hyacinth',
      image: 'Water Hyacinth.jpeg',
      type: 'Aquatic',
      damage: 'Blocks irrigation canals',
      control: 'Manual removal, Bioagents (weevils), Mechanical removal',
      read_more: 'Prevents water flow and increases mosquito breeding.',
      links: [
        { title: 'ICAR Achievements – Weed Management', url: 'https://dwr.icar.gov.in/Downloads/Books_and_Other_publications/Significant%20Achievements%28English%29%202024-25.pdf' }
      ]
    },
    {
      name: 'Wild Amaranthus',
      image: 'Wild Amaranthus.jpeg',
      type: 'Broadleaf',
      damage: 'Strong nutrient competitor',
      control: 'Atrazine, Manual weeding',
      read_more: 'High seed production → spreads quickly.',
      links: []
    },
    {
      name: 'Cyperus Rotundus (Purple Nutsedge)',
      image: 'Cyperus Rotundus (Purple Nutsedge).jpeg',
      type: 'Sedge',
      damage: 'Extremely hard to control, grows from underground tubers',
      control: 'Glyphosate, Mulching',
      read_more: 'Spreads through tubers underground; resistant to shallow tillage.',
      links: [
        { title: 'Crop Production Technologies – ICAR-IIPR', url: 'https://www.icar-iipr.org.in/crop-production-technologies/' }
      ]
    }
  ];

  const tabs = [
    { id: 'detection', label: 'Detect Pest/Weed', icon: '📸' },
    { id: 'pests', label: 'Common Pests', icon: '🐛' },
    { id: 'weeds', label: 'Weed Management', icon: '🌿' },
  ];

  const faqs = [
    {
      q: 'Can AI identify all pests?',
      a: 'Our system identifies 100+ common pests. Upload a clear photo for best results. Always verify with local experts.',
    },
    {
      q: 'Is organic or chemical control better?',
      a: 'Start with organic methods. Use chemical control only if organic methods fail, following safety guidelines.',
    },
    {
      q: 'How to prevent pest infestations?',
      a: 'Regular monitoring, crop rotation, removing infected plants, maintaining field hygiene, and using resistant varieties.',
    },
    {
      q: 'What\'s the best time to spray?',
      a: 'Early morning (before 10 AM) or evening (after 4 PM) when beneficial insects are inactive.',
    },
  ];

  return (
    <div className="min-h-screen bg-white bg-cover bg-fixed" style={{ backgroundImage: 'url(/images/services/pests_weeds.jpg)' }}>
      <Navbar />

      {/* Hero Section - Sticky */}
      <section 
        className="sticky top-20 z-40 text-white pt-8 pb-8 px-4 lg:px-6"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="text-6xl drop-shadow-lg">🐛</div>
            <div>
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">Pest & Weed Management</h1>
              <p className="text-lg drop-shadow">
                Identify pests from photos. Get organic & chemical control recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-smooth flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-yellow-600 text-yellow-600'
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
            {/* Detection Tab */}
            {activeTab === 'detection' && (
              <div className="space-y-8">
                {/* Upload Section */}
                <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300 text-center">
                  {!uploadedImage ? (
                    <div className="space-y-4">
                      <div className="text-5xl">📸</div>
                      <h3 className="text-h3 font-bold text-textDark">Upload a Photo</h3>
                      <p className="text-textLight">Take a photo of affected plant area or pest</p>
                      <button
                        onClick={handleUploadClick}
                        className="inline-block px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-smooth disabled:opacity-50"
                        disabled={loading}
                      >
                        {loading ? 'Analyzing...' : 'Choose Image'}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={loading}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <img
                        src={uploadedImage}
                        alt="Pest/weed detection"
                        className="max-w-full h-auto rounded-lg mx-auto max-h-80"
                      />
                      {loading && (
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mb-2"></div>
                          <p className="text-textLight">Analyzing image with AI model...</p>
                        </div>
                      )}
                      {!loading && (
                        <button
                          onClick={handleUploadClick}
                          className="px-4 py-2 bg-gray-300 text-textDark font-medium rounded-lg hover:bg-gray-400 transition-smooth"
                        >
                          Upload Different
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">⚠️ {error}</p>
                  </div>
                )}

                {/* Results */}
                {detectionResult && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 space-y-4">
                    <h3 className="text-h3 font-bold text-orange-900">✓ Pest Detection Result</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-orange-700">Pest Identified</p>
                        <p className="text-lg font-bold text-textDark">{detectionResult.pest}</p>
                      </div>
                      <div>
                        <p className="text-sm text-orange-700">Confidence</p>
                        <p className="text-lg font-bold text-orange-600">{detectionResult.confidence}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-orange-700">Severity</p>
                        <p className="text-lg font-bold text-orange-600">{detectionResult.severity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-orange-700">Affected Crops</p>
                        <p className="text-lg font-bold text-textDark">{detectionResult.crops}</p>
                      </div>
                    </div>

                    {detectionResult.description && (
                      <div className="pt-4 border-t border-orange-200">
                        <p className="text-sm text-textDark"><strong>Description:</strong> {detectionResult.description}</p>
                      </div>
                    )}

                    {/* Similar Images Section */}
                    {detectionResult.similar_images && detectionResult.similar_images.length > 0 && (
                      <div className="pt-4 border-t border-orange-200">
                        <h4 className="font-semibold text-textDark mb-3">🖼️ Similar Images ({detectionResult.similar_images.length})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {detectionResult.similar_images.map((img, idx) => (
                            <div key={idx} className="text-center">
                              <div className="bg-orange-50 rounded-lg border-2 border-orange-300 overflow-hidden">
                                <a 
                                  href={img.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block group"
                                >
                                  <div className="relative bg-gradient-to-br from-orange-100 to-yellow-100 w-full h-40 flex items-center justify-center overflow-hidden">
                                    <img 
                                      src={img.url_small || img.url}
                                      alt={`Similar ${idx + 1}`}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                      loading="lazy"
                                    />
                                  </div>
                                </a>
                              </div>
                              <div className="mt-2 text-xs space-y-1">
                                <p className="font-semibold text-orange-700">Match: {img.similarity}%</p>
                                {img.citation && <p className="text-gray-600">{img.citation}</p>}
                                {img.license && <p className="text-gray-500">{img.license}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-3 italic">Similar pests from Kindwise database. Click to view full image.</p>
                      </div>
                    )}

                    <div className="space-y-4 mt-6 pt-6 border-t border-orange-200">
                      <div>
                        <h4 className="font-semibold text-textDark mb-3 flex items-center gap-2">
                          <span>🌿</span> Organic Control (Recommended First)
                        </h4>
                        <ul className="space-y-2">
                          {detectionResult.organicControl.map((item, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-textDark">
                              <span className="text-green-600 font-bold">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-textDark mb-3 flex items-center gap-2">
                          <span>⚗️</span> Chemical Control (Last Resort)
                        </h4>
                        <ul className="space-y-2">
                          {detectionResult.chemicalControl.map((item, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-textDark">
                              <span className="text-orange-600 font-bold">→</span>
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
                          {detectionResult.preventive.map((item, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-textDark">
                              <span className="text-blue-600 font-bold">→</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {detectionResult.recommendations && detectionResult.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-textDark mb-3 flex items-center gap-2">
                            <span>📋</span> Immediate Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {detectionResult.recommendations.map((item, idx) => (
                              <li key={idx} className="flex gap-2 text-sm text-textDark">
                                <span className="text-red-600 font-bold">!</span>
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
                            <span>🔍</span> Other Possible Pests
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
                  </div>
                )}
              </div>
            )}

            {/* Common Pests Tab */}
            {activeTab === 'pests' && (
              <div className="space-y-4">
                <h3 className="text-h3 font-bold text-textDark mb-6">Common Crop Pests</h3>
                {commonPests.map((pest, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-smooth">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Image Section */}
                      {pest.image && (
                        <div className="md:col-span-1 flex justify-center">
                          <img
                            src={`${PEST_IMAGE_BASE}${pest.image}`}
                            alt={pest.name}
                            className="w-full h-32 object-cover rounded-lg border border-gray-300 shadow-sm"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22128%22 height=%22128%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22128%22 height=%22128%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2214%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      )}
                      {/* Text Content */}
                      <div className={pest.image ? 'md:col-span-3' : 'md:col-span-4'}>
                        <h4 className="font-bold text-lg text-textDark mb-3">{pest.name}</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-semibold text-textDark">Crops: </span>
                            <span className="text-textLight">{typeof pest.crops === 'string' ? pest.crops : pest.crops.join(', ')}</span>
                          </p>
                          <p>
                            <span className="font-semibold text-textDark">Damage: </span>
                            <span className="text-textLight">{pest.damage}</span>
                          </p>
                          <p>
                            <span className="font-semibold text-textDark">Control Methods: </span>
                            <span className="text-textLight">{typeof pest.control === 'string' ? pest.control : pest.control.join(', ')}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Full Width Details */}
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      {pest.read_more && (
                        <div>
                          <p className="font-semibold text-textDark mb-1">More Information:</p>
                          <p className="text-textLight leading-relaxed text-sm">{pest.read_more}</p>
                        </div>
                      )}
                      {pest.links && pest.links.length > 0 && (
                        <div>
                          <p className="font-semibold text-textDark mb-2">Resources:</p>
                          <ul className="space-y-1">
                            {pest.links.map((link, linkIdx) => (
                              <li key={linkIdx}>
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-yellow-600 hover:text-yellow-700 underline text-xs"
                                >
                                  🔗 {link.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Weed Management Tab */}
            {activeTab === 'weeds' && (
              <div className="space-y-4">
                <h3 className="text-h3 font-bold text-textDark mb-6">Weed Management Guide</h3>
                {weeds.map((weed, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-smooth">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Image Section */}
                      {weed.image && (
                        <div className="md:col-span-1 flex justify-center">
                          <img
                            src={`${PEST_IMAGE_BASE.replace('pests', 'weed')}${weed.image}`}
                            alt={weed.name}
                            className="w-full h-32 object-cover rounded-lg border border-gray-300 shadow-sm"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22128%22 height=%22128%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22128%22 height=%22128%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2214%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      )}
                      {/* Text Content */}
                      <div className={weed.image ? 'md:col-span-3' : 'md:col-span-4'}>
                        <h4 className="font-bold text-lg text-textDark mb-3">{weed.name}</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-semibold text-textDark">Type: </span>
                            <span className="text-textLight bg-gray-100 px-2 py-1 rounded inline-block">{weed.type}</span>
                          </p>
                          <p>
                            <span className="font-semibold text-textDark">Damage: </span>
                            <span className="text-textLight">{weed.damage}</span>
                          </p>
                          <p>
                            <span className="font-semibold text-textDark">Control Methods: </span>
                            <span className="text-textLight">{typeof weed.control === 'string' ? weed.control : weed.control.join(', ')}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Full Width Details */}
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      {weed.read_more && (
                        <div>
                          <p className="font-semibold text-textDark mb-1">More Information:</p>
                          <p className="text-textLight leading-relaxed text-sm">{weed.read_more}</p>
                        </div>
                      )}
                      {weed.links && weed.links.length > 0 && (
                        <div>
                          <p className="font-semibold text-textDark mb-2">Resources:</p>
                          <ul className="space-y-1">
                            {weed.links.map((link, linkIdx) => (
                              <li key={linkIdx}>
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-yellow-600 hover:text-yellow-700 underline text-xs"
                                >
                                  🔗 {link.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* CTA Box */}
              <div className="bg-yellow-600 text-white rounded-lg p-6 space-y-4">
                <h4 className="font-bold text-lg">Detect Pest Now</h4>
                <p className="text-sm opacity-90">Upload a photo to identify pests instantly</p>
                <button
                  onClick={handleUploadClick}
                  className="w-full bg-white text-yellow-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-smooth focus-ring"
                >
                  Upload Image
                </button>
              </div>

              {/* Quick Tips */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-200">
                <h4 className="font-bold text-textDark">Quick Tips</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <span className="text-xl">🔍</span>
                    <div>
                      <p className="text-xs font-semibold text-textDark">Early Detection</p>
                      <p className="text-xs text-textLight">Check plants regularly</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xl">🧹</span>
                    <div>
                      <p className="text-xs font-semibold text-textDark">Field Hygiene</p>
                      <p className="text-xs text-textLight">Remove infected plants</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xl">🔄</span>
                    <div>
                      <p className="text-xs font-semibold text-textDark">Crop Rotation</p>
                      <p className="text-xs text-textLight">Breaks pest cycle</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spray Safety */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h5 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Safety Precautions
                </h5>
                <ul className="text-xs text-red-800 space-y-1">
                  <li>✓ Use protective gear</li>
                  <li>✓ Never spray near water</li>
                  <li>✓ Follow harvest intervals</li>
                  <li>✓ Keep away from children</li>
                </ul>
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
