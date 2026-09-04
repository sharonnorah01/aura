export type ProductCategory = 'All' | 'Apparel' | 'Footwear' | 'Accessories' | 'Home & Living' | 'Lifestyle';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  tag?: 'Bestseller' | 'New Arrival' | 'Limited Edition' | 'Sale' | 'Staff Pick';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: ProductCategory;
  description: string;
  image: string;
  gallery: string[];
  colors: ProductColor[];
  sizes: string[];
  inStock: boolean;
  stockCount: number;
  features: string[];
}

export interface CartItem {
  id: string; // unique key combining productId, color, size
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  maxStock: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  promoCode?: string;
  promoDiscountPercent?: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  promoCode?: string;
  customer: CustomerInfo;
  paymentMethod: string;
  status: 'Confirmed' | 'Processing' | 'Shipped';
}

export interface FilterState {
  category: ProductCategory;
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  maxPrice: number;
  inStockOnly: boolean;
}
