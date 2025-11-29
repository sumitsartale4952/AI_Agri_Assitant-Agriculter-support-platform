import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DeadlinesPage.css';

const API_BASE_URL = 'http://localhost:8000/api';

const DeadlinesPage = () => {
  const [deadlinesData, setDeadlinesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const fetchDeadlines = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/schemes/deadlines`);
      if (response.data.success) {
        setDeadlinesData(response.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching deadlines:', err);
      setError('Failed to load deadline information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="deadlines-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading deadline information...</p>
        </div>
      </div>
    );
  }

  if (error || !deadlinesData) {
    return (
      <div className="deadlines-page">
        <div className="error-message">
          <p>❌ {error || 'Unable to load deadlines'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="deadlines-page">
      <div className="deadlines-header">
        <h1>📅 Scheme Deadlines & Status</h1>
        <p className="subtitle">Last Updated: {deadlinesData.generated_on}</p>
      </div>

      {/* Summary Statistics */}
      <div className="deadlines-summary">
        <div className="summary-card">
          <div className="summary-number">{deadlinesData.total_schemes}</div>
          <div className="summary-label">Total Schemes</div>
          <div className="summary-icon">🎯</div>
        </div>
        <div className="summary-card urgent">
          <div className="summary-number">{deadlinesData.upcoming_deadlines_count}</div>
          <div className="summary-label">Upcoming Deadlines</div>
          <div className="summary-icon">⏰</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{deadlinesData.ongoing_schemes_count}</div>
          <div className="summary-label">Ongoing Schemes</div>
          <div className="summary-icon">♾️</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="deadlines-tabs">
        <button
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          ⏰ Upcoming Deadlines ({deadlinesData.upcoming_deadlines_count})
        </button>
        <button
          className={`tab-button ${activeTab === 'ongoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('ongoing')}
        >
          ♾️ Ongoing Schemes ({deadlinesData.ongoing_schemes_count})
        </button>
      </div>

      {/* Content */}
      <div className="deadlines-content">
        {activeTab === 'upcoming' && (
          <div className="upcoming-deadlines-section">
            <h2>⏳ Upcoming Scheme Deadlines</h2>
            <div className="deadlines-grid">
              {deadlinesData.upcoming_deadlines.map((deadline, index) => (
                <div
                  key={index}
                  className={`deadline-card priority-${deadline.priority}`}
                >
                  <div className="deadline-header">
                    <span className={`priority-badge ${deadline.priority}`}>
                      {deadline.priority.toUpperCase()}
                    </span>
                    <span className="deadline-date">{deadline.deadline}</span>
                  </div>
                  <h3 className="deadline-scheme-name">{deadline.scheme}</h3>
                  <p className="deadline-notes">{deadline.notes}</p>
                  <div className="deadline-footer">
                    <span className="status-badge">{deadline.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ongoing' && (
          <div className="ongoing-schemes-section">
            <h2>♾️ Ongoing Schemes (Year-Round)</h2>
            <div className="schemes-list">
              {deadlinesData.ongoing_schemes.map((scheme, index) => (
                <div key={index} className="scheme-item">
                  <div className="scheme-content">
                    <h4 className="scheme-name">{scheme.scheme}</h4>
                    <p className="scheme-deadline">📅 {scheme.deadline}</p>
                    <p className="scheme-notes">{scheme.notes}</p>
                  </div>
                  <div className="scheme-status">
                    <span className="status-ongoing">ONGOING</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="deadlines-info-box">
        <h3>📝 Important Notes</h3>
        <ul>
          <li>✅ Check state-specific portals for exact dates as they may vary by region</li>
          <li>🔄 Many schemes have rolling windows - apply as soon as possible</li>
          <li>📋 Always verify official scheme websites before applying</li>
          <li>⚠️ Document requirements may change - check updates regularly</li>
          <li>💰 Never pay any charges for government scheme applications</li>
        </ul>
      </div>
    </div>
  );
};

export default DeadlinesPage;
