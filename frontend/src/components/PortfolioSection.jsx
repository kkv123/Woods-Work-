import React, { useState, useEffect } from 'react';
import { CheckCircle2, Calendar, MapPin, Clock, Layers, Star } from 'lucide-react';
import { COMPLETED_PROJECTS } from '../data/mockData';
import { api } from '../services/api';

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [photoState, setPhotoState] = useState({});
  const [projectsList, setProjectsList] = useState(COMPLETED_PROJECTS);

  // Fetch completed projects live from Supabase backend
  useEffect(() => {
    const fetchLiveProjects = async () => {
      try {
        const data = await api.getProjects();
        if (data && data.length > 0) {
          // Merge or prioritize backend projects that have been completed
          const backendCompleted = data
            .filter(p => p.status === 'COMPLETED')
            .map((p, idx) => ({
              id: p.id || `live-${idx}`,
              title: p.title,
              category: p.category || 'Kitchen & Cabinetry',
              client: p.clientName,
              location: p.siteLocation || 'Prime Site',
              budget: `₹${(p.budget || 0).toLocaleString('en-IN')}`,
              completionDate: p.completionDate || 'Recent',
              highlights: p.highlights ? p.highlights.split(', ') : ['Custom Joinery & Precision Alignment'],
              clientReview: p.clientReview || 'Excellent craftsmanship and delivered on time.',
              beforeImage: COMPLETED_PROJECTS[idx % COMPLETED_PROJECTS.length]?.beforeImage,
              afterImage: COMPLETED_PROJECTS[idx % COMPLETED_PROJECTS.length]?.afterImage
            }));

          if (backendCompleted.length > 0) {
            setProjectsList(backendCompleted);
          }
        }
      } catch (err) {
        // Fallback to initial showcase
      }
    };

    fetchLiveProjects();
  }, []);

  const categories = ["All", "Kitchen & Cabinetry", "Bedroom & Storage", "Living & Interior", "Doors & Partitions", "Outdoor & Terraces"];

  const filteredProjects = activeCategory === "All"
    ? projectsList
    : projectsList.filter(p => p.category === activeCategory);

  const togglePhotoView = (projectId) => {
    setPhotoState(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  return (
    <section id="portfolio" className="py-16 lg:py-24 bg-white dark:bg-[#1f150e] relative border-b border-[#e7e2d9] dark:border-[#382518] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-stone-200 dark:border-[#382518]">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#ebe2d2] dark:bg-[#2b1f16] border border-[#d9c8b0] dark:border-[#4a3525] text-[#4a2f1b] dark:text-amber-200 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#825936] dark:text-amber-400" />
              <span>Real Workmanship on Site</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 dark:text-[#f6f1e8] tracking-tight">
              Recently Handed-Over Sites
            </h2>
            
            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base">
              Every home below was measured, fabricated at our workshop, and installed by our in-house carpenters. Click <strong className="text-[#825936] dark:text-amber-400">"View Site During Construction"</strong> to compare the raw site with the final handover.
            </p>
          </div>

          {/* Quick Counter Box */}
          <div className="flex-shrink-0 p-4 rounded-xl bg-[#f6f1e8] dark:bg-[#291c13] border border-[#ebe2d2] dark:border-[#382518] flex items-center space-x-6">
            <div>
              <div className="text-2xl font-serif font-black text-[#2b1a0e] dark:text-amber-300">650+</div>
              <div className="text-xs font-medium text-stone-600 dark:text-stone-400">Sites Completed</div>
            </div>
            <div className="h-8 w-[1px] bg-[#d9c8b0] dark:bg-[#4a3525]" />
            <div>
              <div className="text-2xl font-serif font-black text-emerald-800 dark:text-emerald-400">99.1%</div>
              <div className="text-xs font-medium text-stone-600 dark:text-stone-400">On-Time Handover</div>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-start gap-2 pt-6 pb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === category
                  ? "bg-[#2b1a0e] dark:bg-amber-500 text-amber-100 dark:text-stone-950 shadow-sm"
                  : "bg-[#faf8f5] dark:bg-[#140d08] text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#291c13] border border-stone-200 dark:border-[#382518]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {filteredProjects.map((project) => {
            const isShowingBefore = photoState[project.id];
            const currentImg = isShowingBefore ? project.beforePhoto : project.afterPhoto;

            return (
              <div
                key={project.id}
                className="rounded-xl bg-[#faf8f5] dark:bg-[#140d08] border border-[#e7e2d9] dark:border-[#382518] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200"
              >
                <div>
                  {/* Photo with Before/After Toggle Overlay */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-200 dark:bg-stone-900 group">
                    <img
                      src={currentImg}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    />

                    {/* Before/After Tag */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded text-xs font-bold tracking-wide shadow-md ${
                          isShowingBefore
                            ? "bg-rose-700 text-white"
                            : "bg-[#2b1a0e] dark:bg-amber-500 text-amber-200 dark:text-stone-950"
                        }`}
                      >
                        {isShowingBefore ? "Raw Site (During Work)" : "Final Handover (Finished)"}
                      </span>
                    </div>

                    {/* Interactive Toggle Button */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => togglePhotoView(project.id)}
                        className="px-3 py-1.5 rounded-lg bg-white/95 dark:bg-[#291c13]/95 hover:bg-white dark:hover:bg-[#332318] text-stone-900 dark:text-stone-100 text-xs font-bold shadow-md border border-stone-300 dark:border-[#4a3525] flex items-center space-x-1.5 transition-all hover:scale-105"
                      >
                        <Layers className="w-3.5 h-3.5 text-[#825936] dark:text-amber-400" />
                        <span>{isShowingBefore ? "Show Handover" : "Compare with Raw Site"}</span>
                      </button>
                    </div>

                    {/* Bottom Specs Ribbon */}
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                      <div className="flex items-center space-x-2.5 bg-white/90 dark:bg-[#140d08]/90 backdrop-blur-sm px-2.5 py-1 rounded border border-stone-200 dark:border-[#382518] text-stone-700 dark:text-stone-300">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-[#825936] dark:text-amber-400" />
                          <span>{project.location}</span>
                        </span>
                        <span className="text-stone-300 dark:text-stone-600">&bull;</span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-[#825936] dark:text-amber-400" />
                          <span>{project.completionDate}</span>
                        </span>
                      </div>

                      <div className="bg-[#2b1a0e] dark:bg-amber-500 text-amber-200 dark:text-stone-950 px-3 py-1 rounded font-serif font-bold text-xs">
                        {project.budget}
                      </div>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-6 space-y-4 text-left">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#825936] dark:text-amber-400 mb-0.5">
                        {project.category} &bull; Client: {project.client}
                      </div>
                      <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-[#f6f1e8] leading-snug">
                        {project.title}
                      </h3>
                    </div>

                    {/* Work Scope Highlights */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                        Carpentry Specs Executed:
                      </div>
                      <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                        {project.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Verified Review */}
                    <div className="p-3.5 rounded-lg bg-white dark:bg-[#1f150e] border border-stone-200 dark:border-[#382518] space-y-1.5">
                      <div className="flex items-center space-x-1 text-amber-500 dark:text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-500 dark:fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-300 italic">
                        "{project.clientReview}"
                      </p>
                      <div className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">
                        &mdash; Verified Client ({project.location})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Bar */}
                <div className="px-6 py-3 bg-[#f6f1e8] dark:bg-[#291c13] border-t border-[#ebe2d2] dark:border-[#382518] flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#825936] dark:text-amber-400" />
                    <span>Duration: {project.duration}</span>
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>10-Yr Termite Warranty Handed Over</span>
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
