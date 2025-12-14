export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped';
  date: string;
}

export type ViewState = 
  | 'HOME' 
  | 'SHOP' 
  | 'PRODUCT_DETAIL' 
  | 'CART' 
  | 'CHECKOUT' 
  | 'LOGIN' 
  | 'REGISTER' 
  | 'ADMIN'
  | 'POLICY';