import { useState, useEffect } from 'react';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Generate dynamic notifications based on current time and services
    const generateNotifications = () => {
      const hour = new Date().getHours();
      const month = new Date().getMonth();
      
      let newNotifications = [];

      // Time-based notifications
      if (hour >= 5 && hour < 8) {
        newNotifications.push({
          id: 1,
          type: 'warning',
          icon: '🌅',
          title: 'Morning Spray Alert',
          message: 'Best time to apply pesticides: Early morning (5-8 AM) for maximum effectiveness',
          service: 'Safety Intervals',
          color: 'bg-orange-50 border-orange-300'
        });
      } else if (hour >= 17 && hour < 19) {
        newNotifications.push({
          id: 1,
          type: 'warning',
          icon: '🌆',
          title: 'Evening Spray Time',
          message: 'Perfect evening window: 5-7 PM for pesticide application. Temperature is moderate.',
          service: 'Safety Intervals',
          color: 'bg-orange-50 border-orange-300'
        });
      }

      // Scheme deadline notifications
      newNotifications.push({
        id: 2,
        type: 'info',
        icon: '📋',
        title: 'Government Schemes Open',
        message: 'PM-KISAN & PMFBY applications open. Check eligibility and apply now for farm subsidies.',
        service: 'Schemes',
        color: 'bg-blue-50 border-blue-300'
      });

      // Seasonal notifications
      if (month >= 9 && month <= 10) {
        newNotifications.push({
          id: 3,
          type: 'success',
          icon: '🌾',
          title: 'Kharif Harvest Season',
          message: 'Follow PHI (Pre-Harvest Interval) strictly. Wait 14-21 days after last pesticide spray.',
          service: 'Safety Intervals',
          color: 'bg-green-50 border-green-300'
        });
      }

      // Irrigation tips
      if (hour >= 12 && hour < 16) {
        newNotifications.push({
          id: 4,
          type: 'info',
          icon: '💧',
          title: 'Irrigation Schedule',
          message: 'Peak water demand hours: 12-4 PM. Check power schedule for feeder allocation.',
          service: 'Dashboard',
          color: 'bg-cyan-50 border-cyan-300'
        });
      }

      // Soil health notification
      if (month % 3 === 0) {
        newNotifications.push({
          id: 5,
          type: 'info',
          icon: '🌱',
          title: 'Soil Health Check',
          message: 'Time for soil testing. Monitor NPK levels and pH for optimal crop productivity.',
          service: 'Dashboard',
          color: 'bg-green-50 border-green-300'
        });
      }

      // Weather alert
      newNotifications.push({
        id: 6,
        type: 'alert',
        icon: '🌧️',
        title: 'Weather Advisory',
        message: 'Avoid spraying 6 hours before rain. Check 7-day forecast for planning.',
        service: 'Dashboard',
        color: 'bg-blue-50 border-blue-300'
      });

      return newNotifications;
    };

    setNotifications(generateNotifications());

    // Refresh notifications every 30 minutes
    const interval = setInterval(() => {
      setNotifications(generateNotifications());
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-40 max-w-md space-y-3 max-h-96 overflow-y-auto">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`${notif.color} border-2 rounded-lg p-4 shadow-lg animate-slide-in`}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl flex-shrink-0">{notif.icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-gray-800">{notif.title}</h4>
                <button
                  onClick={() => removeNotification(notif.id)}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-700 mb-2">{notif.message}</p>
              <div className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded inline-block">
                📌 {notif.service}
              </div>
            </div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
