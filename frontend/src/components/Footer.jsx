import React from 'react';
import { Hammer, Phone, Mail, MapPin, Shield, Clock, MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

export default function Footer({ onOpenAdmin }) {
  return (
    <footer id="contact" className="bg-[#2b1a0e] text-[#f6f1e8] text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-left">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-amber-400 text-[#2b1a0e] flex items-center justify-center font-display font-black text-xl shadow">
                V
              </div>
              <span className="text-xl font-serif font-bold tracking-tight text-white">
                Vishwakarma <span className="font-sans font-light text-amber-200">Woods Work</span>
              </span>
            </div>
            
            <p className="text-stone-300 max-w-sm text-xs leading-relaxed">
              Family-run woodworking & interior contractors since 2002. Specializing in modular kitchens, designer wardrobes, solid teak timber doors, and turnkey residential interiors.
            </p>

            <div className="p-3 rounded-lg bg-[#1a0e07] border border-amber-900/40 text-xs text-stone-300 space-y-1">
              <div className="flex items-center space-x-2 text-amber-300 font-semibold text-[11px]">
                <Shield className="w-3.5 h-3.5" />
                <span>Quality & Compliance</span>
              </div>
              <div className="text-[11px] text-stone-400">{COMPANY_INFO.license}</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Work & Estimations
            </div>
            <ul className="space-y-2 text-xs text-stone-300">
              <li><a href="#services" className="hover:text-amber-300 transition-colors">Modular Kitchen Rates</a></li>
              <li><a href="#services" className="hover:text-amber-300 transition-colors">Designer Wardrobes (Sq Ft)</a></li>
              <li><a href="#services" className="hover:text-amber-300 transition-colors">Solid Burma Teak Doors</a></li>
              <li><a href="#portfolio" className="hover:text-amber-300 transition-colors">Before & After Handover Sites</a></li>
              <li><a href="#estimator" className="hover:text-amber-300 transition-colors">Instant Carpentry Calculator</a></li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="text-amber-300 hover:underline font-semibold"
                >
                  Contractor Portal Login &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Timber & Materials */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Material Standards
            </div>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>Genuine IS:710 BWP Marine Ply</li>
              <li>100% Kiln-Seasoned CP/Burma Teak</li>
              <li>Original Hettich Tandem Boxes</li>
              <li>Blum Austrian Soft-Close Hinges</li>
              <li>1.2mm Anti-Scratch Acrylics</li>
              <li>10-Yr Termite Warranty Policy</li>
            </ul>
          </div>

          {/* Workshop & Contact */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Visit Workshop & Yard
            </div>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-300 mt-0.5 flex-shrink-0" />
                <span>{COMPANY_INFO.address}</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Phone className="w-4 h-4 text-amber-300 mt-0.5 flex-shrink-0" />
                <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-white font-medium">
                  {COMPANY_INFO.phone}
                </a>
              </li>
              <li className="flex items-start space-x-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline font-medium">
                  WhatsApp Direct Support
                </a>
              </li>
              <li className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-amber-300 mt-0.5 flex-shrink-0" />
                <span>{COMPANY_INFO.hours}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-12 border-t border-amber-900/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            &copy; {new Date().getFullYear()} Vishwakarma Woods Work. Registered Interior & Woodworking Contractor.
          </div>
          <div className="flex space-x-6 text-[11px]">
            <span>100% Seasoned Hardwood</span>
            <span>&bull;</span>
            <span>Direct Workshop Fabrications</span>
            <span>&bull;</span>
            <span>GST Invoice Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
