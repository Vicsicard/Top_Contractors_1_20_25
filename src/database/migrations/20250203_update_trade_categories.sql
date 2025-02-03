-- Update trade categories to match the new standardized system
UPDATE posts
SET trade_category = 'bathroom remodeling'
WHERE trade_category IN ('bathroom-remodeling', 'bathroom', 'bathrooms', 'bathroom remodel');

UPDATE posts
SET trade_category = 'electrician'
WHERE trade_category IN ('electrical', 'electric');

UPDATE posts
SET trade_category = 'epoxy garage'
WHERE trade_category IN ('epoxy-garage', 'epoxy', 'garage flooring');

UPDATE posts
SET trade_category = 'home remodeling'
WHERE trade_category IN ('home-remodeling', 'remodeling', 'renovation', 'general');

UPDATE posts
SET trade_category = 'kitchen remodeling'
WHERE trade_category IN ('kitchen-remodeling', 'kitchen', 'kitchens');

UPDATE posts
SET trade_category = 'landscaper'
WHERE trade_category IN ('landscaping', 'landscape');

UPDATE posts
SET trade_category = 'roofer'
WHERE trade_category IN ('roofing', 'roof');

-- Verify that all trade categories match our standard list
DO $$ 
BEGIN
  -- Create a temporary table with our valid categories
  CREATE TEMP TABLE valid_categories (category TEXT);
  
  INSERT INTO valid_categories (category) VALUES
    ('bathroom remodeling'),
    ('decks'),
    ('electrician'),
    ('epoxy garage'),
    ('fencing'),
    ('flooring'),
    ('home remodeling'),
    ('hvac'),
    ('kitchen remodeling'),
    ('landscaper'),
    ('masonry'),
    ('plumbing'),
    ('roofer'),
    ('windows');

  -- Check for any posts with invalid categories
  IF EXISTS (
    SELECT 1 
    FROM posts p
    LEFT JOIN valid_categories v ON p.trade_category = v.category
    WHERE v.category IS NULL
  ) THEN
    -- List any invalid categories found
    RAISE NOTICE 'Invalid categories found:';
    SELECT DISTINCT trade_category
    FROM posts p
    LEFT JOIN valid_categories v ON p.trade_category = v.category
    WHERE v.category IS NULL;
    
    RAISE EXCEPTION 'Found posts with invalid trade categories. Please fix these manually.';
  END IF;
END $$;

-- Update the posts_tags table to use the new category names
UPDATE posts_tags pt
SET 
  name = CASE
    WHEN name IN ('bathroom-remodeling', 'bathroom', 'bathrooms') THEN 'bathroom remodeling'
    WHEN name IN ('electrical', 'electric') THEN 'electrician'
    WHEN name IN ('epoxy-garage', 'epoxy') THEN 'epoxy garage'
    WHEN name IN ('home-remodeling', 'remodeling') THEN 'home remodeling'
    WHEN name IN ('kitchen-remodeling', 'kitchen', 'kitchens') THEN 'kitchen remodeling'
    WHEN name = 'landscaping' THEN 'landscaper'
    WHEN name = 'roofing' THEN 'roofer'
    ELSE name
  END,
  slug = CASE
    WHEN slug IN ('bathroom-remodeling', 'bathroom', 'bathrooms') THEN 'bathroom-remodeling'
    WHEN slug IN ('electrical', 'electric') THEN 'electrician'
    WHEN slug IN ('epoxy-garage', 'epoxy') THEN 'epoxy-garage'
    WHEN slug IN ('home-remodeling', 'remodeling') THEN 'home-remodeling'
    WHEN slug IN ('kitchen-remodeling', 'kitchen', 'kitchens') THEN 'kitchen-remodeling'
    WHEN slug = 'landscaping' THEN 'landscaper'
    WHEN slug = 'roofing' THEN 'roofer'
    ELSE slug
  END
WHERE name IN (
  'bathroom-remodeling', 'bathroom', 'bathrooms',
  'electrical', 'electric',
  'epoxy-garage', 'epoxy',
  'home-remodeling', 'remodeling',
  'kitchen-remodeling', 'kitchen', 'kitchens',
  'landscaping',
  'roofing'
);
