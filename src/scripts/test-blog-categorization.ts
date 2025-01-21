import { extractPostCategory } from '../utils/ghost';

interface TestCase {
  input: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    html: string;
    published_at: string;
  };
  expectedCategory: string;
}

const testCases: TestCase[] = [
  {
    input: {
      id: "test-1",
      slug: "plumbing-tips",
      title: "10 Essential Plumbing Tips for Homeowners",
      excerpt: "Learn important plumbing maintenance tips to prevent costly repairs.",
      html: "Plumbing issues can be a major headache for homeowners...",
      published_at: new Date().toISOString()
    },
    expectedCategory: "plumbing"
  },
  {
    input: {
      id: "test-2",
      slug: "hvac-guide",
      title: "How to Choose the Right HVAC System",
      excerpt: "A guide to selecting the perfect heating and cooling system for your home.",
      html: "When it comes to HVAC systems, one size doesn't fit all...",
      published_at: new Date().toISOString()
    },
    expectedCategory: "hvac"
  }
];

function runTests() {
  console.log('Starting blog categorization tests...\n');

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const result = extractPostCategory(testCase.input);

    console.log(`Test Case ${i + 1}:`);
    console.log('Input:', testCase.input);
    console.log('Expected Category:', testCase.expectedCategory);
    console.log('Actual Category:', result);
    console.log('Result:', result === testCase.expectedCategory ? 'PASS' : 'FAIL');
    console.log('---\n');
  }
}

runTests();
