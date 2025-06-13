export interface OrderCategory {
  id: number;
  name: string;
  description: string;
  parent_id: number | null;
}