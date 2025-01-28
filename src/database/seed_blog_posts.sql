-- Insert sample blog posts for different trade categories
insert into posts (title, slug, html, feature_image, feature_image_alt, excerpt, trade_category, reading_time)
values
    (
        'Top 10 Home Remodeling Trends for 2025',
        'top-10-home-remodeling-trends-2025',
        '<p>Discover the latest home remodeling trends that are taking Denver by storm in 2025...</p>',
        '/images/blog/home-remodeling-trends.jpg',
        'Modern home interior after remodeling',
        'Stay ahead of the curve with these emerging home remodeling trends that combine style, sustainability, and smart technology.',
        'home-remodeling',
        8
    ),
    (
        'Essential Plumbing Maintenance Tips for Winter',
        'winter-plumbing-maintenance-tips',
        '<p>Protect your pipes and prevent costly repairs with these essential winter maintenance tips...</p>',
        '/images/blog/winter-plumbing.jpg',
        'Plumber fixing a pipe',
        'Learn how to protect your plumbing system during Denver''s cold winter months with our expert maintenance guide.',
        'plumber',
        6
    ),
    (
        'How to Choose the Right HVAC System',
        'choosing-right-hvac-system',
        '<p>A comprehensive guide to selecting the perfect HVAC system for your Denver home...</p>',
        '/images/blog/hvac-guide.jpg',
        'Modern HVAC system installation',
        'Navigate the complex world of HVAC systems with our expert guide to finding the perfect solution for your home.',
        'hvac',
        10
    );

-- Add more sample posts as needed
