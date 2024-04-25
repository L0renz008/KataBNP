export interface Tenant {
  tenantid?: number;
  name: string;
  contact_info?: string;
  lease_term_start?: Date;
  lease_term_end?: Date;
  rental_payment_status?: 'Paid' | 'Pending' | null;
  propertyid?: number;
}

export type TenantArray = [
  number,
  string,
  string,
  string,
  string,
  'Paid' | 'Pending',
  number
];
