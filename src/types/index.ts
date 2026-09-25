export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number;
  category: 'Apparel' | 'Event & Signage' | 'VIP Kits' | 'Digital Systems';
  images: string[];
  variants: ProductVariant[];
  features: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  featured: boolean;
  badge?: string;
  sku: string;
  leadTime: string;
  specs?: Record<string, string>;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  selectedVariants: Record<string, string>;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  companyName: string;
  workEmail: string;
  phone: string;
  address: string;
  suite?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  deliveryInstructions?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
  selectedVariants: Record<string, string>;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingMethod: 'standard' | 'express' | 'white-glove';
  status: 'Processing' | 'Production' | 'Dispatched' | 'Delivered';
  paymentMethod: 'invoice' | 'corporate-card';
}
