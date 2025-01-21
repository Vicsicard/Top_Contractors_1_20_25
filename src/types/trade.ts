export interface TradeData {
  name: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heading: string;
  subheading: string;
  description: string;
  shortDescription: string;
  icon: string;
  benefits: string[];
  services: string[];
  faqQuestions: {
    question: string;
    answer: string;
  }[];
  keywords: string[];
  category: string;
}
