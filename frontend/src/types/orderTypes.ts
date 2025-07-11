export interface OrderCategory {
  id: number;
  name: string;
  parentId: number | null;
}

export interface OrderData {
  id: string;
  buyerId: string;
  categoryId: number;
  subcategoryId: number;
  title: string;
  description?: string;
  desiredQuantity: number;
  deadline?: string;
  requiredPoints: number;
  status: "pending" | "progress" | "completed" | "cancelled";
  createdAt: string;
  buyer: {
    name: string;
  };
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  };
  myApplicationStatus?: "pending" | "accepted" | "rejected" | null;
  hasApplied?: boolean;
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

export interface WorkProgressData {
  id: string;
  workItemId: string;
  progressPercent: number;
  status: "not_started" | "in_progress" | "completed";
  title: string;
  description?: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkProgressData {
  workItemId: string;
  progressPercent: number;
  status: "not_started" | "in_progress" | "completed";
  title: string;
  description?: string;
  imageUrls?: string[];
}

// WorkList 관련 타입들
export interface WorkItemData {
  id: string;
  orderRequestId: string;
  applicationId: string;
  fileUrl?: string;
  workLink?: string;
  description?: string;
  status: string;
  submittedAt?: string;
  orderRequest: {
    id: string;
    title: string;
    description: string;
    requiredPoints: number;
    status: string;
    createdAt: string;
    buyer?: {
      name: string;
    };
  };
  application: {
    id: string;
    message?: string;
    proposedPrice?: number;
    estimatedDelivery?: string;
    createdAt: string;
    seller?: {
      name: string;
    };
  };
}

export interface WorkListApplicationData {
  id: string;
  orderRequestId: string;
  sellerId: string;
  message?: string;
  proposedPrice?: number;
  estimatedDelivery?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderRequest: {
    id: string;
    title: string;
    description: string;
    requiredPoints: number;
    status: string;
    createdAt: string;
    buyer: {
      name: string;
    };
  };
  workItems: {
    id: string;
    description?: string;
    status: string;
    submittedAt?: string;
    workLink?: string;
    fileUrl?: string;
  }[];
}
