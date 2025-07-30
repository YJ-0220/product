export interface User {
  id: string;
  username: string;
  role: string;
  membershipLevel?: string;
  points?: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
