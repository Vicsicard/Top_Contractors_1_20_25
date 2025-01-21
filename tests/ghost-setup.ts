import '@testing-library/jest-dom';

// Mock Ghost API environment variables
process.env.GHOST_URL = 'http://localhost:2368';
process.env.GHOST_KEY = 'test-content-key';

// Mock Ghost API client
jest.mock('@tryghost/content-api', () => {
    return jest.fn().mockImplementation(() => ({
        posts: {
            browse: jest.fn().mockResolvedValue([
                {
                    id: 'test-1',
                    title: 'Test Post',
                    slug: 'test-1',
                    html: '<p>Test content</p>',
                    published_at: new Date().toISOString()
                }
            ])
        }
    }));
});
