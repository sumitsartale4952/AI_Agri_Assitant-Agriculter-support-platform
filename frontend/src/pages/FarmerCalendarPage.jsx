import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function FarmerCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date()); // Use actual current date
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Set today as default
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [filterType, setFilterType] = useState('all');
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventNotes, setEventNotes] = useState({});
  const [reminders, setReminders] = useState({});
  const [highlights, setHighlights] = useState({});
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentEditEvent, setCurrentEditEvent] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);

  // Sample calendar events data
  const eventCategories = {
    schemes: [
      { name: 'PM Fasal Bima Yojana (PMFBY)', date: '2025-12-31', priority: 'HIGH', color: 'bg-red-500', emoji: '🌾' },
      { name: 'Kisan Credit Card (KCC)', date: '2025-01-15', priority: 'HIGH', color: 'bg-orange-500', emoji: '💳' },
      { name: 'Soil Health Card Scheme', date: '2025-06-30', priority: 'MEDIUM', color: 'bg-green-500', emoji: '🌱' },
      { name: 'PM-KUSUM (Solar Schemes)', date: '2025-02-28', priority: 'MEDIUM', color: 'bg-purple-500', emoji: '🚜' },
      { name: 'PM-KISAN Supplementary', date: '2025-03-15', priority: 'MEDIUM', color: 'bg-indigo-500', emoji: '💰' },
    ],
    irrigation: [
      { name: 'Summer Irrigation - Wheat (Winter Crop)', date: '2025-01-10', priority: 'HIGH', color: 'bg-blue-500', emoji: '💧', notes: 'First winter irrigation for wheat' },
      { name: 'Summer Irrigation - Rice Seedbed', date: '2025-05-15', priority: 'HIGH', color: 'bg-blue-500', emoji: '💧', notes: 'Prepare rice seedbed' },
      { name: 'Summer Irrigation - Cotton', date: '2025-06-01', priority: 'HIGH', color: 'bg-blue-500', emoji: '💧', notes: 'Critical irrigation for cotton' },
      { name: 'Monsoon Irrigation - Vegetables', date: '2025-07-15', priority: 'MEDIUM', color: 'bg-blue-500', emoji: '💧', notes: 'Vegetable garden irrigation' },
      { name: 'Winter Irrigation - Sugarcane', date: '2025-11-01', priority: 'HIGH', color: 'bg-blue-500', emoji: '💧', notes: 'Pre-winter sugarcane irrigation' },
    ],
    fertilizer: [
      { name: 'Basal Fertilizer Application - Wheat', date: '2025-01-05', priority: 'HIGH', color: 'bg-yellow-500', emoji: '🥗', required: 'NPK 10:26:26 - 500kg/ha' },
      { name: 'Top Dressing - Wheat (Stage 1)', date: '2025-02-15', priority: 'HIGH', color: 'bg-yellow-500', emoji: '🥗', required: 'Urea - 150kg/ha' },
      { name: 'Top Dressing - Wheat (Stage 2)', date: '2025-03-15', priority: 'MEDIUM', color: 'bg-yellow-500', emoji: '🥗', required: 'Urea - 100kg/ha' },
      { name: 'Basal Fertilizer - Rice', date: '2025-05-20', priority: 'HIGH', color: 'bg-yellow-500', emoji: '🥗', required: 'DAP 16:20:0 - 350kg/ha' },
      { name: 'Top Dressing - Rice (Tillering)', date: '2025-06-15', priority: 'HIGH', color: 'bg-yellow-500', emoji: '🥗', required: 'Urea - 200kg/ha' },
      { name: 'Basal Fertilizer - Cotton', date: '2025-06-05', priority: 'HIGH', color: 'bg-yellow-500', emoji: '🥗', required: 'NPK 12:32:16 - 600kg/ha' },
      { name: 'Top Dressing - Cotton (Flowering)', date: '2025-08-01', priority: 'MEDIUM', color: 'bg-yellow-500', emoji: '🥗', required: 'Potash - 50kg/ha' },
      { name: 'Basal Fertilizer - Vegetables', date: '2025-07-01', priority: 'MEDIUM', color: 'bg-yellow-500', emoji: '🥗', required: 'FYM - 10 tonnes/ha + NPK 20:10:10' },
    ],
    seasons: [
      { name: 'Kharif Season Start (Monsoon Crops)', date: '2025-06-01', endDate: '2025-10-31', priority: 'HIGH', color: 'bg-cyan-500', emoji: '🌧️', crops: 'Rice, Cotton, Sugarcane, Maize' },
      { name: 'Rabi Season Start (Winter Crops)', date: '2025-10-01', endDate: '2026-03-31', priority: 'HIGH', color: 'bg-indigo-400', emoji: '❄️', crops: 'Wheat, Pulses, Vegetables' },
      { name: 'Summer Season', date: '2025-04-01', endDate: '2025-05-31', priority: 'MEDIUM', color: 'bg-orange-400', emoji: '☀️', crops: 'Summer Vegetables, Groundnut' },
    ],
    planting: [
      { name: 'Wheat Sowing', date: '2025-10-15', priority: 'HIGH', color: 'bg-green-600', emoji: '🌾', variety: 'HD 2967, PBW 771' },
      { name: 'Rice Transplanting (Kharif)', date: '2025-07-01', priority: 'HIGH', color: 'bg-green-600', emoji: '🌾', variety: 'Basmati, PR-11, Pusa' },
      { name: 'Cotton Sowing', date: '2025-06-10', priority: 'HIGH', color: 'bg-green-600', emoji: '🌾', variety: 'Bt Cotton, Desi Cotton' },
      { name: 'Sugarcane Planting', date: '2025-09-15', priority: 'MEDIUM', color: 'bg-green-600', emoji: '🌾', variety: 'CoP 92005, CoM 0238' },
      { name: 'Pulse Sowing (Rabi)', date: '2025-10-20', priority: 'MEDIUM', color: 'bg-green-600', emoji: '🌾', variety: 'Gram, Lentil, Pea' },
    ],
    pestDisease: [
      { name: 'Wheat - Monitor for Aphids', date: '2025-02-01', priority: 'MEDIUM', color: 'bg-red-600', emoji: '🐛', threshold: 'ETL: 50 aphids/ear head' },
      { name: 'Rice - Monitor for Stem Borer', date: '2025-07-15', priority: 'MEDIUM', color: 'bg-red-600', emoji: '🐛', threshold: 'ETL: 20 larvae per hill' },
      { name: 'Cotton - Spray for Bollworm', date: '2025-08-15', priority: 'HIGH', color: 'bg-red-600', emoji: '🐛', threshold: 'ETL: 1 larva per 3 plants' },
      { name: 'Vegetable - Monitor for Whitefly', date: '2025-07-20', priority: 'MEDIUM', color: 'bg-red-600', emoji: '🐛', threshold: 'Yellow sticky trap monitoring' },
    ],
    harvest: [
      { name: 'Wheat Harvest', date: '2025-04-15', priority: 'HIGH', color: 'bg-amber-600', emoji: '🌾', yield: '40-50 q/ha' },
      { name: 'Rice Harvest (Kharif)', date: '2025-10-01', priority: 'HIGH', color: 'bg-amber-600', emoji: '🌾', yield: '40-60 q/ha' },
      { name: 'Cotton Picking', date: '2025-12-01', priority: 'HIGH', color: 'bg-amber-600', emoji: '🌾', yield: '18-25 q/ha' },
      { name: 'Sugarcane Harvest', date: '2025-12-15', priority: 'HIGH', color: 'bg-amber-600', emoji: '🌾', yield: '70-80 tonnes/ha' },
    ],
    soil: [
      { name: 'Soil Health Card - Testing', date: '2025-06-30', priority: 'MEDIUM', color: 'bg-amber-700', emoji: '🧪', parameters: 'NPK, pH, EC, OC' },
      { name: 'Apply Farm Yard Manure (FYM)', date: '2025-09-01', priority: 'MEDIUM', color: 'bg-amber-700', emoji: '♻️', quantity: '10 tonnes/ha' },
      { name: 'Green Manuring - Prepare Field', date: '2025-05-15', priority: 'LOW', color: 'bg-amber-700', emoji: '🌱', crops: 'Dhaincha, Sesbania' },
    ],
  };

  useEffect(() => {
    // Load user profile
    loadUserProfile();
    // Flatten all events
    const allEvents = Object.values(eventCategories).flat();
    setCalendarEvents(allEvents);
    // Load saved notes, reminders, and highlights from localStorage
    const savedNotes = localStorage.getItem('farmerCalendarNotes');
    const savedReminders = localStorage.getItem('farmerCalendarReminders');
    const savedHighlights = localStorage.getItem('farmerCalendarHighlights');
    if (savedNotes) setEventNotes(JSON.parse(savedNotes));
    if (savedReminders) setReminders(JSON.parse(savedReminders));
    if (savedHighlights) setHighlights(JSON.parse(savedHighlights));
    setLoading(false);
  }, []);

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:8000/api/auth/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.profile);
          
          // Generate personalized events based on user profile
          if (data.profile) {
            generatePersonalizedEvents(data.profile);
          }
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Generate personalized events based on user profile
  const generatePersonalizedEvents = (profile) => {
    const personalizedEvents = { ...eventCategories };
    
    // Update irrigation based on user's irrigation type
    if (profile.irrigation_type) {
      const irrigationTypes = {
        'Drip Irrigation': [
          { name: 'Drip Irrigation Setup & Maintenance', date: '2025-01-10', priority: 'HIGH', color: 'bg-blue-500', emoji: '💧', notes: `Set up ${profile.irrigation_type} system for ${profile.crops_growing?.join(', ') || 'crops'}` },
          { name: `${profile.irrigation_type} - Schedule Review`, date: '2025-03-01', priority: 'MEDIUM', color: 'bg-blue-500', emoji: '💧', notes: 'Check drip line condition and adjust watering schedule' },
          { name: `${profile.irrigation_type} - Maintenance Check`, date: '2025-06-15', priority: 'MEDIUM', color: 'bg-blue-500', emoji: '💧', notes: 'Clean and maintain drip irrigation filters' },
        ],
        'Sprinkler Irrigation': [
          { name: 'Sprinkler System Setup', date: '2025-01-15', priority: 'HIGH', color: 'bg-blue-500', emoji: '💧', notes: `Install sprinkler system for ${profile.crops_growing?.join(', ') || 'crops'}` },
          { name: `${profile.irrigation_type} - Pressure Check`, date: '2025-02-20', priority: 'MEDIUM', color: 'bg-blue-500', emoji: '💧', notes: 'Check water pressure and nozzle coverage' },
          { name: `${profile.irrigation_type} - Maintenance`, date: '2025-05-15', priority: 'MEDIUM', color: 'bg-blue-500', emoji: '💧', notes: 'Service and maintain sprinkler heads' },
        ],
        'Furrow Irrigation': [
          { name: 'Furrow Irrigation - Field Preparation', date: '2025-01-05', priority: 'HIGH', color: 'bg-blue-500', emoji: '💧', notes: `Prepare furrows for ${profile.crops_growing?.join(', ') || 'crops'}` },
          { name: `${profile.irrigation_type} - Water Management`, date: '2025-02-15', priority: 'HIGH', color: 'bg-blue-500', emoji: '💧', notes: 'Monitor water flow and adjust furrow irrigation schedule' },
          { name: `${profile.irrigation_type} - Field Inspection`, date: '2025-04-10', priority: 'MEDIUM', color: 'bg-blue-500', emoji: '💧', notes: 'Check furrow condition and water distribution' },
        ],
        'Flood Irrigation': [
          { name: 'Flood Irrigation - Bund Preparation', date: '2025-01-10', priority: 'HIGH', color: 'bg-blue-500', emoji: '💧', notes: 'Prepare and strengthen bunds for flooding' },
          { name: `${profile.irrigation_type} - Water Level Check`, date: '2025-02-20', priority: 'HIGH', color: 'bg-blue-500', emoji: '💧', notes: 'Monitor water level and field saturation' },
          { name: `${profile.irrigation_type} - Maintenance`, date: '2025-05-01', priority: 'MEDIUM', color: 'bg-blue-500', emoji: '💧', notes: 'Repair bunds and prepare for next irrigation cycle' },
        ]
      };

      if (irrigationTypes[profile.irrigation_type]) {
        personalizedEvents.irrigation = irrigationTypes[profile.irrigation_type];
      }
    }

    // Update soil management based on soil type
    if (profile.soil_type) {
      const soilEvents = [
        { name: `${profile.soil_type} Soil - Health Testing`, date: '2025-06-30', priority: 'MEDIUM', color: 'bg-amber-700', emoji: '🧪', parameters: `Test NPK, pH, EC for ${profile.soil_type} soil` },
        { name: `${profile.soil_type} - Organic Matter Addition`, date: '2025-09-01', priority: 'MEDIUM', color: 'bg-amber-700', emoji: '♻️', quantity: '10 tonnes FYM/ha for improved soil structure' },
        { name: `${profile.soil_type} - Amendment Plan`, date: '2025-04-15', priority: 'LOW', color: 'bg-amber-700', emoji: '🌱', notes: `Plan amendments for ${profile.soil_type} soil improvement` },
      ];
      personalizedEvents.soil = soilEvents;
    }

    // Update crop-specific planting dates
    if (profile.crops_growing && profile.crops_growing.length > 0) {
      const cropPlantingDates = {
        'Wheat': { date: '2025-10-15', variety: 'HD 2967, PBW 771', season: 'Rabi' },
        'Rice': { date: '2025-07-01', variety: 'Basmati, PR-11, Pusa', season: 'Kharif' },
        'Cotton': { date: '2025-06-10', variety: 'Bt Cotton, Desi Cotton', season: 'Kharif' },
        'Sugarcane': { date: '2025-09-15', variety: 'CoP 92005, CoM 0238', season: 'Year-round' },
        'Maize': { date: '2025-05-20', variety: 'Pioneer, Syngenta hybrids', season: 'Kharif' },
        'Pulses': { date: '2025-10-20', variety: 'Gram, Lentil, Pea', season: 'Rabi' },
        'Sugarbeet': { date: '2025-09-01', variety: 'Local, Imported varieties', season: 'Rabi' },
      };

      const updatedPlanting = profile.crops_growing
        .filter(crop => cropPlantingDates[crop])
        .map(crop => ({
          name: `${crop} Sowing/Planting`,
          date: cropPlantingDates[crop].date,
          priority: 'HIGH',
          color: 'bg-green-600',
          emoji: '🌾',
          variety: cropPlantingDates[crop].variety,
          season: cropPlantingDates[crop].season
        }));

      if (updatedPlanting.length > 0) {
        personalizedEvents.planting = updatedPlanting;
      }
    }

    // Update all events
    const allEvents = Object.values(personalizedEvents).flat();
    setCalendarEvents(allEvents);
  };

  // Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Format date for comparison
  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = formatDateString(date);
    const filtered = calendarEvents.filter(event => {
      const eventDate = event.date.split('T')[0]; // Handle datetime formats
      return eventDate === dateStr;
    });
    if (filterType !== 'all') {
      return filtered.filter(event => {
        if (filterType === 'schemes') return event.emoji && ['🌾', '💳', '🌱', '🚜', '💰'].includes(event.emoji);
        if (filterType === 'irrigation') return event.emoji === '💧';
        if (filterType === 'fertilizer') return event.emoji === '🥗';
        if (filterType === 'seasons') return event.emoji && ['🌧️', '❄️', '☀️'].includes(event.emoji);
        if (filterType === 'planting') return event.emoji === '🌾' && event.variety;
        if (filterType === 'pest') return event.emoji === '🐛';
        if (filterType === 'harvest') return event.emoji === '🌾' && event.yield;
        if (filterType === 'soil') return event.emoji && ['🧪', '♻️', '🌱'].includes(event.emoji);
        return true;
      });
    }
    return filtered;
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Note Management Functions
  const openNoteModal = (event) => {
    setCurrentEditEvent(event);
    const eventKey = `${event.date}-${event.name}`;
    setNoteText(eventNotes[eventKey] || '');
    setShowNoteModal(true);
  };

  const saveNote = () => {
    if (!currentEditEvent) return;
    const eventKey = `${currentEditEvent.date}-${currentEditEvent.name}`;
    const updatedNotes = { ...eventNotes, [eventKey]: noteText };
    setEventNotes(updatedNotes);
    localStorage.setItem('farmerCalendarNotes', JSON.stringify(updatedNotes));
    setShowNoteModal(false);
    setNoteText('');
    setCurrentEditEvent(null);
  };

  const toggleReminder = (event) => {
    const eventKey = `${event.date}-${event.name}`;
    const updatedReminders = { ...reminders };
    updatedReminders[eventKey] = !updatedReminders[eventKey];
    setReminders(updatedReminders);
    localStorage.setItem('farmerCalendarReminders', JSON.stringify(updatedReminders));
  };

  const toggleHighlight = (event) => {
    const eventKey = `${event.date}-${event.name}`;
    const updatedHighlights = { ...highlights };
    updatedHighlights[eventKey] = !updatedHighlights[eventKey];
    setHighlights(updatedHighlights);
    localStorage.setItem('farmerCalendarHighlights', JSON.stringify(updatedHighlights));
  };

  const hasNote = (event) => {
    const eventKey = `${event.date}-${event.name}`;
    return !!eventNotes[eventKey];
  };

  const hasReminder = (event) => {
    const eventKey = `${event.date}-${event.name}`;
    return reminders[eventKey];
  };

  const isHighlighted = (event) => {
    const eventKey = `${event.date}-${event.name}`;
    return highlights[eventKey];
  };

  // Export Functions
  const exportToCSV = () => {
    const headers = ['Date', 'Event Name', 'Category', 'Priority', 'Details'];
    const rows = calendarEvents.map(event => [
      event.date,
      event.name,
      event.emoji,
      event.priority || 'N/A',
      event.notes || event.required || event.crops || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');

    const element = document.createElement('a');
    const file = new Blob([csvContent], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `farming-calendar-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const exportToICS = () => {
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AI Agri Assistant//Farmer Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Agricultural Calendar
X-WR-TIMEZONE:UTC
X-WR-CALDESC:Farming activities calendar
`;

    calendarEvents.forEach((event) => {
      const [year, month, day] = event.date.split('-');
      icsContent += `BEGIN:VEVENT
UID:${event.name.replace(/\s/g, '')}-${event.date}@aiagriastistant.com
DTSTAMP:${year}${month}${day}T000000Z
DTSTART:${year}${month}${day}T000000Z
SUMMARY:${event.emoji} ${event.name}
DESCRIPTION:${event.notes || event.required || event.crops || event.name}
PRIORITY:${event.priority === 'HIGH' ? '1' : event.priority === 'MEDIUM' ? '5' : '9'}
STATUS:CONFIRMED
END:VEVENT
`;
    });

    icsContent += `END:VCALENDAR`;
    const element = document.createElement('a');
    const file = new Blob([icsContent], { type: 'text/calendar' });
    element.href = URL.createObjectURL(file);
    element.download = `farming-calendar-${new Date().toISOString().split('T')[0]}.ics`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const exportToJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      farmerProfile: userProfile,
      events: calendarEvents,
      notes: eventNotes,
      reminders: reminders,
      highlights: highlights
    };

    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `farming-calendar-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const printCalendar = () => {
    window.print();
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    return days;
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const calendarDays = generateCalendarDays();

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-textLight">Loading your calendar...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white bg-cover bg-fixed" style={{ backgroundImage: 'url(/images/services/govt_schemes.jpg)' }}>
      <Navbar />

      {/* Hero Section - Sticky */}
      <section 
        className="sticky top-20 z-40 text-white pt-8 pb-8 px-4 lg:px-6"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="text-6xl drop-shadow-lg">📅</div>
            <div>
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">Farmer's Agricultural Calendar</h1>
              <p className="text-lg drop-shadow">
                Track all farming activities: scheme deadlines, irrigation schedules, fertilizer applications, seasons, planting, pest management & harvest dates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 bg-white/98 backdrop-blur-sm rounded-t-2xl relative z-10">
        {/* User Profile Info */}
        {userProfile && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8 border border-green-200">
            <h3 className="font-bold text-textDark mb-4 flex items-center gap-2">
              <span>👨‍🌾</span>
              Your Farming Profile
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {userProfile.state && (
                <div className="bg-white rounded p-2 border border-green-100">
                  <p className="text-xs text-green-600 font-semibold">State</p>
                  <p className="text-sm font-bold">{userProfile.state}</p>
                </div>
              )}
              {userProfile.crops_growing && userProfile.crops_growing.length > 0 && (
                <div className="bg-white rounded p-2 border border-green-100">
                  <p className="text-xs text-green-600 font-semibold">Crops</p>
                  <p className="text-sm font-bold">{userProfile.crops_growing.slice(0, 2).join(', ')}</p>
                </div>
              )}
              {userProfile.soil_type && (
                <div className="bg-white rounded p-2 border border-green-100">
                  <p className="text-xs text-green-600 font-semibold">Soil Type</p>
                  <p className="text-sm font-bold">{userProfile.soil_type}</p>
                </div>
              )}
              {userProfile.irrigation_type && (
                <div className="bg-white rounded p-2 border border-green-100">
                  <p className="text-xs text-green-600 font-semibold">Irrigation</p>
                  <p className="text-sm font-bold">{userProfile.irrigation_type}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mb-8 space-y-4">
          {/* View Mode and Navigation */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-smooth"
              >
                Today ({new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
              </button>
              <button
                onClick={previousMonth}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-smooth"
              >
                ← Previous
              </button>
              <button
                onClick={nextMonth}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-smooth"
              >
                Next →
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 font-semibold rounded-lg transition-smooth ${
                  viewMode === 'month'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                📅 Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 font-semibold rounded-lg transition-smooth ${
                  viewMode === 'week'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                📆 Week
              </button>
            </div>
          </div>

          {/* Export/Schedule Options */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-textDark flex items-center gap-2">
                <span>💾</span>
                Export & Schedule Options
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={exportToCSV}
                className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-smooth flex items-center justify-center gap-1"
                title="Export calendar as CSV for Excel/Sheets"
              >
                <span>📊</span>
                Export CSV
              </button>
              <button
                onClick={exportToICS}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-smooth flex items-center justify-center gap-1"
                title="Export calendar for Apple/Google Calendar"
              >
                <span>📅</span>
                Export ICS
              </button>
              <button
                onClick={exportToJSON}
                className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold rounded-lg transition-smooth flex items-center justify-center gap-1"
                title="Export all calendar data including notes"
              >
                <span>📋</span>
                Export JSON
              </button>
              <button
                onClick={printCalendar}
                className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-smooth flex items-center justify-center gap-1"
                title="Print calendar"
              >
                <span>🖨️</span>
                Print
              </button>
            </div>
            <p className="text-xs text-textLight mt-2">
              💡 Tip: Use CSV for spreadsheets, ICS for calendar apps, JSON to backup all data including notes & reminders
            </p>
          </div>

          {/* Filter Options */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-semibold text-textDark mb-3">Filter Events:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-smooth ${
                  filterType === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('schemes')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-smooth flex items-center justify-center gap-1 ${
                  filterType === 'schemes'
                    ? 'bg-red-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>🌾</span> Schemes
              </button>
              <button
                onClick={() => setFilterType('irrigation')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-smooth flex items-center justify-center gap-1 ${
                  filterType === 'irrigation'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>💧</span> Irrigation
              </button>
              <button
                onClick={() => setFilterType('fertilizer')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-smooth flex items-center justify-center gap-1 ${
                  filterType === 'fertilizer'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>🥗</span> Fertilizer
              </button>
              <button
                onClick={() => setFilterType('seasons')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-smooth flex items-center justify-center gap-1 ${
                  filterType === 'seasons'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>🌧️</span> Seasons
              </button>
              <button
                onClick={() => setFilterType('planting')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-smooth flex items-center justify-center gap-1 ${
                  filterType === 'planting'
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>🌾</span> Planting
              </button>
              <button
                onClick={() => setFilterType('pest')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-smooth flex items-center justify-center gap-1 ${
                  filterType === 'pest'
                    ? 'bg-red-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>🐛</span> Pest
              </button>
              <button
                onClick={() => setFilterType('harvest')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-smooth flex items-center justify-center gap-1 ${
                  filterType === 'harvest'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>🌾</span> Harvest
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6">
              {/* Month Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-textDark">{monthName}</h2>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-bold text-textDark py-2 text-sm">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => {
                  const eventsForDay = day ? getEventsForDate(day) : [];
                  const isSelected = selectedDate && day && formatDateString(day) === formatDateString(selectedDate);
                  const today = new Date();
                  const isToday = day && formatDateString(day) === formatDateString(today);

                  return (
                    <div
                      key={idx}
                      onClick={() => day && setSelectedDate(day)}
                      className={`min-h-20 p-2 rounded border-2 cursor-pointer transition-smooth ${
                        !day
                          ? 'bg-gray-50 border-gray-100'
                          : isSelected
                          ? 'border-indigo-600 bg-indigo-50'
                          : isToday
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-bold mb-1 ${isToday ? 'text-green-600' : 'text-textDark'}`}>
                            {day.getDate()}
                          </div>
                          <div className="space-y-1">
                            {eventsForDay.slice(0, 2).map((event, i) => (
                              <button
                                key={i}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  console.log('Event clicked:', event);
                                  setCurrentEditEvent(event);
                                  setShowEventModal(true);
                                }}
                                className={`w-full text-xs px-1 py-0.5 rounded text-white truncate cursor-pointer hover:opacity-80 transition-opacity ${event.color} ${
                                  isHighlighted(event) ? 'ring-2 ring-yellow-300 font-bold' : ''
                                }`}
                                title={`Click to manage: ${event.name}`}
                                type="button"
                              >
                                <span className="flex items-center gap-0.5 justify-start">
                                  {event.emoji} {event.name.substring(0, 10)}...
                                  {hasNote(event) && <span>📝</span>}
                                  {hasReminder(event) && <span>🔔</span>}
                                </span>
                              </button>
                            ))}
                            {eventsForDay.length > 2 && (
                              <div 
                                className="text-xs text-indigo-600 font-semibold cursor-pointer hover:text-indigo-800"
                                onClick={() => setSelectedDate(day)}
                              >
                                +{eventsForDay.length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar - Selected Date Events */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6">
              <h3 className="text-lg font-bold text-textDark mb-4">
                {selectedDate ? `📅 ${formatDateString(selectedDate)}` : 'Select a date'}
              </h3>

              {selectedDate ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {getEventsForDate(selectedDate).length > 0 ? (
                    getEventsForDate(selectedDate).map((event, idx) => {
                      const eventKey = `${event.date}-${event.name}`;
                      const eventNote = eventNotes[eventKey];
                      return (
                        <div
                          key={idx}
                          className={`rounded-lg p-3 border-l-4 transition-all ${
                            isHighlighted(event)
                              ? `${event.color} bg-opacity-20 ring-2 ring-yellow-400 border-yellow-500`
                              : `${event.color} bg-opacity-10`
                          }`}
                          style={isHighlighted(event) ? { borderColor: 'rgb(250, 204, 21)' } : {}}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-start gap-2 flex-1">
                              <span className="text-xl">{event.emoji}</span>
                              <div className="flex-1">
                                <p className="font-bold text-textDark text-sm">{event.name}</p>
                                {hasReminder(event) && (
                                  <p className="text-xs text-red-600 font-semibold">🔔 Reminder Set</p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => toggleHighlight(event)}
                                className={`px-2 py-1 rounded text-xs font-semibold transition-smooth ${
                                  isHighlighted(event)
                                    ? 'bg-yellow-400 text-yellow-900'
                                    : 'bg-gray-200 text-gray-700 hover:bg-yellow-100'
                                }`}
                                title="Highlight event"
                              >
                                ⭐
                              </button>
                              <button
                                onClick={() => toggleReminder(event)}
                                className={`px-2 py-1 rounded text-xs font-semibold transition-smooth ${
                                  hasReminder(event)
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                                }`}
                                title="Set reminder"
                              >
                                🔔
                              </button>
                              <button
                                onClick={() => openNoteModal(event)}
                                className={`px-2 py-1 rounded text-xs font-semibold transition-smooth ${
                                  hasNote(event)
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                                }`}
                                title="Add note"
                              >
                                📝
                              </button>
                            </div>
                          </div>

                          {eventNote && (
                            <div className="bg-white bg-opacity-70 rounded p-2 mb-2 border-l-2 border-blue-500">
                              <p className="text-xs text-textDark font-semibold mb-1">📝 Your Note:</p>
                              <p className="text-xs text-textLight">{eventNote}</p>
                            </div>
                          )}

                          {event.priority && (
                            <p className="text-xs text-textLight mt-1">
                              Priority: <span className="font-semibold">{event.priority}</span>
                            </p>
                          )}
                          {event.notes && (
                            <p className="text-xs text-textLight mt-1">{event.notes}</p>
                          )}
                          {event.required && (
                            <p className="text-xs text-textLight mt-1">
                              <strong>Required:</strong> {event.required}
                            </p>
                          )}
                          {event.crops && (
                            <p className="text-xs text-textLight mt-1">
                              <strong>Crops:</strong> {event.crops}
                            </p>
                          )}
                          {event.variety && (
                            <p className="text-xs text-textLight mt-1">
                              <strong>Variety:</strong> {event.variety}
                            </p>
                          )}
                          {event.threshold && (
                            <p className="text-xs text-textLight mt-1">
                              <strong>ETL:</strong> {event.threshold}
                            </p>
                          )}
                          {event.yield && (
                            <p className="text-xs text-textLight mt-1">
                              <strong>Expected Yield:</strong> {event.yield}
                            </p>
                          )}
                          {event.quantity && (
                            <p className="text-xs text-textLight mt-1">
                              <strong>Quantity:</strong> {event.quantity}
                            </p>
                          )}
                          {event.parameters && (
                            <p className="text-xs text-textLight mt-1">
                              <strong>Parameters:</strong> {event.parameters}
                            </p>
                          )}
                          {event.endDate && (
                            <p className="text-xs text-textLight mt-1">
                              <strong>Until:</strong> {event.endDate}
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-textLight">
                      <p className="text-sm">No events scheduled for this date</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-textLight">
                  <p className="text-sm">Click on a date to view events</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-textDark mb-4">📌 Event Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-sm text-textDark">🌾 Scheme Deadlines</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm text-textDark">💧 Irrigation Schedule</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-yellow-500"></div>
              <span className="text-sm text-textDark">🥗 Fertilizer Application</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-cyan-500"></div>
              <span className="text-sm text-textDark">🌧️ Crop Seasons</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-green-600"></div>
              <span className="text-sm text-textDark">🌾 Planting Dates</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-red-600"></div>
              <span className="text-sm text-textDark">🐛 Pest & Disease Alert</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-amber-600"></div>
              <span className="text-sm text-textDark">🌾 Harvest Schedule</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-amber-700"></div>
              <span className="text-sm text-textDark">🧪 Soil Management</span>
            </div>
          </div>
        </div>

        {/* Event Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <p className="text-2xl font-bold text-red-600">{eventCategories.schemes.length}</p>
            <p className="text-sm text-red-700 font-semibold">Scheme Deadlines</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">{eventCategories.irrigation.length}</p>
            <p className="text-sm text-blue-700 font-semibold">Irrigation Dates</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <p className="text-2xl font-bold text-yellow-600">{eventCategories.fertilizer.length}</p>
            <p className="text-sm text-yellow-700 font-semibold">Fertilizer Applications</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <p className="text-2xl font-bold text-green-600">{eventCategories.planting.length + eventCategories.harvest.length}</p>
            <p className="text-sm text-green-700 font-semibold">Planting & Harvest Dates</p>
          </div>
        </div>

        {/* Personalized Tips Section */}
        {userProfile && (
          <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 border border-green-200">
            <h3 className="text-xl font-bold text-textDark mb-6 flex items-center gap-2">
              <span>💡</span>
              Personalized Tips for Your Farm
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Irrigation Tips */}
              <div className="bg-white rounded-lg p-5 border-l-4 border-blue-500">
                <p className="font-bold text-textDark mb-3 flex items-center gap-2">
                  <span>💧</span>
                  {userProfile.irrigation_type} System Tips
                </p>
                <ul className="text-sm text-textLight space-y-2">
                  {userProfile.irrigation_type === 'Drip Irrigation' && (
                    <>
                      <li>✓ Check drip lines weekly for blockages</li>
                      <li>✓ Apply fertilizers through fertigation for better efficiency</li>
                      <li>✓ Monitor soil moisture to optimize watering</li>
                      <li>✓ Clean filters monthly for optimal performance</li>
                    </>
                  )}
                  {userProfile.irrigation_type === 'Sprinkler Irrigation' && (
                    <>
                      <li>✓ Inspect nozzles for proper coverage</li>
                      <li>✓ Maintain consistent water pressure</li>
                      <li>✓ Irrigate during early morning/evening to reduce evaporation</li>
                      <li>✓ Clean intake filters regularly</li>
                    </>
                  )}
                  {userProfile.irrigation_type === 'Furrow Irrigation' && (
                    <>
                      <li>✓ Maintain proper furrow gradient (0.3-0.5%)</li>
                      <li>✓ Monitor water distribution throughout field</li>
                      <li>✓ Adjust water flow based on soil type</li>
                      <li>✓ Repair eroded furrows promptly</li>
                    </>
                  )}
                  {userProfile.irrigation_type === 'Flood Irrigation' && (
                    <>
                      <li>✓ Maintain strong bunds to prevent leakage</li>
                      <li>✓ Monitor water depth (3-5 cm for most crops)</li>
                      <li>✓ Drain excess water after saturation</li>
                      <li>✓ Plan irrigation cycles based on crop stage</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Soil Tips */}
              <div className="bg-white rounded-lg p-5 border-l-4 border-amber-600">
                <p className="font-bold text-textDark mb-3 flex items-center gap-2">
                  <span>🌱</span>
                  {userProfile.soil_type} Soil Management
                </p>
                <ul className="text-sm text-textLight space-y-2">
                  {userProfile.soil_type === 'Loamy' && (
                    <>
                      <li>✓ Well-balanced soil - maintain organic matter</li>
                      <li>✓ Good water retention - reduce irrigation frequency</li>
                      <li>✓ Add 5-10 tonnes FYM annually</li>
                      <li>✓ Ideal for most crops - rotate cropping pattern</li>
                    </>
                  )}
                  {userProfile.soil_type === 'Clay' && (
                    <>
                      <li>✓ Poor drainage - improve with organic matter</li>
                      <li>✓ Requires less frequent irrigation</li>
                      <li>✓ Add 10-15 tonnes FYM to improve structure</li>
                      <li>✓ Ensure proper field drainage</li>
                    </>
                  )}
                  {userProfile.soil_type === 'Sandy' && (
                    <>
                      <li>✓ Low water retention - increase irrigation frequency</li>
                      <li>✓ Add 15-20 tonnes FYM for better holding capacity</li>
                      <li>✓ Use mulching to conserve moisture</li>
                      <li>✓ Regular nutrient application needed</li>
                    </>
                  )}
                  {userProfile.soil_type === 'Silt' && (
                    <>
                      <li>✓ Good fertility - balance nutrient application</li>
                      <li>✓ Moderate drainage - monitor water logging</li>
                      <li>✓ Add 7-10 tonnes FYM annually</li>
                      <li>✓ Suitable for pulses and vegetables</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Crop Tips */}
              {userProfile.crops_growing && userProfile.crops_growing.length > 0 && (
                <div className="bg-white rounded-lg p-5 border-l-4 border-green-600 md:col-span-2">
                  <p className="font-bold text-textDark mb-3 flex items-center gap-2">
                    <span>🌾</span>
                    Crop Calendar for {userProfile.crops_growing.join(', ')}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userProfile.crops_growing.map((crop, idx) => {
                      const cropInfo = {
                        'Wheat': 'Sow: Oct-Nov | Harvest: April-May | Irrigation: 4-5 times',
                        'Rice': 'Sow: May-June | Harvest: Sept-Oct | Irrigation: 12-15 times',
                        'Cotton': 'Sow: June | Harvest: Nov-Dec | Irrigation: 5-6 times',
                        'Sugarcane': 'Plant: Sept-Oct | Harvest: 12 months | Irrigation: 40-50 times',
                        'Maize': 'Sow: May-June | Harvest: Sept-Oct | Irrigation: 4-5 times',
                        'Pulses': 'Sow: Oct-Nov | Harvest: March-April | Irrigation: 2-3 times',
                      };
                      return (
                        <div key={idx} className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded border border-green-200">
                          <p className="font-semibold text-green-700">{crop}</p>
                          <p className="text-xs text-green-600 mt-1">{cropInfo[crop] || 'Consult local agricultural office'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Event Management Modal */}
      {showEventModal && currentEditEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className={`${currentEditEvent.color} text-white px-6 py-4 flex items-center justify-between rounded-t-lg sticky top-0`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentEditEvent.emoji}</span>
                <div>
                  <h2 className="text-lg font-bold">{currentEditEvent.name}</h2>
                  <p className="text-xs opacity-90">📅 {currentEditEvent.date}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setCurrentEditEvent(null);
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-smooth"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Event Details */}
              <div className="space-y-3">
                <h3 className="font-bold text-textDark text-sm">📋 Event Details</h3>
                {currentEditEvent.priority && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-textLight">Priority:</span>
                    <span className={`px-3 py-1 rounded text-xs font-bold text-white ${
                      currentEditEvent.priority === 'HIGH' ? 'bg-red-500' :
                      currentEditEvent.priority === 'MEDIUM' ? 'bg-orange-500' :
                      'bg-green-500'
                    }`}>
                      {currentEditEvent.priority}
                    </span>
                  </div>
                )}
                {currentEditEvent.notes && (
                  <div className="bg-blue-50 p-3 rounded border-l-2 border-blue-500">
                    <p className="text-xs text-blue-700 font-semibold mb-1">📌 Description:</p>
                    <p className="text-xs text-textLight">{currentEditEvent.notes}</p>
                  </div>
                )}
                {currentEditEvent.required && (
                  <div className="bg-yellow-50 p-3 rounded border-l-2 border-yellow-500">
                    <p className="text-xs text-yellow-700 font-semibold mb-1">✅ Required:</p>
                    <p className="text-xs text-textLight">{currentEditEvent.required}</p>
                  </div>
                )}
                {currentEditEvent.crops && (
                  <div className="bg-green-50 p-3 rounded border-l-2 border-green-500">
                    <p className="text-xs text-green-700 font-semibold mb-1">🌾 Crops:</p>
                    <p className="text-xs text-textLight">{currentEditEvent.crops}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <h3 className="font-bold text-textDark text-sm">⚙️ Event Actions</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      toggleHighlight(currentEditEvent);
                    }}
                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-smooth flex flex-col items-center gap-1 ${
                      isHighlighted(currentEditEvent)
                        ? 'bg-yellow-400 text-yellow-900 ring-2 ring-yellow-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-yellow-100'
                    }`}
                  >
                    <span className="text-lg">⭐</span>
                    <span className="text-xs">Highlight</span>
                  </button>
                  <button
                    onClick={() => {
                      toggleReminder(currentEditEvent);
                    }}
                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-smooth flex flex-col items-center gap-1 ${
                      hasReminder(currentEditEvent)
                        ? 'bg-red-500 text-white ring-2 ring-red-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                    }`}
                  >
                    <span className="text-lg">🔔</span>
                    <span className="text-xs">Reminder</span>
                  </button>
                  <button
                    onClick={() => {
                      const eventKey = `${currentEditEvent.date}-${currentEditEvent.name}`;
                      setNoteText(eventNotes[eventKey] || '');
                      setShowNoteModal(true);
                    }}
                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-smooth flex flex-col items-center gap-1 ${
                      hasNote(currentEditEvent)
                        ? 'bg-blue-500 text-white ring-2 ring-blue-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                    }`}
                  >
                    <span className="text-lg">📝</span>
                    <span className="text-xs">Add Note</span>
                  </button>
                </div>
              </div>

              {/* Current Note Display */}
              {(() => {
                const eventKey = `${currentEditEvent.date}-${currentEditEvent.name}`;
                const eventNote = eventNotes[eventKey];
                return eventNote && (
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
                    <p className="text-xs font-bold text-blue-700 mb-2">📝 Your Note:</p>
                    <p className="text-sm text-textLight">{eventNote}</p>
                    <button
                      onClick={() => {
                        setNoteText(eventNote);
                        setShowNoteModal(true);
                      }}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
                    >
                      Edit Note →
                    </button>
                  </div>
                );
              })()}

              {/* Status Indicators */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-xs font-bold text-textDark mb-2">✨ Event Status</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`${isHighlighted(currentEditEvent) ? '✅' : '⭕'}`}></span>
                  <span className="text-textLight">{isHighlighted(currentEditEvent) ? 'Highlighted' : 'Not highlighted'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`${hasReminder(currentEditEvent) ? '✅' : '⭕'}`}></span>
                  <span className="text-textLight">{hasReminder(currentEditEvent) ? 'Reminder set' : 'No reminder'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`${hasNote(currentEditEvent) ? '✅' : '⭕'}`}></span>
                  <span className="text-textLight">{hasNote(currentEditEvent) ? 'Note added' : 'No note'}</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setCurrentEditEvent(null);
                }}
                className="w-full px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-smooth"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && currentEditEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-lg font-bold">📝 Add Note for Event</h2>
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setNoteText('');
                  setCurrentEditEvent(null);
                }}
                className="text-white hover:bg-indigo-700 rounded-full p-2 transition-smooth"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm font-semibold text-textDark mb-2">{currentEditEvent.emoji} {currentEditEvent.name}</p>
                <p className="text-xs text-textLight">{currentEditEvent.date}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-textDark mb-2">
                  Your Notes:
                </label>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add your own notes or reminders about this event..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none resize-none"
                  rows="5"
                />
                <p className="text-xs text-textLight mt-1">{noteText.length}/500 characters</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={saveNote}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-smooth"
                >
                  💾 Save Note
                </button>
                <button
                  onClick={() => {
                    setShowNoteModal(false);
                    setNoteText('');
                    setCurrentEditEvent(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-textDark font-semibold rounded-lg hover:bg-gray-300 transition-smooth"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
