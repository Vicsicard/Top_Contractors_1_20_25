import { blogSupabase } from '../src/utils/supabase-blog-client';
import type { Database } from '../src/types/supabase';

const testPost: Database['public']['Tables']['blog_posts']['Insert'] = {
  title: '2025 Home Remodeling Guide: Expert Tips for Kitchen and Bathroom Renovations',
  slug: '2025-home-remodeling-guide-' + Date.now(),
  content: `# 2025 Home Remodeling Guide: Expert Tips for Kitchen and Bathroom Renovations

When planning your home renovation project in 2025, it's crucial to understand the latest trends, materials, and best practices. This comprehensive guide will help you make informed decisions about your remodeling project.

## Table of Contents
- [Understanding Modern Kitchen Design](#understanding-modern-kitchen-design)
- [Bathroom Renovation Essentials](#bathroom-renovation-essentials)
- [Cost Breakdown](#cost-breakdown)
- [Working with Contractors](#working-with-contractors)

## Understanding Modern Kitchen Design

Modern kitchens combine functionality with aesthetic appeal. Here are key elements to consider:

### Smart Appliances Integration

\`\`\`javascript
// Example smart home integration
const kitchen = {
  lighting: {
    type: "LED",
    smartControls: true,
    zones: ["prep", "dining", "ambient"]
  },
  appliances: {
    refrigerator: {
      brand: "Samsung",
      features: ["touchscreen", "camera", "temp-monitoring"]
    }
  }
};
\`\`\`

### Material Selection

| Material | Durability | Cost | Maintenance |
|----------|------------|------|-------------|
| Quartz   | High       | $$$  | Low         |
| Granite  | High       | $$$  | Medium      |
| Marble   | Medium     | $$$$ | High        |
| Laminate | Low        | $    | Low         |

## Bathroom Renovation Essentials

> "A well-designed bathroom combines luxury with practicality" - Top Contractors Denver

### Key Considerations

1. **Water Efficiency**
   - Low-flow fixtures
   - Dual-flush toilets
   - Smart shower systems

2. **Ventilation**
   - *Proper ventilation prevents mold and mildew*
   - **Modern fans with humidity sensors**
   - Heat lamp integration

### Installation Code Example

\`\`\`typescript
interface BathroomFixture {
  type: string;
  model: string;
  waterEfficiency: number;
  installationCost: number;
}

const calculateROI = (fixture: BathroomFixture): number => {
  const annualWaterSavings = fixture.waterEfficiency * 365;
  const paybackPeriod = fixture.installationCost / annualWaterSavings;
  return paybackPeriod;
};
\`\`\`

## Cost Breakdown

Here's a typical cost breakdown for a full renovation:

- 💰 Labor: 35%
- 🏗️ Materials: 40%
- 🔧 Fixtures: 15%
- 📋 Permits: 5%
- 🔄 Contingency: 5%

### Sample Budget Calculation

\`\`\`json
{
  "kitchen": {
    "cabinets": 15000,
    "countertops": 8000,
    "appliances": 12000,
    "labor": 20000
  },
  "bathroom": {
    "fixtures": 5000,
    "tile": 4000,
    "labor": 8000
  }
}
\`\`\`

## Working with Contractors

When selecting a contractor, ensure they:

1. Are licensed and insured
2. Have positive reviews
3. Provide detailed quotes
4. Understand local building codes

### Project Timeline Example

\`\`\`bash
# Typical renovation timeline
Week 1: Demo and prep
Week 2-3: Plumbing and electrical
Week 4-5: Walls and flooring
Week 6: Cabinet installation
Week 7: Countertops
Week 8: Finishing touches
\`\`\`

---

*Remember to always:*
- Get multiple quotes
- Check references
- Review contracts carefully
- Maintain open communication

![Modern Kitchen Design](https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000)

For more information about our services, [contact us](/contact) today.
`,
  tags: 'kitchen remodeling, bathroom remodeling, home improvement, renovation guide, home remodeling',
  created_at: new Date().toISOString(),
  posted_on_site: false,
  images: null
};

async function postTestBlog() {
  try {
    const { data, error } = await blogSupabase
      .from('blog_posts')
      .insert([testPost])
      .select();

    if (error) {
      console.error('Error posting blog:', error);
      return;
    }

    console.log('Successfully posted blog:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

postTestBlog();
