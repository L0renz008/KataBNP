// export type Property = [][];
export interface Property {
  propertyid?: number;
  address: string;
  property_type?: 'Residential' | 'Commercial';
  status?: 'Vacant' | 'Occupied';
  purchase_date?: Date;
  price?: number;
}

export type PropertyArray = [
  number,
  string,
  'Residential' | 'Commercial' | null,
  'Vacant' | 'Occupied' | null,
  string,
  number
];
