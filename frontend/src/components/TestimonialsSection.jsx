import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-[#faf8f5] dark:bg-[#140d08] border-b border-[#e7e2d9] dark:border-[#382518] relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#ebe2d2] dark:bg-[#2b1f16] border border-[#d9c8b0] dark:border-[#4a3525] text-[#4a2f1b] dark:text-amber-200 text-xs font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Verified Client Feedback</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-[#f6f1e8] tracking-tight">
            Trusted by 650+ Families & Architects
          </h2>

          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            Read unedited reviews from homeowners, villa owners, and interior designers who trusted our workshop.
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-xl bg-white dark:bg-[#1f150e] border border-[#e7e2d9] dark:border-[#382518] flex flex-col justify-between space-y-4 shadow-sm hover:border-[#825936] dark:hover:border-amber-400 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                  "{t.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-[#2b1f16] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-stone-900 dark:text-[#f6f1e8]">{t.author}</div>
                  <div className="text-stone-500 dark:text-stone-400">{t.role} &bull; {t.city}</div>
                </div>
                <div className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Client</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
