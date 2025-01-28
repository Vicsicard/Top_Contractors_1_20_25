import { TradeData } from '../types/trade';

export const tradesData: Record<string, TradeData> = {
  "plumber": {
    name: "plumber",
    title: "Plumber",
    metaTitle: "Licensed Plumbers in Denver | Professional Plumbing Services",
    metaDescription: "Find top-rated licensed plumbers in Denver. Our network of professional plumbers provides expert residential and commercial plumbing services.",
    heading: "Expert Plumbing Services in Denver",
    subheading: "Professional Licensed Plumbers for All Your Needs",
    description: "Our network of licensed plumbers in Denver provides comprehensive plumbing services for both residential and commercial properties. From emergency repairs to new installations, our experienced professionals deliver quality workmanship and reliable service.",
    shortDescription: "Professional plumbing services for residential and commercial properties in Denver.",
    icon: "🔧",
    benefits: [
      "24/7 Emergency Services",
      "Licensed & Insured Professionals",
      "Competitive Pricing",
      "Guaranteed Workmanship"
    ],
    services: [
      "Emergency Plumbing Repairs",
      "Drain Cleaning",
      "Water Heater Installation",
      "Pipe Repair & Replacement",
      "Fixture Installation",
      "Sewer Line Services"
    ],
    faqQuestions: [
      {
        question: "How quickly can a plumber arrive for an emergency?",
        answer: "Our emergency plumbing services are available 24/7, and we typically arrive within 1-2 hours for urgent situations."
      },
      {
        question: "Are your plumbers licensed and insured?",
        answer: "Yes, all our plumbers are fully licensed, insured, and have undergone extensive training and background checks."
      }
    ],
    keywords: ["plumber", "plumbing", "drain cleaning", "water heater", "pipe repair", "emergency plumber"],
    category: "plumbing"
  },
  "electrician": {
    name: "electrician",
    title: "Electrician",
    metaTitle: "Licensed Electricians in Denver | Professional Electrical Services",
    metaDescription: "Find certified electricians in Denver, CO. Professional electrical services for residential and commercial properties. Available 24/7 for emergencies.",
    heading: "Licensed Electricians in Denver, CO",
    subheading: "Connect with certified electrical professionals for all your residential and commercial needs",
    description: "Our directory connects you with licensed, insured, and experienced electricians throughout the Denver metropolitan area. From emergency repairs to new installations, our verified professionals deliver quality electrical services.",
    shortDescription: "Certified electricians providing professional electrical services in Denver.",
    icon: "💡",
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
    faqQuestions: [
      {
        question: "What areas of Denver do you serve?",
        answer: "We serve the entire Denver metropolitan area, including downtown Denver, the suburbs, and surrounding cities."
      },
      {
        question: "Do you offer emergency electrical services?",
        answer: "Yes, we offer 24/7 emergency electrical services for urgent situations."
      }
    ],
    keywords: ["electrician", "electrical", "electric", "lighting", "outlet", "switch", "panel"],
    category: "electrical"
  },
  "hvac": {
    name: "hvac",
    title: "HVAC",
    metaTitle: "Denver HVAC Contractors | Heating & Cooling Services",
    metaDescription: "Find trusted HVAC contractors in Denver, CO. Expert heating, cooling, and ventilation services. 24/7 emergency HVAC repairs available.",
    heading: "Denver HVAC Contractors",
    subheading: "Expert heating, cooling, and ventilation services for your home or business",
    description: "Connect with skilled HVAC professionals who understand Denver's unique climate challenges. Our verified contractors provide comprehensive heating, cooling, and ventilation services.",
    shortDescription: "Expert HVAC services for heating, cooling, and ventilation in Denver.",
    icon: "❄️",
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
    faqQuestions: [
      {
        question: "What is the average cost of a new HVAC system?",
        answer: "The average cost of a new HVAC system varies depending on the type and size of the system, but our contractors can provide you with a detailed estimate."
      },
      {
        question: "Do you offer financing options for HVAC services?",
        answer: "Yes, we offer financing options for HVAC services to help make your heating and cooling needs more affordable."
      }
    ],
    keywords: ["hvac", "heating", "cooling", "ventilation", "furnace", "ac", "heat pump"],
    category: "hvac"
  },
  "roofer": {
    name: "roofer",
    title: "Roofer",
    metaTitle: "Denver Roofing Contractors | Professional Roof Services",
    metaDescription: "Find expert roofing contractors in Denver, CO. Professional roof repair, replacement, and installation services. Free estimates available.",
    heading: "Professional Roofing Contractors in Denver, CO",
    subheading: "Expert roofing services for residential and commercial properties",
    description: "Connect with experienced roofing professionals who understand Colorado's unique weather challenges. Our verified contractors provide comprehensive roofing services with quality materials and workmanship.",
    shortDescription: "Expert roofing services for residential and commercial properties in Denver.",
    icon: "🏠",
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
    faqQuestions: [
      {
        question: "What is the average cost of a new roof?",
        answer: "The average cost of a new roof varies depending on the type and size of the roof, but our contractors can provide you with a detailed estimate."
      },
      {
        question: "Do you offer financing options for roofing services?",
        answer: "Yes, we offer financing options for roofing services to help make your roofing needs more affordable."
      }
    ],
    keywords: ["roofer", "roofing", "roof", "shingle", "tile", "metal roof", "flat roof"],
    category: "roofing"
  },
  "carpenter": {
    name: "carpenter",
    title: "Carpenter",
    metaTitle: "Professional Carpenters in Denver | Custom Woodworking & Repairs",
    metaDescription: "Find skilled carpenters in Denver, CO. Expert woodworking, custom carpentry, and repair services for residential and commercial properties.",
    heading: "Professional Carpenters in Denver, CO",
    subheading: "Expert carpentry and woodworking services for your home or business",
    description: "Connect with skilled carpenters who bring craftsmanship and attention to detail to every project. Our verified professionals handle everything from custom woodworking to structural repairs.",
    shortDescription: "Expert carpentry and woodworking services for residential and commercial properties in Denver.",
    icon: "🛠️",
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
    faqQuestions: [
      {
        question: "What types of carpentry services do you offer?",
        answer: "We offer a wide range of carpentry services, including custom woodworking, trim and molding installation, door installation and repair, and more."
      },
      {
        question: "Do you provide free estimates for carpentry services?",
        answer: "Yes, we provide free estimates for all carpentry services."
      }
    ],
    keywords: ["carpenter", "carpentry", "wood", "woodworking", "cabinet", "door", "deck"],
    category: "carpentry"
  },
  "painter": {
    name: "painter",
    title: "Painter",
    metaTitle: "Professional Painters in Denver | Interior & Exterior Painting",
    metaDescription: "Find expert painters in Denver, CO. Quality interior and exterior painting services for residential and commercial properties. Free estimates available.",
    heading: "Professional Painters in Denver, CO",
    subheading: "Expert interior and exterior painting services",
    description: "Connect with skilled painters who deliver beautiful, lasting results. Our verified professionals provide comprehensive painting services with attention to detail and quality materials.",
    shortDescription: "Expert interior and exterior painting services for residential and commercial properties in Denver.",
    icon: "🎨",
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
    faqQuestions: [
      {
        question: "What types of painting services do you offer?",
        answer: "We offer a wide range of painting services, including interior and exterior painting, cabinet painting, deck and fence staining, and more."
      },
      {
        question: "Do you provide free estimates for painting services?",
        answer: "Yes, we provide free estimates for all painting services."
      }
    ],
    keywords: ["painter", "painting", "interior paint", "exterior paint", "wall", "texture"],
    category: "painting"
  },
  "landscaper": {
    name: "landscaper",
    title: "Landscaper",
    metaTitle: "Professional Landscapers in Denver | Lawn & Garden Services",
    metaDescription: "Find expert landscapers in Denver, CO. Professional lawn care, garden design, and landscape maintenance services. Free consultations available.",
    heading: "Professional Landscapers in Denver, CO",
    subheading: "Expert landscape design and maintenance services",
    description: "Connect with skilled landscapers who understand Colorado's unique climate and soil conditions. Our verified professionals create and maintain beautiful outdoor spaces.",
    shortDescription: "Expert landscape design and maintenance services for residential and commercial properties in Denver.",
    icon: "🌳",
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
    faqQuestions: [
      {
        question: "What types of landscaping services do you offer?",
        answer: "We offer a wide range of landscaping services, including landscape design, lawn maintenance, irrigation systems, and more."
      },
      {
        question: "Do you provide free consultations for landscaping services?",
        answer: "Yes, we provide free consultations for all landscaping services."
      }
    ],
    keywords: ["landscaper", "landscaping", "lawn", "garden", "yard", "outdoor", "tree", "shrub"],
    category: "landscaping"
  },
  "home-remodeling": {
    name: "home-remodeling",
    title: "Home Remodeling",
    metaTitle: "Professional Home Remodeling in Denver | Expert Renovation",
    metaDescription: "Find specialized home remodeling contractors in Denver, CO. Expert home renovation services from design to completion. Free estimates available.",
    heading: "Denver Home Remodeling Contractors",
    subheading: "Transform your home with Denver's top remodeling experts",
    description: "Connect with experienced home remodeling contractors in Denver who can turn your vision into reality. Our verified professionals specialize in full home renovations, kitchen remodels, bathroom updates, and more.",
    shortDescription: "Professional home remodeling and renovation services in Denver.",
    icon: "🏠",
    benefits: [
      "Licensed & Insured Contractors",
      "Custom Design Services",
      "Project Management",
      "Quality Craftsmanship",
      "Transparent Pricing"
    ],
    services: [
      "Full Home Renovations",
      "Kitchen Remodeling",
      "Bathroom Remodeling",
      "Basement Finishing",
      "Room Additions",
      "Interior Upgrades"
    ],
    faqQuestions: [
      {
        question: "How long does a typical home remodeling project take?",
        answer: "Project timelines vary based on scope, but most whole-home renovations take 2-4 months. Smaller projects may be completed in 2-6 weeks."
      },
      {
        question: "Do you provide free estimates?",
        answer: "Yes, our contractors provide detailed, free estimates for all home remodeling projects."
      }
    ],
    keywords: ["home remodeling", "renovation", "home improvement", "remodel", "contractor", "denver"],
    category: "remodeling",
    videoUrl: "https://youtu.be/pTKgEtJpGjE"
  },
  "bathroom-remodeling": {
    name: "bathroom-remodeling",
    title: "Bathroom Remodeling",
    metaTitle: "Professional Bathroom Remodeling in Denver | Expert Renovation",
    metaDescription: "Find specialized bathroom remodeling contractors in Denver, CO. Expert bathroom renovation services from design to completion. Free estimates available.",
    heading: "Denver Bathroom Remodeling Contractors",
    subheading: "Transform your bathroom with Denver's top remodeling experts",
    description: "Connect with experienced bathroom remodeling contractors in Denver who can turn your vision into reality. Our verified professionals specialize in complete bathroom renovations with attention to detail.",
    shortDescription: "Professional bathroom remodeling and renovation services in Denver.",
    icon: "🚿",
    benefits: [
      "Licensed & Insured Contractors",
      "Custom Design Services",
      "Project Management",
      "Quality Craftsmanship",
      "Transparent Pricing"
    ],
    services: [
      "Complete Bathroom Remodels",
      "Shower & Tub Installation",
      "Tile Installation",
      "Vanity & Cabinet Updates",
      "Plumbing Fixtures",
      "Lighting Upgrades"
    ],
    faqQuestions: [
      {
        question: "How long does a bathroom remodel typically take?",
        answer: "A typical bathroom remodel takes 2-3 weeks, depending on the scope of work and materials selected."
      },
      {
        question: "Do you provide free estimates?",
        answer: "Yes, our contractors provide detailed, free estimates for all bathroom remodeling projects."
      }
    ],
    keywords: ["bathroom remodeling", "bathroom renovation", "bathroom remodel", "bathroom contractor", "denver"],
    category: "remodeling",
    videoUrl: "https://youtu.be/mTOqRT0unsY"
  },
  "kitchen-remodeling": {
    name: "kitchen-remodeling",
    title: "Kitchen Remodeling",
    metaTitle: "Professional Kitchen Remodeling in Denver | Expert Renovation",
    metaDescription: "Find specialized kitchen remodeling contractors in Denver, CO. Expert kitchen renovation services from design to completion. Free consultations available.",
    heading: "Professional Kitchen Remodeling in Denver, CO",
    subheading: "Expert kitchen renovation and design services",
    description: "Connect with specialized kitchen remodeling contractors who can create your dream kitchen. Our verified professionals handle complete kitchen renovations with quality craftsmanship.",
    shortDescription: "Expert kitchen remodeling services for residential properties in Denver.",
    icon: "🍳",
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
    faqQuestions: [
      {
        question: "What types of kitchen remodeling services do you offer?",
        answer: "We offer a wide range of kitchen remodeling services, including full kitchen renovations, cabinet installation, countertop installation, and more."
      },
      {
        question: "Do you provide free consultations for kitchen remodeling services?",
        answer: "Yes, we provide free consultations for all kitchen remodeling services."
      }
    ],
    keywords: ["kitchen remodeling", "kitchen", "cabinets", "countertop", "appliance", "kitchen renovation"],
    category: "kitchen remodeling"
  },
  "siding-gutters": {
    name: "siding-gutters",
    title: "Siding & Gutters",
    metaTitle: "Professional Siding & Gutter Services in Denver | Installation & Repair",
    metaDescription: "Find expert siding and gutter contractors in Denver, CO. Professional installation and repair services. Free estimates available.",
    heading: "Professional Siding & Gutter Services in Denver, CO",
    subheading: "Expert siding installation and gutter services",
    description: "Connect with experienced siding and gutter professionals who provide quality installation and repairs. Our verified contractors work with all types of siding and gutter materials.",
    shortDescription: "Expert siding and gutter services for residential and commercial properties in Denver.",
    icon: "🏠",
    benefits: [
      "Licensed contractors",
      "Quality materials",
      "Property line expertise",
      "Permit handling",
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
    faqQuestions: [
      {
        question: "What types of siding and gutter services do you offer?",
        answer: "We offer a wide range of siding and gutter services, including siding installation and repair, gutter installation, downspout installation, and more."
      },
      {
        question: "Do you provide free estimates for siding and gutter services?",
        answer: "Yes, we provide free estimates for all siding and gutter services."
      }
    ],
    keywords: ["siding", "gutter", "vinyl siding", "fiber cement", "aluminum", "downspout"],
    category: "siding and gutters"
  },
  "masonry": {
    name: "masonry",
    title: "Masonry",
    metaTitle: "Professional Masonry Services in Denver | Expert Stone & Brick Work",
    metaDescription: "Find skilled masonry contractors in Denver, CO. Expert brick, stone, and concrete services for residential and commercial properties. Free estimates available.",
    heading: "Professional Masonry Services in Denver, CO",
    subheading: "Expert brick, stone, and concrete work",
    description: "Connect with skilled masonry professionals who bring craftsmanship to every project. Our verified contractors handle all types of stone, brick, and concrete work.",
    shortDescription: "Expert masonry services for residential and commercial properties in Denver.",
    icon: "🏗️",
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
    faqQuestions: [
      {
        question: "What types of masonry services do you offer?",
        answer: "We offer a wide range of masonry services, including brick and stone installation, retaining walls, chimney repair, and more."
      },
      {
        question: "Do you provide free estimates for masonry services?",
        answer: "Yes, we provide free estimates for all masonry services."
      }
    ],
    keywords: ["masonry", "brick", "stone", "concrete", "block", "patio", "retaining wall"],
    category: "masonry"
  },
  "decks": {
    name: "decks",
    title: "Decks",
    metaTitle: "Professional Deck Builders in Denver | Custom Deck Services",
    metaDescription: "Find expert deck builders in Denver, CO. Custom deck design, construction, and repair services. Free consultations available.",
    heading: "Professional Deck Builders in Denver, CO",
    subheading: "Expert deck design and construction services",
    description: "Connect with experienced deck builders who create beautiful outdoor living spaces. Our verified contractors provide custom design and quality construction services.",
    shortDescription: "Expert deck services for residential properties in Denver.",
    icon: "🌳",
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
    faqQuestions: [
      {
        question: "What types of deck services do you offer?",
        answer: "We offer a wide range of deck services, including custom deck design, new deck construction, deck repair and restoration, and more."
      },
      {
        question: "Do you provide free consultations for deck services?",
        answer: "Yes, we provide free consultations for all deck services."
      }
    ],
    keywords: ["deck", "patio", "composite deck", "wood deck", "outdoor living"],
    category: "decks"
  },
  "flooring": {
    name: "flooring",
    title: "Flooring",
    metaTitle: "Professional Flooring Services in Denver | Installation & Repair",
    metaDescription: "Find expert flooring contractors in Denver, CO. Professional installation and repair services for all flooring types. Free estimates available.",
    heading: "Professional Flooring Services in Denver, CO",
    subheading: "Expert flooring installation and repair services",
    description: "Connect with skilled flooring professionals who handle all types of flooring materials. Our verified contractors provide quality installation and repair services.",
    shortDescription: "Expert flooring services for residential and commercial properties in Denver.",
    icon: "🛋️",
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
    faqQuestions: [
      {
        question: "What types of flooring services do you offer?",
        answer: "We offer a wide range of flooring services, including hardwood flooring, tile installation, carpet installation, and more."
      },
      {
        question: "Do you provide free estimates for flooring services?",
        answer: "Yes, we provide free estimates for all flooring services."
      }
    ],
    keywords: ["floor", "hardwood", "tile", "carpet", "vinyl", "laminate", "luxury vinyl"],
    category: "flooring"
  },
  "windows": {
    name: "windows",
    title: "Windows",
    metaTitle: "Professional Window Services in Denver | Installation & Repair",
    metaDescription: "Find expert window contractors in Denver, CO. Professional window installation, replacement, and repair services. Free estimates available.",
    heading: "Professional Window Services in Denver, CO",
    subheading: "Expert window installation and replacement services",
    description: "Connect with experienced window professionals who understand energy efficiency and style. Our verified contractors provide quality installation and replacement services.",
    shortDescription: "Expert window services for residential and commercial properties in Denver.",
    icon: "🌆",
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
    faqQuestions: [
      {
        question: "What types of window services do you offer?",
        answer: "We offer a wide range of window services, including window replacement, new window installation, energy efficient windows, and more."
      },
      {
        question: "Do you provide free estimates for window services?",
        answer: "Yes, we provide free estimates for all window services."
      }
    ],
    keywords: ["window", "replacement window", "energy efficient", "double pane", "triple pane"],
    category: "windows"
  },
  "fencing": {
    name: "fencing",
    title: "Fencing",
    metaTitle: "Professional Fence Services in Denver | Installation & Repair",
    metaDescription: "Find expert fence contractors in Denver, CO. Professional fence installation and repair services for all types of fencing. Free estimates available.",
    heading: "Professional Fence Services in Denver, CO",
    subheading: "Expert fence installation and repair services",
    description: "Connect with experienced fence professionals who provide quality installation and repairs. Our verified contractors work with all types of fencing materials.",
    shortDescription: "Expert fence services for residential and commercial properties in Denver.",
    icon: "🚪",
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
    faqQuestions: [
      {
        question: "What types of fence services do you offer?",
        answer: "We offer a wide range of fence services, including wood fence installation, vinyl fencing, chain link fences, and more."
      },
      {
        question: "Do you provide free estimates for fence services?",
        answer: "Yes, we provide free estimates for all fence services."
      }
    ],
    keywords: ["fence", "privacy fence", "wood fence", "vinyl fence", "chain link", "metal fence"],
    category: "fencing"
  },
  "epoxy-garage": {
    name: "epoxy-garage",
    title: "Epoxy Garage",
    metaTitle: "Professional Garage Floor Epoxy in Denver | Expert Installation",
    metaDescription: "Find expert epoxy flooring contractors in Denver, CO. Professional garage floor coating and epoxy services. Free consultations available.",
    heading: "Professional Garage Floor Epoxy in Denver, CO",
    subheading: "Expert garage floor coating and finishing services",
    description: "Connect with specialized epoxy flooring professionals who deliver durable, attractive results. Our verified contractors provide quality garage floor coating services.",
    shortDescription: "Expert epoxy garage services for residential properties in Denver.",
    icon: "🚗",
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
    faqQuestions: [
      {
        question: "What types of epoxy garage services do you offer?",
        answer: "We offer a wide range of epoxy garage services, including epoxy floor coating, floor preparation, concrete repair, and more."
      },
      {
        question: "Do you provide free consultations for epoxy garage services?",
        answer: "Yes, we provide free consultations for all epoxy garage services."
      }
    ],
    keywords: ["epoxy", "garage floor", "floor coating", "concrete coating", "metallic epoxy"],
    category: "epoxy garage"
  }
};
