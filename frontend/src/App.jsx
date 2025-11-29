import { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import HomePage from './pages/HomePage';
import CropDiseasePage from './pages/CropDiseasePage';
import SoilHealthPage from './pages/SoilHealthPage';
import IrrigationPage from './pages/IrrigationPage';
import YieldPredictionPage from './pages/YieldPredictionPage';
import PestWeedPage from './pages/PestWeedPage';
import SchemePage from './pages/SchemePage';
import DeadlinesPage from './pages/DeadlinesPage';
import FarmerCalendarPage from './pages/FarmerCalendarPage';
import SeedSelectionPage from './pages/SeedSelectionPage';
import SafetyPage from './pages/SafetyPage';
import InsurancePage from './pages/InsurancePage';
import LoanPage from './pages/LoanPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import NotificationsPage from './pages/NotificationsPage';
import SensorDashboard from './pages/SensorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  useEffect(() => {
    const lang = localStorage.getItem('language') || 'en';
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
            <Route path="/crop-disease" element={<CropDiseasePage />} />
            <Route path="/soil-health" element={<SoilHealthPage />} />
            <Route path="/irrigation" element={<IrrigationPage />} />
            <Route path="/yield-prediction" element={<YieldPredictionPage />} />
            <Route path="/pest-weed" element={<PestWeedPage />} />
            <Route path="/schemes" element={<SchemePage />} />
            <Route path="/deadlines" element={<DeadlinesPage />} />
            <Route path="/calendar" element={<FarmerCalendarPage />} />
            <Route path="/seed-selection" element={<SeedSelectionPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/insurance" element={<InsurancePage />} />
            <Route path="/loan" element={<LoanPage />} />
            <Route path="/sensor-dashboard" element={<SensorDashboard />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Routes>
        </Router>
      </Suspense>
    </I18nextProvider>
  );
}

export default App;
