import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Download, Plus, Trash2, Printer, FileText, CheckCircle2, 
  Sparkles, RefreshCw, Eye, Edit3, Building, MapPin, Calendar, 
  PenTool, ArrowUp, ArrowDown, Copy, ListPlus, AlignLeft, 
  Upload, RotateCcw, Check, Briefcase
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function QuotationPdfModal({ isOpen, onClose }) {
  const printRef = useRef(null);
  const sigCanvasRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [entryMode, setEntryMode] = useState('structured'); // 'structured' or 'bulk'

  // -------------------------------------------------------------
  // Official Company Entities Configuration
  // -------------------------------------------------------------
  const COMPANY_ENTITIES = {
    woods_work: {
      id: 'woods_work',
      displayName: 'Vishwakarma Woods Work',
      headerTitle: 'VISHWAKARMA WOODS WORK',
      address: 'Add: S. No. 58, H. No. 6B, 1A/1A/1A, Jadhav Vasti, Mundhwa, Pune - 36',
      email: 'indervish1234@gmail.com',
      gst: '27APHPV6529H1ZC',
      pan: 'APHPV6529H',
      sac: null,
      showSac: false,
      layoutOrder: 'email_first', // Email on line 2, GST & PAN on line 3 (exact scan format)
      signatoryLabel: 'For Vishwakarma Woods Work'
    },
    enterprises: {
      id: 'enterprises',
      displayName: 'Vishwakarma Enterprises',
      headerTitle: 'VISHWAKARMA ENTERPRISES',
      address: 'Add: S. No. 58, H. No. 6B, 1A/1A/1A, Jadhav Vasti, Mundhwa, Pune - 36',
      email: 'indervish1234@gmail.com',
      gst: '27AWUPV4157F1ZT',
      pan: 'AWUPV4157F',
      sac: '995476',
      showSac: true,
      layoutOrder: 'gst_first', // GST & PAN & SAC on line 2, Email on line 3
      signatoryLabel: 'For Vishwakarma Enterprises'
    }
  };

  const [selectedCompanyKey, setSelectedCompanyKey] = useState('woods_work');
  const currentCompany = COMPANY_ENTITIES[selectedCompanyKey];

  // Default values matching the documents
  const [clientName, setClientName] = useState('Kolte Patil Developers Limited');
  const [siteLocation, setSiteLocation] = useState('Main Site');
  
  // Format current date as DD-MM-YYYY
  const getTodayFormatted = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };
  const [quoteDate, setQuoteDate] = useState(getTodayFormatted());

  // Numbering Style: 'twoDigitDot' (01.), 'numberDot' (1.), 'bracket' (1}), 'romanUpper' (I.), 'romanLower' (i.), 'dot' (•)
  const [bulletStyle, setBulletStyle] = useState('twoDigitDot');

  // Bullet Points list (preloaded with sample points from documents)
  const [bulletPoints, setBulletPoints] = useState([
    {
      title: 'Window work Not complete.',
      spec: ''
    },
    {
      title: 'Acid wash not complete.',
      spec: ''
    },
    {
      title: 'First coat Paint not complete.',
      spec: ''
    },
    {
      title: 'Sir Ji यह Readymate Door है , इसको साइट पर कुछ Repairing या touch-up का work नहीं हो पायेगा । इसको change ही करना पड़ेगा ।',
      spec: ''
    },
    {
      title: 'Sir Ji, खाली frame का work नहीं हो पायेगा क्योंकि flooring में 2 या 3mm का variation रहता है इसके लिए frame और Door दोनों साथ में लगाना पड़ता है।',
      spec: ''
    },
    {
      title: 'Frame अभी और दरवाजा बाद में लगाने से quality issue हो सकता है।',
      spec: ''
    }
  ]);

  // Concluding Remarks / Site Condition Note (as shown in Kolte Patil report)
  const [concludingNote, setConcludingNote] = useState(
    'सर जी ऊपर mention condition को ध्यान में रखकर काम नहीं हुआ तो बहुत Damage और Repairing work आ सकता है ।'
  );
  const [showConcludingNote, setShowConcludingNote] = useState(true);

  // Bulk paste text buffer
  const [bulkText, setBulkText] = useState(
`Window work Not complete.

Acid wash not complete.

First coat Paint not complete.`
  );

  const [gstExtra, setGstExtra] = useState(false); // Can be toggled if commercial quotation

  // -------------------------------------------------------------
  // Signature Options State
  // -------------------------------------------------------------
  const [signatureType, setSignatureType] = useState('blank'); // 'blank', 'draw', 'upload', 'type'
  const [drawnSigData, setDrawnSigData] = useState(null);
  const [uploadedSigData, setUploadedSigData] = useState(null);
  const [typedSigName, setTypedSigName] = useState('Inder');
  const [inkColor, setInkColor] = useState('#1e3a8a'); // Blue ink by default
  const [isDrawing, setIsDrawing] = useState(false);

  // Canvas drawing setup
  const startDrawing = (e) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = sigCanvasRef.current;
    if (canvas) {
      setDrawnSigData(canvas.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setDrawnSigData(null);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedSigData(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  // Helper to render text with proper weight hierarchy and optional markdown **bold** support
  const renderFormattedText = (text) => {
    if (!text) return null;
    if (!text.includes('**')) {
      return text;
    }
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-bold text-black">{part.slice(2, -2)}</strong>;
      }
      return <span key={idx}>{part}</span>;
    });
  };

  // Numbering formatter
  const formatBulletNumber = (index) => {
    switch (bulletStyle) {
      case 'twoDigitDot': // 01., 02., 03. (from Kolte Patil scan)
        return `${String(index + 1).padStart(2, '0')}.`;
      case 'numberDot': // 1., 2., 3.
        return `${index + 1}.`;
      case 'bracket': // 1}, 2}, 3} (from Enterprises scan)
        return `${index + 1}}`;
      case 'romanUpper': // I., II., III.
        const romanU = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
        return `${romanU[index] || (index + 1)}.`;
      case 'romanLower': // i., ii., iii.
        const romanL = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii', 'xiii', 'xiv', 'xv'];
        return `${romanL[index] || (index + 1)}.`;
      case 'dot': // •
        return '•';
      default:
        return `${index + 1}.`;
    }
  };

  // Add bullet point
  const handleAddBullet = () => {
    setBulletPoints([
      ...bulletPoints,
      { title: '', spec: '' }
    ]);
  };

  const handleAddPreset = (title, spec) => {
    setBulletPoints([
      ...bulletPoints,
      { title, spec }
    ]);
  };

  const handleUpdateBullet = (index, field, value) => {
    const updated = [...bulletPoints];
    updated[index][field] = value;
    setBulletPoints(updated);
  };

  const handleRemoveBullet = (index) => {
    if (bulletPoints.length === 1) return;
    setBulletPoints(bulletPoints.filter((_, idx) => idx !== index));
  };

  const handleDuplicateBullet = (index) => {
    const itemToCopy = bulletPoints[index];
    const updated = [...bulletPoints];
    updated.splice(index + 1, 0, { ...itemToCopy });
    setBulletPoints(updated);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...bulletPoints];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setBulletPoints(updated);
  };

  const handleMoveDown = (index) => {
    if (index === bulletPoints.length - 1) return;
    const updated = [...bulletPoints];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setBulletPoints(updated);
  };

  const handleApplyBulkText = () => {
    const blocks = bulkText.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
    const parsed = [];

    if (blocks.length > 0) {
      blocks.forEach(block => {
        const blockLines = block.split('\n').map(l => l.trim()).filter(Boolean);
        if (blockLines.length === 1) {
          parsed.push({ title: blockLines[0], spec: '' });
        } else if (blockLines.length >= 2) {
          parsed.push({
            title: blockLines[0],
            spec: blockLines.slice(1).join(' ')
          });
        }
      });
    }

    if (parsed.length > 0) {
      setBulletPoints(parsed);
      setEntryMode('structured');
    }
  };

  // Switch Company Preset Defaults
  const handleCompanyChange = (key) => {
    setSelectedCompanyKey(key);
    setBulletStyle('twoDigitDot'); // Always 01. for all companies per user specification
    if (key === 'woods_work') {
      setClientName('Kolte Patil Developers Limited');
      setSiteLocation('');
      setGstExtra(false);
      setShowConcludingNote(true);
    } else {
      setClientName('Magarpatta Township Development & Construction Company Ltd.');
      setSiteLocation('SEZ North Gate');
      setGstExtra(true);
      setShowConcludingNote(false);
    }
  };

  // Generate & Download PDF
  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setDownloading(true);

    try {
      const element = printRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 3, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const companySlug = currentCompany.displayName.replace(/\s+/g, '_');
      const sanitizedClient = clientName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 15) || 'Quotation';
      pdf.save(`${companySlug}_${sanitizedClient}_${quoteDate}.pdf`);
      setDownloading(false);
    } catch (err) {
      console.error('PDF generation error:', err);
      setDownloading(false);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[96vh] bg-white dark:bg-[#1a120b] border border-stone-300 dark:border-[#382518] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-left my-auto">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-[#2b1c12] bg-stone-50 dark:bg-[#140d08]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/30 text-red-600 flex items-center justify-center">
              <FileText className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-white flex items-center space-x-2">
                <span>Official Letterhead & Quotation Generator</span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Switch between your 2 registered companies with instant A4 PDF export.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="inline-flex items-center space-x-1.5 px-4.5 py-2 rounded-xl bg-[#e31b23] hover:bg-[#c91219] text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {downloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Rendering PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#291c13]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Editor on Left, Live A4 Document on Right */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          
          {/* LEFT: Input Form Controls */}
          <div className="lg:col-span-5 p-5 sm:p-6 space-y-5 border-r border-stone-200 dark:border-[#2b1c12] bg-white dark:bg-[#1a120b] overflow-y-auto max-h-[85vh]">
            
            {/* 1. COMPANY ENTITY SELECTOR (Switch between Woods Work & Enterprises) */}
            <div className="space-y-1.5 p-3 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
              <label className="block text-xs font-black uppercase tracking-wider text-red-900 dark:text-red-300">
                Select Company Letterhead
              </label>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleCompanyChange('woods_work')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedCompanyKey === 'woods_work'
                      ? 'border-red-600 bg-white dark:bg-[#140d08] text-red-600 shadow-sm ring-2 ring-red-500/20'
                      : 'border-stone-300 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-white/60'
                  }`}
                >
                  <div className="text-xs font-black">VISHWAKARMA WOODS WORK</div>
                  <div className="text-[10px] font-mono text-stone-500 mt-0.5">GST: 27APHPV6529H1ZC</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleCompanyChange('enterprises')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedCompanyKey === 'enterprises'
                      ? 'border-red-600 bg-white dark:bg-[#140d08] text-red-600 shadow-sm ring-2 ring-red-500/20'
                      : 'border-stone-300 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-white/60'
                  }`}
                >
                  <div className="text-xs font-black">VISHWAKARMA ENTERPRISES</div>
                  <div className="text-[10px] font-mono text-stone-500 mt-0.5">GST: 27AWUPV4157F1ZT</div>
                </button>
              </div>
            </div>

            {/* Client & Date Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                  To: (Client / Developer Name)
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Kolte Patil Developers Limited"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-[#382518] bg-stone-50 dark:bg-[#140d08] text-stone-900 dark:text-white text-xs focus:ring-2 focus:ring-red-500 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                    Site: (Location / Optional)
                  </label>
                  <input
                    type="text"
                    value={siteLocation}
                    onChange={(e) => setSiteLocation(e.target.value)}
                    placeholder="e.g. SEZ North Gate (leave empty to hide)"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-[#382518] bg-stone-50 dark:bg-[#140d08] text-stone-900 dark:text-white text-xs focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                    Date (Top Right)
                  </label>
                  <input
                    type="text"
                    value={quoteDate}
                    onChange={(e) => setQuoteDate(e.target.value)}
                    placeholder="10-07-2026"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-[#382518] bg-stone-50 dark:bg-[#140d08] text-stone-900 dark:text-white text-xs focus:ring-2 focus:ring-red-500 outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bullet Points Management Section */}
            <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-[#2b1c12]">
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block">
                    Points & Observations ({bulletPoints.length} Items)
                  </label>
                </div>
                
                {/* Switch between Step-by-Step and Bulk Paste */}
                <div className="flex rounded-lg bg-stone-100 dark:bg-[#291c13] p-0.5 border border-stone-200 dark:border-[#382518] text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setEntryMode('structured')}
                    className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
                      entryMode === 'structured'
                        ? 'bg-white dark:bg-[#140d08] text-red-600 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <ListPlus className="w-3 h-3" />
                    <span>Point by Point</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntryMode('bulk')}
                    className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
                      entryMode === 'bulk'
                        ? 'bg-white dark:bg-[#140d08] text-red-600 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <AlignLeft className="w-3 h-3" />
                    <span>Paste Multi-Lines</span>
                  </button>
                </div>
              </div>

              {/* Numbering Style Selector */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-stone-100/80 dark:bg-[#140d08]/80 border border-stone-200 dark:border-[#382518]">
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-300">
                  Numbering Style:
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setBulletStyle('twoDigitDot')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      bulletStyle === 'twoDigitDot'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800'
                    }`}
                    title="01., 02., 03. (From Kolte Patil document)"
                  >
                    01.
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulletStyle('numberDot')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      bulletStyle === 'numberDot'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800'
                    }`}
                    title="Formal Numeric: 1., 2., 3."
                  >
                    1.
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulletStyle('bracket')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      bulletStyle === 'bracket'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800'
                    }`}
                    title="Letterhead Bracket: 1}, 2}, 3}"
                  >
                    1&#125;
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulletStyle('romanUpper')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      bulletStyle === 'romanUpper'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800'
                    }`}
                    title="Formal Roman: I., II., III."
                  >
                    I.
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulletStyle('dot')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      bulletStyle === 'dot'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800'
                    }`}
                    title="Bullet Dot: •"
                  >
                    &bull;
                  </button>
                </div>
              </div>

              {/* MODE 1: STRUCTURED POINT-BY-POINT EDITOR */}
              {entryMode === 'structured' && (
                <div className="space-y-3">
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {bulletPoints.map((item, index) => (
                      <div 
                        key={index} 
                        className="p-3 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50/70 dark:bg-[#140d08]/70 space-y-2 relative group hover:border-red-400 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-200 dark:border-red-900/40">
                            Point {formatBulletNumber(index)}
                          </span>

                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                              className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 disabled:opacity-20 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveDown(index)}
                              disabled={index === bulletPoints.length - 1}
                              className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 disabled:opacity-20 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicateBullet(index)}
                              className="p-1 text-stone-400 hover:text-amber-600 cursor-pointer"
                              title="Duplicate Point"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            {bulletPoints.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveBullet(index)}
                                className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                                title="Delete Point"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <textarea
                            rows={item.title.length > 60 ? 3 : 1}
                            value={item.title}
                            onChange={(e) => handleUpdateBullet(index, 'title', e.target.value)}
                            placeholder={`Enter item or site observation...`}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-[#382518] bg-white dark:bg-[#1a120b] text-stone-900 dark:text-white text-xs font-semibold focus:ring-1 focus:ring-red-500 outline-none leading-relaxed"
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            value={item.spec}
                            onChange={(e) => handleUpdateBullet(index, 'spec', e.target.value)}
                            placeholder="Optional technical specs, rates, or dimensions..."
                            className="w-full px-2.5 py-1 rounded-lg border border-stone-300 dark:border-[#382518] bg-white dark:bg-[#1a120b] text-stone-800 dark:text-stone-300 text-xs focus:ring-1 focus:ring-red-500 outline-none font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddBullet}
                    className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-red-500/40 hover:border-red-600 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100/60 dark:hover:bg-red-950/40 text-red-700 dark:text-red-300 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>+ Add Next Point ({formatBulletNumber(bulletPoints.length)})</span>
                  </button>
                </div>
              )}

              {/* MODE 2: BULK MULTI-LINE PASTE EDITOR */}
              {entryMode === 'bulk' && (
                <div className="space-y-3">
                  <textarea
                    rows="8"
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder="Point 1&#10;&#10;Point 2&#10;&#10;Point 3"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-[#382518] bg-stone-50 dark:bg-[#140d08] text-stone-900 dark:text-white text-xs font-mono leading-relaxed focus:ring-2 focus:ring-red-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyBulkText}
                    className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Convert into Numbered Bullet Points</span>
                  </button>
                </div>
              )}

            </div>

            {/* Concluding Remarks / Site Condition Note (Optional) */}
            <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-[#2b1c12]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showConcludingNote}
                    onChange={(e) => setShowConcludingNote(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span>Include Concluding Condition Note</span>
                </label>
              </div>

              {showConcludingNote && (
                <textarea
                  rows="2"
                  value={concludingNote}
                  onChange={(e) => setConcludingNote(e.target.value)}
                  placeholder="e.g. सर जी ऊपर mention condition को ध्यान में रखकर काम नहीं हुआ तो..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-[#382518] bg-stone-50 dark:bg-[#140d08] text-stone-900 dark:text-white text-xs leading-relaxed focus:ring-2 focus:ring-red-500 outline-none"
                />
              )}
            </div>

            {/* Signature Options */}
            <div className="space-y-3 pt-3 border-t border-stone-200 dark:border-[#2b1c12]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center space-x-1.5">
                  <PenTool className="w-3.5 h-3.5 text-red-600" />
                  <span>Signature Option</span>
                </label>

                <div className="flex rounded-lg bg-stone-100 dark:bg-[#291c13] p-0.5 border border-stone-200 dark:border-[#382518] text-[10px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setSignatureType('blank')}
                    className={`px-2 py-0.5 rounded transition-all ${
                      signatureType === 'blank'
                        ? 'bg-white dark:bg-[#140d08] text-red-600 shadow-xs'
                        : 'text-stone-500'
                    }`}
                  >
                    Leave Blank
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignatureType('draw')}
                    className={`px-2 py-0.5 rounded transition-all ${
                      signatureType === 'draw'
                        ? 'bg-white dark:bg-[#140d08] text-red-600 shadow-xs'
                        : 'text-stone-500'
                    }`}
                  >
                    Draw Pad
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignatureType('upload')}
                    className={`px-2 py-0.5 rounded transition-all ${
                      signatureType === 'upload'
                        ? 'bg-white dark:bg-[#140d08] text-red-600 shadow-xs'
                        : 'text-stone-500'
                    }`}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignatureType('type')}
                    className={`px-2 py-0.5 rounded transition-all ${
                      signatureType === 'type'
                        ? 'bg-white dark:bg-[#140d08] text-red-600 shadow-xs'
                        : 'text-stone-500'
                    }`}
                  >
                    Type Name
                  </button>
                </div>
              </div>

              {signatureType === 'draw' && (
                <div className="space-y-2 p-3 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50/70 dark:bg-[#140d08]/70">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>Draw signature:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setInkColor('#1e3a8a')}
                        className={`w-4 h-4 rounded-full border-2 ${inkColor === '#1e3a8a' ? 'border-amber-500 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: '#1e3a8a' }}
                        title="Blue Ink"
                      />
                      <button
                        type="button"
                        onClick={() => setInkColor('#000000')}
                        className={`w-4 h-4 rounded-full border-2 ${inkColor === '#000000' ? 'border-amber-500 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: '#000000' }}
                        title="Black Ink"
                      />
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="text-[10px] text-red-600 hover:underline flex items-center space-x-0.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-stone-300 dark:border-[#382518] overflow-hidden shadow-inner">
                    <canvas
                      ref={sigCanvasRef}
                      width={380}
                      height={90}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-24 touch-none cursor-crosshair block"
                      style={{ backgroundColor: '#ffffff' }}
                    />
                  </div>
                </div>
              )}

              {signatureType === 'upload' && (
                <div className="space-y-2 p-3 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50/70 dark:bg-[#140d08]/70">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="block w-full text-xs text-stone-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  />
                  {uploadedSigData && (
                    <div className="p-2 bg-white rounded border border-stone-200 flex items-center justify-between">
                      <img src={uploadedSigData} alt="Uploaded signature" className="h-10 object-contain" />
                      <button
                        type="button"
                        onClick={() => setUploadedSigData(null)}
                        className="text-[10px] text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}

              {signatureType === 'type' && (
                <div className="space-y-2 p-3 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50/70 dark:bg-[#140d08]/70">
                  <input
                    type="text"
                    value={typedSigName}
                    onChange={(e) => setTypedSigName(e.target.value)}
                    placeholder="e.g. Inder"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-[#382518] bg-white dark:bg-[#1a120b] text-sm font-serif italic text-blue-900 focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>
              )}
            </div>

            {/* GST Controls */}
            <div className="space-y-3 pt-3 border-t border-stone-200 dark:border-[#2b1c12]">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={gstExtra}
                  onChange={(e) => setGstExtra(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                />
                <span>Include "# GST Extra" clause</span>
              </label>
            </div>

            {/* Bottom Download Trigger */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="w-full py-3 px-4 rounded-xl bg-[#e31b23] hover:bg-[#c91219] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {downloading ? (
                  <span>Generating High-Res A4 PDF...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Official PDF Now</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* RIGHT: Live High-Fidelity A4 Paper Preview */}
          <div className="lg:col-span-7 p-4 sm:p-6 bg-stone-200/70 dark:bg-stone-950 flex flex-col items-center justify-start overflow-y-auto max-h-[85vh]">
            
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Exact Letterhead Preview ({currentCompany.displayName})</span>
            </div>

            {/* Printable A4 Canvas Container */}
            <div 
              ref={printRef}
              className="w-full max-w-[595px] min-h-[842px] bg-white text-black shadow-2xl rounded-xs px-10 py-8 font-sans relative border border-stone-300 text-left select-none flex flex-col justify-between"
              style={{ backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              <div>
                {/* 1. Auspicious Invocation: || श्री || */}
                <div 
                  className="text-center font-bold text-[11px] mb-1 leading-none"
                  style={{ color: '#b91c1c' }}
                >
                  ॥ श्री ॥
                </div>

                {/* 2. Bold Red Company Name (Exact Serif Roman Letterhead Typography from Uploaded Scan) */}
                <div 
                  className="text-center uppercase leading-tight mb-2 whitespace-nowrap overflow-visible"
                  style={{ 
                    color: '#b21016', 
                    fontFamily: "'Times New Roman', 'Georgia', 'Palatino Linotype', serif",
                    fontWeight: 800,
                    fontSize: selectedCompanyKey === 'woods_work' ? '25.5px' : '26px',
                    letterSpacing: '0.02em',
                    wordSpacing: '0.06em'
                  }}
                >
                  {currentCompany.headerTitle}
                </div>

                {/* 3. Address & Tax Info (Exact Letterhead Scale & Compact Print Ratio) */}
                <div 
                  className="text-center text-[10px] leading-tight mb-2 font-sans" 
                  style={{ color: '#000000', fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  <div className="font-normal">
                    {currentCompany.address}
                  </div>
                  
                  {currentCompany.layoutOrder === 'email_first' ? (
                    <>
                      <div className="mt-0.5">
                        <span className="font-bold">Email: </span>
                        <span className="font-normal">{currentCompany.email}</span>
                      </div>
                      <div className="mt-0.5">
                        <span className="font-bold">GST No. : </span>
                        <span className="font-normal">{currentCompany.gst}</span>
                        <span className="inline-block w-8"></span>
                        <span className="font-bold">PAN No. : </span>
                        <span className="font-normal">{currentCompany.pan}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mt-0.5">
                        <span className="font-bold">GST No. : </span>
                        <span className="font-normal">{currentCompany.gst}</span>
                        <span className="inline-block w-4"></span>
                        <span className="font-bold">PAN No. : </span>
                        <span className="font-normal">{currentCompany.pan}</span>
                        <span className="inline-block w-4"></span>
                        {currentCompany.sac && (
                          <>
                            <span className="font-bold">SAC Code : </span>
                            <span className="font-normal">{currentCompany.sac}</span>
                          </>
                        )}
                      </div>
                      <div className="mt-0.5">
                        <span className="font-bold">Email: </span>
                        <span className="font-normal">{currentCompany.email}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* 4. Crisp Black Dividing Rule */}
                <div className="w-full border-b-[2px] border-black mb-3" />

                {/* 5. Date (Right Aligned) */}
                <div className="flex justify-end text-[14px] font-sans font-normal text-black mb-3">
                  <span className="border-b border-black/40 pb-0.5">{quoteDate}</span>
                </div>

                {/* 6. To: and site: details */}
                <div className="space-y-1 text-[14.5px] font-sans text-black mb-5">
                  <div className="leading-snug">
                    <span className="font-semibold text-black">To </span>
                  </div>
                  <div className="leading-snug pl-4">
                    <span className="font-normal text-[15px] text-black">
                      {clientName || 'Kolte Patil Developers Limited'}
                    </span>
                  </div>
                  {siteLocation && (
                    <div className="leading-snug pt-1 pl-4">
                      <span className="font-semibold text-black">Site: </span>
                      <span className="font-normal text-[14.5px] text-black">{siteLocation}</span>
                    </div>
                  )}
                </div>

                {/* 7. Bullet Points List with Balanced Weight Hierarchy */}
                <div className="space-y-3.5 text-[14.5px] font-sans text-black mb-5 pl-1">
                  {bulletPoints.map((item, index) => (
                    <div key={index} className="space-y-0.5">
                      <div className="flex items-start">
                        <span className="font-bold mr-2 text-black select-none min-w-[28px] shrink-0 font-sans text-[15px]">
                          {formatBulletNumber(index)}
                        </span>
                        <span className="font-normal text-black text-[14.5px] leading-relaxed">
                          {renderFormattedText(item.title || '(Enter point description...)')}
                        </span>
                      </div>
                      {item.spec && (
                        <div className="pl-9 text-[13px] font-normal text-stone-600 leading-normal font-sans">
                          {renderFormattedText(item.spec)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 8. Concluding Remarks / Site Condition Note (Exact Natural Flow) */}
                {showConcludingNote && concludingNote && (
                  <div className="text-[14px] font-sans font-normal text-black my-4 leading-relaxed">
                    {renderFormattedText(concludingNote)}
                  </div>
                )}

                {/* 9. Terms: # GST Extra (if enabled) */}
                {gstExtra && (
                  <div className="text-[14px] font-sans font-medium text-black my-4">
                    <span className="border-b border-black pb-0.5 inline-block">
                      # GST Extra
                    </span>
                  </div>
                )}
              </div>

              {/* 10. Signature Block (Right Aligned) */}
              <div className="flex justify-end pt-6 pb-2">
                <div className="text-right min-w-[190px]">
                  
                  {/* Signature Zone Based on Selected Mode */}
                  <div className="h-14 flex items-end justify-end mb-1 relative">
                    
                    {signatureType === 'draw' && drawnSigData && (
                      <img 
                        src={drawnSigData} 
                        alt="Owner Signature" 
                        className="max-h-12 max-w-[160px] object-contain select-none" 
                      />
                    )}

                    {signatureType === 'upload' && uploadedSigData && (
                      <img 
                        src={uploadedSigData} 
                        alt="Owner Signature" 
                        className="max-h-12 max-w-[160px] object-contain select-none" 
                      />
                    )}

                    {signatureType === 'type' && (
                      <span 
                        className="text-2xl font-serif italic tracking-wider select-none font-bold transform -rotate-3 mr-2"
                        style={{ 
                          fontFamily: "'Brush Script MT', 'Dancing Script', 'Caveat', cursive, serif",
                          color: inkColor
                        }}
                      >
                        {typedSigName || 'Inder'}
                      </span>
                    )}

                    {signatureType === 'blank' && (
                      <div className="w-full h-12" />
                    )}
                  </div>

                  <div className="text-xs sm:text-sm font-sans font-semibold text-black">
                    {currentCompany.signatoryLabel}
                  </div>
                  <div className="text-[10px] text-stone-600 uppercase font-sans mt-0.5">
                    (Authorized Signatory)
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
