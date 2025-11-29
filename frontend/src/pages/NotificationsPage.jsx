import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotificationsPage() {
  const [allNotifications, setAllNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  // Generate all notifications
  useEffect(() => {
    const hour = new Date().getHours();
    const month = new Date().getMonth() + 1;
    const notifs = [];

    // Morning spray alert
    notifs.push({
      id: 1,
      type: 'warning',
      icon: '🌅',
      title: 'Morning Spray Alert',
      message: 'Best time to apply pesticides: Early morning (5-8 AM) for maximum effectiveness',
      service: 'Safety Intervals',
      timestamp: new Date(Date.now() - 15 * 60000),
      link: '/safety'
    });

    // Scheme notification
    notifs.push({
      id: 2,
      type: 'info',
      icon: '📋',
      title: 'Government Schemes Open',
      message: 'PM-KISAN, PMFBY & other schemes applications open. Check eligibility.',
      service: 'Schemes',
      timestamp: new Date(Date.now() - 45 * 60000),
      link: '/schemes'
    });

    // Irrigation alert
    notifs.push({
      id: 3,
      type: 'info',
      icon: '💧',
      title: 'Irrigation Schedule',
      message: 'Peak water demand hours: 12-4 PM. Check power schedule & water availability.',
      service: 'Dashboard',
      timestamp: new Date(Date.now() - 2 * 3600000),
      link: '/irrigation'
    });

    // Seasonal alerts
    if (month >= 9 && month <= 10) {
      notifs.push({
        id: 4,
        type: 'alert',
        icon: '🌾',
        title: 'Kharif Harvest Season',
        message: 'Time to prepare for harvest. Check storage facilities & market prices.',
        service: 'Dashboard',
        timestamp: new Date(Date.now() - 5 * 3600000),
        link: '/dashboard'
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
        service: 'Dashboard',
        timestamp: new Date(Date.now() - 1 * 3600000),
        link: '/soil-health'
      });
    }

    // Evening spray alert
    notifs.push({
      id: 6,
      type: 'warning',
      icon: '🌆',
      title: 'Evening Spray Window',
      message: 'Evening spray window open (5-7 PM). Ensure low wind for application.',
      service: 'Safety Intervals',
      timestamp: new Date(Date.now() - 30 * 60000),
      link: '/safety'
    });

    // Weather advisories
    notifs.push({
      id: 7,
      type: 'alert',
      icon: '🌧️',
      title: 'Heavy Rain Expected',
      message: 'Weather forecast predicts heavy rainfall in next 48 hours. Delay spraying.',
      service: 'Weather',
      timestamp: new Date(Date.now() - 1 * 3600000),
      link: '/dashboard'
    });

    // Crop disease alert
    notifs.push({
      id: 8,
      type: 'warning',
      icon: '🦠',
      title: 'Pest Alert: Fall Armyworm Detected',
      message: 'Fall armyworm reported in your district. Check recommended pesticides.',
      service: 'Safety Intervals',
      timestamp: new Date(Date.now() - 3 * 3600000),
      link: '/safety'
    });

    // Market price update
    notifs.push({
      id: 9,
      type: 'info',
      icon: '📈',
      title: 'Market Price Update',
      message: 'Wheat prices increased by 5% in APMC. Good time to sell.',
      service: 'Dashboard',
      timestamp: new Date(Date.now() - 2 * 3600000),
      link: '/dashboard'
    });

    // Sort by timestamp (newest first)
    notifs.sort((a, b) => b.timestamp - a.timestamp);
    setAllNotifications(notifs);
  }, []);

  const filteredNotifications = filter === 'all' 
    ? allNotifications 
    : allNotifications.filter(n => n.service === filter);

  const services = ['all', ...new Set(allNotifications.map(n => n.service))];

  const typeColors = {
    warning: 'bg-yellow-50 border-l-4 border-yellow-400',
    info: 'bg-blue-50 border-l-4 border-blue-400',
    success: 'bg-green-50 border-l-4 border-green-400',
    alert: 'bg-red-50 border-l-4 border-red-400'
  };

  const typeIcons = {
    warning: '⚠️',
    info: 'ℹ️',
    success: '✓',
    alert: '🔔'
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-textDark mb-2">All Notifications</h1>
          <p className="text-textLight">Stay updated with important alerts and information</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {services.map(service => (
            <button
              key={service}
              onClick={() => setFilter(service)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                filter === service
                  ? 'bg-gradient-to-r from-primaryGreen to-accentGreen text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {service === 'all' ? 'All Notifications' : service}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => window.location.href = notif.link}
                className={`${typeColors[notif.type]} p-5 rounded-lg hover:shadow-lg transition-all cursor-pointer transform hover:scale-102`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="text-4xl flex-shrink-0 pt-1">{notif.icon}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-textDark">{notif.title}</h3>
                        <p className="text-sm text-textLight mt-1">{notif.message}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="inline-block text-xs px-3 py-1 bg-white rounded-full text-gray-600 font-medium whitespace-nowrap">
                          {notif.service}
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-opacity-20 border-gray-400">
                      <span className="text-xs text-textLight">{formatTime(notif.timestamp)}</span>
                      <span className="text-sm font-medium text-primaryGreen hover:text-accentGreen">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <p className="text-2xl mb-2">✓ All caught up!</p>
              <p className="text-textLight">No notifications match your filter.</p>
            </div>
          )}
        </div>

        {/* Stats */}
        {allNotifications.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="text-3xl font-bold text-yellow-600">
                {allNotifications.filter(n => n.type === 'warning').length}
              </div>
              <p className="text-sm text-textLight mt-1">Warnings</p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <div className="text-3xl font-bold text-blue-600">
                {allNotifications.filter(n => n.type === 'info').length}
              </div>
              <p className="text-sm text-textLight mt-1">Info</p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <div className="text-3xl font-bold text-green-600">
                {allNotifications.filter(n => n.type === 'success').length}
              </div>
              <p className="text-sm text-textLight mt-1">Success</p>
            </div>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <div className="text-3xl font-bold text-red-600">
                {allNotifications.filter(n => n.type === 'alert').length}
              </div>
              <p className="text-sm text-textLight mt-1">Alerts</p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
