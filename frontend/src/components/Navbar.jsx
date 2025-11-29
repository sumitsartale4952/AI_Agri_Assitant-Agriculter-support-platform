import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logos/logo.jpg';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [user, setUser] = useState(null);
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const langRef = useRef(null);
  const notifRef = useRef(null);

  // Check authentication status
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Generate notifications
  const generateNotifications = () => {
    const hour = new Date().getHours();
    const month = new Date().getMonth() + 1;
    const notifs = [];

    // Morning spray alert
    if (hour >= 5 && hour < 8) {
      notifs.push({
        id: 1,
        type: 'warning',
        icon: '🌅',
        title: 'Morning Spray Alert',
        message: 'Best time to apply pesticides: Early morning (5-8 AM) for maximum effectiveness',
        service: 'Safety Intervals'
      });
    }

    // Scheme notification
    notifs.push({
      id: 2,
      type: 'info',
      icon: '📋',
      title: 'Government Schemes Open',
      message: 'PM-KISAN, PMFBY & other schemes applications open. Check eligibility.',
      service: 'Schemes'
    });

    // Irrigation alert
    if (hour >= 12 && hour < 16) {
      notifs.push({
        id: 3,
        type: 'info',
        icon: '💧',
        title: 'Irrigation Schedule',
        message: 'Peak water demand hours: 12-4 PM. Check power schedule & water availability.',
        service: 'Dashboard'
      });
    }

    // Seasonal alerts
    if (month >= 9 && month <= 10) {
      notifs.push({
        id: 4,
        type: 'alert',
        icon: '🌾',
        title: 'Kharif Harvest Season',
        message: 'Time to prepare for harvest. Check storage facilities & market prices.',
        service: 'Dashboard'
      });
    }

    // Soil health check
    if (month % 3 === 0) {
      notifs.push({
        id: 5,
        type: 'success',
        icon: '🌱',
        title: 'Soil Health Check Due',
        message: 'Quarterly soil testing recommended. Book appointment with extension officer.',
        service: 'Dashboard'
      });
    }

    // Evening spray alert
    if (hour >= 17 && hour < 19) {
      notifs.push({
        id: 6,
        type: 'warning',
        icon: '🌆',
        title: 'Evening Spray Window',
        message: 'Evening spray window open (5-7 PM). Ensure low wind for application.',
        service: 'Safety Intervals'
      });
    }

    setNotifications(notifs);
    setHasNotifications(notifs.length > 0);
  };

  // Initialize notifications
  useEffect(() => {
    generateNotifications();
    const interval = setInterval(generateNotifications, 30 * 60 * 1000); // 30 minutes
    return () => clearInterval(interval);
  }, []);

  // Handle scroll to compress header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock search function - integrates with MCP data
  const handleSearch = (value) => {
    setSearchValue(value);
    if (value.length > 0) {
      // Mock search results - in production, call MCP API
      const mockResults = [
        { type: 'scheme', title: 'PMFBY - Prime Minister Fasal Bima Yojana', category: t('search.schemes') },
        { type: 'market', title: 'Amravati Mandi - Wheat Prices', category: t('search.markets') },
        { type: 'advisory', title: 'Pest Alert: Fall Armyworm in Maharashtra', category: t('search.advisories') },
        { type: 'help', title: 'How to upload a soil test report?', category: t('search.help') },
      ].filter(r => r.title.toLowerCase().includes(value.toLowerCase()));
      setSearchResults(mockResults);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    setShowLangMenu(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 bg-white z-40 transition-smooth ${
          isScrolled ? 'shadow-md' : 'shadow-sm'
        }`}
        role="banner"
      >
        <nav className="max-w-7xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo - full left, larger */}
          <div className="flex items-center flex-shrink-0 mr-6">
            <a href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <img
                src={logo}
                alt={t('header.logo_alt') || 'AI Agri Assistant'}
                className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg shadow"
                loading="lazy"
              />
              <span className="font-extrabold text-2xl md:text-3xl text-primaryGreen tracking-tight ml-2">
                {t('AI Agri Assistant') || 'AI Agri Assistant'}
              </span>
            </a>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md mx-auto relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchValue && setShowResults(true)}
                placeholder={t('header.search_placeholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus-ring bg-neutralGray placeholder-textLight"
                aria-label={t('header.search_placeholder')}
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-textLight"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Search Results */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    className="w-full px-4 py-3 text-left border-b last:border-b-0 hover:bg-neutralGray transition-colors focus-ring"
                    onClick={() => {
                      setSearchValue('');
                      setShowResults(false);
                      // Navigate to result
                    }}
                  >
                    <div className="text-sm font-medium text-textDark">{result.title}</div>
                    <div className="text-xs text-textLight">{result.category}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-neutralGray transition-smooth focus-ring text-sm font-medium"
                aria-label={t('header.language')}
                aria-haspopup="true"
                aria-expanded={showLangMenu}
              >
                <span>{i18n.language === 'en' ? 'EN' : i18n.language === 'hi' ? 'HI' : 'TE'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <button
                    onClick={() => {
                      i18n.changeLanguage('en');
                      setShowLangMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-neutralGray text-sm font-medium"
                  >
                    {t('header.english')}
                  </button>
                  <button
                    onClick={() => {
                      i18n.changeLanguage('hi');
                      setShowLangMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-neutralGray text-sm border-t border-gray-200 font-medium"
                  >
                    {t('header.hindi')}
                  </button>
                  <button
                    onClick={() => {
                      i18n.changeLanguage('te');
                      setShowLangMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-neutralGray text-sm border-t border-gray-200 font-medium"
                  >
                    తెలుగు
                  </button>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-neutralGray rounded-lg transition-smooth focus-ring"
                aria-label={t('header.notifications')}
                aria-haspopup="true"
                aria-expanded={showNotifications}
              >
                <svg className="w-5 h-5 text-textDark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {hasNotifications && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-alertOrange rounded-full" aria-hidden="true" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="sticky top-0 bg-gradient-to-r from-primaryGreen to-accentGreen text-white px-4 py-3 border-b border-green-400">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm">Notifications</h3>
                      <span className="bg-white text-primaryGreen text-xs font-bold px-2 py-1 rounded-full">
                        {notifications.length}
                      </span>
                    </div>
                  </div>

                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {notifications.map((notif) => {
                        const typeColors = {
                          warning: 'bg-yellow-50 border-l-4 border-yellow-400',
                          info: 'bg-blue-50 border-l-4 border-blue-400',
                          success: 'bg-green-50 border-l-4 border-green-400',
                          alert: 'bg-red-50 border-l-4 border-red-400'
                        };

                        // Map notification types to navigation links
                        const notificationLinks = {
                          1: '/safety',      // Morning Spray Alert
                          2: '/schemes',     // Government Schemes
                          3: '/irrigation',  // Irrigation Schedule
                          4: '/dashboard',   // Kharif Harvest
                          5: '/soil-health', // Soil Health
                          6: '/safety',      // Evening Spray
                          7: '/dashboard',   // Weather
                        };

                        return (
                          <div
                            key={notif.id}
                            onClick={() => {
                              navigate(notificationLinks[notif.id] || '/');
                              setShowNotifications(false);
                            }}
                            className={`p-4 ${typeColors[notif.type]} hover:opacity-80 transition-opacity cursor-pointer`}
                          >
                            <div className="flex gap-3">
                              <div className="text-2xl flex-shrink-0">{notif.icon}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="font-bold text-sm text-textDark">{notif.title}</h4>
                                  <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600 font-medium whitespace-nowrap">
                                    {notif.service}
                                  </span>
                                </div>
                                <p className="text-xs text-textLight mt-1 line-clamp-2">{notif.message}</p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNotifications(notifications.filter(n => n.id !== notif.id));
                                }}
                                className="text-gray-400 hover:text-gray-600 flex-shrink-0 self-start mt-1"
                                aria-label="Dismiss"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p className="text-sm">✓ All caught up! No new notifications.</p>
                    </div>
                  )}

                  <div className="sticky bottom-0 bg-gray-50 px-4 py-3 border-t border-gray-200">
                    <button
                      onClick={() => {
                        navigate('/notifications');
                        setShowNotifications(false);
                      }}
                      className="w-full text-center text-sm font-medium text-primaryGreen hover:text-accentGreen transition-colors"
                    >
                      View All Notifications →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu / Auth Buttons */}
            {user ? (
              <div className="relative ml-4 pl-4 border-l border-gray-200" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutralGray transition-smooth focus-ring"
                  aria-label={t('header.profile')}
                  aria-haspopup="true"
                  aria-expanded={showProfileMenu}
                >
                  <div className="w-9 h-9 rounded-full bg-primaryGreen flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-sm font-semibold text-textDark truncate max-w-xs">{user.name}</span>
                  <svg className="hidden md:block w-4 h-4 text-textLight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-primaryGreen to-accentGreen text-white">
                      <div className="text-sm font-bold">{user.name}</div>
                      <div className="text-xs opacity-90 mt-1">{user.email}</div>
                    </div>
                    <button 
                      onClick={() => { navigate('/dashboard'); setShowProfileMenu(false); }}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm text-textDark transition-smooth font-medium flex items-center gap-2"
                    >
                      <span>📊</span> Dashboard
                    </button>
                    <button 
                      onClick={() => { navigate('/profile-setup'); setShowProfileMenu(false); }}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm text-textDark border-t border-gray-100 transition-smooth font-medium flex items-center gap-2"
                    >
                      <span>✏️</span> Edit Profile
                    </button>
                    <button 
                      onClick={() => {
                        localStorage.clear();
                        setUser(null);
                        setShowProfileMenu(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm text-red-600 border-t border-gray-100 transition-smooth font-medium flex items-center gap-2"
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-smooth"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-smooth"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>
      {/* Advertisement/Marquee below navbar */}
      <div className="w-full bg-yellow-400 text-black py-2 overflow-hidden shadow-lg border-b-2 border-yellow-600 z-30 relative">
        <div className="animate-marquee whitespace-nowrap text-center text-lg font-extrabold tracking-wider">
          🚜 Special Offer: Get 20% off on soil testing kits! | 🌾 New: Crop insurance advisory now available | 📢 Government scheme updates every Monday | 📱 Download our mobile app for instant alerts!
        </div>
      </div>
    </>
  );
}
