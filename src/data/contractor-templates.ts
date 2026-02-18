export type TradeSlug = 
  | 'roofers'
  | 'hvac'
  | 'electricians'
  | 'plumbers'
  | 'kitchen-remodelers'
  | 'bathroom-remodelers'
  | 'home-remodelers'
  | 'painters'
  | 'flooring'
  | 'windows'
  | 'decks'
  | 'fencing'
  | 'landscapers'
  | 'masonry'
  | 'siding-gutters'

export interface TradeTemplate {
  specializations: string[]
  projectTypes: string[]
  faqs: { q: string; a: string }[]
  expertiseParagraph: string
  typicalTimeline: string
}

export const TRADE_TEMPLATES: Record<TradeSlug, TradeTemplate> = {
  'roofers': {
    specializations: [
      'Hail damage & insurance claims',
      'Class 4 impact-resistant shingles',
      'Emergency leak repair',
      'Commercial roofing',
      'Historic home restoration',
    ],
    projectTypes: [
      'Roof Replacement',
      'Hail Damage Repair',
      'Roof Inspection & Maintenance',
      'Emergency Leak Repair',
      'Gutter Installation & Repair',
      'Skylight Installation',
      'Roof Ventilation Upgrades',
      'Ice Dam Prevention',
    ],
    expertiseParagraph: `Specializing in Denver's unique roofing challenges, they understand the impact of Colorado's intense UV exposure, hail storms, and temperature extremes on roofing systems. Their expertise includes Class 4 impact-resistant shingle installation, which qualifies homeowners for significant insurance discounts. They work directly with insurance companies to streamline the claims process for storm damage, making roof replacement more affordable for Denver homeowners.`,
    typicalTimeline: 'Most residential roof replacements take 1-3 days depending on size and complexity. Emergency repairs are typically completed within 24-48 hours.',
    faqs: [
      {
        q: 'Are you licensed and insured?',
        a: 'Yes, we are fully licensed and insured to work throughout the Denver metro area, including comprehensive liability and workers compensation coverage.',
      },
      {
        q: 'Do you offer free estimates?',
        a: 'Yes, we provide free, no-obligation estimates for all roofing projects. We can typically schedule an inspection within 2-3 business days.',
      },
      {
        q: 'Do you handle insurance claims?',
        a: 'Yes, we work directly with insurance companies and can assist with the entire claims process for hail and storm damage. We provide detailed documentation to support your claim.',
      },
      {
        q: 'How long does a roof replacement take?',
        a: 'Most residential roof replacements take 1-3 days depending on size, complexity, and weather conditions. We provide a detailed timeline with every estimate.',
      },
      {
        q: 'What roofing materials do you install?',
        a: 'We install all major roofing materials including asphalt shingles (standard and Class 4 impact-resistant), metal roofing, tile, and flat roofing systems.',
      },
      {
        q: 'What is your warranty policy?',
        a: 'We provide comprehensive warranties covering both materials (manufacturer warranty) and workmanship (typically 10+ years). Specific warranty details are included with every estimate.',
      },
      {
        q: 'Do you require a deposit?',
        a: 'We typically require a 10-20% deposit to schedule your project and order materials. Final payment is due upon completion and your satisfaction.',
      },
    ],
  },
  'hvac': {
    specializations: [
      'High-efficiency system upgrades',
      'Smart thermostat integration',
      'Ductwork design & repair',
      'Emergency 24/7 service',
      'Preventive maintenance plans',
    ],
    projectTypes: [
      'Furnace Replacement',
      'AC Installation & Repair',
      'Heat Pump Installation',
      'Duct Cleaning & Sealing',
      'Thermostat Installation',
      'Air Quality Improvements',
      'Emergency HVAC Repair',
      'Preventive Maintenance',
    ],
    expertiseParagraph: `With expertise in Denver's extreme temperature swings—from -10°F winters to 100°F summers—they understand the demands placed on HVAC systems at high altitude. They specialize in properly sized systems using Manual J load calculations, ensuring optimal efficiency and comfort. Their technicians are EPA-certified for refrigerant handling and stay current with the latest high-efficiency technologies, including variable-speed systems and smart home integration.`,
    typicalTimeline: 'HVAC installations typically take 1-2 days. Emergency repairs are prioritized and often completed same-day or within 24 hours.',
    faqs: [
      {
        q: 'Are you licensed and insured?',
        a: 'Yes, we are fully licensed and insured with EPA Section 608 certification for refrigerant handling and comprehensive liability coverage.',
      },
      {
        q: 'Do you offer free estimates?',
        a: 'Yes, we provide free, no-obligation estimates for all HVAC installations and major repairs. We perform a thorough assessment of your home and current system.',
      },
      {
        q: 'Do you offer financing?',
        a: 'Contact us for current financing options and promotional offers on HVAC installations. We work with multiple lenders to provide flexible payment plans.',
      },
      {
        q: 'What brands do you install?',
        a: 'We install major HVAC brands including Carrier, Trane, Lennox, Rheem, and others. We recommend systems based on your specific needs, budget, and home requirements.',
      },
      {
        q: 'Do you provide emergency service?',
        a: 'Yes, we offer emergency HVAC repair services for urgent heating and cooling issues. Contact us for availability and emergency service rates.',
      },
      {
        q: 'How often should I service my HVAC system?',
        a: 'We recommend annual maintenance—spring for AC, fall for furnace. Regular maintenance prevents breakdowns, improves efficiency, and extends system lifespan.',
      },
      {
        q: 'What size HVAC system do I need?',
        a: 'Proper sizing requires a Manual J load calculation based on your home\'s square footage, insulation, windows, and other factors. We never size systems by square footage alone.',
      },
    ],
  },
  'electricians': {
    specializations: [
      'EV charger installation',
      'Panel upgrades (100A→200A)',
      'Smart home wiring',
      'Solar panel integration',
      'Code compliance updates',
    ],
    projectTypes: [
      'Electrical Panel Upgrades',
      'EV Charger Installation',
      'Outlet & Switch Installation',
      'Lighting Installation',
      'Ceiling Fan Installation',
      'Electrical Inspections',
      'Whole-House Rewiring',
      'Generator Installation',
    ],
    expertiseParagraph: `As licensed Colorado electricians, they specialize in the electrical challenges common to Denver homes, including panel upgrades for older properties, EV charger installations, and code compliance updates. They understand Denver's building codes and permit requirements, ensuring all work passes inspection. Their expertise includes modern smart home integration, energy-efficient lighting, and solar panel electrical connections.`,
    typicalTimeline: 'Most electrical projects take 1-3 days. Panel upgrades typically require 1 full day. Emergency repairs are prioritized for same-day service.',
    faqs: [
      {
        q: 'Are you licensed and insured?',
        a: 'Yes, we hold a Colorado Master or Journeyman Electrician license and carry comprehensive liability and workers compensation insurance.',
      },
      {
        q: 'Do you offer free estimates?',
        a: 'Yes, we provide free estimates for most electrical projects. Some diagnostic work may require a service call fee, which is applied to the repair cost.',
      },
      {
        q: 'Do you pull permits?',
        a: 'Yes, we pull all required permits for electrical work and schedule inspections with the city. Permits are required for panel upgrades, new circuits, and most electrical installations.',
      },
      {
        q: 'How much does a panel upgrade cost?',
        a: 'Panel upgrades from 100A to 200A typically cost $2,000-$4,000 depending on complexity and location. We provide detailed estimates after inspecting your current setup.',
      },
      {
        q: 'Can you install an EV charger?',
        a: 'Yes, we specialize in EV charger installation including Level 2 chargers. Installation typically costs $800-$2,500 depending on distance from panel and electrical capacity.',
      },
      {
        q: 'Do you provide emergency service?',
        a: 'Yes, we offer emergency electrical services for urgent issues like power outages, burning smells, or sparking outlets. Safety is our top priority.',
      },
      {
        q: 'What is your warranty policy?',
        a: 'We provide a warranty on all labor, typically 1-3 years depending on the project. Electrical components carry manufacturer warranties.',
      },
    ],
  },
  'plumbers': {
    specializations: [
      'Sewer line replacement',
      'Tankless water heaters',
      'Water softener systems',
      'Emergency service',
      'Repiping specialists',
    ],
    projectTypes: [
      'Water Heater Replacement',
      'Sewer Line Repair',
      'Drain Cleaning',
      'Fixture Installation',
      'Repiping',
      'Sump Pump Installation',
      'Gas Line Work',
      'Emergency Plumbing',
    ],
    expertiseParagraph: `Specializing in Denver's unique plumbing challenges, they understand the impact of hard water on pipes and fixtures, the importance of proper winterization, and the complexities of older home plumbing systems. Their expertise includes modern solutions like tankless water heaters, water softener systems, and trenchless sewer line replacement. They're equipped to handle both routine maintenance and emergency situations with professionalism and efficiency.`,
    typicalTimeline: 'Most plumbing projects take 1-2 days. Water heater replacements typically take 4-6 hours. Emergency repairs are prioritized for same-day service.',
    faqs: [
      {
        q: 'Are you licensed and insured?',
        a: 'Yes, we hold a Colorado Master or Journeyman Plumber license and carry comprehensive liability and workers compensation insurance.',
      },
      {
        q: 'Do you offer free estimates?',
        a: 'Yes, we provide free estimates for most plumbing projects. Emergency service calls may have a diagnostic fee that is applied to the repair cost.',
      },
      {
        q: 'Do you provide emergency service?',
        a: 'Yes, we offer 24/7 emergency plumbing services for urgent issues like burst pipes, sewage backups, and major leaks. Emergency rates apply for after-hours service.',
      },
      {
        q: 'How much does water heater replacement cost?',
        a: 'Tank water heaters typically cost $1,200-$3,500 installed. Tankless water heaters cost $2,500-$5,000. We provide detailed estimates based on your specific needs.',
      },
      {
        q: 'Do you handle sewer line issues?',
        a: 'Yes, we specialize in sewer line diagnosis, repair, and replacement including trenchless methods. We use camera inspection to accurately identify issues.',
      },
      {
        q: 'What is your warranty policy?',
        a: 'We provide warranties on labor (typically 1-2 years) and pass through manufacturer warranties on fixtures and equipment. Specific warranty details are provided with each estimate.',
      },
      {
        q: 'Do you install water softeners?',
        a: 'Yes, we install and service water softener systems. Denver\'s hard water can damage pipes and fixtures, and a water softener provides significant benefits.',
      },
    ],
  },
  'kitchen-remodelers': {
    specializations: [
      'Luxury kitchen design',
      'Open-concept conversions',
      'Custom cabinetry',
      'Historic home kitchens',
      'Eco-friendly materials',
    ],
    projectTypes: [
      'Full Kitchen Remodel',
      'Cabinet Refacing',
      'Countertop Installation',
      'Kitchen Island Addition',
      'Backsplash Installation',
      'Appliance Installation',
      'Lighting Upgrades',
      'Flooring Installation',
    ],
    expertiseParagraph: `With extensive experience in Denver kitchen remodeling, they understand the unique challenges of working with older homes, managing permits through Denver's building department, and coordinating multiple trades. Their expertise includes space planning, material selection, and project management to ensure your kitchen remodel stays on schedule and within budget. They work with trusted local suppliers and subcontractors to deliver quality results.`,
    typicalTimeline: 'Full kitchen remodels typically take 8-12 weeks from demolition to completion. Minor updates can be completed in 2-4 weeks.',
    faqs: [
      {
        q: 'Are you licensed and insured?',
        a: 'Yes, we are a licensed general contractor with comprehensive liability insurance and workers compensation coverage for all team members.',
      },
      {
        q: 'Do you offer free estimates?',
        a: 'Yes, we provide free initial consultations and detailed estimates for all kitchen remodeling projects.',
      },
      {
        q: 'How long does a kitchen remodel take?',
        a: 'Full kitchen remodels typically take 8-12 weeks. Minor updates take 2-4 weeks. Timeline depends on scope, material availability, and permit processing.',
      },
      {
        q: 'Do you handle permits?',
        a: 'Yes, we handle all required permits for electrical, plumbing, and structural work. Permit costs are included in our detailed estimates.',
      },
      {
        q: 'Can I see examples of your work?',
        a: 'Yes, we maintain a portfolio of completed projects and can provide references from recent clients. We\'re happy to share examples during your consultation.',
      },
      {
        q: 'What is your payment schedule?',
        a: 'We typically require 10-20% deposit to start, with progress payments tied to project milestones. Final payment is due upon completion and your satisfaction.',
      },
      {
        q: 'Do you offer design services?',
        a: 'Yes, we provide design consultation and can work with your existing plans or help you develop a complete kitchen design that fits your style and budget.',
      },
    ],
  },
  'bathroom-remodelers': {
    specializations: [
      'Luxury bathroom design',
      'Accessible bathroom conversions',
      'Custom tile work',
      'Master suite additions',
      'Waterproofing specialists',
    ],
    projectTypes: [
      'Full Bathroom Remodel',
      'Shower & Tub Installation',
      'Vanity Installation',
      'Tile Installation',
      'Bathroom Addition',
      'Accessibility Upgrades',
      'Fixture Replacement',
      'Ventilation Improvements',
    ],
    expertiseParagraph: `Specializing in Denver bathroom remodeling, they understand the critical importance of proper waterproofing, ventilation, and moisture management in Colorado's dry climate. Their expertise includes custom tile work, modern fixture installation, and creating spa-like spaces that combine beauty with functionality. They coordinate all aspects of bathroom remodeling including plumbing, electrical, tile, and finish work.`,
    typicalTimeline: 'Full bathroom remodels typically take 3-6 weeks from demolition to completion. Minor updates can be completed in 1-2 weeks.',
    faqs: [
      {
        q: 'Are you licensed and insured?',
        a: 'Yes, we are a licensed general contractor with comprehensive liability insurance and workers compensation coverage.',
      },
      {
        q: 'Do you offer free estimates?',
        a: 'Yes, we provide free consultations and detailed estimates for all bathroom remodeling projects.',
      },
      {
        q: 'How long does a bathroom remodel take?',
        a: 'Full bathroom remodels typically take 3-6 weeks. Minor updates take 1-2 weeks. Timeline depends on scope and material availability.',
      },
      {
        q: 'Do you handle permits?',
        a: 'Yes, we handle all required permits for plumbing, electrical, and structural work. Permit costs are included in our estimates.',
      },
      {
        q: 'What is the most important part of a bathroom remodel?',
        a: 'Proper waterproofing is critical. We use cement board and waterproofing membranes behind all tile to prevent mold and water damage.',
      },
      {
        q: 'Can you work with my existing layout?',
        a: 'Yes, keeping the existing plumbing layout significantly reduces costs. We can also redesign the layout if you want to optimize the space.',
      },
      {
        q: 'What is your payment schedule?',
        a: 'We typically require 10-20% deposit to start, with progress payments tied to milestones. Final payment is due upon completion.',
      },
    ],
  },
  'home-remodelers': {
    specializations: [
      'Whole-home renovations',
      'Home additions',
      'Basement finishing',
      'Historic home restoration',
      'Multi-room remodels',
    ],
    projectTypes: [
      'Whole-Home Remodel',
      'Home Additions',
      'Basement Finishing',
      'Second Story Additions',
      'Kitchen & Bath Remodel',
      'Open Floor Plan Conversions',
      'Exterior Renovations',
      'Structural Repairs',
    ],
    expertiseParagraph: `As experienced general contractors in Denver, they specialize in complex remodeling projects that require coordination of multiple trades, permits, and timelines. Their expertise includes structural modifications, historic home renovations, and creating modern open-concept spaces while respecting Denver's building codes and architectural character. They manage every aspect of your remodel from design through final inspection.`,
    typicalTimeline: 'Whole-home remodels typically take 6-12 months. Kitchen/bathroom remodels take 2-4 months. Additions take 4-8 months depending on scope.',
    faqs: [
      {
        q: 'Are you licensed and insured?',
        a: 'Yes, we are a licensed general contractor with comprehensive liability insurance and workers compensation for all team members and subcontractors.',
      },
      {
        q: 'Do you offer free estimates?',
        a: 'Yes, we provide free initial consultations. Detailed estimates and design work may require a small fee that is credited toward your project.',
      },
      {
        q: 'How long does a major remodel take?',
        a: 'Timelines vary significantly by scope. Kitchen/bathroom remodels: 2-4 months. Whole-home remodels: 6-12 months. Additions: 4-8 months.',
      },
      {
        q: 'Do you handle all permits and inspections?',
        a: 'Yes, we handle all required permits and coordinate all inspections with the city. This is included in our project management services.',
      },
      {
        q: 'Should I move out during a major remodel?',
        a: 'For whole-home remodels, most homeowners move out. For kitchen/bathroom remodels, you can usually stay but expect significant disruption.',
      },
      {
        q: 'How do you handle change orders?',
        a: 'We have a clear change order process. Any changes to scope are documented in writing with cost and timeline impacts before proceeding.',
      },
      {
        q: 'What is your payment schedule?',
        a: 'Payment schedules are tied to project milestones. We typically require 10-20% to start, with progress payments throughout the project.',
      },
    ],
  },
  'painters': {
    specializations: [
      'Exterior painting (UV-resistant)',
      'Interior color consultation',
      'Cabinet refinishing',
      'Deck & fence staining',
      'Commercial painting',
    ],
    projectTypes: [
      'Exterior House Painting',
      'Interior Painting',
      'Cabinet Painting',
      'Deck & Fence Staining',
      'Trim & Door Painting',
      'Drywall Repair',
      'Color Consultation',
      'Commercial Painting',
    ],
    expertiseParagraph: `Specializing in Denver's challenging climate, they understand the importance of proper surface preparation and using premium paints that withstand Colorado's intense UV exposure and temperature extremes. Their expertise includes color consultation, meticulous prep work, and professional application techniques that ensure a flawless, long-lasting finish. They use premium brands like Sherwin-Williams and Benjamin Moore for superior durability.`,
    typicalTimeline: 'Exterior painting typically takes 3-7 days depending on home size and condition. Interior painting takes 2-5 days for an average home.',
    faqs: [
      {
        q: 'Are you licensed and insured?',
        a: 'Yes, we are fully licensed and insured with comprehensive liability coverage to protect your property.',
      },
      {
        q: 'Do you offer free estimates?',
        a: 'Yes, we provide free, detailed estimates for all painting projects. We can typically schedule an estimate within 2-3 business days.',
      },
      {
        q: 'What paint brands do you use?',
        a: 'We primarily use premium paints from Sherwin-Williams and Benjamin Moore. These brands offer superior coverage, durability, and color retention.',
      },
      {
        q: 'How do you prep surfaces?',
        a: 'Surface prep is 70% of a quality paint job. We clean, scrape, sand, prime, caulk, and patch as needed to ensure a smooth, long-lasting finish.',
      },
      {
        q: 'What is the best time to paint exterior in Denver?',
        a: 'Late spring through early fall (May-September) is ideal. We avoid painting when temperatures drop below 50°F or during monsoon season.',
      },
      {
        q: 'How long will the paint last?',
        a: 'Quality exterior paint lasts 7-10 years in Denver with proper prep and premium paint. Interior paint lasts 10-15 years in most areas.',
      },
      {
        q: 'Do I need to be home while you work?',
        a: 'Not necessarily. Most painters can work independently once you approve colors and scope. Many homeowners leave during the day.',
      },
    ],
  },
  'flooring': {
    specializations: [
      'Hardwood installation & refinishing',
      'Luxury vinyl plank (LVP)',
      'Tile installation',
      'Subfloor repair',
      'Commercial flooring',
    ],
    projectTypes: [
      'Hardwood Installation',
      'LVP Installation',
      'Tile Installation',
      'Carpet Installation',
      'Hardwood Refinishing',
      'Subfloor Repair',
      'Stairs & Landing',
      'Commercial Flooring',
    ],
    expertiseParagraph: `With expertise in Denver's dry climate, they understand the importance of proper acclimation for wood products and moisture management for all flooring types. Their team includes certified installers for major brands, ensuring proper installation techniques and warranty compliance. They specialize in both residential and commercial projects, handling everything from subfloor preparation to final trim installation.`,
    typicalTimeline: 'Most residential flooring installations take 2-5 days depending on square footage and material. Hardwood requires 2-3 days acclimation before installation.',
    faqs: [
      {
        q: 'Are you licensed and insured?',
        a: 'Yes, we are fully licensed and insured with comprehensive liability coverage.',
      },
      {
        q: 'Do you offer free estimates?',
        a: 'Yes, we provide free in-home estimates including material samples and detailed pricing.',
      },
      {
        q: 'What is the best flooring for Denver homes?',
        a: 'Engineered hardwood is ideal for living areas (more stable in dry climate). LVP is best for basements and wet areas. Tile works well for bathrooms and kitchens.',
      },
      {
        q: 'How long does flooring installation take?',
        a: 'Most residential installs take 2-5 days depending on square footage. Hardwood needs 2-3 days acclimation before installation.',
      },
      {
        q: 'Do you move furniture?',
        a: 'Most contractors charge a fee for furniture moving ($100-$300). Some include it in the quote. We confirm this during your estimate.',
      },
      {
        q: 'What is your warranty policy?',
        a: 'We provide installation warranties (typically 1-5 years) and pass through manufacturer warranties on materials.',
      },
      {
        q: 'Do you handle subfloor issues?',
        a: 'Yes, proper subfloor preparation is critical. We handle leveling, moisture testing, and repairs as needed.',
      },
    ],
  },
  'windows': {
    specializations: [
      'Energy-efficient replacements',
      'Historic window restoration',
      'Custom window installation',
      'Commercial windows',
      'Egress window installation',
    ],
    projectTypes: [
      'Window Replacement',
      'New Window Installation',
      'Egress Windows',
      'Bay & Bow Windows',
      'Sliding Glass Doors',
      'Storm Windows',
      'Window Repair',
      'Commercial Windows',
    ],
    expertiseParagraph: `Specializing in Denver's climate challenges, they understand the importance of proper window specs for Colorado's temperature extremes and high-altitude UV exposure. Their expertise includes energy-efficient window selection, proper installation with flashing and air sealing, and ensuring compliance with Denver building codes. They're certified installers for major brands including Andersen, Pella, and Marvin.`,
    typicalTimeline: 'Most residential window replacements take 1-2 days for a full house (10-15 windows). Individual windows can be replaced in 1-2 hours.',
    faqs: [
      {
        q: 'Are you licensed and insured?',
        a: 'Yes, we are fully licensed and insured with comprehensive liability and workers compensation coverage.',
      },
      {
        q: 'Do you offer free estimates?',
        a: 'Yes, we provide free in-home consultations with window samples and detailed pricing.',
      },
      {
        q: 'What window specs should I look for in Denver?',
        a: 'Look for U-factor 0.30 or lower, SHGC 0.25-0.35, Low-E coating, and argon gas fill. We provide detailed spec recommendations for your home.',
      },
      {
        q: 'How long does window replacement take?',
        a: 'Most full-house replacements (10-15 windows) take 1-2 days. Individual windows can be replaced in 1-2 hours.',
      },
      {
        q: 'Do I need a permit for window replacement?',
        a: 'Generally no for like-for-like replacement. Yes if changing window size or opening. We verify and pull permits if needed.',
      },
      {
        q: 'What is your warranty policy?',
        a: 'We provide installation warranties (typically 5-10 years) and pass through manufacturer warranties on windows.',
      },
      {
        q: 'What brands do you install?',
        a: 'We install major brands including Andersen, Pella, Marvin, and others. We recommend windows based on your budget and performance needs.',
      },
    ],
  },
  'decks': {
    specializations: [
      'Composite decking (Trex, TimberTech)',
      'Multi-level deck design',
      'Deck repair & restoration',
      'Custom railings',
      'Covered deck structures',
    ],
    projectTypes: [
      'New Deck Construction',
      'Deck Repair',
      'Deck Refinishing',
      'Railing Installation',
      'Deck Expansion',
      'Covered Decks',
      'Multi-Level Decks',
      'Deck Lighting',
    ],
    expertiseParagraph: `With extensive experience building decks in Denver's climate, they understand the importance of proper construction techniques for Colorado's temperature swings and UV exposure. Their expertise includes composite decking installation, proper ledger board attachment, code-compliant railings, and structural design that withstands Denver's weather. They're certified installers for Trex and TimberTech composite decking systems.`,
    typicalTimeline: 'Most residential decks take 1-2 weeks from start to finish. Complex designs or large decks can take 3-4 weeks.',
    faqs: [
      {
        q: 'Are you licensed and insured?',
        a: 'Yes, we are fully licensed and insured with comprehensive liability and workers compensation coverage.',
      },
      {
        q: 'Do you offer free estimates?',
        a: 'Yes, we provide free design consultations and detailed estimates for all deck projects.',
      },
      {
        q: 'What is the best decking material for Denver?',
        a: 'Composite (Trex, TimberTech) is best for Denver. It handles UV exposure better than wood, requires no maintenance, and lasts 25-30 years.',
      },
      {
        q: 'Do I need a permit to build a deck?',
        a: 'Yes, Denver requires permits for all decks over 200 sq ft or more than 30" above grade. We handle all permits and inspections.',
      },
      {
        q: 'How long does deck construction take?',
        a: 'Most residential decks take 1-2 weeks from start to finish. Complex designs or large decks can take 3-4 weeks.',
      },
      {
        q: 'What is your warranty policy?',
        a: 'We provide structural warranties (typically 5-10 years) and pass through manufacturer warranties on composite decking materials.',
      },
      {
        q: 'Can you repair my existing deck?',
        a: 'Yes, we handle deck repairs including board replacement, railing repair, and structural reinforcement. We assess your deck and recommend repair vs. replacement.',
      },
    ],
  },
  'fencing': {
    specializations: [
      'Cedar & vinyl fencing',
      'Privacy fence installation',
      'Decorative metal fencing',
      'Fence repair',
      'HOA-compliant installations',
    ],
    projectTypes: [
      'Privacy Fence Installation',
      'Vinyl Fence Installation',
      'Chain Link Fencing',
      'Decorative Metal Fencing',
      'Fence Repair',
      'Gate Installation',
      'Fence Staining',
      'Commercial Fencing',
    ],
    expertiseParagraph: `Specializing in Denver's climate and soil conditions, they understand the importance of proper post installation, frost line depth, and materials that withstand Colorado's wind and UV exposure. Their expertise includes working with HOA requirements, property line verification, and building fences that last 20-30 years. They install all major fence types including cedar, vinyl, chain link, and decorative metal.`,
    typicalTimeline: 'Most residential fences (150-200 linear ft) take 2-4 days to install. Complex terrain or large projects can take 5-7 days.',
    faqs: [
      {
        q: 'Are you licensed and insured?',
        a: 'Yes, we are fully licensed and insured with comprehensive liability coverage.',
      },
      {
        q: 'Do you offer free estimates?',
        a: 'Yes, we provide free on-site estimates including material samples and detailed pricing.',
      },
      {
        q: 'What is the best fence material for Denver?',
        a: 'Cedar wood or vinyl are best for Denver. Cedar handles UV and temperature swings well. Vinyl is lowest maintenance and lasts 20-30 years.',
      },
      {
        q: 'Do I need a permit to install a fence?',
        a: 'Generally no for residential fences under 6 ft. Check with your HOA and verify setback requirements. Some neighborhoods have strict rules.',
      },
      {
        q: 'How long does fence installation take?',
        a: 'Most residential fences (150-200 linear ft) take 2-4 days to install. Complex terrain or large projects can take 5-7 days.',
      },
      {
        q: 'How deep do you set posts?',
        a: 'Posts must be 36" deep in concrete to reach below Denver\'s frost line. This prevents heaving and ensures fence stability.',
      },
      {
        q: 'Do you call 811 before digging?',
        a: 'Yes, we always call 811 for utility locates before digging. This is required by law and prevents damage to underground utilities.',
      },
    ],
  },
  'landscapers': {
    specializations: [
      'Xeriscape design',
      'Irrigation systems',
      'Outdoor living spaces',
      'Native plant installation',
      'Landscape maintenance',
    ],
    projectTypes: [
      'Landscape Design & Installation',
      'Xeriscaping',
      'Irrigation Systems',
      'Sod Installation',
      'Retaining Walls',
      'Patio Installation',
      'Tree & Shrub Planting',
      'Landscape Maintenance',
    ],
    expertiseParagraph: `With expertise in Denver's semi-arid climate and high altitude, they specialize in water-wise landscaping using native and drought-tolerant plants. Their knowledge of xeriscape principles, efficient irrigation design, and Denver's soil conditions ensures beautiful, sustainable landscapes that thrive with minimal water. They understand local water restrictions and create outdoor spaces that are both attractive and environmentally responsible.`,
    typicalTimeline: 'Full landscape installations typically take 1-3 weeks depending on scope. Irrigation systems take 2-4 days. Sod installation takes 1-2 days.',
    faqs: [
      {
        q: 'Are you licensed and insured?',
        a: 'Yes, we are fully licensed and insured with comprehensive liability coverage.',
      },
      {
        q: 'Do you offer free estimates?',
        a: 'Yes, we provide free consultations and estimates for all landscaping projects.',
      },
      {
        q: 'What plants work best in Denver?',
        a: 'Native and drought-tolerant plants thrive: blue grama grass, buffalo grass, Russian sage, penstemon, yucca, juniper, and serviceberry.',
      },
      {
        q: 'What is xeriscaping?',
        a: 'Xeriscaping is water-efficient landscaping using drought-tolerant plants, efficient irrigation, mulch, and proper soil. It reduces water use by 30-50%.',
      },
      {
        q: 'Do I need a permit for landscaping?',
        a: 'Generally no for basic landscaping. Yes for retaining walls over 4 ft, major grading, or irrigation systems that tap into city water.',
      },
      {
        q: 'Do you install irrigation systems?',
        a: 'Yes, we design and install efficient drip irrigation systems with smart controllers that adjust for weather and save water.',
      },
      {
        q: 'Do you offer maintenance services?',
        a: 'Yes, we offer ongoing landscape maintenance including mowing, pruning, fertilizing, and irrigation system management.',
      },
    ],
  },
  'masonry': {
    specializations: [
      'Outdoor fireplaces & fire pits',
      'Retaining walls',
      'Stone veneer',
      'Patio pavers',
      'Chimney repair',
    ],
    projectTypes: [
      'Outdoor Fireplace Construction',
      'Retaining Wall Installation',
      'Stone Veneer Installation',
      'Patio Paver Installation',
      'Chimney Repair',
      'Brick Repair',
      'Concrete Work',
      'Stucco Repair',
    ],
    expertiseParagraph: `With extensive experience in Denver's freeze-thaw cycles and soil conditions, they understand the critical importance of proper drainage, reinforcement, and using freeze-thaw resistant materials. Their expertise includes structural masonry, decorative stone work, and creating outdoor living spaces that withstand Colorado's climate. They specialize in both functional and aesthetic masonry projects built to last 50-100 years.`,
    typicalTimeline: 'Outdoor fireplaces take 1-2 weeks. Retaining walls take 3-7 days depending on length. Patio pavers take 3-5 days for average patios.',
    faqs: [
      {
        q: 'Are you licensed and insured?',
        a: 'Yes, we are fully licensed and insured with comprehensive liability and workers compensation coverage.',
      },
      {
        q: 'Do you offer free estimates?',
        a: 'Yes, we provide free consultations and detailed estimates for all masonry projects.',
      },
      {
        q: 'What type of brick is best for Denver?',
        a: 'Use SW (severe weathering) rated brick. It handles freeze-thaw cycles better than MW or NW rated brick.',
      },
      {
        q: 'Do I need a permit for masonry work?',
        a: 'Yes for retaining walls over 4 ft, structural walls, chimneys, and outdoor fireplaces. We handle all permits and inspections.',
      },
      {
        q: 'How long does masonry work last?',
        a: 'Quality masonry lasts 50-100 years with proper maintenance. Poor masonry fails in 10-20 years due to water infiltration.',
      },
      {
        q: 'What is the most important part of masonry?',
        a: 'Proper drainage and flashing are critical. Water infiltration is the #1 cause of masonry failure in Denver\'s freeze-thaw climate.',
      },
      {
        q: 'Can you match existing brick or stone?',
        a: 'Yes, we specialize in matching existing materials for repairs and additions. We bring samples to ensure a good match.',
      },
    ],
  },
  'siding-gutters': {
    specializations: [
      'Fiber cement siding (James Hardie)',
      'Vinyl siding installation',
      'Gutter & downspout systems',
      'Siding repair',
      'Soffit & fascia replacement',
    ],
    projectTypes: [
      'Siding Replacement',
      'Siding Repair',
      'Gutter Installation',
      'Gutter Repair & Cleaning',
      'Soffit & Fascia Replacement',
      'Trim Installation',
      'House Wrap Installation',
      'Commercial Siding',
    ],
    expertiseParagraph: `Specializing in Denver's harsh climate, they understand the importance of proper house wrap, flashing, and using materials that withstand Colorado's intense UV, hail, and temperature extremes. Their expertise includes fiber cement siding installation (James Hardie certified), vinyl siding, and comprehensive gutter systems that protect your home from water damage. They ensure proper ventilation and moisture management for long-lasting results.`,
    typicalTimeline: 'Most residential siding replacements take 1-2 weeks. Large homes or complex designs can take 3-4 weeks. Gutter installation takes 1-2 days.',
    faqs: [
      {
        q: 'Are you licensed and insured?',
        a: 'Yes, we are fully licensed and insured with comprehensive liability and workers compensation coverage.',
      },
      {
        q: 'Do you offer free estimates?',
        a: 'Yes, we provide free consultations and detailed estimates for all siding and gutter projects.',
      },
      {
        q: 'What is the best siding for Denver?',
        a: 'Fiber cement (James Hardie) is most popular. It handles UV, hail, and temperature swings better than vinyl or wood. Fire-resistant and lasts 30-50 years.',
      },
      {
        q: 'Do I need a permit for siding replacement?',
        a: 'Yes, Denver requires permits for siding replacement. We handle all permits and schedule inspections.',
      },
      {
        q: 'How long does siding installation take?',
        a: 'Most residential siding replacements take 1-2 weeks. Large homes or complex designs can take 3-4 weeks.',
      },
      {
        q: 'What is your warranty policy?',
        a: 'We provide installation warranties (typically 5-10 years) and pass through manufacturer warranties on siding materials.',
      },
      {
        q: 'Do you install gutters too?',
        a: 'Yes, we install and repair gutters and downspouts. Proper gutter systems are critical for protecting your home from water damage.',
      },
    ],
  },
}
