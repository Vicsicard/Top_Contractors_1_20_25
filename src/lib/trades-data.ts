export interface Trade {
    id: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    heading: string;
    subheading: string;
    description: string;
    benefits: string[];
    services: string[];
    regionDescriptions: {
        [key: string]: string;
    };
    keywords?: string[];
}

export const tradesData: Record<string, Trade> = {
  "plumber": {
    id: "plumber",
    title: "Plumber",
    metaTitle: "Licensed Plumbers in Denver | Professional Plumbing Services",
    metaDescription: "Find trusted, licensed plumbers in Denver, CO. Expert plumbing services for residential and commercial properties. Available 24/7 for emergencies.",
    heading: "Licensed Plumbers in Denver, CO",
    subheading: "Connect with experienced plumbing professionals for all your needs",
    description: "Our directory connects you with licensed, insured, and experienced plumbers throughout the Denver metropolitan area. From emergency repairs to new installations, our verified professionals are ready to help.",
    benefits: [
      "Licensed and insured professionals",
      "24/7 emergency services available",
      "Transparent pricing",
      "Verified reviews from local customers",
      "Expertise in residential and commercial plumbing"
    ],
    services: [
      "Emergency leak repair",
      "Water heater installation and repair",
      "Drain cleaning and unclogging",
      "Pipe repair and replacement",
      "Fixture installation",
      "Sewer line services",
      "Bathroom and kitchen remodeling"
    ],
    regionDescriptions: {
      "Central Denver": "Expert plumbers serving downtown Denver and central neighborhoods with 24/7 availability.",
      "East Denver": "Reliable plumbing services in Park Hill and eastern Denver communities.",
      "Denver Suburbs": "Professional plumbing contractors serving the greater Denver metropolitan area."
    },
    keywords: ['plumbing', 'drain', 'sewer', 'water', 'leak', 'pipe', 'faucet', 'toilet', 'sink']
  },
  "electrician": {
    id: "electrician",
    title: "Electrician",
    metaTitle: "Licensed Electricians in Denver | Professional Electrical Services",
    metaDescription: "Find certified electricians in Denver, CO. Professional electrical services for residential and commercial properties. Available 24/7 for emergencies.",
    heading: "Licensed Electricians in Denver, CO",
    subheading: "Connect with certified electrical professionals for all your residential and commercial needs",
    description: "Our directory connects you with licensed, insured, and experienced electricians throughout the Denver metropolitan area. From emergency repairs to new installations, our verified professionals deliver quality electrical services.",
    benefits: [
      "Licensed and certified professionals",
      "24/7 emergency electrical services",
      "Residential and commercial expertise",
      "Up-front pricing and estimates",
      "Fully insured and bonded"
    ],
    services: [
      "Electrical repairs and troubleshooting",
      "Panel upgrades and installations",
      "Lighting installation",
      "Outlet and switch installation",
      "Ceiling fan installation",
      "Home electrical safety inspections",
      "Emergency electrical services"
    ],
    regionDescriptions: {
      "Central Denver": "Expert electricians serving downtown Denver and central neighborhoods with 24/7 availability.",
      "East Denver": "Reliable electrical services in Park Hill and eastern Denver communities.",
      "Denver Suburbs": "Professional electrical contractors serving the greater Denver metropolitan area."
    },
    keywords: ['electrical', 'wiring', 'lighting', 'power', 'circuit', 'outlet', 'breaker', 'panel']
  },
  "hvac": {
    id: "hvac",
    title: "HVAC",
    metaTitle: "Denver HVAC Contractors | Heating & Cooling Services",
    metaDescription: "Find trusted HVAC contractors in Denver, CO. Expert heating, cooling, and ventilation services. 24/7 emergency HVAC repairs available.",
    heading: "Denver HVAC Contractors",
    subheading: "Expert heating, cooling, and ventilation services for your home or business",
    description: "Connect with skilled HVAC professionals who understand Denver's unique climate challenges. Our verified contractors provide comprehensive heating, cooling, and ventilation services.",
    benefits: [
      "NATE-certified technicians",
      "24/7 emergency HVAC service",
      "Seasonal maintenance programs",
      "Energy efficiency experts",
      "Full system warranties"
    ],
    services: [
      "Heating system repair and installation",
      "AC repair and installation",
      "Furnace maintenance",
      "Heat pump services",
      "Ductwork repair and cleaning",
      "Smart thermostat installation",
      "Emergency HVAC repairs"
    ],
    regionDescriptions: {
      "Central Denver": "Experienced HVAC contractors serving downtown Denver with prompt service.",
      "East Denver": "Reliable heating and cooling services for eastern Denver neighborhoods.",
      "Denver Suburbs": "Comprehensive HVAC solutions throughout the Denver metro area."
    },
    keywords: ['heating', 'cooling', 'air conditioning', 'ventilation', 'furnace', 'ac', 'heat', 'duct']
  },
  "roofer": {
    id: "roofer",
    title: "Roofer",
    metaTitle: "Denver Roofing Contractors | Professional Roof Services",
    metaDescription: "Find expert roofing contractors in Denver, CO. Professional roof repair, replacement, and installation services. Free estimates available.",
    heading: "Professional Roofing Contractors in Denver, CO",
    subheading: "Expert roofing services for residential and commercial properties",
    description: "Connect with experienced roofing professionals who understand Colorado's unique weather challenges. Our verified contractors provide comprehensive roofing services with quality materials and workmanship.",
    benefits: [
      "Licensed and insured contractors",
      "Free roof inspections",
      "Storm damage specialists",
      "Quality material warranties",
      "Experienced in all roofing types"
    ],
    services: [
      "Roof repair and replacement",
      "Storm damage repair",
      "Shingle, tile, and metal roofing",
      "Flat roof systems",
      "Gutter installation",
      "Roof inspections",
      "Emergency roof repairs"
    ],
    regionDescriptions: {
      "Central Denver": "Expert roofers serving downtown Denver and historic neighborhoods.",
      "East Denver": "Quality roofing services for eastern Denver communities.",
      "Denver Suburbs": "Comprehensive roofing solutions throughout the Denver metro area."
    },
    keywords: ['roofing', 'roof', 'shingle', 'metal roof', 'tile roof', 'flat roof', 'commercial roof']
  },
  "carpenter": {
    id: "carpenter",
    title: "Carpenter",
    metaTitle: "Professional Carpenters in Denver | Custom Woodworking & Repairs",
    metaDescription: "Find skilled carpenters in Denver, CO. Expert woodworking, custom carpentry, and repair services for residential and commercial properties.",
    heading: "Professional Carpenters in Denver, CO",
    subheading: "Expert carpentry and woodworking services for your home or business",
    description: "Connect with skilled carpenters who bring craftsmanship and attention to detail to every project. Our verified professionals handle everything from custom woodworking to structural repairs.",
    benefits: [
      "Experienced craftsmen",
      "Custom design services",
      "Quality materials",
      "Detailed project planning",
      "Clean and professional work"
    ],
    services: [
      "Custom cabinetry",
      "Trim and molding installation",
      "Door installation and repair",
      "Deck building and repair",
      "Structural carpentry",
      "Custom built-ins",
      "Wood floor installation"
    ],
    regionDescriptions: {
      "Central Denver": "Expert carpenters serving downtown Denver and historic homes.",
      "East Denver": "Quality carpentry services for eastern Denver neighborhoods.",
      "Denver Suburbs": "Professional carpentry solutions throughout the metro area."
    },
    keywords: ['carpentry', 'wood', 'framing', 'trim', 'cabinet', 'door', 'window frame']
  },
  "painter": {
    id: "painter",
    title: "Painter",
    metaTitle: "Professional Painters in Denver | Interior & Exterior Painting",
    metaDescription: "Find expert painters in Denver, CO. Quality interior and exterior painting services for residential and commercial properties. Free estimates available.",
    heading: "Professional Painters in Denver, CO",
    subheading: "Expert interior and exterior painting services",
    description: "Connect with skilled painters who deliver beautiful, lasting results. Our verified professionals provide comprehensive painting services with attention to detail and quality materials.",
    benefits: [
      "Professional color consultation",
      "Quality paint and materials",
      "Detailed preparation work",
      "Clean and efficient service",
      "Satisfaction guaranteed"
    ],
    services: [
      "Interior painting",
      "Exterior painting",
      "Cabinet painting",
      "Deck and fence staining",
      "Wallpaper removal",
      "Texture and drywall repair",
      "Color consultation"
    ],
    regionDescriptions: {
      "Central Denver": "Expert painters serving downtown Denver and historic homes.",
      "East Denver": "Quality painting services for eastern Denver communities.",
      "Denver Suburbs": "Professional painting solutions throughout the metro area."
    },
    keywords: ['painting', 'paint', 'interior paint', 'exterior paint', 'wall', 'texture']
  },
  "landscaper": {
    id: "landscaper",
    title: "Landscaper",
    metaTitle: "Professional Landscapers in Denver | Lawn & Garden Services",
    metaDescription: "Find expert landscapers in Denver, CO. Professional lawn care, garden design, and landscape maintenance services. Free consultations available.",
    heading: "Professional Landscapers in Denver, CO",
    subheading: "Expert landscape design and maintenance services",
    description: "Connect with skilled landscapers who understand Colorado's unique climate and soil conditions. Our verified professionals create and maintain beautiful outdoor spaces.",
    benefits: [
      "Licensed and insured professionals",
      "Drought-resistant design expertise",
      "Seasonal maintenance programs",
      "Eco-friendly practices",
      "Custom design services"
    ],
    services: [
      "Landscape design",
      "Lawn maintenance",
      "Irrigation systems",
      "Tree and shrub care",
      "Hardscape installation",
      "Xeriscaping",
      "Snow removal"
    ],
    regionDescriptions: {
      "Central Denver": "Expert landscapers serving downtown Denver properties.",
      "East Denver": "Quality landscaping services for eastern Denver homes.",
      "Denver Suburbs": "Comprehensive landscape solutions for the metro area."
    },
    keywords: ['landscaping', 'lawn', 'garden', 'yard', 'outdoor', 'tree', 'shrub', 'grass']
  },
  "home-remodeling": {
    id: "home-remodeling",
    title: "Home Remodeling",
    metaTitle: "Professional Home Remodeling in Denver | Full-Service Renovation",
    metaDescription: "Find expert home remodeling contractors in Denver, CO. Complete home renovation services, from design to completion. Free consultations available.",
    heading: "Professional Home Remodeling in Denver, CO",
    subheading: "Comprehensive home renovation and remodeling services",
    description: "Connect with experienced remodeling contractors who can transform your home. Our verified professionals handle complete home renovations with quality craftsmanship.",
    benefits: [
      "Licensed and insured contractors",
      "Project management expertise",
      "Design services available",
      "Quality materials and finishes",
      "Detailed project planning"
    ],
    services: [
      "Full home renovations",
      "Kitchen remodeling",
      "Bathroom remodeling",
      "Basement finishing",
      "Room additions",
      "Interior redesign",
      "Permit handling"
    ],
    regionDescriptions: {
      "Central Denver": "Expert remodelers serving downtown Denver and historic homes.",
      "East Denver": "Quality renovation services for eastern Denver properties.",
      "Denver Suburbs": "Comprehensive remodeling solutions throughout the metro area."
    },
    keywords: ['remodel', 'renovation', 'home improvement', 'contractor', 'construction']
  },
  "bathroom-remodeling": {
    id: "bathroom-remodeling",
    title: "Bathroom Remodeling",
    metaTitle: "Professional Bathroom Remodeling in Denver | Expert Renovation",
    metaDescription: "Find specialized bathroom remodeling contractors in Denver, CO. Expert bathroom renovation services from design to completion. Free estimates available.",
    heading: "Professional Bathroom Remodeling in Denver, CO",
    subheading: "Expert bathroom renovation and design services",
    description: "Connect with specialized bathroom remodeling contractors who can create your perfect space. Our verified professionals handle complete bathroom renovations with attention to detail.",
    benefits: [
      "Specialized bathroom designers",
      "Quality fixtures and materials",
      "Waterproofing expertise",
      "Project management",
      "Clean and efficient work"
    ],
    services: [
      "Full bathroom renovations",
      "Shower and tub installation",
      "Tile installation",
      "Vanity and cabinet installation",
      "Plumbing updates",
      "Lighting installation",
      "Accessibility modifications"
    ],
    regionDescriptions: {
      "Central Denver": "Expert bathroom remodelers serving downtown Denver.",
      "East Denver": "Quality bathroom renovation services for eastern Denver.",
      "Denver Suburbs": "Professional bathroom remodeling throughout the metro area."
    },
    keywords: ['bathroom', 'bath', 'shower', 'vanity', 'tile', 'bathroom renovation']
  },
  "kitchen-remodeling": {
    id: "kitchen-remodeling",
    title: "Kitchen Remodeling",
    metaTitle: "Professional Kitchen Remodeling in Denver | Expert Renovation",
    metaDescription: "Find specialized kitchen remodeling contractors in Denver, CO. Expert kitchen renovation services from design to completion. Free consultations available.",
    heading: "Professional Kitchen Remodeling in Denver, CO",
    subheading: "Expert kitchen renovation and design services",
    description: "Connect with specialized kitchen remodeling contractors who can create your dream kitchen. Our verified professionals handle complete kitchen renovations with quality craftsmanship.",
    benefits: [
      "Custom kitchen design",
      "Quality cabinets and countertops",
      "Project management",
      "3D design visualization",
      "Licensed and insured contractors"
    ],
    services: [
      "Full kitchen renovations",
      "Cabinet installation",
      "Countertop installation",
      "Island design and build",
      "Appliance installation",
      "Lighting design",
      "Plumbing updates"
    ],
    regionDescriptions: {
      "Central Denver": "Expert kitchen remodelers serving downtown Denver.",
      "East Denver": "Quality kitchen renovation services for eastern Denver.",
      "Denver Suburbs": "Professional kitchen remodeling throughout the metro area."
    },
    keywords: ['kitchen', 'cabinets', 'countertop', 'appliance', 'kitchen renovation']
  },
  "siding-gutters": {
    id: "siding-gutters",
    title: "Siding & Gutters",
    metaTitle: "Professional Siding & Gutter Services in Denver | Installation & Repair",
    metaDescription: "Find expert siding and gutter contractors in Denver, CO. Professional installation and repair services. Free estimates available.",
    heading: "Professional Siding & Gutter Services in Denver, CO",
    subheading: "Expert siding installation and gutter services",
    description: "Connect with experienced siding and gutter professionals who understand Colorado's weather challenges. Our verified contractors provide quality installation and repair services.",
    benefits: [
      "Licensed and insured contractors",
      "Quality materials and brands",
      "Storm damage expertise",
      "Proper drainage solutions",
      "Warranty coverage"
    ],
    services: [
      "Siding installation and repair",
      "Gutter installation",
      "Downspout installation",
      "Gutter guards",
      "Vinyl and fiber cement siding",
      "Fascia and soffit repair",
      "Storm damage repair"
    ],
    regionDescriptions: {
      "Central Denver": "Expert siding and gutter services for downtown Denver.",
      "East Denver": "Quality installation services for eastern Denver.",
      "Denver Suburbs": "Comprehensive solutions throughout the metro area."
    },
    keywords: ['siding', 'gutter', 'vinyl siding', 'fiber cement', 'aluminum', 'downspout']
  },
  "masonry": {
    id: "masonry",
    title: "Masonry",
    metaTitle: "Professional Masonry Services in Denver | Expert Stone & Brick Work",
    metaDescription: "Find skilled masonry contractors in Denver, CO. Expert brick, stone, and concrete services for residential and commercial properties. Free estimates available.",
    heading: "Professional Masonry Services in Denver, CO",
    subheading: "Expert brick, stone, and concrete work",
    description: "Connect with skilled masonry professionals who bring craftsmanship to every project. Our verified contractors handle all types of stone, brick, and concrete work.",
    benefits: [
      "Experienced craftsmen",
      "Quality materials",
      "Historic restoration expertise",
      "Custom design services",
      "Structural knowledge"
    ],
    services: [
      "Brick and stone installation",
      "Retaining walls",
      "Chimney repair",
      "Concrete work",
      "Patio construction",
      "Stone veneer installation",
      "Historic restoration"
    ],
    regionDescriptions: {
      "Central Denver": "Expert masons serving downtown Denver and historic properties.",
      "East Denver": "Quality masonry services for eastern Denver.",
      "Denver Suburbs": "Professional masonry throughout the metro area."
    },
    keywords: ['masonry', 'brick', 'stone', 'concrete', 'block', 'patio', 'retaining wall']
  },
  "decks": {
    id: "decks",
    title: "Decks",
    metaTitle: "Professional Deck Builders in Denver | Custom Deck Services",
    metaDescription: "Find expert deck builders in Denver, CO. Custom deck design, construction, and repair services. Free consultations available.",
    heading: "Professional Deck Builders in Denver, CO",
    subheading: "Expert deck design and construction services",
    description: "Connect with experienced deck builders who create beautiful outdoor living spaces. Our verified contractors provide custom design and quality construction services.",
    benefits: [
      "Custom design services",
      "Quality materials",
      "Building code expertise",
      "Proper permitting",
      "Warranty coverage"
    ],
    services: [
      "Custom deck design",
      "New deck construction",
      "Deck repair and restoration",
      "Composite decking",
      "Wood decking",
      "Railings and stairs",
      "Built-in seating"
    ],
    regionDescriptions: {
      "Central Denver": "Expert deck builders serving downtown Denver properties.",
      "East Denver": "Quality deck services for eastern Denver homes.",
      "Denver Suburbs": "Professional deck construction throughout the metro area."
    },
    keywords: ['deck', 'patio', 'composite deck', 'wood deck', 'outdoor living']
  },
  "flooring": {
    id: "flooring",
    title: "Flooring",
    metaTitle: "Professional Flooring Services in Denver | Installation & Repair",
    metaDescription: "Find expert flooring contractors in Denver, CO. Professional installation and repair services for all flooring types. Free estimates available.",
    heading: "Professional Flooring Services in Denver, CO",
    subheading: "Expert flooring installation and repair services",
    description: "Connect with skilled flooring professionals who handle all types of flooring materials. Our verified contractors provide quality installation and repair services.",
    benefits: [
      "Experienced installers",
      "Quality materials",
      "All flooring types",
      "Subfloor expertise",
      "Clean installation process"
    ],
    services: [
      "Hardwood flooring",
      "Tile installation",
      "Carpet installation",
      "Vinyl and LVP",
      "Floor refinishing",
      "Subfloor repair",
      "Commercial flooring"
    ],
    regionDescriptions: {
      "Central Denver": "Expert flooring services for downtown Denver properties.",
      "East Denver": "Quality flooring installation for eastern Denver.",
      "Denver Suburbs": "Professional flooring throughout the metro area."
    },
    keywords: ['floor', 'hardwood', 'tile', 'carpet', 'vinyl', 'laminate', 'luxury vinyl']
  },
  "windows": {
    id: "windows",
    title: "Windows",
    metaTitle: "Professional Window Services in Denver | Installation & Repair",
    metaDescription: "Find expert window contractors in Denver, CO. Professional window installation, replacement, and repair services. Free estimates available.",
    heading: "Professional Window Services in Denver, CO",
    subheading: "Expert window installation and replacement services",
    description: "Connect with experienced window professionals who understand energy efficiency and style. Our verified contractors provide quality installation and replacement services.",
    benefits: [
      "Energy efficiency experts",
      "Quality window brands",
      "Professional installation",
      "Warranty coverage",
      "Style consultation"
    ],
    services: [
      "Window replacement",
      "New window installation",
      "Energy efficient windows",
      "Storm windows",
      "Custom windows",
      "Window repair",
      "Historic window restoration"
    ],
    regionDescriptions: {
      "Central Denver": "Expert window services for downtown Denver properties.",
      "East Denver": "Quality window installation for eastern Denver.",
      "Denver Suburbs": "Professional window services throughout the metro area."
    },
    keywords: ['window', 'replacement window', 'energy efficient', 'double pane', 'triple pane']
  },
  "fencing": {
    id: "fencing",
    title: "Fencing",
    metaTitle: "Professional Fence Services in Denver | Installation & Repair",
    metaDescription: "Find expert fence contractors in Denver, CO. Professional fence installation and repair services for all types of fencing. Free estimates available.",
    heading: "Professional Fence Services in Denver, CO",
    subheading: "Expert fence installation and repair services",
    description: "Connect with experienced fence professionals who provide quality installation and repairs. Our verified contractors work with all types of fencing materials.",
    benefits: [
      "Licensed contractors",
      "Quality materials",
      "Property line expertise",
      "Permit handling",
      "Warranty coverage"
    ],
    services: [
      "Wood fence installation",
      "Vinyl fencing",
      "Chain link fences",
      "Privacy fences",
      "Gate installation",
      "Fence repair",
      "Custom fencing"
    ],
    regionDescriptions: {
      "Central Denver": "Expert fence services for downtown Denver properties.",
      "East Denver": "Quality fence installation for eastern Denver.",
      "Denver Suburbs": "Professional fencing throughout the metro area."
    },
    keywords: ['fence', 'privacy fence', 'wood fence', 'vinyl fence', 'chain link', 'metal fence']
  },
  "epoxy-garage": {
    id: "epoxy-garage",
    title: "Epoxy Garage",
    metaTitle: "Professional Garage Floor Epoxy in Denver | Expert Installation",
    metaDescription: "Find expert epoxy flooring contractors in Denver, CO. Professional garage floor coating and epoxy services. Free consultations available.",
    heading: "Professional Garage Floor Epoxy in Denver, CO",
    subheading: "Expert garage floor coating and finishing services",
    description: "Connect with specialized epoxy flooring professionals who deliver durable, attractive results. Our verified contractors provide quality garage floor coating services.",
    benefits: [
      "Professional preparation",
      "Quality epoxy products",
      "Moisture testing",
      "Proper cure times",
      "Warranty coverage"
    ],
    services: [
      "Epoxy floor coating",
      "Floor preparation",
      "Concrete repair",
      "Custom color options",
      "Anti-slip additives",
      "Decorative flake systems",
      "Clear coat finishing"
    ],
    regionDescriptions: {
      "Central Denver": "Expert epoxy services for downtown Denver properties.",
      "East Denver": "Quality garage floor coating for eastern Denver.",
      "Denver Suburbs": "Professional epoxy throughout the metro area."
    },
    keywords: ['epoxy', 'garage floor', 'floor coating', 'concrete coating', 'metallic epoxy']
  }
};
