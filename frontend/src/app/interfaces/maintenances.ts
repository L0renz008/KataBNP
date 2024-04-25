export interface Maintenance {
  taskid?: number;
  description: string;
  status?: 'In Progress' | 'Completed' | 'Pending';
  scheduled_date?: Date;
  propertyid?: number;
}
