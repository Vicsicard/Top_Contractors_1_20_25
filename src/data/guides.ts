export type GuideCategory = 'cost' | 'hiring' | 'timeline' | 'permit' | 'seasonal'

export type Guide = {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  category: GuideCategory
  trade: string
  tradeSlug: string
  intro: string
  sections: { heading: string; body: string }[]
  keyTakeaways: string[]
  faqs: { q: string; a: string }[]
  relatedGuides: string[]
}

export const GUIDE_CATEGORIES: Record<GuideCategory, { label: string; description: string }> = {
  cost:     { label: 'Cost Guides',     description: 'Understand what home improvement projects cost in Denver before you hire.' },
  hiring:   { label: 'Hiring Guides',   description: 'How to find, vet, and hire the right contractor for your project.' },
  timeline: { label: 'Timeline Guides', description: 'How long projects take in Denver — from start to finish.' },
  permit:   { label: 'Permit Guides',   description: 'What permits you need for home improvement projects in Denver.' },
  seasonal: { label: 'Seasonal Guides', description: 'The best time of year to schedule home improvement work in Denver.' },
}

export const GUIDES: Guide[] = [
  {
    slug: 'cost-to-replace-roof-denver',
    title: 'Cost to Replace a Roof in Denver (2025 Guide)',
    metaTitle: 'Cost to Replace a Roof in Denver, CO (2025) | Top Contractors Denver',
    metaDescription: 'How much does roof replacement cost in Denver? Average prices, material options, what affects cost, and how to get the best value. Updated for 2025.',
    category: 'cost',
    trade: 'Roofing Contractors',
    tradeSlug: 'roofing-contractors',
    intro: "Denver roofing costs vary widely. With Colorado's hail seasons, UV exposure, and snow loads, knowing what to expect before calling a contractor puts you in a much stronger position.",
    sections: [
      {
        heading: 'Average Roof Replacement Cost in Denver',
        body: "Most Denver homeowners pay $8,000–$20,000 for a full roof replacement, averaging $12,000–$15,000 for a 2,000 sq ft home with asphalt shingles. Metal or tile can reach $25,000–$40,000+.\n\nThe range comes down to roof size (measured in 100 sq ft \"squares\"), pitch, material choice, and decking damage found during removal.",
      },
      {
        heading: 'Roofing Material Costs in Denver',
        body: "Asphalt shingles: $4–$7/sq ft installed. Class 4 impact-resistant shingles: $6–$9/sq ft — but qualify for 20–30% insurance discounts, often paying for the upgrade in a few years.\n\nMetal roofing: $10–$18/sq ft installed, lasts 40–70 years. Tile and slate: $15–$30+/sq ft.",
      },
      {
        heading: 'What Drives Cost Up in Denver',
        body: "Hail damage to decking adds $75–$100 per sheet. High-altitude labor adds 5–10%. Permit fees run $150–$400. Steep pitch (above 6:12) adds $500–$2,000.",
      },
      {
        heading: 'Insurance Claims for Roof Replacement',
        body: "Denver is one of the most hail-active metros in the US. If your roof was damaged by hail or wind, homeowners insurance may cover most of the replacement cost minus your deductible. A licensed roofer can document damage for your claim. Avoid storm chasers — stick with established local companies.",
      },
      {
        heading: 'How to Get the Best Price',
        body: "Get at least 3 written quotes. Quotes should itemize labor, materials, permit fees, and disposal separately. Scheduling in fall (after hail season) can get better pricing as demand drops.",
      },
    ],
    keyTakeaways: [
      'Average Denver roof replacement: $8,000–$20,000 for asphalt shingles',
      'Class 4 impact-resistant shingles can earn 20–30% insurance discounts',
      'Always get 3+ written, itemized quotes from licensed contractors',
      'Hail damage may be covered by homeowners insurance',
      'Avoid storm chasers — hire established local Denver roofers',
    ],
    faqs: [
      { q: 'How long does a roof replacement take in Denver?', a: 'Most residential replacements take 1–3 days. Larger or complex roofs may take 3–5 days.' },
      { q: 'Do I need a permit to replace my roof in Denver?', a: 'Yes. Denver requires a permit for full roof replacements. Your contractor should pull it.' },
      { q: 'What is the best roofing material for Denver?', a: 'Class 4 impact-resistant asphalt shingles are the most popular. Metal roofing is the best long-term investment.' },
      { q: 'How do I know if my roof needs replacing vs. repair?', a: 'If less than 30% of shingles are damaged, repair is often sufficient. Widespread damage typically warrants replacement.' },
    ],
    relatedGuides: ['how-to-choose-roofing-contractor-denver', 'permit-guide-roofing-denver', 'best-time-replace-roof-denver'],
  },
  {
    slug: 'cost-kitchen-remodel-denver',
    title: 'Cost of a Kitchen Remodel in Denver (2025 Guide)',
    metaTitle: 'Kitchen Remodel Cost in Denver, CO (2025) | Top Contractors Denver',
    metaDescription: 'How much does a kitchen remodel cost in Denver? Average prices by scope, what affects cost, ROI data, and tips to stay on budget. Updated for 2025.',
    category: 'cost',
    trade: 'Kitchen Remodeling',
    tradeSlug: 'kitchen-remodeling',
    intro: "A kitchen remodel is the most popular home improvement project in Denver and one of the highest-ROI investments before selling. Costs vary enormously based on scope, materials, and layout changes.",
    sections: [
      {
        heading: 'Average Kitchen Remodel Cost in Denver',
        body: "Minor refresh ($10,000–$25,000): New cabinet fronts, countertops, fixtures. No layout changes.\n\nMid-range remodel ($25,000–$60,000): Semi-custom cabinets, quartz countertops, new flooring, updated lighting, appliance package.\n\nFull gut renovation ($60,000–$120,000+): Custom cabinetry, premium countertops, structural changes, high-end appliances.",
      },
      {
        heading: 'Where the Money Goes',
        body: "Cabinets: 30–35% of budget. Labor: 20–25%. Appliances: 15–20%. Countertops: 10–15%. Flooring: 5–10%. Plumbing and electrical: 5–10%. Permits and design: 3–5%.\n\nCabinets are the biggest lever — stock vs. custom can swing your budget by $15,000–$30,000.",
      },
      {
        heading: 'Denver-Specific Cost Factors',
        body: "Denver labor runs 10–20% above national average. Custom cabinet lead times run 8–12 weeks. Permits for electrical, plumbing, or structural work cost $300–$800.",
      },
      {
        heading: 'Kitchen Remodel ROI in Denver',
        body: "Mid-range remodels return 65–75% of cost at resale. A $50,000 remodel adds roughly $32,000–$37,000 in value. High-end remodels in Cherry Creek, Wash Park, and Highlands can return 80–90%.",
      },
      {
        heading: 'How to Budget',
        body: "Add a 15–20% contingency. Hidden costs are common in older Denver homes — outdated wiring, plumbing, or asbestos behind walls. Get detailed written quotes from at least 3 licensed general contractors.",
      },
    ],
    keyTakeaways: [
      'Minor refresh: $10,000–$25,000; full gut: $60,000–$120,000+',
      'Cabinets are 30–35% of budget — the biggest cost lever',
      'Denver labor runs 10–20% above national average',
      'Mid-range remodels return 65–75% of cost at resale',
      'Always budget a 15–20% contingency for hidden costs',
    ],
    faqs: [
      { q: 'How long does a kitchen remodel take in Denver?', a: 'A minor refresh takes 2–4 weeks. A full gut renovation typically takes 8–16 weeks including cabinet lead time.' },
      { q: 'Do I need a permit for a kitchen remodel in Denver?', a: 'Yes, if the work involves electrical, plumbing, or structural changes.' },
      { q: 'What is the most cost-effective kitchen upgrade?', a: 'Cabinet painting or refacing with new countertops and hardware — typically $8,000–$15,000 for dramatic impact.' },
      { q: 'Should I stay home during a kitchen remodel?', a: 'Most homeowners stay home but set up a temporary kitchen. Expect significant dust and noise the first 1–2 weeks.' },
    ],
    relatedGuides: ['how-to-choose-kitchen-remodeler-denver', 'cost-bathroom-remodel-denver', 'permit-guide-kitchen-remodel-denver'],
  },
  {
    slug: 'cost-bathroom-remodel-denver',
    title: 'Cost of a Bathroom Remodel in Denver (2025 Guide)',
    metaTitle: 'Bathroom Remodel Cost in Denver, CO (2025) | Top Contractors Denver',
    metaDescription: 'How much does a bathroom remodel cost in Denver? Average prices for hall baths, master baths, and full renovations. Updated for 2025.',
    category: 'cost',
    trade: 'Bathroom Remodeling',
    tradeSlug: 'bathroom-remodeling',
    intro: "Bathroom remodels are among the most requested projects in Denver. Understanding realistic costs before you start will help you plan effectively and avoid budget surprises.",
    sections: [
      {
        heading: 'Average Bathroom Remodel Cost in Denver',
        body: "Hall bathroom ($8,000–$18,000): New vanity, toilet, tub/shower surround, flooring, and fixtures.\n\nMaster bathroom ($18,000–$45,000): Walk-in shower, double vanity, soaking tub, heated floors, custom tile.\n\nFull master suite renovation ($45,000–$80,000+): Structural changes, custom tile, steam shower, radiant heat.",
      },
      {
        heading: 'Biggest Cost Drivers',
        body: "Tile work is the biggest variable — basic ceramic runs $8–$15/sq ft installed; natural stone can reach $25–$50+/sq ft. Plumbing relocation adds $2,000–$8,000. Proper waterproofing (Schluter Kerdi, RedGard) is non-negotiable.",
      },
      {
        heading: 'ROI on Bathroom Remodels in Denver',
        body: "Mid-range remodels return 60–70% of cost at resale. Master bath renovations in Cherry Creek and Wash Park return more. Best ROI: update fixtures, tile, and vanity while keeping the existing layout.",
      },
      {
        heading: 'Hidden Costs to Watch For',
        body: "Denver's older housing stock often hides galvanized pipes, outdated wiring, or subfloor damage behind bathroom walls. Budget a 20% contingency. Always include a proper exhaust fan upgrade ($200–$500).",
      },
    ],
    keyTakeaways: [
      'Hall bath: $8,000–$18,000; master bath: $18,000–$45,000',
      'Tile selection is the biggest cost variable',
      'Never skip proper waterproofing',
      'Budget 20% contingency for older Denver homes',
      'Mid-range remodels return 60–70% of cost at resale',
    ],
    faqs: [
      { q: 'How long does a bathroom remodel take in Denver?', a: 'A hall bath refresh takes 1–2 weeks. A full master bath renovation typically takes 3–6 weeks.' },
      { q: 'What bathroom upgrades have the best ROI in Denver?', a: 'Updated vanity, new tile surround, and modern fixtures. Walk-in showers are highly desirable to Denver buyers.' },
      { q: 'Do I need a permit for a bathroom remodel in Denver?', a: 'Yes, if the work involves plumbing or electrical changes.' },
      { q: 'Can I use my bathroom during a remodel?', a: 'Not the one being remodeled. If it\'s your only bathroom, discuss timing with your contractor.' },
    ],
    relatedGuides: ['cost-kitchen-remodel-denver', 'how-to-choose-bathroom-remodeler-denver', 'permit-guide-bathroom-remodel-denver'],
  },
  {
    slug: 'how-to-choose-roofing-contractor-denver',
    title: 'How to Choose a Roofing Contractor in Denver (2025)',
    metaTitle: 'How to Choose a Roofing Contractor in Denver | Top Contractors Denver',
    metaDescription: "What to look for when hiring a roofer in Denver. License checks, red flags, questions to ask, and how to compare quotes.",
    category: 'hiring',
    trade: 'Roofing Contractors',
    tradeSlug: 'roofing-contractors',
    intro: "Denver's roofing market is flooded with contractors — especially after hail events. Knowing how to separate qualified local professionals from storm chasers can save you thousands.",
    sections: [
      {
        heading: 'Verify Colorado Roofing Licensing',
        body: "Colorado requires roofing contractors to be licensed at the state level — verify through DORA (Colorado Department of Regulatory Agencies). Denver also requires a city contractor license. A legitimate Denver roofer will have both readily available.",
      },
      {
        heading: 'Check Insurance — Both Types',
        body: "Require general liability (covers property damage) and workers' compensation (covers injuries on your property). Ask for certificates of insurance and call the insurer to verify they're current. Non-negotiable.",
      },
      {
        heading: 'Storm Chaser Red Flags',
        body: "After Denver hail events, out-of-state contractors flood the market. Red flags: unmarked trucks, pressure to sign immediately, asking you to sign over your insurance claim, no local office, unusually low bids, offering to waive your deductible (insurance fraud).",
      },
      {
        heading: 'Questions to Ask Before Hiring',
        body: "1. How long have you operated in Denver?\n2. Can you provide 3 local references from the past year?\n3. Who will be on my roof — employees or subcontractors?\n4. What manufacturer certifications do you hold?\n5. What labor warranty do you offer?\n6. Will you pull the permit?\n7. How do you handle unexpected decking damage?",
      },
      {
        heading: 'How to Compare Roofing Quotes',
        body: "Get 3+ written quotes. Each should specify: exact materials, layers being removed, decking repair allowance, underlayment type, flashing scope, permit fees, cleanup, and labor warranty duration. Compare what's included, not just the bottom line.",
      },
    ],
    keyTakeaways: [
      'Verify Colorado state license and Denver city license',
      'Always get certificates of insurance — both liability and workers\' comp',
      'Avoid storm chasers: look for established local Denver contractors',
      'Get 3+ written, itemized quotes',
      'Manufacturer certifications (GAF, Owens Corning) indicate quality',
    ],
    faqs: [
      { q: 'How many roofing quotes should I get in Denver?', a: 'At least 3. This gives you a realistic sense of market pricing and lets you compare what\'s included.' },
      { q: 'What is a GAF Master Elite contractor?', a: 'The top tier of GAF\'s certification program. Only 3% of roofers qualify. A strong indicator of quality.' },
      { q: 'How long should a roofing warranty last?', a: 'Labor warranties from reputable Denver roofers run 5–10 years. Material warranties run 25–50 years. Get both in writing.' },
      { q: 'Should I be home during my roof replacement?', a: "You don't need to be, but be available by phone — the contractor may find decking damage requiring a decision." },
    ],
    relatedGuides: ['cost-to-replace-roof-denver', 'permit-guide-roofing-denver', 'best-time-replace-roof-denver'],
  },
  {
    slug: 'permit-guide-roofing-denver',
    title: 'Do You Need a Permit to Replace a Roof in Denver?',
    metaTitle: 'Roofing Permits in Denver, CO — What You Need to Know | Top Contractors Denver',
    metaDescription: "Do you need a permit to replace a roof in Denver? Yes. Here's what's required, how much it costs, and what happens if you skip it.",
    category: 'permit',
    trade: 'Roofing Contractors',
    tradeSlug: 'roofing-contractors',
    intro: "Yes — Denver requires a permit for roof replacements. It's a consumer protection measure ensuring work is inspected and meets building code.",
    sections: [
      {
        heading: 'When a Roofing Permit Is Required',
        body: "Denver CPD requires a permit for: full roof replacement, replacing more than 25% of the roof surface, any structural roof work, and re-roofing over existing material. Minor repairs (patching a few shingles) generally don't require a permit.",
      },
      {
        heading: 'How Much Does a Roofing Permit Cost?',
        body: "Fees are based on work valuation. For a typical residential replacement, expect $150–$400. Reputable contractors include permit fees in their quotes. If a quote doesn't mention permits, ask directly.",
      },
      {
        heading: 'What the Inspection Covers',
        body: "A city inspector verifies: proper underlayment installation, correct flashing at penetrations and valleys, adequate ventilation, and compliance with wind and hail resistance requirements.",
      },
      {
        heading: 'What Happens If You Skip the Permit',
        body: "Insurance claims may be denied for unpermitted work. Unpermitted work must be disclosed when selling — buyers' inspectors often find evidence. Denver can issue stop-work orders and fines. After-the-fact permits cost significantly more.",
      },
    ],
    keyTakeaways: [
      'Denver requires a permit for full roof replacements',
      'Permit fees typically run $150–$400 for residential work',
      'Your contractor should pull the permit — not you',
      'Skipping permits can void insurance claims and complicate home sales',
    ],
    faqs: [
      { q: 'Who pulls the roofing permit in Denver?', a: "The licensed contractor is responsible. If they ask you to pull your own permit, that's a red flag." },
      { q: 'How long does it take to get a roofing permit in Denver?', a: 'Most are issued same-day or within 1–2 business days through the online portal.' },
      { q: 'Can I reroof over existing shingles without a permit?', a: 'No. Re-roofing requires a permit in Denver.' },
    ],
    relatedGuides: ['cost-to-replace-roof-denver', 'how-to-choose-roofing-contractor-denver'],
  },
  {
    slug: 'best-time-replace-roof-denver',
    title: 'Best Time to Replace a Roof in Denver (Seasonal Guide)',
    metaTitle: 'Best Time to Replace a Roof in Denver, CO | Seasonal Guide | Top Contractors Denver',
    metaDescription: "When is the best time to replace a roof in Denver? Learn how Denver's seasons affect roofing projects, pricing, and contractor availability.",
    category: 'seasonal',
    trade: 'Roofing Contractors',
    tradeSlug: 'roofing-contractors',
    intro: "Denver's climate creates distinct roofing seasons. Knowing when to schedule your replacement can affect pricing, availability, and installation quality.",
    sections: [
      {
        heading: 'Spring (March–May): Peak Demand, Higher Prices',
        body: "Spring is Denver's busiest roofing season. Hail season begins in April and after the first major storm, contractors are booked weeks out. Spring pricing is typically 5–15% higher than fall. Temperatures are ideal for shingle installation (40–85°F).",
      },
      {
        heading: 'Summer (June–August): Hot, Busy, and Hail-Prone',
        body: "Still peak season. July and August bring the highest hail risk. High temperatures (90°F+) can affect shingle handling. Reputable contractors work early mornings. Not ideal for planned replacements.",
      },
      {
        heading: 'Fall (September–November): The Sweet Spot',
        body: "Best time for planned replacements. Hail season winds down after September. Contractor demand drops, often leading to better pricing. Temperatures are ideal. October and early November are particularly good.",
      },
      {
        heading: 'Winter (December–February): Possible but Challenging',
        body: "Shingles become brittle below 40°F. Snow and ice create safety hazards. Emergency repairs are done year-round. Full replacements in winter are less common and may require cold-weather adhesives.",
      },
    ],
    keyTakeaways: [
      'Fall (September–November) is the best time for planned replacements',
      'Spring and summer mean higher prices and longer wait times',
      'Shingles install best between 40–85°F',
      'Winter roofing is possible for emergencies but not ideal',
      'Book fall appointments in August–September',
    ],
    faqs: [
      { q: 'Can you replace a roof in winter in Denver?', a: 'Yes, but not ideal. Below 40°F makes shingles brittle and harder to seal properly.' },
      { q: 'How far in advance should I book a Denver roofer?', a: 'For fall replacements, book in August or September. After major hail, top contractors book 4–8 weeks out.' },
      { q: 'Does Denver weather affect material choices?', a: "Yes. Denver's hail risk and UV intensity make Class 4 impact-resistant shingles the most practical choice." },
    ],
    relatedGuides: ['cost-to-replace-roof-denver', 'how-to-choose-roofing-contractor-denver', 'permit-guide-roofing-denver'],
  },
  {
    slug: 'how-to-choose-hvac-contractor-denver',
    title: 'How to Choose an HVAC Contractor in Denver (2025)',
    metaTitle: 'How to Choose an HVAC Contractor in Denver | Top Contractors Denver',
    metaDescription: 'What to look for when hiring an HVAC contractor in Denver. Certifications, questions to ask, red flags, and how to compare quotes.',
    category: 'hiring',
    trade: 'HVAC Contractors',
    tradeSlug: 'hvac-contractors',
    intro: "Denver's extreme temperature swings — from -20°F winters to 100°F summers — make your HVAC system one of the most critical systems in your home. Choosing the right contractor ensures your system is properly sized, installed, and maintained.",
    sections: [
      {
        heading: 'Required Certifications and Licenses',
        body: "Colorado requires HVAC contractors to hold a state mechanical license. Look for NATE (North American Technician Excellence) certification — the industry's most respected credential. EPA 608 certification is required for anyone handling refrigerants.\n\nFor new system installations, ask if the contractor performs Manual J load calculations — this is the industry standard for properly sizing HVAC equipment to your home.",
      },
      {
        heading: 'High-Altitude HVAC Considerations',
        body: "Denver's elevation (5,280 ft) affects HVAC performance. Gas furnaces must be derated for altitude — a furnace rated at 100,000 BTU at sea level produces about 80,000 BTU in Denver. A qualified contractor will account for this in equipment selection.\n\nDenver's dry climate also makes whole-home humidifiers a valuable addition to any HVAC system — ask your contractor about this during any heating system work.",
      },
      {
        heading: 'Questions to Ask an HVAC Contractor',
        body: "1. Are you NATE-certified?\n2. Do you perform Manual J load calculations for new installs?\n3. What brands do you carry and what are your manufacturer relationships?\n4. Do you offer maintenance plans?\n5. What is your response time for emergency service calls?\n6. Are you familiar with Xcel Energy rebate programs?\n7. What warranty do you offer on parts and labor?",
      },
      {
        heading: 'Understanding HVAC Quotes',
        body: "HVAC quotes should specify: equipment brand and model number, SEER rating (efficiency), BTU capacity, installation scope, permit fees, and warranty terms. Be wary of contractors who quote a system without visiting your home — proper sizing requires a site visit.",
      },
    ],
    keyTakeaways: [
      'Look for NATE certification and Colorado mechanical license',
      'Proper sizing requires a Manual J calculation — not a guess',
      'Denver altitude affects furnace output — ensure contractor accounts for this',
      'Ask about Xcel Energy rebates for high-efficiency systems',
      'Get quotes that include model numbers so you can compare apples to apples',
    ],
    faqs: [
      { q: 'How often should I service my HVAC in Denver?', a: 'Annual service is recommended — furnace in fall, AC in spring. Denver\'s dry air also makes humidifier maintenance important.' },
      { q: 'Are there rebates for new HVAC systems in Denver?', a: 'Yes. Xcel Energy offers rebates for qualifying high-efficiency systems. Your contractor can identify eligible equipment.' },
      { q: 'What size HVAC system do I need for my Denver home?', a: 'Sizing depends on square footage, insulation, and ceiling height. A licensed contractor performs a Manual J load calculation.' },
      { q: 'How long does an HVAC installation take?', a: 'A standard furnace or AC replacement takes 4–8 hours. A full system replacement (furnace + AC) typically takes 1–2 days.' },
    ],
    relatedGuides: ['cost-to-replace-roof-denver', 'how-to-choose-roofing-contractor-denver'],
  },
  {
    slug: 'permit-guide-kitchen-remodel-denver',
    title: 'Do You Need a Permit for a Kitchen Remodel in Denver?',
    metaTitle: 'Kitchen Remodel Permits in Denver, CO | Top Contractors Denver',
    metaDescription: 'What permits do you need for a kitchen remodel in Denver? Which work requires permits, how much they cost, and what happens without them.',
    category: 'permit',
    trade: 'Kitchen Remodeling',
    tradeSlug: 'kitchen-remodeling',
    intro: "Kitchen remodels in Denver often require permits — but not always. The key question is whether your project involves electrical, plumbing, or structural work. Here's how to know what's required.",
    sections: [
      {
        heading: 'When Kitchen Remodel Permits Are Required',
        body: "Denver requires permits for kitchen work that involves:\n\n- **Electrical**: New circuits, panel upgrades, moving outlets, adding recessed lighting\n- **Plumbing**: Moving the sink, adding a dishwasher connection, gas line work\n- **Structural**: Removing or modifying walls, especially load-bearing walls\n- **Mechanical**: Adding or modifying ventilation (range hood venting)\n\nCosmetic work — painting, replacing cabinet doors, new countertops on existing cabinets, new flooring — generally does not require a permit.",
      },
      {
        heading: 'Kitchen Permit Costs in Denver',
        body: "Kitchen remodel permit fees in Denver are based on the valuation of the work:\n\n- Minor electrical permit: $75–$150\n- Plumbing permit: $100–$200\n- Full remodel permit (combined): $300–$800\n\nYour general contractor should include permit fees in their quote and handle all applications.",
      },
      {
        heading: 'The Inspection Process',
        body: "Permitted kitchen work requires inspections at key stages:\n\n- **Rough-in inspection**: Before walls are closed — verifies electrical, plumbing, and structural work\n- **Final inspection**: After completion — verifies everything meets code\n\nYour contractor schedules inspections. Work cannot proceed to the next stage until each inspection passes.",
      },
      {
        heading: 'Risks of Unpermitted Kitchen Work',
        body: "Unpermitted work creates problems at resale — buyers' inspectors look for evidence of unpermitted work, and it must be disclosed. Insurance may not cover damage from unpermitted work. Retroactive permits cost significantly more than pulling them upfront.",
      },
    ],
    keyTakeaways: [
      'Electrical, plumbing, and structural work requires permits',
      'Cosmetic work (paint, countertops, cabinet doors) generally does not',
      'Full remodel permits typically cost $300–$800 in Denver',
      'Your contractor should handle all permit applications',
      'Unpermitted work creates problems at resale',
    ],
    faqs: [
      { q: 'Does replacing kitchen cabinets require a permit in Denver?', a: 'Not if you\'re replacing in-kind without moving plumbing or electrical. If you\'re changing the layout, permits are likely required.' },
      { q: 'Who is responsible for pulling kitchen remodel permits?', a: 'Your licensed general contractor. If they suggest skipping permits, find a different contractor.' },
      { q: 'How long do kitchen remodel permits take in Denver?', a: 'Simple permits are often issued same-day online. Complex projects may require plan review, which takes 2–4 weeks.' },
    ],
    relatedGuides: ['cost-kitchen-remodel-denver', 'how-to-choose-kitchen-remodeler-denver'],
  },
]

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug)
}

export function getGuidesByCategory(category: GuideCategory): Guide[] {
  return GUIDES.filter((g) => g.category === category)
}

export function getGuidesByTrade(tradeSlug: string): Guide[] {
  return GUIDES.filter((g) => g.tradeSlug === tradeSlug)
}
