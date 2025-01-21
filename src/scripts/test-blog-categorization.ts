const ghost = require('../utils/ghost');

interface GhostPost {
    id: string;
    slug: string;
    title: string;
    html: string;
    feature_image?: string;
    feature_image_alt?: string;
    excerpt?: string;
    published_at: string;
    updated_at?: string;
    reading_time?: number;
    tags?: any[];
    authors?: {
        id: string;
        name: string;
        slug: string;
        profile_image?: string;
    }[];
    source?: string;
}

// Test cases for blog categorization
const testCases: { html: string; expectedCategory: string | null }[] = [
    // Test case 1: Direct trade hyperlink
    {
        html: '<p>This is a blog post about plumbing with a <a href="/trades/plumber">link to plumber page</a></p>',
        expectedCategory: 'plumber'
    },
    // Test case 2: Multiple trade hyperlinks (should use first one)
    {
        html: '<p>Post with <a href="/trades/electrician">electrician link</a> and <a href="/trades/plumber">plumber link</a></p>',
        expectedCategory: 'electrician'
    },
    // Test case 3: Invalid trade hyperlink (should fall back to keyword matching)
    {
        html: '<p>Post about <a href="/trades/invalid">invalid trade</a> but mentions HVAC systems and air conditioning</p>',
        expectedCategory: 'hvac'
    },
    // Test case 4: No hyperlink but clear trade content
    {
        html: '<p>This is a post about roofing services and roof repairs in Denver</p>',
        expectedCategory: 'roofer'
    },
    // Test case 5: Hyperlink with additional URL parameters
    {
        html: '<p>Check out our <a href="/trades/plumber?region=denver">Denver plumbing services</a></p>',
        expectedCategory: 'plumber'
    }
];

// Run tests
function runTests() {
    console.log('Starting blog categorization tests...\n');
    
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const mockPost: GhostPost = {
            id: `test-${i}`,
            slug: `test-${i}`,
            title: `Test Post ${i}`,
            html: testCase.html,
            published_at: new Date().toISOString()
        };

        const category = ghost.extractPostCategory(mockPost);
        const passed = category === testCase.expectedCategory;

        console.log(`Test ${i + 1}:`);
        console.log(`Expected: ${testCase.expectedCategory}`);
        console.log(`Actual: ${category}`);
        console.log(`Status: ${passed ? '✓ PASSED' : '✗ FAILED'}`);
        if (!passed) {
            console.log(`HTML: ${testCase.html}`);
        }
        console.log('---\n');
    }
}

// Run the tests
runTests();
