export const COMPANY_INFO = {
  name: "Vishwakarma Woods Work",
  tagline: "Master Woodcraft, Custom Cabinetry & Architectural Interior Contracting",
  license: "Reg. Woodworking & Interior Contractor | 100% Seasoned Hardwood | 10-Yr Termite Warranty",
  phone: "+91 98765 43210",
  whatsapp: "+919876543210",
  email: "contact@vishwakarmawoodswork.com",
  address: "Plot 42, Timber Market Road, Industrial Area",
  hours: "Mon - Sat: 8:00 AM - 8:00 PM (Site Visits Available on Sunday)",
  stats: [
    { label: "Completed Projects", value: "650+" },
    { label: "Years of Craftsmanship", value: "24" },
    { label: "On-Time Handover", value: "99.1%" },
    { label: "Client Satisfaction", value: "4.9 / 5.0" }
  ]
};

export const SERVICES = [
  {
    id: "modular-kitchen",
    title: "Modular Kitchens & Custom Cabinetry",
    category: "Kitchen & Cabinetry",
    icon: "Utensils",
    shortDesc: "BWP marine-grade plywood cabinetry with German soft-close fittings, quartz countertops, and anti-scratch acrylic finishes.",
    pricingModel: "Starting Package",
    baseRate: 65000,
    unit: "standard kitchen setup",
    rateRange: "₹65,000 – ₹2,80,000",
    turnaround: "2 - 3 Weeks",
    popular: true,
    photo: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    whatIsIncluded: [
      "IS:710 Marine Grade Boiling Water Proof (BWP) plywood",
      "German soft-close hinges and tandem box drawers (Blum/Hettich/Hafele)",
      "High-gloss acrylic or 1.2mm anti-scratch laminate shutter finishes",
      "Cutlery organizer, spice pull-out, and under-sink drip tray",
      "On-site precision laser alignment and dust-free assembly",
      "10-Year termite & borer replacement warranty"
    ],
    tierMultiplier: {
      standard: 1.0,
      premium: 1.45,
      luxury: 2.2
    }
  },
  {
    id: "custom-wardrobes",
    title: "Designer Wardrobes & Walk-In Closets",
    category: "Bedroom & Storage",
    icon: "Bath",
    shortDesc: "Floor-to-ceiling sliding or hinged wardrobes with tinted glass profile doors, hydraulic hanging rails, and concealed LED lighting.",
    pricingModel: "Unit Price",
    baseRate: 1200,
    unit: "sq ft front elevation",
    rateRange: "₹1,100 – ₹2,400 / sq ft",
    turnaround: "10 - 15 Days",
    popular: true,
    photo: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=800&q=80",
    whatIsIncluded: [
      "Heavy-duty aluminum slim-profile frame with tinted or fluted glass",
      "Custom internal drawer organizers with velvet jewelry trays",
      "Sensored internal LED profile lighting with warm ambient glow",
      "Hydraulic pull-down hanging lifts for high-ceiling storage",
      "Soft-cushion silent sliding track system"
    ],
    tierMultiplier: {
      standard: 1.0,
      premium: 1.35,
      luxury: 1.9
    }
  },
  {
    id: "wall-paneling",
    title: "Acoustic Fluted Paneling & TV Units",
    category: "Living & Interior",
    icon: "Trees",
    shortDesc: "Architectural charcoal and teak wood fluted wall paneling, floating media consoles with wire-management and stone veneer backdrops.",
    pricingModel: "Unit Price",
    baseRate: 450,
    unit: "sq ft",
    rateRange: "₹400 – ₹950 / sq ft",
    turnaround: "5 - 7 Days",
    popular: true,
    photo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    whatIsIncluded: [
      "Natural teak veneer or charcoal fluted louvers",
      "Waterproof base framing and anti-warp anchoring",
      "Concealed cable raceways for clean zero-wire aesthetic",
      "PU Italian matte or high-gloss clear protective polish",
      "Integrated cove lighting channels"
    ],
    tierMultiplier: {
      standard: 1.0,
      premium: 1.3,
      luxury: 1.75
    }
  },
  {
    id: "solid-doors",
    title: "Solid Teak Doors & Carved Entrances",
    category: "Doors & Partitions",
    icon: "Home",
    shortDesc: "Heavy first-quality CP Teak wood main doors, CNC carved sacred motifs, digital smart lock integration, and matching door frames.",
    pricingModel: "Unit Price",
    baseRate: 38000,
    unit: "main door set with frame",
    rateRange: "₹35,000 – ₹1,20,000",
    turnaround: "1 - 2 Weeks",
    popular: false,
    photo: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    whatIsIncluded: [
      "100% genuine kiln-seasoned Burma/CP Teak wood",
      "5-inch x 3-inch heavy teak door frame (Chowkhat)",
      "Brass or matte black ball-bearing security hinges",
      "Multi-coat melamyne or PU hand-rubbed timber polish",
      "Deadbolt and smart lock precision mortise cutouts"
    ],
    tierMultiplier: {
      standard: 1.0,
      premium: 1.4,
      luxury: 2.1
    }
  },
  {
    id: "wood-furniture",
    title: "Bespoke Dining Sets & Solid Wood Furniture",
    category: "Custom Furniture",
    icon: "Hammer",
    shortDesc: "Handcrafted live-edge dining tables, ergonomic upholstered teak chairs, handcrafted temples (Mandir), and sofa frames.",
    pricingModel: "Package Rate",
    baseRate: 45000,
    unit: "custom dining set / unit",
    rateRange: "₹45,000 – ₹1,60,000",
    turnaround: "2 - 3 Weeks",
    popular: false,
    photo: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
    whatIsIncluded: [
      "Hand-selected timber grain matching (Sheesham, Teak, or White Ash)",
      "Traditional mortise and tenon joinery for generational durability",
      "Moisture-controlled seasoning to eliminate seasonal cracking",
      "High-density ergonomic cushioning and stain-resistant fabric",
      "Stain-resistant heat-proof top seal coat"
    ],
    tierMultiplier: {
      standard: 1.0,
      premium: 1.35,
      luxury: 1.8
    }
  },
  {
    id: "pergola-decking",
    title: "Wooden Pergolas & Outdoor Decking",
    category: "Outdoor & Terraces",
    icon: "Zap",
    shortDesc: "Weatherproof Ipe and Teak wood outdoor decks, poolside planking, terrace pergolas with polycarbonate roofing, and planter benches.",
    pricingModel: "Unit Price",
    baseRate: 350,
    unit: "sq ft",
    rateRange: "₹320 – ₹650 / sq ft",
    turnaround: "1 - 2 Weeks",
    popular: false,
    photo: "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?auto=format&fit=crop&w=800&q=80",
    whatIsIncluded: [
      "Pressure-impregnated weather & UV-resistant exterior timber",
      "Rust-proof SS-304 hidden decking clips",
      "Exterior anti-fungal oil treatment and water-repellent finish",
      "Structural galvanized sub-frame base",
      "5-Year outdoor weatherproofing guarantee"
    ],
    tierMultiplier: {
      standard: 1.0,
      premium: 1.3,
      luxury: 1.7
    }
  }
];

export const COMPLETED_PROJECTS = [
  {
    id: "proj-1",
    title: "Luxury Acrylic Modular Kitchen & Island",
    category: "Kitchen & Cabinetry",
    client: "Rajesh & Meera Sharma",
    location: "Greenwood Palms, Villa 14",
    duration: "18 Days",
    completionDate: "October 2026",
    budget: "₹2,10,000",
    beforePhoto: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80",
    afterPhoto: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    highlights: [
      "Built using 100% Marine Grade 710 ply with anti-bubble pressing",
      "Hettich InnoTech soft-close drawers and pantry tall unit",
      "Seamless PU-coated handleless J-profile edge finish"
    ],
    clientReview: "Vishwakarma Woods Work transformed our kitchen completely. The fit and finish of the drawers and zero-gap alignment is simply world class!"
  },
  {
    id: "proj-2",
    title: "Full-Height Master Bedroom Wardrobe with Fluted Louvers",
    category: "Bedroom & Storage",
    client: "Dr. Ananya Verma",
    location: "Silver Oak Towers",
    duration: "12 Days",
    completionDate: "September 2026",
    budget: "₹1,45,000",
    beforePhoto: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80",
    afterPhoto: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80",
    highlights: [
      "Floor-to-ceiling 9.5ft sliding mechanism with silent German dampers",
      "Integrated sensor-activated profile LED strips inside every bay",
      "Custom walnut veneer finish with protective matte polyurethane coat"
    ],
    clientReview: "Master carpenters! They worked clean, finished on the promised date, and took care of every small detail we asked for."
  },
  {
    id: "proj-3",
    title: "Architectural Teak TV Media Console & Wall Louvers",
    category: "Living & Interior",
    client: "Siddharth & Priya Nair",
    location: "Prestige Boulevard",
    duration: "8 Days",
    completionDate: "August 2026",
    budget: "₹92,000",
    beforePhoto: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
    afterPhoto: "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?auto=format&fit=crop&w=900&q=80",
    highlights: [
      "Fluted natural teak batten paneling with dark acoustic felt backing",
      "Concealed wire raceways and floating storage ledge with rounded corners",
      "Italian PU clear polish showcasing the natural golden teak grain"
    ],
    clientReview: "The craftsmanship of the fluted panels is stunning. Vishwakarma Woods Work has true master artisans."
  },
  {
    id: "proj-4",
    title: "Hand-Carved Teak Main Entrance Door & Chowkhat",
    category: "Doors & Partitions",
    client: "Rameshwar Patel",
    location: "Lakeview Enclave",
    duration: "14 Days",
    completionDate: "July 2026",
    budget: "₹68,000",
    beforePhoto: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=900&q=80",
    afterPhoto: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
    highlights: [
      "Seasoned CP Teak with precision CNC geometric carving and brass inlays",
      "Heavy 45mm solid door core with heavy-duty ball bearing brass hinges",
      "Smart digital biometric fingerprint lock integration"
    ],
    clientReview: "The door is a masterpiece. Everyone entering our home compliments the heavy teak quality and carving."
  },
  {
    id: "proj-5",
    title: "Terrace Wooden Decking & Shaded Pergola",
    category: "Outdoor & Terraces",
    client: "Vikram Malhotra",
    location: "Highland Heights Penthouse",
    duration: "10 Days",
    completionDate: "June 2026",
    budget: "₹1,80,000",
    beforePhoto: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=900&q=80",
    afterPhoto: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=900&q=80",
    highlights: [
      "Weather-treated hardwood decking with hidden fastener clips",
      "Heavy timber posts with UV polycarbonate roof shelter",
      "Custom planter boxes and bench seating integrated into deck"
    ],
    clientReview: "Created a stunning private resort vibe on our terrace. Super solid construction."
  }
];

export const TESTIMONIALS = [
  {
    id: "t1",
    author: "Amitabh Banerjee",
    role: "Architect & Interior Designer",
    city: "City Center",
    rating: 5,
    text: "As an architect, I am very picky about joinery and wood finishing. Vishwakarma Woods Work consistently delivers flawless millimeter precision on every site. Their carpenters are true masters of their trade.",
    date: "1 week ago"
  },
  {
    id: "t2",
    author: "Sunita & Deepak Roy",
    role: "Homeowners",
    city: "Green Valley",
    rating: 5,
    text: "We gave Vishwakarma Woods Work the full interior woodwork contract for our 3BHK—kitchen, wardrobes, TV unit, and doors. They used genuine BWP 710 ply and completed the work in just 28 days without any extra charges.",
    date: "3 weeks ago"
  },
  {
    id: "t3",
    author: "Karan Singhania",
    role: "Villa Owner",
    city: "Palm Springs",
    rating: 5,
    text: "Their instant online cost estimator gave us a very accurate benchmark before they came for site measurement. The final bill matched the quote exactly. Best carpentry contractor in town!",
    date: "1 month ago"
  }
];
