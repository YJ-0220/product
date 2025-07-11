export interface FormInputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  type?: string;
  rows?: number;
  options?: Array<{ id: number; name: string } | { value: string; label: string }>;
  placeholder?: string;
  min?: string;
  max?: string;
}

export interface OrderRequestData {
  categoryId: number;
  subcategoryId: number;
  title: string;
  description: string;
  desiredQuantity: string;
  requiredPoints: string;
  deadline: string;
}

export interface CreateApplicationData {
  message?: string;
  proposedPrice?: number;
  estimatedDelivery?: string;
} 