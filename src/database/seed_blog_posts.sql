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
        'plumbers',
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
    ),
    (
        'Common Plumbing Problems and How to Fix Them',
        'common-plumbing-problems-solutions',
        '<p>A comprehensive guide to identifying and fixing common household plumbing issues...</p>',
        '/images/blog/plumbing-problems.jpg',
        'Plumber working on sink',
        'Learn how to diagnose and fix common plumbing problems with our expert troubleshooting guide.',
        'plumbers',
        7
    ),
    (
        'Water Heater Maintenance: A Complete Guide',
        'water-heater-maintenance-guide',
        '<p>Everything you need to know about maintaining your water heater for optimal performance...</p>',
        '/images/blog/water-heater.jpg',
        'Modern water heater installation',
        'Keep your water heater running efficiently with our comprehensive maintenance guide.',
        'plumbers',
        10
    );

-- Add more sample posts as needed
