import { TRADE_TEMPLATES, type TradeSlug } from '@/data/contractor-templates'
import { getLocationData } from '@/data/location-data'

interface ContractorContentParams {
  contractorName: string
  tradeName: string
  tradeSlug: string
  locationName: string
  locationSlug: string
  rating: number
  reviewCount: number
}

export function getRatingTier(rating: number): string {
  if (rating >= 4.8) return 'highly-rated and trusted'
  if (rating >= 4.5) return 'highly-rated'
  if (rating >= 4.0) return 'trusted and verified'
  return 'verified'
}

export function getReviewCountTier(reviewCount: number): string {
  if (reviewCount >= 200) return `with over ${reviewCount} Google reviews`
  if (reviewCount >= 100) return `with ${reviewCount} Google reviews`
  if (reviewCount >= 50) return 'with strong customer feedback'
  return 'building a reputation for quality'
}

export function generateUniqueDescription(params: ContractorContentParams): string {
  const { contractorName, tradeName, locationName, rating, reviewCount, tradeSlug } = params
  
  const ratingTier = getRatingTier(rating)
  const reviewTier = getReviewCountTier(reviewCount)
  const template = TRADE_TEMPLATES[tradeSlug as TradeSlug]
  
  if (!template) {
    return `${contractorName} is a ${ratingTier} ${tradeName.toLowerCase()} serving ${locationName} and the surrounding Denver metro area. ${reviewTier}, they have built a strong reputation for quality workmanship and customer service.`
  }

  const paragraph1 = `${contractorName} is a ${ratingTier} ${tradeName.toLowerCase()} serving ${locationName} and the surrounding Denver metro area. ${reviewTier}, they have built a strong reputation for quality workmanship and customer service.`
  
  const paragraph2 = template.expertiseParagraph
  
  const paragraph3 = `As a verified contractor on Top Contractors Denver, ${contractorName} meets our standards for licensing, insurance, and customer satisfaction. They offer free estimates and competitive pricing for ${locationName} homeowners.`
  
  const paragraph4 = `Contact ${contractorName} today to discuss your ${tradeName.toLowerCase()} project. Their team is ready to provide expert guidance, answer your questions, and deliver the quality results Denver homeowners expect.`
  
  return `${paragraph1}\n\n${paragraph2}\n\n${paragraph3}\n\n${paragraph4}`
}

export function generateServiceAreaText(params: ContractorContentParams): string {
  const { contractorName, locationName, locationSlug } = params
  const locationData = getLocationData(locationSlug)
  
  const nearbyCitiesList = locationData.nearbyCities.slice(0, 3).join(', ')
  const expandedCitiesList = locationData.nearbyCities.join(', ')
  
  return `${contractorName} proudly serves ${locationName} and nearby communities including ${nearbyCitiesList}. Licensed and insured to work throughout ${locationData.county} County, Colorado.\n\nService areas include: ${expandedCitiesList}\n\nTypical service radius: ${locationData.serviceRadius} miles from ${locationName}. Contact us to confirm service availability in your area.`
}

export function generateCustomerSummary(params: ContractorContentParams): string {
  const { contractorName, rating } = params
  
  if (rating >= 4.5) {
    return `Customers consistently praise ${contractorName} for their professionalism, clear communication, and quality workmanship. Reviews frequently highlight their attention to detail, timely project completion, and fair pricing. Many customers note their willingness to explain the work and answer questions throughout the project.`
  }
  
  if (rating >= 4.0) {
    return `${contractorName} has built a solid reputation for reliable service and quality work. Customers appreciate their straightforward approach and competitive pricing. Reviews indicate consistent performance and professional service delivery.`
  }
  
  return `As a verified contractor on Top Contractors Denver, ${contractorName} meets our standards for licensing, insurance, and professional service. We encourage you to contact them directly to discuss your project needs and expectations.`
}

export function getTradeTemplate(tradeSlug: string) {
  return TRADE_TEMPLATES[tradeSlug as TradeSlug] || null
}

export function generateFAQs(params: ContractorContentParams) {
  const { contractorName, tradeName, locationName, tradeSlug, locationSlug } = params
  const template = TRADE_TEMPLATES[tradeSlug as TradeSlug]
  const locationData = getLocationData(locationSlug)
  
  if (!template) return []
  
  // Replace placeholders in FAQ answers
  return template.faqs.map(faq => ({
    q: faq.q,
    a: faq.a
      .replace(/\{contractor_name\}/gi, contractorName)
      .replace(/\{trade\}/gi, tradeName.toLowerCase())
      .replace(/\{location\}/gi, locationName)
      .replace(/\{county\}/gi, locationData.county)
  }))
}

// Varied anchor text for internal links
const GUIDE_ANCHOR_VARIATIONS = [
  'Learn more about {topic}',
  'View our guide on {topic}',
  'Explore {topic}',
  'Read about {topic}',
  'See our {topic} guide',
]

export function getVariedAnchor(guideTopic: string, index: number = 0): string {
  const variation = GUIDE_ANCHOR_VARIATIONS[index % GUIDE_ANCHOR_VARIATIONS.length]
  return variation.replace('{topic}', guideTopic)
}

const CONTRACTOR_ANCHOR_VARIATIONS = [
  'View {contractor} profile',
  'Learn about {contractor}',
  'See {contractor} details',
  'Check out {contractor}',
  'Visit {contractor} page',
]

export function getVariedContractorAnchor(contractorName: string, index: number = 0): string {
  const variation = CONTRACTOR_ANCHOR_VARIATIONS[index % CONTRACTOR_ANCHOR_VARIATIONS.length]
  return variation.replace('{contractor}', contractorName)
}
