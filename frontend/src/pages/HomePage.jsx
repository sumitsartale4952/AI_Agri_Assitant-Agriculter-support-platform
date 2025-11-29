import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SnapshotBar from '../components/SnapshotBar';
import RollingAdvertisements from '../components/RollingAdvertisements';
import ModuleGrid from '../components/ModuleGrid';
import AdvertisementStrip from '../components/AdvertisementStrip';
import MarketChart from '../components/MarketChart';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Snapshot Bar - weather, prices, alerts */}
      <SnapshotBar />

      {/* Rolling Advertisements Carousel */}
      <RollingAdvertisements />

      {/* Module Grid - 10 feature cards */}
      <ModuleGrid />

      {/* Advertisement Strip */}
      <AdvertisementStrip />

      {/* Featured Content - Advisories + Market Chart */}
      <MarketChart />

      {/* Footer */}
      <Footer />
    </div>
  );
}
