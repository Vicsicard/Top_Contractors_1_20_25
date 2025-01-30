interface FAQ {
  question: string;
  answer: string;
}

interface TradeFAQs {
  [key: string]: FAQ[];
}

export const tradeFAQs: TradeFAQs = {
  "plumbing": [
    {
      question: "What are common plumbing emergencies?",
      answer: "Common plumbing emergencies include burst pipes, severe leaks, sewer backups, no hot water, and clogged main lines. These situations typically require immediate professional attention to prevent property damage."
    },
    {
      question: "How often should I have my plumbing inspected?",
      answer: "It's recommended to have a professional plumbing inspection annually. Regular inspections can identify potential issues before they become major problems and help maintain your plumbing system's efficiency."
    },
    {
      question: "What are signs of a hidden water leak?",
      answer: "Signs of hidden water leaks include unexplained high water bills, water stains on walls or ceilings, musty odors, mold growth, and warm spots on floors. If you notice any of these signs, contact a professional plumber immediately."
    }
  ],
  "electrical": [
    {
      question: "When do I need to upgrade my electrical panel?",
      answer: "Consider upgrading your electrical panel if you experience frequent circuit breaker trips, have an older home (pre-1970s), are adding major appliances, or notice signs of electrical issues like flickering lights or burning smells."
    },
    {
      question: "What are signs of electrical problems?",
      answer: "Common signs include frequent circuit breaker trips, flickering lights, buzzing sounds from outlets, warm or discolored outlet covers, burning smells, and shocks from appliances or switches."
    },
    {
      question: "How often should electrical systems be inspected?",
      answer: "Professional electrical inspections are recommended every 3-5 years for most homes, or annually for homes over 40 years old. More frequent inspections may be needed if you notice any electrical issues."
    }
  ],
  "hvac": [
    {
      question: "How often should I replace my HVAC filters?",
      answer: "For standard 1-inch filters, replacement is typically recommended every 1-3 months. However, this can vary based on factors like pets, allergies, and air quality. High-end filters may last 6-12 months."
    },
    {
      question: "What maintenance does an HVAC system need?",
      answer: "Regular HVAC maintenance includes filter changes, cleaning coils and condensers, checking refrigerant levels, inspecting electrical connections, and ensuring proper airflow. Professional servicing is recommended twice yearly."
    },
    {
      question: "How long does an HVAC system typically last?",
      answer: "With proper maintenance, most HVAC systems last 15-20 years. However, efficiency may decline in later years. Factors affecting lifespan include usage patterns, maintenance regularity, and local climate."
    }
  ],
  "roofing": [
    {
      question: "How often should I have my roof inspected?",
      answer: "Professional roof inspections are recommended annually and after severe storms. Regular inspections can identify potential issues early and extend your roof's lifespan."
    },
    {
      question: "What are signs that I need a new roof?",
      answer: "Common signs include missing or damaged shingles, granules in gutters, daylight visible through roof boards, sagging areas, water stains on ceilings, and a roof age over 20-25 years."
    },
    {
      question: "How long does a typical roof replacement take?",
      answer: "Most residential roof replacements take 1-3 days, depending on factors like roof size, complexity, weather conditions, and material type. Larger or more complex projects may take longer."
    }
  ],
  "landscaping": [
    {
      question: "What is the best time for landscape maintenance?",
      answer: "Spring and fall are ideal for major landscape maintenance. Spring is best for planting and pruning, while fall is perfect for lawn care, tree maintenance, and preparing for winter."
    },
    {
      question: "How often should I water my lawn?",
      answer: "Watering frequency depends on climate, season, and grass type. Generally, lawns need 1-1.5 inches of water per week, either from rainfall or irrigation. Deep, infrequent watering is better than frequent light watering."
    },
    {
      question: "What maintenance does a sprinkler system need?",
      answer: "Sprinkler systems should be inspected annually, typically in spring. Maintenance includes checking for leaks, adjusting sprinkler heads, testing controllers, and winterizing the system in cold climates."
    }
  ]
};
