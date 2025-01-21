import { Metadata } from 'next';
import { tradesData } from './trades-data';

interface LocationMetadataParams {
  trade: string;
  region: string;
  area?: string;
}

export function getMetadataByLocation({ trade, region, area }: LocationMetadataParams): Metadata {
  const tradeData = tradesData[trade.toLowerCase() as keyof typeof tradesData];
  
  if (!tradeData) {
    return {
      title: 'Service Not Found | Professional Services Directory',
      description: 'The requested service category could not be found.',
    };
  }

  return {
    title: `${tradeData.title} in ${area}, ${region} | Professional Services`,
    description: `Find top-rated ${tradeData.title.toLowerCase()} in ${area}, ${region}. Licensed, insured professionals with great reviews.`,
    keywords: [
      `${area} ${tradeData.title.toLowerCase()}`,
      `${region} ${tradeData.title.toLowerCase()}`,
      `local ${tradeData.title.toLowerCase()} ${area}`,
      ...tradeData.services.map(service => `${service.toLowerCase()} ${area}`)
    ],
  };
}

export function getMetadataForTradeRegion({ trade, region }: { trade: string; region: string }): Metadata {
  const tradeData = tradesData[trade.toLowerCase() as keyof typeof tradesData];
  
  if (!tradeData) {
    return {
      title: 'Service Not Found | Professional Services Directory',
      description: 'The requested service category could not be found.',
    };
  }

  return {
    title: `${tradeData.title} in ${region} | Professional Services`,
    description: `Find top-rated ${tradeData.title.toLowerCase()} professionals in ${region}. Licensed, insured experts with great reviews.`,
    keywords: [
      `${region} ${tradeData.title.toLowerCase()}`,
      `${tradeData.title.toLowerCase()} services ${region}`,
      `local ${tradeData.title.toLowerCase()} ${region}`,
      ...tradeData.services.map(service => `${service.toLowerCase()} ${region}`)
    ],
  };
}

export function getMetadataForTrade({ trade }: { trade: string }): Metadata {
  const tradeData = tradesData[trade.toLowerCase() as keyof typeof tradesData];
  
  if (!tradeData) {
    return {
      title: 'Service Not Found | Professional Services Directory',
      description: 'The requested service category could not be found.',
    };
  }

  return {
    title: `${tradeData.title} Services | Professional Services Directory`,
    description: `Find top-rated ${tradeData.title.toLowerCase()} professionals. Licensed, insured experts with great reviews.`,
    keywords: [
      `${tradeData.title.toLowerCase()} services`,
      `professional ${tradeData.title.toLowerCase()}`,
      `local ${tradeData.title.toLowerCase()}`,
      ...tradeData.services.map(service => service.toLowerCase())
    ],
  };
}
