import React from 'react';
import { ArrowRight, Calculator, CheckCircle2, ShieldCheck, Star, Award, Compass, MessageCircle, MapPin } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

export default function Hero({ onSelectEstimator }) {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-[#faf8f5] dark:bg-[#140d08] border-b border-[#e7e2d9] dark:border-[#382518] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Authentic Craftsman Narrative */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Heritage Badge */}
            <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-md bg-[#ebe2d2] dark:bg-[#2b1f16] border border-[#d9c8b0] dark:border-[#4a3525] text-[#4a2f1b] dark:text-amber-200 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#825936] dark:bg-amber-400" />
              <span>ESTABLISHED 2002 &bull; 24 YEARS OF TRUSTED WOODWORKING</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 dark:text-[#f6f1e8] leading-[1.15] tracking-tight">
              Honest Woodcraft. <br />
              <span className="italic font-normal text-[#825936] dark:text-amber-400">Master Joinery.</span> <br />
              Direct From Our Workshop.
            </h1>

            {/* Grounded Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-sans leading-relaxed max-w-xl">
              We are hands-on woodworking contractors, not brokers. From modular acrylic kitchens and fluted TV lounges to solid Burma teak doors, we manufacture at our own workshop and assemble on your site with millimeter accuracy.
            </p>

            {/* Authentic Workshop Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-medium">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#825936] dark:text-amber-400 flex-shrink-0" />
                <span>100% Calibrated BWP 710 Marine Ply</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#825936] dark:text-amber-400 flex-shrink-0" />
                <span>Kiln-Seasoned CP & Burma Teak</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#825936] dark:text-amber-400 flex-shrink-0" />
                <span>Original Hettich / Blum Soft-Close</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#825936] dark:text-amber-400 flex-shrink-0" />
                <span>10-Year Anti-Termite Written Warranty</span>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                href="#estimator"
                className="inline-flex items-center justify-center space-x-2.5 bg-[#2b1a0e] dark:bg-amber-500 hover:bg-[#4a2f1b] dark:hover:bg-amber-400 text-amber-100 dark:text-stone-950 font-bold px-7 py-3.5 rounded-lg shadow-md transition-all text-sm group"
              >
                <Calculator className="w-4 h-4 text-amber-400 dark:text-stone-950" />
                <span>Estimate Your Carpentry Cost</span>
                <ArrowRight className="w-4 h-4 text-amber-400 dark:text-stone-950 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="https://wa.me/919876543210?text=Hi%20Vishwakarma%20Woods%20Work,%20I%20have%20an%20interior/carpentry%20requirement."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3.5 rounded-lg shadow-sm transition-all text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share Floor Plan on WhatsApp</span>
              </a>
            </div>

            {/* Social proof strip */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#e7e2d9] dark:border-[#382518] text-xs text-stone-600 dark:text-stone-400">
              <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                4.9/5 Rating across 650+ Handed-over Homes & Commercial Sites
              </span>
            </div>

          </div>

          {/* Right Column: Grounded Workshop & Work Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-white dark:bg-[#1f150e] border border-[#e7e2d9] dark:border-[#382518] p-5 shadow-lg space-y-5">
              
              {/* Main Photo with caption */}
              <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900 group">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
                  alt="Finished modular kitchen and woodwork"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-[#2b1a0e]/90 text-amber-200 text-[11px] font-bold px-3 py-1 rounded-md tracking-wider uppercase">
                  Recent Handover &bull; Oct 2026
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-[#140d08]/95 backdrop-blur-sm p-3 rounded-lg border border-stone-200 dark:border-[#382518] text-xs text-stone-700 dark:text-stone-300 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-stone-900 dark:text-[#f6f1e8] block">Villa Kitchen & Fluted Bar Unit</span>
                    <span className="text-stone-500 dark:text-stone-400 text-[11px]">Greenwood Palms &bull; Finished in 18 Days</span>
                  </div>
                  <span className="font-bold text-[#825936] dark:text-amber-400 text-sm">₹2,10,000</span>
                </div>
              </div>

              {/* Contractor Credentials Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-[#f6f1e8] dark:bg-[#291c13] border border-[#ebe2d2] dark:border-[#382518]">
                  <div className="text-2xl font-serif font-black text-[#2b1a0e] dark:text-amber-300">650+</div>
                  <div className="text-xs font-semibold text-stone-700 dark:text-stone-200 mt-0.5">Sites Completed</div>
                  <div className="text-[11px] text-stone-600 dark:text-stone-400">On-time delivery</div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#f6f1e8] dark:bg-[#291c13] border border-[#ebe2d2] dark:border-[#382518]">
                  <div className="text-2xl font-serif font-black text-[#2b1a0e] dark:text-amber-300">24 Yrs</div>
                  <div className="text-xs font-semibold text-stone-700 dark:text-stone-200 mt-0.5">Woodcraft Legacy</div>
                  <div className="text-[11px] text-stone-600 dark:text-stone-400">Family-run workshop</div>
                </div>
              </div>

              {/* Workshop visit invite banner */}
              <div className="p-4 rounded-xl bg-[#2b1a0e] dark:bg-[#291c13] border border-amber-950/40 dark:border-[#4a3525] text-[#f6f1e8] flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                    Visit Our Timber Yard
                  </div>
                  <div className="text-xs text-stone-200 dark:text-stone-300">
                    Inspect raw teak logs & ply before we begin cutting.
                  </div>
                </div>
                <a
                  href="#contact"
                  className="px-3 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors"
                >
                  Location
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
