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
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  updatedAt: string;
  seller: {
    name: string;
  };
}

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
    category?: {
      name: string;
    };
    subcategory?: {
      name: string;
    };
    buyer?: {
      name: string;
    };
  };
  application: {
    id: string;
    createdAt: string;
    seller?: {
      name: string;
    };
  };
}

export interface WorkListData {
  id: string;
  orderRequestId: string;
  sellerId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderRequest: {
    id: string;
    title: string;
    category: {
      name: string;
    };
    subcategory: {
      name: string;
    };
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
