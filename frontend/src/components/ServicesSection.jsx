import React, { useState } from 'react';
import { Check, Clock, ArrowRight, Sparkles, Shield, Wrench, MessageCircle } from 'lucide-react';
import { SERVICES } from '../data/mockData';

export default function ServicesSection({ onSelectServiceForEstimator }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Kitchen & Cabinetry", "Bedroom & Storage", "Living & Interior", "Doors & Partitions", "Custom Furniture", "Outdoor & Terraces"];

  const filteredServices = selectedCategory === "All"
    ? SERVICES
    : SERVICES.filter(s => s.category === selectedCategory);

  return (
    <section id="services" className="py-16 lg:py-24 bg-[#faf8f5] dark:bg-[#140d08] relative border-b border-[#e7e2d9] dark:border-[#382518] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#ebe2d2] dark:bg-[#2b1f16] border border-[#d9c8b0] dark:border-[#4a3525] text-[#4a2f1b] dark:text-amber-200 text-xs font-bold tracking-wider uppercase">
            <span>Direct Workshop Price Guide</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 dark:text-[#f6f1e8] tracking-tight">
            Woodwork Services & Transparent Rates
          </h2>
          
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            No middleman design agency markups. Below are our honest workshop rates, material specifications, and exact deliverables.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-8 pb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === category
                  ? "bg-[#2b1a0e] dark:bg-amber-500 text-amber-100 dark:text-stone-950 shadow-sm"
                  : "bg-white dark:bg-[#1f150e] text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-[#f6f1e8] dark:hover:bg-[#291c13] border border-[#e7e2d9] dark:border-[#382518]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="flex flex-col justify-between rounded-xl bg-white dark:bg-[#1f150e] border border-[#e7e2d9] dark:border-[#382518] transition-all duration-200 hover:shadow-lg overflow-hidden group"
            >
              <div>
                {/* Photo with Tag */}
                <div className="relative h-48 overflow-hidden bg-stone-100 dark:bg-stone-900">
                  <img
                    src={service.photo}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {service.popular && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#2b1a0e] dark:bg-amber-500 text-amber-300 dark:text-stone-950 text-[10px] font-bold uppercase tracking-wider shadow">
                      High Demand
                    </div>
                  )}

                  <div className="absolute bottom-2.5 left-3 bg-white/95 dark:bg-[#140d08]/95 backdrop-blur-sm px-2.5 py-1 rounded text-stone-800 dark:text-stone-200 text-[11px] font-bold border border-stone-200 dark:border-[#382518]">
                    {service.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 text-left">
                  <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-[#f6f1e8] group-hover:text-[#825936] dark:group-hover:text-amber-400 transition-colors leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Pricing Box */}
                  <div className="p-3.5 rounded-lg bg-[#f6f1e8] dark:bg-[#291c13] border border-[#ebe2d2] dark:border-[#382518] space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                        {service.pricingModel}:
                      </span>
                      <span className="text-xl font-serif font-black text-[#2b1a0e] dark:text-amber-300">
                        ₹{service.baseRate.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-stone-600 dark:text-stone-400 ml-1">
                          / {service.unit}
                        </span>
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-600 dark:text-stone-400 flex items-center justify-between pt-1 border-t border-[#ebe2d2] dark:border-[#382518]">
                      <span>Typical Range:</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{service.rateRange}</span>
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
                      <span>Timeline:</span>
                      <span className="font-medium text-stone-700 dark:text-stone-300">{service.turnaround}</span>
                    </div>
                  </div>

                  {/* Scope Inclusions */}
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center space-x-1.5">
                      <Wrench className="w-3.5 h-3.5 text-[#825936] dark:text-amber-400" />
                      <span>Specifications Included:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                      {service.whatIsIncluded.slice(0, 4).map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className="leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 mt-3 space-y-2">
                <button
                  onClick={() => onSelectServiceForEstimator(service.id)}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#2b1a0e] dark:bg-amber-500 hover:bg-[#4a2f1b] dark:hover:bg-amber-400 text-amber-100 dark:text-stone-950 font-semibold text-xs transition-all flex items-center justify-center space-x-2"
                >
                  <span>Calculate Cost For This</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 dark:text-stone-950" />
                </button>

                <a
                  href={`https://wa.me/919876543210?text=Hi%20Vishwakarma%20Woods%20Work,%20I%20am%20interested%20in%20${encodeURIComponent(service.title)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-semibold text-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Ask Details on WhatsApp</span>
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* Raw Material Transparency Note */}
        <div className="mt-14 p-6 sm:p-8 rounded-xl bg-white dark:bg-[#1f150e] border border-[#e7e2d9] dark:border-[#382518] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-left">
            <h4 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-[#f6f1e8]">
              Have an architect drawing or CAD floor plan?
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              WhatsApp your 2D/3D elevations to us. We will generate an itemized bill of materials (ply count, hardware list, veneer sq ft) within 24 hours.
            </p>
          </div>
          <a
            href="https://wa.me/919876543210?text=Hi%20Vishwakarma%20Woods%20Work,%20sending%20my%20floor%20plan%20for%20carpentry%20estimate."
            target="_blank"
            rel="noreferrer"
            className="flex-shrink-0 px-5 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Floor Plan (PDF/Image)</span>
          </a>
        </div>

      </div>
    </section>
  );
}
