import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <aside aria-label="WhatsApp Assistance" className="fixed bottom-6 right-6 z-40 flex items-center group">
      <div className="hidden sm:block mr-3 px-3 py-1.5 rounded-lg bg-[#2b1a0e] text-white text-xs font-medium shadow-lg border border-amber-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Chat with Master Carpenter
      </div>
      <a
        href="https://wa.me/919876543210?text=Hi%20Vishwakarma%20Woods%20Work,%20I%20want%20to%20discuss%20an%20interior/woodwork%20estimate."
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-400/30"
        aria-label="Contact Vishwakarma Woods Work on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white/20" />
      </a>
    </aside>
  );
}
