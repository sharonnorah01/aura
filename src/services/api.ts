import { CartState, FilterState, Order, Product } from '../types';

export const api = {
  async getProducts(filters?: Partial<FilterState>): Promise<{ products: Product[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'All') {
      params.append('category', filters.category);
    }
    if (filters?.searchQuery) {
      params.append('search', filters.searchQuery);
    }
    if (filters?.sortBy) {
      params.append('sort', filters.sortBy);
    }
    if (filters?.inStockOnly) {
      params.append('inStock', 'true');
    }
    if (filters?.maxPrice && filters.maxPrice < 500) {
      params.append('maxPrice', filters.maxPrice.toString());
    }

    const res = await fetch(`/api/products?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product details');
    return res.json();
  },

  async getCart(): Promise<CartState> {
    const res = await fetch('/api/cart');
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
  },

  async addToCart(productId: string, quantity = 1, selectedColor?: string, selectedSize?: string): Promise<CartState> {
    const res = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity, selectedColor, selectedSize })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to add item to cart');
    }
    return res.json();
  },

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartState> {
    const res = await fetch('/api/cart/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, quantity })
    });
    if (!res.ok) throw new Error('Failed to update cart item');
    return res.json();
  },

  async removeCartItem(id: string): Promise<CartState> {
    const res = await fetch(`/api/cart/item/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to remove item from cart');
    return res.json();
  },

  async clearCart(): Promise<CartState> {
    const res = await fetch('/api/cart/clear', {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to clear cart');
    return res.json();
  },

  async applyPromoCode(promoCode: string): Promise<CartState & { message?: string }> {
    const res = await fetch('/api/cart/promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promoCode })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Invalid promo code');
    }
    return res.json();
  },

  async getOrders(): Promise<{ orders: Order[] }> {
    const res = await fetch('/api/orders');
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async createOrder(customer: Order['customer'], paymentMethod: string): Promise<{ success: boolean; order: Order; message: string }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer, paymentMethod })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to complete order');
    }
    return res.json();
  },

  async resetDemo(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/reset-demo', {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset store demo');
    return res.json();
  }
};
