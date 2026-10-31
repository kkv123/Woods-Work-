import React, { useState, useEffect } from 'react';
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
import { useAuth } from './context/useAuth';

export default function App() {
  const { isAuthenticated } = useAuth();
  const [currentHash, setCurrentHash] = useState(() => (typeof window !== 'undefined' ? window.location.hash : ''));
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState(null);

  // Sync hash changes & protect #admin route
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentHash(hash);
      if (hash === '#admin' && !isAuthenticated) {
        // Intercept unauthorized access: prompt login modal and do not render admin portal
        setAdminModalOpen(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Check initial load
    if (window.location.hash === '#admin' && !isAuthenticated) {
      setAdminModalOpen(true);
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  const handleSelectServiceForEstimator = (serviceId) => {
    setPreselectedService(serviceId);
    const element = document.getElementById('estimator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExitAdmin = () => {
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname);
      setCurrentHash('');
    }
  };

  // Strictly protected: Only render AdminPortal if user is fully authenticated with real JWT token
  if (isAuthenticated && currentHash === '#admin') {
    return <AdminPortal onClose={handleExitAdmin} />;
  }

  // Otherwise, render Public Website
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#140d08] text-stone-900 dark:text-[#f6f1e8] flex flex-col font-sans selection:bg-[#ebe2d2] dark:selection:bg-amber-950 selection:text-[#2b1a0e] dark:selection:text-amber-200 transition-colors duration-200">
      {/* Navigation with Theme Switcher & Admin Portal Hook */}
      <Navbar onOpenAdmin={() => {
        if (isAuthenticated) {
          window.location.hash = '#admin';
          setCurrentHash('#admin');
        } else {
          setAdminModalOpen(true);
        }
      }} />

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
        onLoginSuccess={() => {
          window.location.hash = '#admin';
          setCurrentHash('#admin');
        }}
      />
    </div>
  );
}
