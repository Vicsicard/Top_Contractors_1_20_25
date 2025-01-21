import { extractPostCategory } from '../ghost';

describe('Blog Post Categorization', () => {
    const testCases = [
        {
            name: 'Direct trade hyperlink',
            post: {
                html: '<p>This is a blog post about plumbing with a <a href="/trades/plumber">link to plumber page</a></p>',
                title: 'Test Post',
                id: 'test-1',
                slug: 'test-1',
                published_at: new Date().toISOString()
            },
            expectedCategory: 'plumber'
        },
        {
            name: 'Multiple trade hyperlinks (should use first one)',
            post: {
                html: '<p>Post with <a href="/trades/electrician">electrician link</a> and <a href="/trades/plumber">plumber link</a></p>',
                title: 'Test Post',
                id: 'test-2',
                slug: 'test-2',
                published_at: new Date().toISOString()
            },
            expectedCategory: 'electrician'
        },
        {
            name: 'Invalid trade hyperlink with fallback',
            post: {
                html: '<p>Post about <a href="/trades/invalid">invalid trade</a> but mentions HVAC systems and air conditioning</p>',
                title: 'Test Post',
                id: 'test-3',
                slug: 'test-3',
                published_at: new Date().toISOString()
            },
            expectedCategory: 'hvac'
        },
        {
            name: 'No hyperlink but clear trade content',
            post: {
                html: '<p>This is a post about roofing services and roof repairs in Denver</p>',
                title: 'Test Post',
                id: 'test-4',
                slug: 'test-4',
                published_at: new Date().toISOString()
            },
            expectedCategory: 'roofer'
        },
        {
            name: 'Hyperlink with additional URL parameters',
            post: {
                html: '<p>Check out our <a href="/trades/plumber?region=denver">Denver plumbing services</a></p>',
                title: 'Test Post',
                id: 'test-5',
                slug: 'test-5',
                published_at: new Date().toISOString()
            },
            expectedCategory: 'plumber'
        },
        {
            name: 'General Home Remodeling URL',
            post: {
                html: '<p>Complete home renovation services</p>',
                title: 'Home Remodeling Services',
                id: 'test-hr-1',
                slug: 'complete-home-remodel-services-denver',
                published_at: new Date().toISOString()
            },
            expectedCategory: 'home-remodeling'
        },
        {
            name: 'Home Remodeling with Bathroom (should go to bathroom category)',
            post: {
                html: '<p>Bathroom remodeling services</p>',
                title: 'Bathroom Remodeling',
                id: 'test-hr-2',
                slug: 'bathroom-remodeling-services',
                published_at: new Date().toISOString()
            },
            expectedCategory: 'bathroom-remodeling'
        },
        {
            name: 'Home Remodeling with Kitchen (should go to kitchen category)',
            post: {
                html: '<p>Kitchen renovation guide</p>',
                title: 'Kitchen Remodeling',
                id: 'test-hr-3',
                slug: 'kitchen-remodeling-tips',
                published_at: new Date().toISOString()
            },
            expectedCategory: 'kitchen-remodeling'
        },
        {
            name: 'Whole House Remodel',
            post: {
                html: '<p>Complete house renovation</p>',
                title: 'Whole House Remodel',
                id: 'test-hr-4',
                slug: 'whole-house-remodel-process',
                published_at: new Date().toISOString()
            },
            expectedCategory: 'home-remodeling'
        },
        {
            name: 'General Flooring URL',
            post: {
                html: '<p>Flooring installation services</p>',
                title: 'Flooring Services',
                id: 'test-fl-1',
                slug: 'flooring-installation-services',
                published_at: new Date().toISOString()
            },
            expectedCategory: 'flooring'
        },
        {
            name: 'Hardwood Flooring Specific',
            post: {
                html: '<p>Hardwood floor installation</p>',
                title: 'Hardwood Flooring',
                id: 'test-fl-2',
                slug: 'hardwood-flooring-installation',
                published_at: new Date().toISOString()
            },
            expectedCategory: 'flooring'
        },
        {
            name: 'Tile Flooring Specific',
            post: {
                html: '<p>Tile floor installation</p>',
                title: 'Tile Flooring',
                id: 'test-fl-3',
                slug: 'tile-flooring-installation',
                published_at: new Date().toISOString()
            },
            expectedCategory: 'flooring'
        },
        {
            name: 'Floor Repair Service',
            post: {
                html: '<p>Floor repair and maintenance</p>',
                title: 'Floor Repair',
                id: 'test-fl-4',
                slug: 'floor-repair-services',
                published_at: new Date().toISOString()
            },
            expectedCategory: 'flooring'
        },
        {
            name: 'Mixed Category Content (should prioritize URL)',
            post: {
                html: '<p>We do flooring and painting</p>',
                title: 'Home Services',
                id: 'test-edge-1',
                slug: 'flooring-installation-and-painting',
                published_at: new Date().toISOString()
            },
            expectedCategory: 'flooring'
        },
        {
            name: 'Ambiguous Remodeling Content',
            post: {
                html: '<p>Home improvement and remodeling</p>',
                title: 'Remodeling Services',
                id: 'test-edge-2',
                slug: 'home-improvement-services',
                published_at: new Date().toISOString()
            },
            expectedCategory: 'home-remodeling'
        }
    ];

    testCases.forEach(({ name, post, expectedCategory }) => {
        it(`should correctly categorize: ${name}`, () => {
            const category = extractPostCategory(post);
            expect(category).toBe(expectedCategory);
        });
    });
});
