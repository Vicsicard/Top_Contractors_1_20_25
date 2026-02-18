export interface LocationData {
  nearbyCities: string[]
  county: string
  serviceRadius: number
}

export const LOCATION_DATA: Record<string, LocationData> = {
  'aurora': {
    nearbyCities: ['Denver', 'Centennial', 'Parker', 'Greenwood Village', 'Glendale'],
    county: 'Arapahoe',
    serviceRadius: 20,
  },
  'lakewood': {
    nearbyCities: ['Denver', 'Golden', 'Wheat Ridge', 'Arvada', 'Edgewater'],
    county: 'Jefferson',
    serviceRadius: 20,
  },
  'arvada': {
    nearbyCities: ['Westminster', 'Wheat Ridge', 'Broomfield', 'Thornton', 'Denver'],
    county: 'Jefferson',
    serviceRadius: 20,
  },
  'westminster': {
    nearbyCities: ['Thornton', 'Broomfield', 'Arvada', 'Northglenn', 'Commerce City'],
    county: 'Adams',
    serviceRadius: 20,
  },
  'thornton': {
    nearbyCities: ['Northglenn', 'Westminster', 'Commerce City', 'Brighton', 'Denver'],
    county: 'Adams',
    serviceRadius: 20,
  },
  'centennial': {
    nearbyCities: ['Aurora', 'Littleton', 'Englewood', 'Greenwood Village', 'Parker'],
    county: 'Arapahoe',
    serviceRadius: 20,
  },
  'littleton': {
    nearbyCities: ['Englewood', 'Centennial', 'Highlands Ranch', 'Ken Caryl', 'Columbine'],
    county: 'Arapahoe',
    serviceRadius: 20,
  },
  'highlands-ranch': {
    nearbyCities: ['Littleton', 'Lone Tree', 'Castle Rock', 'Parker', 'Centennial'],
    county: 'Douglas',
    serviceRadius: 20,
  },
  'boulder': {
    nearbyCities: ['Louisville', 'Lafayette', 'Broomfield', 'Superior', 'Longmont'],
    county: 'Boulder',
    serviceRadius: 15,
  },
  'broomfield': {
    nearbyCities: ['Westminster', 'Thornton', 'Louisville', 'Lafayette', 'Arvada'],
    county: 'Broomfield',
    serviceRadius: 20,
  },
  'castle-rock': {
    nearbyCities: ['Highlands Ranch', 'Parker', 'Lone Tree', 'Larkspur', 'Franktown'],
    county: 'Douglas',
    serviceRadius: 20,
  },
  'parker': {
    nearbyCities: ['Aurora', 'Centennial', 'Castle Rock', 'Lone Tree', 'Elizabeth'],
    county: 'Douglas',
    serviceRadius: 20,
  },
  'commerce-city': {
    nearbyCities: ['Thornton', 'Brighton', 'Northglenn', 'Westminster', 'Denver'],
    county: 'Adams',
    serviceRadius: 20,
  },
  'wheat-ridge': {
    nearbyCities: ['Arvada', 'Lakewood', 'Golden', 'Westminster', 'Denver'],
    county: 'Jefferson',
    serviceRadius: 20,
  },
}

export function getLocationData(subregionSlug: string): LocationData {
  return LOCATION_DATA[subregionSlug] || {
    nearbyCities: ['Denver'],
    county: 'Denver',
    serviceRadius: 15,
  }
}
