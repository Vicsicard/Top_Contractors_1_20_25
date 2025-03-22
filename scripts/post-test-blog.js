"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_1 = require("../src/utils/supabase");
var testPost = {
    title: '2025 Home Remodeling Guide: Expert Tips for Kitchen and Bathroom Renovations',
    slug: '2025-home-remodeling-guide',
    content: "# 2025 Home Remodeling Guide: Expert Tips for Kitchen and Bathroom Renovations\n\nWhen planning your home renovation project in 2025, it's crucial to understand the latest trends, materials, and best practices. This comprehensive guide will help you make informed decisions about your remodeling project.\n\n## Table of Contents\n- [Understanding Modern Kitchen Design](#understanding-modern-kitchen-design)\n- [Bathroom Renovation Essentials](#bathroom-renovation-essentials)\n- [Cost Breakdown](#cost-breakdown)\n- [Working with Contractors](#working-with-contractors)\n\n## Understanding Modern Kitchen Design\n\nModern kitchens combine functionality with aesthetic appeal. Here are key elements to consider:\n\n### Smart Appliances Integration\n\n```javascript\n// Example smart home integration\nconst kitchen = {\n  lighting: {\n    type: \"LED\",\n    smartControls: true,\n    zones: [\"prep\", \"dining\", \"ambient\"]\n  },\n  appliances: {\n    refrigerator: {\n      brand: \"Samsung\",\n      features: [\"touchscreen\", \"camera\", \"temp-monitoring\"]\n    }\n  }\n};\n```\n\n### Material Selection\n\n| Material | Durability | Cost | Maintenance |\n|----------|------------|------|-------------|\n| Quartz   | High       | $$$  | Low         |\n| Granite  | High       | $$$  | Medium      |\n| Marble   | Medium     | $$$$ | High        |\n| Laminate | Low        | $    | Low         |\n\n## Bathroom Renovation Essentials\n\n> \"A well-designed bathroom combines luxury with practicality\" - Top Contractors Denver\n\n### Key Considerations\n\n1. **Water Efficiency**\n   - Low-flow fixtures\n   - Dual-flush toilets\n   - Smart shower systems\n\n2. **Ventilation**\n   - *Proper ventilation prevents mold and mildew*\n   - **Modern fans with humidity sensors**\n   - Heat lamp integration\n\n### Installation Code Example\n\n```typescript\ninterface BathroomFixture {\n  type: string;\n  model: string;\n  waterEfficiency: number;\n  installationCost: number;\n}\n\nconst calculateROI = (fixture: BathroomFixture): number => {\n  const annualWaterSavings = fixture.waterEfficiency * 365;\n  const paybackPeriod = fixture.installationCost / annualWaterSavings;\n  return paybackPeriod;\n};\n```\n\n## Cost Breakdown\n\nHere's a typical cost breakdown for a full renovation:\n\n- \uD83D\uDCB0 Labor: 35%\n- \uD83C\uDFD7\uFE0F Materials: 40%\n- \uD83D\uDD27 Fixtures: 15%\n- \uD83D\uDCCB Permits: 5%\n- \uD83D\uDD04 Contingency: 5%\n\n### Sample Budget Calculation\n\n```json\n{\n  \"kitchen\": {\n    \"cabinets\": 15000,\n    \"countertops\": 8000,\n    \"appliances\": 12000,\n    \"labor\": 20000\n  },\n  \"bathroom\": {\n    \"fixtures\": 5000,\n    \"tile\": 4000,\n    \"labor\": 8000\n  }\n}\n```\n\n## Working with Contractors\n\nWhen selecting a contractor, ensure they:\n\n1. Are licensed and insured\n2. Have positive reviews\n3. Provide detailed quotes\n4. Understand local building codes\n\n### Project Timeline Example\n\n```bash\n# Typical renovation timeline\nWeek 1: Demo and prep\nWeek 2-3: Plumbing and electrical\nWeek 4-5: Walls and flooring\nWeek 6: Cabinet installation\nWeek 7: Countertops\nWeek 8: Finishing touches\n```\n\n---\n\n*Remember to always:*\n- Get multiple quotes\n- Check references\n- Review contracts carefully\n- Maintain open communication\n\n![Modern Kitchen Design](https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000)\n\nFor more information about our services, [contact us](/contact) today.\n",
    excerpt: 'A comprehensive guide to home renovation in 2025, covering kitchen and bathroom remodeling with expert tips on materials, costs, and working with contractors.',
    feature_image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=1000',
    feature_image_alt: 'Modern kitchen with white cabinets and marble countertops',
    published_at: new Date().toISOString(),
    reading_time: 8,
    tags: 'kitchen remodeling, bathroom remodeling, home improvement, renovation guide',
    category: 'home remodeling'
};
function postTestBlog() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_1.mainSupabase
                            .from('blog_posts')
                            .insert([testPost])
                            .select()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('Error posting blog:', error);
                        return [2 /*return*/];
                    }
                    console.log('Successfully posted blog:', data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    console.error('Error:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
postTestBlog();
