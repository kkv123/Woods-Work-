import React from 'react';
import { Ruler, Trees, Cog, Award } from 'lucide-react';

export default function ProcessSection() {
  const steps = [
    {
      num: "01",
      title: "On-Site Laser Measurement",
      desc: "Our senior carpenter visits your site with laser meters to record accurate wall plumb, ceiling clearances, and electrical switch points.",
      tag: "Free of Cost",
      icon: Ruler
    },
    {
      num: "02",
      title: "Timber & Veneer Selection",
      desc: "Visit our timber yard to inspect raw teak logs and physical laminate/acrylic sample swatches. Zero guesswork from digital photos.",
      tag: "At Our Workshop",
      icon: Trees
    },
    {
      num: "03",
      title: "Precision Factory Fabrication",
      desc: "All carcases are cut on German beam saws and edge-banded with hot-melt adhesive at 200°C for lifetime water seal.",
      tag: "10-15 Days",
      icon: Cog
    },
    {
      num: "04",
      title: "Dust-Free Modular Handover",
      desc: "Pre-fabricated modules are assembled on site with zero messy sawing, followed by Italian PU polish and warranty certificate.",
      tag: "Guaranteed Handover",
      icon: Award
    }
  ];

  return (
    <section id="process" className="py-16 lg:py-24 bg-[#faf8f5] dark:bg-[#140d08] border-b border-[#e7e2d9] dark:border-[#382518] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#ebe2d2] dark:bg-[#2b1f16] border border-[#d9c8b0] dark:border-[#4a3525] text-[#4a2f1b] dark:text-amber-200 text-xs font-bold uppercase tracking-wider">
            <span>Transparent Workflow</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-[#f6f1e8] tracking-tight">
            How We Execute Your Woodwork
          </h2>
          
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base">
            No messy wood cutting in your living room for months. 80% of fabrication happens at our workshop; fast modular assembly happens on your site.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 text-left">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white dark:bg-[#1f150e] border border-[#e7e2d9] dark:border-[#382518] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#825936] dark:hover:border-amber-400 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-serif font-black text-[#825936] dark:text-amber-400">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f6f1e8] dark:bg-[#291c13] text-stone-700 dark:text-stone-300 border border-[#ebe2d2] dark:border-[#382518]">
                      {step.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-stone-900 dark:text-[#f6f1e8]">
                    {step.title}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-[#2b1f16] flex items-center space-x-2 text-xs font-semibold text-[#825936] dark:text-amber-300">
                  <Icon className="w-4 h-4 text-[#825936] dark:text-amber-400" />
                  <span>Step {idx + 1} Milestones</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
