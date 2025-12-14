import React, { createContext, useContext, useState } from 'react';
import { Product, CartItem, User, Order, ViewState } from '../types';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  orders: Order[];
  view: ViewState;
  selectedProductId: string | null;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, delta: number) => void;
  clearCart: () => void;
  login: (email: string, role: 'admin' | 'customer') => void;
  logout: () => void;
  placeOrder: (address: string) => void;
  setView: (view: ViewState) => void;
  navigateToProduct: (id: string) => void;
  proceedToCheckout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_PRODUCTS: Product[] = [
  // MEN
  {
    id: '1',
    name: 'Slim Fit Casual Shirt',
    brand: 'Roadster',
    price: 699,
    originalPrice: 1299,
    discount: 46,
    category: 'Men',
    description: 'Olive green sustainable casual shirt, has a spread collar, button placket, 1 pocket, long sleeves, curved hem.',
    images: ['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1519766304807-bf6667090886?q=80&w=2070&auto=format&fit=crop'],
    sizes: ['38', '40', '42', '44'],
    colors: ['Olive', 'Navy']
  },
  {
    id: '3',
    name: 'Running Shoes',
    brand: 'HRX by Hrithik Roshan',
    price: 1499,
    originalPrice: 3299,
    discount: 54,
    category: 'Men',
    description: 'Grey and white running shoes, has central lace-ups and mesh upper.',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop'],
    sizes: ['7', '8', '9', '10'],
    colors: ['Grey', 'Black']
  },
  {
    id: '5',
    name: 'Slim Fit Jeans',
    brand: 'Highlander',
    price: 799,
    originalPrice: 1599,
    discount: 50,
    category: 'Men',
    description: 'Blue dark wash 5-pocket jeans, light fade, clean look.',
    images: ['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=2070&auto=format&fit=crop'],
    sizes: ['30', '32', '34', '36'],
    colors: ['Blue', 'Black']
  },
  {
    id: 'm1',
    name: 'Classic Leather Jacket',
    brand: 'Jack & Jones',
    price: 3499,
    originalPrice: 6999,
    discount: 50,
    category: 'Men',
    description: 'Black solid leather jacket, has a mock collar, 2 pockets, zip closure, long sleeves, straight hem, and polyester lining.',
    images: ['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2000&auto=format&fit=crop'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'Brown']
  },
  {
    id: 'm2',
    name: 'Cotton Linen Kurta',
    brand: 'FabIndia',
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    category: 'Men',
    description: 'White solid straight kurta, has a mandarin collar, long sleeves, straight hem, and side slits.',
    images: ['https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?q=80&w=2000&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Beige']
  },
  {
    id: 'm3',
    name: 'Formal Blazer',
    brand: 'Raymond',
    price: 4999,
    originalPrice: 7999,
    discount: 37,
    category: 'Men',
    description: 'Navy Blue solid single-breasted formal blazer, has a notched lapel, double-button closure, and long sleeves.',
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop'],
    sizes: ['38', '40', '42', '44'],
    colors: ['Navy', 'Black']
  },
  {
    id: 'm4',
    name: 'Vintage Wide Cuff Jeans',
    brand: 'Urban Retro',
    price: 2499,
    originalPrice: 3999,
    discount: 37,
    category: 'Men',
    description: 'Relaxed fit dark wash denim with statement wide cuffs. Perfect for a casual, street-style look.',
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop'],
    sizes: ['30', '32', '34', '36'],
    colors: ['Dark Blue']
  },
  
  // WOMEN
  {
    id: '2',
    name: 'Printed Anarkali Kurta',
    brand: 'Anouk',
    price: 899,
    originalPrice: 2499,
    discount: 64,
    category: 'Women',
    description: 'Navy blue and white printed Anarkali kurta with trousers and dupatta.',
    images: ['https://images.unsplash.com/photo-1585914924626-15adac1e6402?q=80&w=2071&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Red']
  },
  {
    id: '4',
    name: 'Floral Maxi Dress',
    brand: 'DressBerry',
    price: 1199,
    originalPrice: 2299,
    discount: 47,
    category: 'Women',
    description: 'Pink floral print maxi dress, has a V-neck, sleeveless, and flared hem.',
    images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L'],
    colors: ['Pink', 'Yellow']
  },
  {
    id: 'w1',
    name: 'Silk Saree',
    brand: 'Saree Mall',
    price: 2499,
    originalPrice: 5999,
    discount: 58,
    category: 'Women',
    description: 'Red and Gold-toned ethnic motifs woven design silk blend Banarasi saree with blouse piece.',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2000&auto=format&fit=crop'],
    sizes: ['Free Size'],
    colors: ['Red', 'Green']
  },
  {
    id: 'w2',
    name: 'High-Waist Trousers',
    brand: 'Mango',
    price: 1899,
    originalPrice: 2990,
    discount: 36,
    category: 'Women',
    description: 'Beige solid high-rise trousers, has a hook and bar closure, and 2 pockets.',
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=2000&auto=format&fit=crop'],
    sizes: ['26', '28', '30', '32'],
    colors: ['Beige', 'Black']
  },
  {
    id: 'w4',
    name: 'Party Wear Heels',
    brand: 'Catwalk',
    price: 1599,
    originalPrice: 3299,
    discount: 51,
    category: 'Women',
    description: 'Rose Gold-toned open toe sandals with high-top styling and buckle closure.',
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2000&auto=format&fit=crop'],
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7'],
    colors: ['Rose Gold', 'Silver']
  },

  // KIDS
  {
    id: 'k1',
    name: 'Denim Dungarees',
    brand: 'Mothercare',
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    category: 'Kids',
    description: 'Blue washed denim dungarees, has adjustable shoulder straps, 4 pockets.',
    images: ['https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=2000&auto=format&fit=crop'],
    sizes: ['2-3Y', '3-4Y', '4-5Y'],
    colors: ['Blue']
  },
  {
    id: 'k2',
    name: 'Party Frock',
    brand: 'Gini & Jony',
    price: 1499,
    originalPrice: 2499,
    discount: 40,
    category: 'Kids',
    description: 'Pink sequinned fit and flare dress, has a round neck, sleeveless, zip closure.',
    images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=2000&auto=format&fit=crop'],
    sizes: ['5-6Y', '7-8Y'],
    colors: ['Pink']
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [view, setView] = useState<ViewState>('HOME');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [pendingCheckout, setPendingCheckout] = useState(false);

  const addProduct = (product: Product) => setProducts([...products, product]);
  
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

  const addToCart = (product: Product, size: string, color: string) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id && p.selectedSize === size && p.selectedColor === color);
      if (existing) {
        return prev.map(p => p === existing ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart(prev => prev.filter(p => !(p.id === productId && p.selectedSize === size && p.selectedColor === color)));
  };

  const updateCartQuantity = (productId: string, size: string, color: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId && item.selectedSize === size && item.selectedColor === color) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const login = (email: string, role: 'admin' | 'customer') => {
    setUser({ id: Date.now().toString(), email, name: email.split('@')[0], role });
    if (pendingCheckout) {
      setView('CHECKOUT');
      setPendingCheckout(false);
    } else {
      setView('HOME');
    }
  };

  const logout = () => {
    setUser(null);
    setView('HOME');
  };

  const proceedToCheckout = () => {
    if (user) {
      setView('CHECKOUT');
    } else {
      setPendingCheckout(true);
      setView('LOGIN');
    }
  };

  const placeOrder = (address: string) => {
    if (!user) return;
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      date: new Date().toISOString()
    };
    setOrders([newOrder, ...orders]);
    clearCart();
    setView('HOME');
  };

  const navigateToProduct = (id: string) => {
    setSelectedProductId(id);
    setView('PRODUCT_DETAIL');
  };

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      user,
      orders,
      view,
      selectedProductId,
      addProduct,
      deleteProduct,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      login,
      logout,
      placeOrder,
      setView,
      navigateToProduct,
      proceedToCheckout
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};