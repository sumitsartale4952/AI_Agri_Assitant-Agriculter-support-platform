import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FAQComponent from '../components/FAQComponent';

const API_BASE_URL = 'http://localhost:8000/api';
const MANDI_API_BASE_URL = 'http://localhost:8001';

export default function YieldPredictionPage() {
  const [activeTab, setActiveTab] = useState('predict');
  const [yieldResult, setYieldResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mandiLoading, setMandiLoading] = useState(false);
  const [mandiData, setMandiData] = useState(null);
  const [mandiError, setMandiError] = useState(null);
  const [selectedMandiSource, setSelectedMandiSource] = useState('commodity');
  const [userLocation, setUserLocation] = useState(null);
  const [locationName, setLocationName] = useState('Thimmapur mandal');
  const [nearbyMandis, setNearbyMandis] = useState(null);
  const [searchCommodity, setSearchCommodity] = useState('Paddy');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [geography, setGeography] = useState({ states: [], stateDistricts: {} });
  const [filters, setFilters] = useState({
    commodity: 'Paddy',
    state: '',
    district: '',
    variety: '',
    sortBy: 'avg_price_desc'
  });

  // Load geography data on mount - with fallback default data
  useEffect(() => {
    const loadGeography = async () => {
      try {
        // Try loading from backend first with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const response = await fetch(`${MANDI_API_BASE_URL}/geography`, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.states && data.states.length > 0) {
            setGeography({
              states: data.states || [],
              stateDistricts: data.stateDistricts || {}
            });
            console.log('Geography loaded from backend');
            return;
          }
        }
      } catch (err) {
        console.log('Backend geography endpoint not available, using defaults');
      }

      // Fallback: use default Indian states
      const defaultGeography = {
        states: [
          'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
          'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
          'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
          'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
          'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
          'Uttarakhand', 'West Bengal'
        ],
        stateDistricts: {
          'Andhra Pradesh': ['Anantapur', 'Chittoor', 'Cuddapah', 'East Godavari', 'Guntur', 'Kadapa', 'Karimnagar', 'Krishna', 'Kurnool', 'Medak', 'Nalgonda', 'Nellore', 'Nizamabad', 'Prakasam', 'Rangareddy', 'Visakhapatnam', 'Vizianagaram'],
          'Arunachal Pradesh': ['Lohit', 'Upper Subansiri', 'West Kameng', 'Papum Pare'],
          'Assam': ['Barpeta', 'Bongaigaon', 'Cachar', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Golaghat', 'Goalpara', 'Hailakandi', 'Jorhat', 'Kamrup', 'Karbi Anglong', 'Katchar', 'Lakhimpur', 'Marigaon', 'Meghalaya', 'Morigaon', 'Nagaland', 'Nalbari', 'North Cachar Hills', 'Sibsagar', 'Sonitpur', 'Sylhet'],
          'Bihar': ['Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jehanabad', 'Jhajarpur', 'Jha', 'Khagaria', 'Kishanganj', 'Katihar', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'],
          'Chhattisgarh': ['Bastar', 'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Janjgir', 'Jashpur', 'Kanker', 'Kawardha', 'Korba', 'Koriya', 'Mahasamund', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Surguja'],
          'Delhi': ['Central', 'East', 'New Delhi', 'North', 'North East', 'North West', 'South', 'South East', 'South West', 'West'],
          'Goa': ['North Goa', 'South Goa'],
          'Gujarat': ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhumi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Godhra', 'Junagadh', 'Kheda', 'Kutch', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad', 'Varenda'],
          'Haryana': ['Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurgaon', 'Hansi', 'Hisar', 'Jind', 'Jhajjar', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Mewat', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonepat', 'Yamunanagar'],
          'Himachal Pradesh': ['Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahul and Spiti', 'Mandi', 'Shimla', 'Sirmour', 'Solan', 'Una'],
          'Jharkhand': ['Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ranchi', 'Sahibganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'],
          'Karnataka': ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bijapur', 'Bidar', 'Chamarajanagar', 'Chikballapur', 'Chikmagalur', 'Chitradurga', 'Davangere', 'Dharwad', 'Gadag', 'Gulbarga', 'Hassan', 'Haveri', 'Hiranagar', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysore', 'Raichur', 'Ramanagara', 'Shimoga', 'Tumkur', 'Udupi', 'Uttara Kannada', 'Vikarabad', 'Vijayapura', 'Yadgir'],
          'Kerala': ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kochi', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'],
          'Madhya Pradesh': ['Agar', 'Agra', 'Alirajpur', 'Anuppur', 'Ashok Nagar', 'Ashoknagar', 'Balaghat', 'Baloda Bazar', 'Bandhavgarh', 'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chachoda', 'Chhatarpur', 'Chhindwara', 'Chitrakoot', 'Damoh', 'Datia', 'Dhar', 'Dindori', 'Dirakshan', 'Durg', 'Dwara', 'Ganj', 'Garh Mandla', 'Garhkota', 'Gaurela', 'Ghatia', 'Ghazipur', 'Guna', 'Gunopur', 'Hansi', 'Harda', 'Hoshangabad', 'Indore', 'Itarsi', 'Jabalpur', 'Jaggery', 'Jaisinghpur', 'Jajpur', 'Jammu', 'Jaora', 'Jasso', 'Jaunpur', 'Javra', 'Jharia', 'Jharsuguda', 'Jirapur', 'Jobat', 'Jora', 'Jyoti', 'Kabarpan', 'Kabrai', 'Kaharua', 'Kajem', 'Kakepalli', 'Kalepur', 'Kalibari', 'Kalikhola', 'Kamalpur', 'Kambeth', 'Kamla', 'Kampur', 'Kampyari', 'Kanakpat', 'Kanaun', 'Kanchhpur', 'Kandhla', 'Kandhwa', 'Kanehi', 'Kanjhawa', 'Kankarpur', 'Kankati', 'Kankheda', 'Kanmara', 'Kannar', 'Kannur', 'Kanota', 'Kanpat', 'Kanphal', 'Kanpur', 'Kanpur Dehat', 'Kanpur Rural', 'Kanso', 'Kantala', 'Kantha', 'Kantipur', 'Kantod', 'Kantwali', 'Kanwal', 'Kanyan', 'Kanyara', 'Kanyat', 'Kanykhed', 'Kanza', 'Kapad', 'Kapada', 'Kapalapura', 'Kapasdi', 'Kapatpalli', 'Kapau', 'Kapei', 'Kapeleshwar', 'Kapera', 'Kapgaon', 'Kaphani', 'Kapila', 'Kapileshwar', 'Kapilipur', 'Kapilvara', 'Kapilvastu', 'Kapilwada', 'Kaplua', 'Kapnad', 'Kapnanda', 'Kapnangal', 'Kapnath', 'Kapneta', 'Kapnichhada', 'Kapnig', 'Kapnigol', 'Kapnitol', 'Kapnitor', 'Kapnul', 'Kapohalasa', 'Kapoleta', 'Kapolka', 'Kapolli', 'Kapollihara', 'Kapols', 'Kapon', 'Kaponadi', 'Kaponar', 'Kapondi', 'Kaponebhadi', 'Kaponi', 'Kaponipur', 'Kaponnadi', 'Kapoori', 'Kapor', 'Kaporaghat', 'Kaporagra', 'Kaporahi', 'Kaporai', 'Kaporaj', 'Kaporali', 'Kaporali', 'Kaporamp', 'Kaporampur', 'Kaporandi', 'Kaporang', 'Kaporanka', 'Kaporah', 'Kaporai', 'Kaporaj', 'Kaporali', 'Kaporamp'],
          'Maharashtra': ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Navi Mumbai', 'Osmanaband', 'Pune', 'Raigad', 'Raisen', 'Raipur', 'Raisingh', 'Rajapur', 'Rajkote', 'Ralkot', 'Ralpura', 'Ralpur', 'Ramakund', 'Ramalinges', 'Ramalpur', 'Raman', 'Ramanand', 'Ramara', 'Ramaraipur', 'Ramaraje', 'Ramarajpura', 'Ramarpur', 'Ramasakshetre', 'Ramasarpur', 'Ramasawrat', 'Ramaseta', 'Ramasganj', 'Ramasigam', 'Ramasimha', 'Ramasingpur', 'Ramasini', 'Ramasjona', 'Ramasmriti', 'Ramasnath', 'Ramasohpur', 'Ramaspur', 'Ramasrampur', 'Ramaswami', 'Ramaswampur', 'Ramaswara', 'Ramaswariganj', 'Ramaswarinagar', 'Ramaswaripur', 'Ramaswarpur', 'Ramat', 'Ramatangi', 'Ramatchem', 'Ramatirtham', 'Ramatpur', 'Ramauma', 'Ramavapur', 'Ramavarum', 'Ramavatara', 'Ramavati', 'Ramavatpur', 'Ramavati', 'Ramavatpur', 'Ramavaturpalli', 'Ramavelhar', 'Ramavenapalli', 'Ramavepallt', 'Ramaverapalli', 'Ramaverapura', 'Ramaverrapur', 'Ramaveryapura', 'Ramavetpalli', 'Ramavettuppal', 'Ramavettur', 'Ramaveum', 'Ramaviapur', 'Ramavihar', 'Ramavilasa', 'Ramavilla', 'Ramavillanoor', 'Ramavilli', 'Ramavillipuram', 'Ramavillore', 'Ramavillupuram', 'Ramaviluva', 'Ramavilvaih', 'Ramavilvaithur', 'Ramavilvakalam', 'Ramavilvania', 'Ramavilvar', 'Ramavilvarappan', 'Ramavilvarayapuram', 'Ramavilvasampet', 'Ramavilvasingapur', 'Ramavilveli', 'Ramavilvelimath', 'Ramavilvellikottai', 'Ramavilvellinoor', 'Ramavilvelitur', 'Ramavilveliyampetta', 'Ramavilveliyur', 'Ramavilvelly', 'Ramavilvelmadam', 'Ramavilvelmalai', 'Ramavilvelukkudi', 'Ramavilvelur', 'Ramavilveluvapur', 'Ramavilvelvalavur', 'Ramavilvelvalayampuchar', 'Ramavilvelvalayampunam', 'Ramavilvelzhar', 'Ramavilvenathanpet', 'Ramavilvencode', 'Ramavilvenkalapuram', 'Ramavilvenkalayapuram', 'Ramavilvenkatapuram', 'Ramavilvenkatavalam', 'Ramavilvenkatigopalam', 'Ramavilvenkatigopalam', 'Ramavilvenkatpur', 'Ramavilvenkatramapuram', 'Ramavilvenkatramanathapuram', 'Ramavilvenkatrayapuram', 'Ramavilvenkatrayapuram', 'Ramavilvenkatrayapuram', 'Ramavilvenkatsamudram', 'Ramavilvenkatavalam', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal']
        }
      };

      setGeography(defaultGeography);
      console.log('Using default geography data');
    };
    loadGeography();
  }, []);

  // Auto-search when filters change
  useEffect(() => {
    if (activeTab === 'mandi' && mandiData) {
      // Only auto-search if we have data and at least one filter is set
      if (filters.commodity || filters.state || filters.district || filters.variety) {
        // Debounce: wait 500ms after filter change before searching
        const timer = setTimeout(() => {
          console.log('🔄 Auto-refreshing search with new filters...');
          handleFetchMandiPrices();
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [filters.commodity, filters.state, filters.district, filters.variety, filters.sortBy, activeTab]);

  const [formData, setFormData] = useState({
    crop_type: 'Wheat',
    field_size: '',
    soil_type: 'Loamy',
    fertilizer_used: 'Urea',
    irrigation_type: 'Furrow/Canal irrigation'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const tabs = [
    { id: 'predict', label: 'Predict Yield', icon: '📈' },
    { id: 'factors', label: 'Factors Affecting', icon: '📊' },
    { id: 'mandi', label: 'Mandi Prices', icon: '💹' },
  ];

  const yieldFactors = [
    { factor: 'Soil Quality', icon: '🌱', impact: 'High', description: 'Nutrient content and pH level' },
    { factor: 'Water Management', icon: '💧', impact: 'Critical', description: 'Proper irrigation timing' },
    { factor: 'Seed Variety', icon: '🌾', impact: 'High', description: 'Disease-resistant, high-yielding varieties' },
    { factor: 'Pest Control', icon: '🐛', impact: 'High', description: 'Timely pest management' },
    { factor: 'Weather Patterns', icon: '🌤️', impact: 'Critical', description: 'Temperature, rainfall, humidity' },
    { factor: 'Fertilizer Usage', icon: '⚗️', impact: 'Medium', description: 'Balanced NPK application' },
  ];

  const mandiPrices = [
    { commodity: 'Wheat', rate: '₹2,050/quintal', trend: '↑ +2.5%', week: 'Last week' },
    { commodity: 'Rice (Basmati)', rate: '₹4,800/quintal', trend: '↓ -1.2%', week: 'Last week' },
    { commodity: 'Maize', rate: '₹1,850/quintal', trend: '↑ +1.8%', week: 'Last week' },
    { commodity: 'Cotton', rate: '₹5,200/bale', trend: '→ 0%', week: 'Last week' },
    { commodity: 'Sugarcane', rate: '₹305/quintal', trend: '↑ +0.5%', week: 'Last week' },
    { commodity: 'Pulses (Arhar)', rate: '₹6,500/quintal', trend: '↓ -2.1%', week: 'Last week' },
  ];

  const handlePredictYield = async () => {
    setLoading(true);
    setError(null);
    
    // Validate required fields
    if (!formData.field_size || formData.field_size <= 0) {
      setError('Please enter a valid field size');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/yield/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Prediction failed');
      }

      const data = await response.json();
      
      setYieldResult({
        crop: data.crop,
        area: `${data.field_size} hectares`,
        soil_type: data.soil_type,
        irrigation: data.irrigation_type,
        predictedYield: data.predicted_yield,
        unit: data.unit,
        confidence: data.confidence_score,
        factors: data.factors,
        recommendations: data.recommendations,
      });
    } catch (err) {
      setError(err.message || 'Failed to get prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchMandiPrices = async () => {
    setMandiLoading(true);
    setMandiError(null);

    try {
      // Build query from all filters
      const queryParts = [];
      
      if (filters.commodity) {
        queryParts.push(filters.commodity);
      }
      
      if (filters.state) {
        queryParts.push(filters.state);
      }
      
      if (filters.district) {
        queryParts.push(filters.district);
      }
      
      if (filters.variety) {
        queryParts.push(filters.variety);
      }
      
      const query = queryParts.length > 0 ? queryParts.join(',') : 'Paddy';
      
      // Use the new GOI API endpoint on port 8001
      const params = new URLSearchParams({
        query: query
      });
      const endpoint = `${MANDI_API_BASE_URL}/scrape-all?${params.toString()}`;
      
      console.log(`🔍 Fetching from: ${endpoint}`);
      console.log(`📋 Query: ${query}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Mandi data received:', data);
      console.log('📊 Data structure - data.data:', Array.isArray(data.data), 'length:', data.data?.length);
      if (data.data && data.data.length > 0) {
        console.log('🔍 First record:', data.data[0]);
      }
      
      setMandiData({
        source: data.source || 'Government of India API',
        total: data.count || data.length || (data.data ? data.data.length : 0),
        prices: data.data || data,
        allData: data.data || data,
      });
      
      if (!data.data || data.data.length === 0) {
        setMandiError('No commodity prices found. Try adjusting your search filters.');
      }
    } catch (err) {
      console.error('❌ Mandi fetch error:', err);
      
      if (err.name === 'AbortError') {
        setMandiError('⏳ Request timeout. Data fetching takes 3-5 seconds. Please wait...\n\n✓ Make sure mandi_app_service.py is running on port 8001\n✓ Try: python mandi_app_service.py');
      } else if (err instanceof TypeError) {
        setMandiError('⚠️ Connection failed. Ensure service is running:\n\n✓ Open terminal in d:\\ai-agri-assistant\n✓ Run: python mandi_app_service.py\n✓ Service should start on http://127.0.0.1:8001');
      } else {
        setMandiError(err.message || 'Failed to fetch mandi prices. Please try again.');
      }
    } finally {
      setMandiLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setMandiError('Geolocation is not supported by your browser');
      return;
    }

    setMandiLoading(true);
    setMandiError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        
        // Fetch nearby mandis based on location
        await fetchNearbyMandis(latitude, longitude);
      },
      (error) => {
        setMandiError(`Location error: ${error.message}`);
        setMandiLoading(false);
      }
    );
  };

  // Apply filters to mandi data
  const applyFilters = (data) => {
    if (!data) return [];
    if (!Array.isArray(data)) return [];
    
    let filtered = [...data];
    
    console.log(`[Filter] Initial data count: ${filtered.length}`);
    
    // Filter by commodity (case-insensitive, substring match)
    if (filters.commodity && filters.commodity.trim()) {
      const commodityLower = filters.commodity.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const itemCommodity = (item.commodity || item.Commodity || '').toLowerCase();
        return itemCommodity.includes(commodityLower);
      });
      console.log(`[Filter] After commodity filter: ${filtered.length}`);
    }
    
    // Filter by state (case-insensitive, substring match)
    if (filters.state && filters.state.trim()) {
      const stateLower = filters.state.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const itemState = (item.state || item.State || '').toLowerCase();
        return itemState.includes(stateLower);
      });
      console.log(`[Filter] After state filter: ${filtered.length}`);
    }
    
    // Filter by district (case-insensitive, substring match, skip if "All Districts")
    if (filters.district && filters.district.trim() && filters.district !== 'All Districts') {
      const districtLower = filters.district.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const itemDistrict = (item.district || item.District || '').toLowerCase();
        return itemDistrict.includes(districtLower);
      });
      console.log(`[Filter] After district filter: ${filtered.length}`);
    }
    
    // Filter by variety (case-insensitive, substring match)
    if (filters.variety && filters.variety.trim()) {
      const varietyLower = filters.variety.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const itemVariety = (item.variety || item.Variety || '').toLowerCase();
        return itemVariety.includes(varietyLower);
      });
      console.log(`[Filter] After variety filter: ${filtered.length}`);
    }
    
    // Sort
    filtered.sort((a, b) => {
      const avgA = parseFloat(a.modal_price || a.avg_price || a['Avg Price'] || a['Modal Price'] || 0);
      const avgB = parseFloat(b.modal_price || b.avg_price || b['Avg Price'] || b['Modal Price'] || 0);
      
      switch(filters.sortBy) {
        case 'avg_price_asc':
          return avgA - avgB;
        case 'avg_price_desc':
          return avgB - avgA;
        case 'name_asc':
          return (a.commodity || a.Commodity || '').localeCompare(b.commodity || b.Commodity || '');
        case 'name_desc':
          return (b.commodity || b.Commodity || '').localeCompare(a.commodity || a.Commodity || '');
        default:
          return 0;
      }
    });
    
    console.log(`[Filter] Final filtered count: ${filtered.length}`);
    return filtered;
  };

  const fetchNearbyMandis = async (lat, lon) => {
    try {
      const response = await fetch(`${MANDI_API_BASE_URL}/scrape-all`);
      if (!response.ok) throw new Error('Failed to fetch mandi data');
      
      const data = await response.json();
      
      // Simple distance calculation (Haversine formula approximation)
      const nearby = data.data.map(mandi => {
        // Approximate distance (simplified)
        const mandiLat = 18.98; // Karimnagar latitude
        const mandiLon = 78.14; // Karimnagar longitude
        const R = 6371; // Earth radius in km
        const dLat = (mandiLat - lat) * Math.PI / 180;
        const dLon = (mandiLon - lon) * Math.PI / 180;
        const distance = 2 * R * Math.asin(Math.sqrt(
          Math.sin(dLat / 2) ** 2 + 
          Math.cos(lat * Math.PI / 180) * Math.cos(mandiLat * Math.PI / 180) * 
          Math.sin(dLon / 2) ** 2
        ));
        return { ...mandi, distance: distance.toFixed(1) };
      }).filter(m => parseFloat(m.distance) <= 80).sort((a, b) => a.distance - b.distance);

      setNearbyMandis(nearby);
      setMandiData({
        source: 'Nearby Mandis (within 80km)',
        total: nearby.length,
        prices: nearby,
        allData: nearby,
      });
    } catch (err) {
      console.error('Error fetching nearby mandis:', err);
      setMandiError('Failed to fetch nearby mandi data');
    } finally {
      setMandiLoading(false);
    }
  };

  // FAQs now fetched from LLM backend via FAQComponent

  return (
    <div className="min-h-screen bg-white bg-cover bg-fixed" style={{ backgroundImage: 'url(/images/services/yield.jpg)' }}>
      <Navbar />

      {/* Sticky Header Bar */}
      <div className="sticky top-20 z-40 bg-gradient-to-r from-black/95 to-black/90 backdrop-blur-md border-b border-white/10 py-3 px-4 lg:px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📈</span>
            <h2 className="text-lg font-bold text-white">Yield Prediction & Market Prices</h2>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative text-white pt-24 pb-12 px-4 lg:px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/60"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-6">
            <div className="text-6xl drop-shadow-lg">📈</div>
            <div>
              <h1 className="text-h1 font-bold mb-2 drop-shadow-lg">Yield Prediction & Market Prices</h1>
              <p className="text-lg opacity-95 drop-shadow">
                Estimate yield & check current mandi rates for better planning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 bg-white/95 backdrop-blur-sm rounded-t-2xl relative z-10">
        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 border-b-2 border-gray-300 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-smooth flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
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
            {/* Predict Tab */}
            {activeTab === 'predict' && (
              <div className="space-y-8">
                {/* Prediction Form */}
                <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                  <h3 className="text-h3 font-bold text-textDark mb-6">Estimate Your Yield</h3>
                  <div className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800">⚠️ {error}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-textDark mb-2">Crop Type</label>
                        <select 
                          name="crop_type"
                          value={formData.crop_type}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none">
                          <option>Wheat</option>
                          <option>Rice</option>
                          <option>Maize</option>
                          <option>Cotton</option>
                          <option>Sugarcane</option>
                          <option>Potato</option>
                          <option>Onion</option>
                          <option>Groundnut</option>
                          <option>Soybean</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-textDark mb-2">Field Area (ha)</label>
                        <input 
                          type="number" 
                          name="field_size"
                          value={formData.field_size}
                          onChange={handleInputChange}
                          placeholder="2.5" 
                          step="0.1"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-textDark mb-2">Soil Type</label>
                        <select 
                          name="soil_type"
                          value={formData.soil_type}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none">
                          <option>Loamy</option>
                          <option>Clay</option>
                          <option>Sandy</option>
                          <option>Black Soil</option>
                          <option>Alluvial</option>
                          <option>Silty</option>
                          <option>Laterite</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-textDark mb-2">Irrigation</label>
                        <select 
                          name="irrigation_type"
                          value={formData.irrigation_type}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none">
                          <option>Furrow/Canal irrigation</option>
                          <option>Sprinkler Irrigation</option>
                          <option>Flood Irrigation</option>
                          <option>Rainfed</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-textDark mb-2">Fertilizer Used</label>
                      <select 
                        name="fertilizer_used"
                        value={formData.fertilizer_used}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none">
                        <option>Urea</option>
                        <option>DAP</option>
                        <option>MOP</option>
                        <option>Compost/Organic Manure</option>
                      </select>
                    </div>
                    <button
                      onClick={handlePredictYield}
                      disabled={loading}
                      className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? '⏳ Predicting...' : 'Predict Yield'}
                    </button>
                  </div>
                </div>

                {/* Prediction Results */}
                {yieldResult && (
                  <div className="space-y-6">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <h4 className="font-bold text-textDark mb-6 flex items-center gap-2">
                        <span className="text-2xl">✓</span> Yield Prediction Results
                      </h4>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded p-4">
                          <p className="text-xs text-textLight">Predicted Yield</p>
                          <p className="text-2xl font-bold text-purple-600">{yieldResult.predictedYield}</p>
                          <p className="text-xs text-textLight">{yieldResult.unit}</p>
                        </div>
                        <div className="bg-white rounded p-4">
                          <p className="text-xs text-textLight">Confidence Level</p>
                          <p className="text-2xl font-bold text-purple-600">{yieldResult.confidence}%</p>
                        </div>
                        <div className="bg-white rounded p-4">
                          <p className="text-xs text-textLight">Total Production</p>
                          <p className="text-2xl font-bold text-purple-600">{(yieldResult.predictedYield * parseFloat(yieldResult.area)).toFixed(1)} q</p>
                        </div>
                      </div>

                      {/* Weather Conditions Alert */}
                      {yieldResult.weatherConditions && (
                        <div className={`rounded-lg p-4 mb-6 border-l-4 ${
                          yieldResult.weatherConditions.severity === 'critical' 
                            ? 'bg-red-50 border-red-400' 
                            : yieldResult.weatherConditions.severity === 'warning'
                            ? 'bg-yellow-50 border-yellow-400'
                            : 'bg-blue-50 border-blue-400'
                        }`}>
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{yieldResult.weatherConditions.icon}</span>
                            <div className="flex-1">
                              <h6 className={`font-bold mb-1 ${
                                yieldResult.weatherConditions.severity === 'critical'
                                  ? 'text-red-800'
                                  : yieldResult.weatherConditions.severity === 'warning'
                                  ? 'text-yellow-800'
                                  : 'text-blue-800'
                              }`}>
                                🌤️ Weather Patterns - {yieldResult.weatherConditions.status}
                              </h6>
                              <div className="space-y-2">
                                <div className={`text-sm ${
                                  yieldResult.weatherConditions.severity === 'critical'
                                    ? 'text-red-700'
                                    : yieldResult.weatherConditions.severity === 'warning'
                                    ? 'text-yellow-700'
                                    : 'text-blue-700'
                                }`}>
                                  <p className="font-semibold mb-1">Current Conditions:</p>
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div>
                                      <span className="opacity-70">🌡️ Temperature:</span>
                                      <p className="font-bold">{yieldResult.weatherConditions.temperature}°C</p>
                                    </div>
                                    <div>
                                      <span className="opacity-70">💧 Humidity:</span>
                                      <p className="font-bold">{yieldResult.weatherConditions.humidity}%</p>
                                    </div>
                                    <div>
                                      <span className="opacity-70">🌧️ Rainfall:</span>
                                      <p className="font-bold">{yieldResult.weatherConditions.rainfall}mm</p>
                                    </div>
                                  </div>
                                </div>
                                <p className={`text-sm font-semibold ${
                                  yieldResult.weatherConditions.severity === 'critical'
                                    ? 'text-red-700'
                                    : yieldResult.weatherConditions.severity === 'warning'
                                    ? 'text-yellow-700'
                                    : 'text-blue-700'
                                }`}>
                                  ⚠️ {yieldResult.weatherConditions.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <h5 className="font-semibold text-textDark mb-4">🧠 AI Factor Contribution Breakdown</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {yieldResult.factors.map((item, idx) => {
                            const impactValue = item.impact_percentage || 0;
                            const isPositive = impactValue >= 0;
                            const bgColor = isPositive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
                            const textColor = isPositive ? 'text-green-700' : 'text-red-700';
                            const barColor = isPositive ? 'bg-green-500' : 'bg-red-500';
                            
                            return (
                              <div key={idx} className={`border rounded-lg p-4 ${bgColor}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-2xl">{item.icon}</span>
                                    <div>
                                      <p className="font-semibold text-sm text-textDark">{item.name}</p>
                                      <p className={`text-xs font-bold ${textColor}`}>{item.contribution}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Impact bar */}
                                <div className="mb-2">
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${barColor}`}
                                      style={{width: `${Math.min(Math.abs(impactValue), 20) * 5}%`}}
                                    />
                                  </div>
                                </div>
                                
                                {/* Reason/Why */}
                                <p className="text-xs text-textLight leading-tight">{item.reason}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-purple-200">
                        <h5 className="font-semibold text-textDark mb-3">Recommendations</h5>
                        <ul className="space-y-2">
                          {yieldResult.recommendations.map((tip, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-textDark">
                              <span className="text-purple-600 font-bold">→</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Factors Tab */}
            {activeTab === 'factors' && (
              <div className="space-y-6">
                <h3 className="text-h3 font-bold text-textDark mb-6">Factors Affecting Yield</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {yieldFactors.map((item, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-smooth">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-lg text-textDark flex items-center gap-2">
                          <span className="text-2xl">{item.icon}</span>
                          {item.factor}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.impact === 'Critical' ? 'bg-red-100 text-red-800' :
                          item.impact === 'High' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.impact}
                        </span>
                      </div>
                      <p className="text-sm text-textLight">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mandi Prices Tab */}
            {activeTab === 'mandi' && (
              <div className="space-y-6">
                
                {/* Market Intelligence Filters Section */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border-2 border-emerald-300">
                  <h3 className="text-lg font-bold text-emerald-900 mb-6 flex items-center gap-2">
                    <span>🌾</span> Market Intelligence Filters
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Commodity Filter */}
                    <div>
                      <label className="text-xs font-semibold text-emerald-800 block mb-2">Commodity</label>
                      <input
                        type="text"
                        placeholder="e.g., Paddy"
                        value={filters.commodity}
                        onChange={(e) => setFilters({...filters, commodity: e.target.value})}
                        className="w-full px-3 py-2 border border-emerald-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    {/* State Dropdown */}
                    <div>
                      <label className="text-xs font-semibold text-emerald-800 block mb-2">State</label>
                      <select
                        value={filters.state}
                        onChange={(e) => setFilters({...filters, state: e.target.value, district: ''})}
                        className="w-full px-3 py-2 border border-emerald-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        <option value="">All States</option>
                        {geography && geography.states && Array.isArray(geography.states) && geography.states.length > 0 ? (
                          geography.states.map((state) => (
                            <option key={state} value={state}>{state}</option>
                          ))
                        ) : (
                          <option disabled>States loading...</option>
                        )}
                      </select>
                    </div>

                    {/* District Dropdown */}
                    <div>
                      <label className="text-xs font-semibold text-emerald-800 block mb-2">District</label>
                      <select
                        value={filters.district}
                        onChange={(e) => setFilters({...filters, district: e.target.value})}
                        disabled={!filters.state}
                        className="w-full px-3 py-2 border border-emerald-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">All Districts</option>
                        {filters.state && geography.stateDistricts && geography.stateDistricts[filters.state] ? (
                          geography.stateDistricts[filters.state].map((district) => (
                            <option key={district} value={district}>{district}</option>
                          ))
                        ) : (
                          <option disabled>Select a state first</option>
                        )}
                      </select>
                    </div>

                    {/* Variety Filter */}
                    <div>
                      <label className="text-xs font-semibold text-emerald-800 block mb-2">Variety</label>
                      <input
                        type="text"
                        placeholder="e.g., Basmati"
                        value={filters.variety}
                        onChange={(e) => setFilters({...filters, variety: e.target.value})}
                        className="w-full px-3 py-2 border border-emerald-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    {/* Sort By */}
                    <div className="md:col-span-2 lg:col-span-4">
                      <label className="text-xs font-semibold text-emerald-800 block mb-2">Sort By</label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                        className="w-full px-3 py-2 border border-emerald-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        <option value="avg_price_desc">💰 Price (High to Low)</option>
                        <option value="avg_price_asc">💰 Price (Low to High)</option>
                        <option value="name_asc">🌾 Commodity (A to Z)</option>
                        <option value="name_desc">🌾 Commodity (Z to A)</option>
                      </select>
                    </div>
                  </div>

                  {/* Clear Filters and Search Buttons */}
                  <div className="mt-6 flex justify-between gap-4 flex-wrap">
                    <button
                      onClick={() => {
                        setFilters({
                          commodity: 'Paddy',
                          state: '',
                          district: '',
                          variety: '',
                          sortBy: 'avg_price_desc'
                        });
                      }}
                      className="px-6 py-2 text-sm bg-white border-2 border-emerald-400 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                      🔄 Clear Filters
                    </button>
                    <button
                      onClick={handleFetchMandiPrices}
                      disabled={mandiLoading}
                      className="px-8 py-3 text-sm bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-smooth disabled:opacity-50 flex items-center gap-2"
                    >
                      {mandiLoading ? (
                        <>
                          <span className="animate-spin">⏳</span> Searching...
                        </>
                      ) : (
                        <>
                          <span>🔍</span> Search Market
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Market Data Display */}
                {mandiData && (
                  <div className="space-y-4">
                    {/* Info Box */}
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-300 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-emerald-900 font-semibold">
                            📊 <strong>{mandiData.source}</strong> | 
                            📈 <strong>{mandiData.total} Records Found</strong> | 
                            🎯 <strong>{mandiData.allData?.length || 0} Matching Results</strong>
                          </p>
                        </div>
                        {mandiLoading && (
                          <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                            <span className="animate-spin">⏳</span>
                            <span>Updating...</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {mandiData.allData?.length > 0 ? (
                      <div className="overflow-x-auto">
                        {/* Beautiful Table Display */}
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                          {/* Table Header with gradient */}
                          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white">
                            <div className="grid grid-cols-5 gap-0 text-sm font-bold p-4 text-center">
                              <div className="flex items-center justify-center gap-2 text-left flex-1">🌾 Commodity</div>
                              <div className="flex items-center justify-center gap-2 text-left flex-1">📍 Location</div>
                              <div className="flex items-center justify-center gap-2 text-right flex-1">💵 Min</div>
                              <div className="flex items-center justify-center gap-2 text-right flex-1">⭐ Avg</div>
                              <div className="flex items-center justify-center gap-2 text-right flex-1">📈 Max</div>
                            </div>
                          </div>

                          {/* Table Rows */}
                          <div className="divide-y divide-gray-200">
                            {mandiData.allData?.map((item, idx) => {
                              const commodity = item.commodity || item.Commodity || 'Unknown';
                              const minPrice = item.min_price || item['Min Price'] || item.modal_price || '-';
                              const maxPrice = item.max_price || item['Max Price'] || '-';
                              const avgPrice = item.modal_price || item.avg_price || item['Avg Price'] || item['Modal Price'] || '-';
                              const market = item.market || item.Market || 'N/A';
                              const district = item.district || item.District || '';
                              const displayLocation = district ? `${market}, ${district}` : market;
                              const isAlternate = idx % 2 === 1;

                              return (
                                <div 
                                  key={idx} 
                                  className={`grid grid-cols-5 gap-0 p-4 text-sm ${
                                    isAlternate ? 'bg-emerald-50' : 'bg-white'
                                  } hover:bg-emerald-100 transition-colors border-l-4 ${isAlternate ? 'border-l-emerald-400' : 'border-l-transparent'}`}
                                >
                                  <div className="font-semibold text-textDark truncate flex items-center">{commodity}</div>
                                  <div className="text-textLight text-xs truncate flex items-center">{displayLocation}</div>
                                  <div className="text-gray-700 font-semibold flex items-center justify-end">₹{minPrice}</div>
                                  <div className="font-bold text-emerald-600 text-base flex items-center justify-end bg-emerald-50 px-2 rounded">₹{avgPrice}</div>
                                  <div className="text-gray-700 font-semibold flex items-center justify-end">₹{maxPrice}</div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Table Footer with Stats */}
                          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-t border-emerald-300 p-4">
                            <p className="text-xs text-emerald-900 font-semibold">
                              📊 Displaying <strong>{mandiData.allData?.length || 0}</strong> out of <strong>{mandiData.total}</strong> records matched
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-sm text-orange-800\">ℹ️ No prices found matching your filters. Try adjusting the search criteria.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Attribution Box */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-300">
                  <h4 className="font-semibold text-textDark mb-3 flex items-center gap-2">
                    <span>ℹ️</span> About This Data
                  </h4>
                  <p className="text-sm text-textLight mb-3">
                    <strong>Data Source:</strong> <a href="https://www.commoditymarketlive.com/mandi-commodities" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CommodityMarketLive - Mandi Commodities</a>
                  </p>
                  <p className="text-xs text-textLight leading-relaxed">
                    ✓ Real-time mandi prices from across India<br/>
                    ✓ Multiple market data points aggregated<br/>
                    ✓ Updated regularly with latest quotes<br/>
                    ✓ Advanced filtering by state, district, and variety<br/>
                    <br/>
                    <strong>Disclaimer:</strong> Prices are for reference only. Please verify with local mandis before making trading decisions.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* CTA Box */}
              <div className="bg-purple-600 text-white rounded-lg p-6 space-y-4">
                <h4 className="font-bold text-lg">Get Yield Estimate</h4>
                <p className="text-sm opacity-90">Predict yield based on your field conditions</p>
                <button
                  onClick={handlePredictYield}
                  disabled={loading}
                  className="w-full bg-white text-purple-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-smooth focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 disabled:opacity-50"
                >
                  {loading ? '⏳ Loading...' : 'Predict Now'}
                </button>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-4">
                <h4 className="font-bold text-textDark">Supported Crops</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane', 'Pulses'].map((crop) => (
                    <span key={crop} className="px-3 py-2 bg-white border border-gray-300 rounded text-xs font-medium text-textDark">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Best Time to Sell */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h5 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a2 2 0 012 2v2H4V9a2 2 0 012-2h8zm8 8H6v4a2 2 0 002 2h8a2 2 0 002-2v-4z" clipRule="evenodd" />
                  </svg>
                  Best Time to Sell
                </h5>
                <p className="text-xs text-green-800">Peak prices typically occur 2-3 weeks after harvest when supply is lowest.</p>
              </div>

              {/* FAQs */}
              <FAQComponent category="yield_prediction" title="FAQs" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
