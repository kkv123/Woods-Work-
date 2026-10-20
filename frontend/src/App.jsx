import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import ProcessSection from './components/ProcessSection';
import PortfolioSection from './components/PortfolioSection';
import CostEstimator from './components/CostEstimator';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AdminLoginModal from './components/AdminLoginModal';
import AdminPortal from './components/AdminPortal';

export default function App() {
  // Support direct URL access via http://localhost:5173/#admin
  const [isAdminView, setIsAdminView] = useState(() => {
    return typeof window !== 'undefined' && window.location.hash === '#admin';
  });
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState(null);

  // Sync hash changes
  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminView(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectServiceForEstimator = (serviceId) => {
    setPreselectedService(serviceId);
    const element = document.getElementById('estimator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExitAdmin = () => {
    setIsAdminView(false);
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  // If contractor logged into Admin Portal
  if (isAdminView) {
    return <AdminPortal onClose={handleExitAdmin} />;
  }

  // Otherwise, render Public Website
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#140d08] text-stone-900 dark:text-[#f6f1e8] flex flex-col font-sans selection:bg-[#ebe2d2] dark:selection:bg-amber-950 selection:text-[#2b1a0e] dark:selection:text-amber-200 transition-colors duration-200">
      {/* Navigation with Theme Switcher & Admin Portal Hook */}
      <Navbar onOpenAdmin={() => setAdminModalOpen(true)} />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Heritage Hero */}
        <Hero onSelectEstimator={() => handleSelectServiceForEstimator('modular-kitchen')} />

        {/* Services & Direct Workshop Rates */}
        <ServicesSection onSelectServiceForEstimator={handleSelectServiceForEstimator} />

        {/* 4-Step Process: Laser Measurement to Handover */}
        <ProcessSection />

        {/* Real Completed Sites & Before/After Inspection */}
        <PortfolioSection />

        {/* Interactive Cost Calculator */}
        <CostEstimator preselectedServiceId={preselectedService} />

        {/* Real Client Reviews */}
        <TestimonialsSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setAdminModalOpen(true)} />

      {/* Floating WhatsApp Contact Button */}
      <WhatsAppButton />

      {/* Admin Portal Modal Trigger */}
      <AdminLoginModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onLoginSuccess={() => setIsAdminView(true)}
      />
    </div>
  );
}
