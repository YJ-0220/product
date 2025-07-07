export interface OrderCategory {
  id: number;
  name: string;
  parentId: number | null;
}

export interface OrderData {
  id: string;
  categoryId: number;
  subcategoryId: number;
  title: string;
  description: string;
  desiredQuantity: number;
  requiredPoints: number;
  deadline: string;
  createdAt: string;
  buyerId: string;
  buyer: {
    name: string;
  };
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  };
  status: "pending" | "progress" | "completed" | "cancelled";
}

export interface ApplicationData {
  id: string;
  orderRequestId: string;
  sellerId: string;
  message?: string;
  proposedPrice?: number;
  estimatedDelivery?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  updatedAt: string;
  seller: {
    name: string;
  };
}
