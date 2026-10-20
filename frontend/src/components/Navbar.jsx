import React, { useState, useEffect } from 'react';
import { 
  Shield, MapPin, Clock, MessageCircle, Sun, Moon, 
  ArrowRight, Menu, X, Sparkles, Lock, Compass, CheckCircle2 
} from 'lucide-react';
import { useTheme } from '../context/useTheme';

export default function Navbar({ onOpenAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { theme, toggleTheme } = useTheme();

  // Scroll detection for compact frosted-glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Determine active section in view
      const sections = ['services', 'portfolio', 'estimator', 'process', 'testimonials'];
      const scrollPosition = window.scrollY + 120;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services & Pricing', href: '#services', id: 'services' },
    { name: 'Completed Sites', href: '#portfolio', id: 'portfolio' },
    { 
      name: 'Cost Estimator', 
      href: '#estimator', 
      id: 'estimator', 
      badge: 'Live Calculator' 
    },
    { name: 'Craft Process', href: '#process', id: 'process' },
    { name: 'Client Reviews', href: '#testimonials', id: 'testimonials' },
  ];

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Top Announcements & Quick Contractor Bar */}
      <div className="bg-[#1c120c] text-stone-300 text-xs py-1.5 px-4 sm:px-6 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          
          {/* Left: Verification Badges */}
          <div className="flex items-center space-x-3 text-[11px] sm:text-xs">
            <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>IS:710 Marine Certified Contractor</span>
            </span>
            <span className="hidden md:inline text-stone-600">&bull;</span>
            <span className="hidden md:flex items-center space-x-1 text-stone-400 hover:text-amber-200 transition-colors">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>Workshop & Timber Yard: Plot 42, Timber Market Yard</span>
            </span>
          </div>

          {/* Right: Operational Status & Direct WhatsApp */}
          <div className="flex items-center space-x-4 text-[11px] sm:text-xs">
            <span className="hidden sm:flex items-center space-x-1 text-stone-400">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Mon–Sat: 8 AM – 8 PM</span>
            </span>
            <a
              href="https://wa.me/919876543210?text=Hi%20Vishwakarma%20Woods%20Work,%20I%20would%20like%20to%20discuss%20an%20interior/carpentry%20project"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-all font-semibold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <MessageCircle className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp: +91 98765 43210</span>
            </a>
          </div>

        </div>
      </div>

      {/* Main Interactive Navigation Bar */}
      <nav 
        className={`w-full transition-all duration-300 backdrop-blur-xl border-b ${
          scrolled 
            ? 'bg-[#faf8f5]/90 dark:bg-[#120b07]/90 py-2.5 shadow-xl border-stone-200/80 dark:border-amber-900/40' 
            : 'bg-[#faf8f5]/95 dark:bg-[#140d08]/95 py-3.5 border-stone-200 dark:border-amber-950/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Brand Logo & Royal Craftsman Seal */}
            <a href="#" className="flex items-center space-x-3 group">
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#3d2313] via-[#24140b] to-[#120a06] border border-amber-500/40 p-0.5 shadow-lg shadow-amber-950/20 group-hover:border-amber-400 transition-all duration-300 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col items-center justify-center z-10 leading-none">
                  <span className="font-serif font-black text-amber-300 text-lg tracking-tight group-hover:scale-110 transition-transform">
                    V
                  </span>
                  <span className="text-[7px] font-mono tracking-widest text-amber-200/90 font-bold uppercase mt-0.5">
                    EST.02
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-50 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    Vishwakarma
                  </span>
                  <span className="font-sans font-light text-stone-500 dark:text-amber-200/70 text-sm sm:text-base">
                    Woods Work
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-[10px] font-medium text-stone-500 dark:text-stone-400 tracking-wider uppercase">
                  <span>Bespoke Joinery</span>
                  <span className="text-amber-500">&bull;</span>
                  <span>Modular Kitchens</span>
                  <span className="text-amber-500">&bull;</span>
                  <span>Turnkey Interiors</span>
                </div>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 bg-stone-100/70 dark:bg-stone-900/50 p-1.5 rounded-full border border-stone-200 dark:border-amber-950/50 shadow-inner">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-white dark:bg-amber-500/20 text-stone-900 dark:text-amber-300 shadow-sm border border-stone-200/80 dark:border-amber-500/40'
                        : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-amber-200 hover:bg-white/60 dark:hover:bg-stone-800/60'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 tracking-normal shadow-xs">
                        ⚡
                      </span>
                    )}
                  </a>
                );
              })}
            </div>

            {/* Desktop Actions & Buttons */}
            <div className="hidden sm:flex items-center space-x-2.5">
              
              {/* Theme Toggle Button (Refined Pill) */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-stone-200 dark:border-amber-900/40 bg-white dark:bg-stone-900/60 text-stone-700 dark:text-amber-300 hover:border-amber-500/40 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all shadow-sm cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-300 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-stone-700 hover:-rotate-12 transition-transform" />
                )}
              </button>

              {/* Contractor Admin Portal Gate */}
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-200 hover:text-stone-950 dark:hover:text-amber-100 transition-all text-xs font-semibold shadow-sm hover:shadow group"
                title="Open Contractor Master Management Dashboard"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Contractor Portal</span>
              </button>

              {/* Primary CTA Button */}
              <a
                href="#estimator"
                className="inline-flex items-center space-x-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[#825936] to-[#603b1e] dark:from-amber-500 dark:to-amber-600 hover:from-[#6b4728] hover:to-[#4e2e14] dark:hover:from-amber-400 dark:hover:to-amber-500 text-white dark:text-stone-950 font-bold text-xs shadow-md shadow-amber-950/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all group"
              >
                <span>Get Rate Estimate</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-200 dark:text-stone-950 group-hover:translate-x-1 transition-transform" />
              </a>

            </div>

            {/* Mobile Hamburger Controls */}
            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-stone-200 dark:border-amber-900/40 bg-white dark:bg-stone-900 text-stone-700 dark:text-amber-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Open Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 border-t border-stone-200 dark:border-amber-900/40 bg-[#faf8f5] dark:bg-[#140d08] px-5 py-4 space-y-2 animate-fadeIn shadow-2xl">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold text-stone-800 dark:text-stone-200 hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-stone-950">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}

            <div className="pt-3 border-t border-stone-200 dark:border-amber-900/40 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 font-semibold text-xs flex items-center justify-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span>Contractor Login & Management Portal</span>
              </button>

              <a
                href="#estimator"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-md"
              >
                <span>Calculate Your Interior Cost Estimate</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
