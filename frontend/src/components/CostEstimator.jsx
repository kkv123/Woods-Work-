import React, { useState, useEffect } from 'react';
import { Calculator, Check, ArrowRight, ShieldCheck, Send, CheckCircle2, MessageCircle, MapPin } from 'lucide-react';
import { SERVICES } from '../data/mockData';
import { api } from '../services/api';

export default function CostEstimator({ preselectedServiceId }) {
  const [selectedServiceId, setSelectedServiceId] = useState(SERVICES[0].id);
  const [projectSize, setProjectSize] = useState(250);
  const [finishTier, setFinishTier] = useState("premium");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quoteRef, setQuoteRef] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    siteLocation: "",
    notes: ""
  });

  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
    }
  }, [preselectedServiceId]);

  const currentService = SERVICES.find(s => s.id === selectedServiceId) || SERVICES[0];

  const tierMultipliers = {
    standard: 1.0,
    premium: 1.35,
    luxury: 1.85
  };

  const calculateEstimate = () => {
    const base = currentService.baseRate;
    const tierFactor = tierMultipliers[finishTier];

    let estimatedTotal = 0;

    if (currentService.pricingModel === "Unit Price") {
      estimatedTotal = base * projectSize * tierFactor;
    } else {
      const scaleFactor = Math.max(0.8, Math.min(2.5, projectSize / 250));
      estimatedTotal = base * scaleFactor * tierFactor;
    }

    const lowEstimate = Math.round(estimatedTotal * 0.92);
    const highEstimate = Math.round(estimatedTotal * 1.12);
    const materialsEstimate = Math.round(estimatedTotal * 0.60);
    const laborEstimate = Math.round(estimatedTotal * 0.40);

    return { lowEstimate, highEstimate, materialsEstimate, laborEstimate };
  };

  const { lowEstimate, highEstimate, materialsEstimate, laborEstimate } = calculateEstimate();

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const generatedCode = "VWW-" + Math.floor(10000 + Math.random() * 90000);
    setQuoteRef(generatedCode);

    try {
      await api.submitQuote({
        quoteReference: generatedCode,
        clientName: formData.name,
        phone: formData.phone,
        siteLocation: formData.siteLocation,
        serviceTitle: currentService.title,
        projectSizeSqFt: projectSize,
        finishTier: finishTier,
        estimatedLow: lowEstimate,
        estimatedHigh: highEstimate,
        notes: formData.notes || "Submitted via website calculator"
      });
    } catch (err) {
      // Fallback
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section id="estimator" className="py-16 lg:py-24 bg-white dark:bg-[#140d08] relative border-b border-[#e7e2d9] dark:border-[#382518] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#ebe2d2] dark:bg-[#2b1f16] border border-[#d9c8b0] dark:border-[#4a3525] text-[#4a2f1b] dark:text-amber-200 text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5 text-[#825936] dark:text-amber-400" />
            <span>Carpentry Rate Calculator</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 dark:text-[#f6f1e8] tracking-tight">
            Calculate Your Estimated Project Cost
          </h2>
          
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            Select your woodwork category, approximate sq ft area, and material specification grade for an instant realistic budget range.
          </p>
        </div>

        {/* Calculator Main Layout */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel (Left - 7 cols) */}
          <div className="lg:col-span-7 bg-[#faf8f5] dark:bg-[#1f150e] border border-[#e7e2d9] dark:border-[#382518] rounded-xl p-6 sm:p-8 space-y-7 shadow-sm text-left">
            
            {/* Step 1: Select Service */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#2b1a0e] dark:bg-amber-500 text-amber-200 dark:text-stone-950 text-xs flex items-center justify-center font-bold">1</span>
                <span>Select Carpentry Category</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedServiceId(s.id)}
                    className={`p-3 rounded-lg text-left border text-xs font-semibold transition-all ${
                      selectedServiceId === s.id
                        ? "bg-[#2b1a0e] dark:bg-amber-500 border-[#2b1a0e] dark:border-amber-500 text-amber-100 dark:text-stone-950 shadow-sm"
                        : "bg-white dark:bg-[#291c13] border-stone-200 dark:border-[#382518] text-stone-700 dark:text-stone-300 hover:border-stone-400 dark:hover:border-stone-600"
                    }`}
                  >
                    <div className="truncate font-bold">{s.title}</div>
                    <div className={`text-[10px] mt-0.5 ${selectedServiceId === s.id ? "text-amber-200 dark:text-stone-900" : "text-stone-500 dark:text-stone-400"}`}>
                      {s.pricingModel}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Area / Size Slider */}
            <div className="space-y-3.5 pt-4 border-t border-stone-200 dark:border-[#382518]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#2b1a0e] dark:bg-amber-500 text-amber-200 dark:text-stone-950 text-xs flex items-center justify-center font-bold">2</span>
                  <span>Approximate Area / Elevation</span>
                </label>
                <span className="text-base font-serif font-bold text-[#2b1a0e] dark:text-amber-300 bg-white dark:bg-[#291c13] px-3 py-1 rounded border border-stone-300 dark:border-[#4a3525]">
                  {projectSize} sq ft
                </span>
              </div>

              <input
                type="range"
                min="60"
                max="1200"
                step="10"
                value={projectSize}
                onChange={(e) => setProjectSize(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#825936] dark:accent-amber-500"
              />

              <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400">
                <span>Compact (60 sq ft)</span>
                <span>Average 2BHK/3BHK (250-450 sq ft)</span>
                <span>Full Villa / Bunglow (1,200 sq ft)</span>
              </div>
            </div>

            {/* Step 3: Material Grade */}
            <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-[#382518]">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#2b1a0e] dark:bg-amber-500 text-amber-200 dark:text-stone-950 text-xs flex items-center justify-center font-bold">3</span>
                <span>Plywood & Hardware Specification Grade</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "standard",
                    title: "Commercial Grade",
                    sub: "IS:303 MR Ply",
                    desc: "Commercial moisture-resistant ply with 0.8mm textured mica & standard soft-close hinges"
                  },
                  {
                    id: "premium",
                    title: "Marine 710 Grade",
                    sub: "BWP + Acrylic (Recommended)",
                    desc: "100% Calibrated BWP Marine Ply, 1.2mm anti-scratch acrylic & Hettich tandem boxes"
                  },
                  {
                    id: "luxury",
                    title: "Bespoke Teak / Veneer",
                    sub: "Burma Teak + PU Polish",
                    desc: "Natural wood veneer / Burma teak with Italian polyurethane matte polish & Blum hardware"
                  }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setFinishTier(tier.id)}
                    className={`p-3.5 rounded-lg text-left border transition-all ${
                      finishTier === tier.id
                        ? "bg-[#2b1a0e] dark:bg-amber-500 text-amber-100 dark:text-stone-950 border-[#2b1a0e] dark:border-amber-400 shadow-md"
                        : "bg-white dark:bg-[#291c13] border-stone-200 dark:border-[#382518] text-stone-700 dark:text-stone-300 hover:border-stone-400 dark:hover:border-stone-600"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>{tier.title}</span>
                      {finishTier === tier.id && <Check className="w-4 h-4 text-amber-400 dark:text-stone-950 stroke-[3]" />}
                    </div>
                    <div className={`text-[10px] font-semibold mt-0.5 ${finishTier === tier.id ? "text-amber-300 dark:text-stone-900" : "text-[#825936] dark:text-amber-400"}`}>
                      {tier.sub}
                    </div>
                    <div className={`text-[11px] mt-1 leading-snug ${finishTier === tier.id ? "text-stone-300 dark:text-stone-800" : "text-stone-600 dark:text-stone-400"}`}>
                      {tier.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Result & Quote Form (Right - 5 cols) */}
          <div className="lg:col-span-5 bg-[#f6f1e8] dark:bg-[#1f150e] border border-[#d9c8b0] dark:border-[#382518] rounded-xl p-6 sm:p-8 space-y-6 shadow-sm text-left">
            
            {/* Live Estimate Header */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#825936] dark:text-amber-400">
                Estimated Workshop Budget
              </div>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-[#2b1a0e] dark:text-[#f6f1e8] mt-1">
                ₹{lowEstimate.toLocaleString('en-IN')} &ndash; ₹{highEstimate.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                Estimated for {currentService.title} ({projectSize} sq ft, {finishTier} specification).
              </p>
            </div>

            {/* Breakdown Bars */}
            <div className="p-3.5 rounded-lg bg-white dark:bg-[#291c13] border border-[#ebe2d2] dark:border-[#382518] space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-600 dark:text-stone-400">Timber, Calibrated Ply & Laminates (~60%):</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">₹{materialsEstimate.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600 dark:text-stone-400">Master Carpenter Labor, Fitting & Polish (~40%):</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">₹{laborEstimate.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 dark:border-[#382518] flex items-center space-x-1.5 text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 flex-shrink-0" />
                <span>Includes 10-Yr Termite & Delamination Warranty.</span>
              </div>
            </div>

            {/* Submission Form or Success State */}
            {submitted ? (
              <div className="p-5 rounded-lg bg-white dark:bg-[#291c13] border border-emerald-300 dark:border-emerald-700 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-serif font-bold text-stone-900 dark:text-white">Site Measurement Request Logged!</h4>
                <div className="text-xs text-stone-600 dark:text-stone-300">
                  Your reference quote code: <strong className="text-[#825936] dark:text-amber-400 font-mono text-sm">{quoteRef}</strong>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Our master carpenter will contact you at <strong className="text-stone-900 dark:text-white">{formData.phone}</strong> to confirm your site address for free laser measurement.
                </p>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/919876543210?text=Hi%20Vishwakarma%20Woods%20Work,%20my%20quote%20reference%20is%20${quoteRef}.%20I%20want%20to%20schedule%20site%20measurement.`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send Code Directly on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote} className="space-y-3 pt-1">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                  Book Free On-Site Measurement:
                </div>

                <div className="space-y-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-white dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#825936] dark:focus:border-amber-500"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile / WhatsApp Number *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-white dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#825936] dark:focus:border-amber-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Site Location (e.g. Greenwood Palms, 5th Block) *"
                    value={formData.siteLocation}
                    onChange={(e) => setFormData({ ...formData, siteLocation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-white dark:bg-[#140d08] border border-stone-300 dark:border-[#382518] text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#825936] dark:focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-lg bg-[#2b1a0e] dark:bg-amber-500 hover:bg-[#4a2f1b] dark:hover:bg-amber-400 text-amber-100 dark:text-stone-950 font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400 dark:text-stone-950" />
                  <span>{submitting ? "Booking Measurement..." : "Lock Rate & Request Site Measurement"}</span>
                </button>

                <p className="text-[11px] text-center text-stone-500 dark:text-stone-400">
                  No obligation &bull; Free laser measurement &bull; Factory direct quote
                </p>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
