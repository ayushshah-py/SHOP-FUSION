import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, User as UserIcon, LogOut, Trash2, Plus, ArrowRight, Star, Search, Filter, Heart, ChevronRight, Mail, Phone, CreditCard, Banknote, Image as ImageIcon, Loader2 } from 'lucide-react';
import { StoreProvider, useStore } from './contexts/StoreContext';
import AIStylist from './components/AIStylist';
import { generateProductDescription, generateProductImage } from './services/geminiService';
import { Product } from './types';

// Shop Fusion Colors & Theme
// Primary Pink: #ff3f6c (Kept for action buttons)
// Text: #282c3f

// Robust Image Component to handle loading errors
const ImageWithFallback: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ src, alt, className, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src as string | undefined);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src as string | undefined);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      // Fallback to a high-quality generic fashion image
      setImgSrc('https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?q=80&w=1000&auto=format&fit=crop');
      setHasError(true);
    }
  };

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      className={`${className} transition-opacity duration-300 ${hasError ? 'opacity-80' : 'opacity-100'}`}
      onError={handleError}
      loading="lazy"
    />
  );
};

const Navbar: React.FC = () => {
  const { cart, user, setView, logout } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-sm font-sans">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex items-center gap-8">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden">
              <Menu size={24} />
            </button>
            <div 
              onClick={() => setView('HOME')} 
              className="cursor-pointer flex items-center gap-2"
            >
              {/* Logo Placeholder */}
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                S
              </div>
              <span className="text-xl font-extrabold tracking-tight hidden sm:block text-gray-800">SHOP FUSION</span>
            </div>

            <div className="hidden lg:flex items-center space-x-8 text-sm font-bold text-[#282c3f] tracking-wide h-20">
              <button onClick={() => setView('SHOP')} className="h-full border-b-4 border-transparent hover:border-[#ff3f6c] px-2 transition-all flex items-center">MEN</button>
              <button onClick={() => setView('SHOP')} className="h-full border-b-4 border-transparent hover:border-[#ff3f6c] px-2 transition-all flex items-center">WOMEN</button>
              <button onClick={() => setView('SHOP')} className="h-full border-b-4 border-transparent hover:border-[#ff3f6c] px-2 transition-all flex items-center">KIDS</button>
              <button onClick={() => setView('SHOP')} className="h-full border-b-4 border-transparent hover:border-[#ff3f6c] px-2 transition-all flex items-center">HOME & LIVING</button>
              <button onClick={() => setView('SHOP')} className="h-full border-b-4 border-transparent hover:border-[#ff3f6c] px-2 transition-all flex items-center">BEAUTY</button>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-8 hidden lg:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search for products, brands and more" 
                className="w-full bg-[#f5f5f6] text-sm py-2.5 pl-10 pr-4 rounded-md focus:outline-none focus:bg-white focus:border focus:border-gray-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center cursor-pointer group relative">
               {user ? (
                 <div className="flex flex-col items-center" onClick={logout}>
                    <div className="w-5 h-5 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold mb-0.5">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="text-xs font-bold hidden sm:block max-w-[80px] truncate">{user.name}</span>
                 </div>
               ) : (
                 <div className="flex flex-col items-center" onClick={() => setView('LOGIN')}>
                    <UserIcon size={20} className="text-gray-700 mb-0.5" />
                    <span className="text-xs font-bold hidden sm:block">Login/Signup</span>
                 </div>
               )}
            </div>

            <div className="flex flex-col items-center cursor-pointer">
              <Heart size={20} className="text-gray-700 mb-0.5" />
              <span className="text-xs font-bold hidden sm:block">Wishlist</span>
            </div>
            
            <button onClick={() => setView('CART')} className="flex flex-col items-center cursor-pointer relative">
              <ShoppingBag size={20} className="text-gray-700 mb-0.5" />
              <span className="text-xs font-bold hidden sm:block">Bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 right-0 bg-[#ff3f6c] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-lg absolute w-full z-50">
          <button onClick={() => { setView('HOME'); setIsMenuOpen(false); }} className="block w-full text-left font-bold text-sm py-2">HOME</button>
          <button onClick={() => { setView('SHOP'); setIsMenuOpen(false); }} className="block w-full text-left font-bold text-sm py-2">MEN</button>
          <button onClick={() => { setView('SHOP'); setIsMenuOpen(false); }} className="block w-full text-left font-bold text-sm py-2">WOMEN</button>
          <button onClick={() => { setView('SHOP'); setIsMenuOpen(false); }} className="block w-full text-left font-bold text-sm py-2">KIDS</button>
          {user?.role === 'admin' && (
            <button onClick={() => { setView('ADMIN'); setIsMenuOpen(false); }} className="block w-full text-left font-bold text-sm py-2 text-[#ff3f6c]">ADMIN PANEL</button>
          )}
        </div>
      )}
    </nav>
  );
};

const Hero: React.FC = () => {
  const { setView } = useStore();
  return (
    <div className="w-full bg-[#fff5f6] mb-8 cursor-pointer" onClick={() => setView('SHOP')}>
      <div className="max-w-[1600px] mx-auto relative h-[400px] md:h-[500px] flex items-center overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-pink-100 opacity-50"></div>
        
        <div className="relative z-10 w-full px-4 md:px-16 flex flex-col md:flex-row items-center justify-between">
          <div className="text-left md:w-1/2">
            <h2 className="text-[#3e4152] text-xl md:text-3xl font-light mb-2">Shop Fusion Exclusive</h2>
            <h1 className="text-[#ff3f6c] text-5xl md:text-8xl font-black mb-4 tracking-tighter">50-80% OFF</h1>
            <p className="text-[#3e4152] text-lg md:text-2xl font-medium mb-8">UNLIMITED FASHION VARIETIES</p>
            <button className="bg-[#ff3f6c] text-white px-8 py-4 text-base font-bold rounded-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              EXPLORE NOW <ChevronRight size={20} />
            </button>
          </div>
          <div className="hidden md:block w-1/2 h-[500px] relative">
             <ImageWithFallback 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
                className="absolute right-0 bottom-0 h-full object-contain mix-blend-multiply" 
                alt="Fashion Model" 
             />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { navigateToProduct } = useStore();
  return (
    <div onClick={() => navigateToProduct(product.id)} className="group cursor-pointer bg-white hover:shadow-lg transition-shadow duration-200 border border-transparent hover:border-gray-100">
      <div className="aspect-[3/4] overflow-hidden relative">
        <ImageWithFallback 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded flex items-center gap-1 text-xs font-bold shadow-sm">
           4.5 <Star size={10} className="fill-teal-500 text-teal-500" />
        </div>
        
        <div className="absolute bottom-0 w-full bg-white py-2 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-gray-100 flex items-center justify-center gap-2 text-[#ff3f6c] font-bold text-sm uppercase">
          <ShoppingBag size={16} /> Add to Bag
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-base font-bold text-[#282c3f] truncate mb-0.5">{product.brand}</h3>
        <p className="text-sm text-[#535766] truncate font-light mb-2">{product.name}</p>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-[#282c3f]">₹{product.price}</span>
          {product.discount > 0 && (
            <>
              <span className="text-xs text-[#7e818c] line-through">₹{product.originalPrice}</span>
              <span className="text-xs text-[#ff905a] font-bold">({product.discount}% OFF)</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ShopView: React.FC = () => {
  const { products } = useStore();
  const [filter, setFilter] = useState('All');
  
  const filtered = products.filter(p => filter === 'All' || p.category === filter);
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="border-b pb-4 mb-4">
            <h3 className="font-bold mb-4 uppercase text-sm tracking-wide">Filters</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="cat" checked={filter === 'All'} onChange={() => setFilter('All')} className="accent-[#ff3f6c]" />
                <span className="text-sm">All Categories</span>
              </label>
              {categories.filter(c => c !== 'All').map(c => (
                <label key={c} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="cat" checked={filter === c} onChange={() => setFilter(c)} className="accent-[#ff3f6c]" />
                  <span className="text-sm">{c}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="border-b pb-4 mb-4">
            <h3 className="font-bold mb-4 uppercase text-sm tracking-wide">Price</h3>
            <div className="space-y-2 text-sm text-gray-600">
               <label className="flex items-center gap-2"><input type="checkbox" /> ₹500 - ₹1000</label>
               <label className="flex items-center gap-2"><input type="checkbox" /> ₹1000 - ₹2000</label>
               <label className="flex items-center gap-2"><input type="checkbox" /> ₹2000+</label>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-500">Showing {filtered.length} items from Unlimited Collection</span>
            <div className="md:hidden">
              <select className="border p-2 rounded" value={filter} onChange={e => setFilter(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailView: React.FC = () => {
  const { products, selectedProductId, addToCart, setView } = useStore();
  const product = products.find(p => p.id === selectedProductId);
  const [size, setSize] = useState<string>('');
  const [color, setColor] = useState<string>('');

  if (!product) return <div className="p-10 text-center">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
       <div className="text-sm breadcrumbs mb-4 text-gray-500">
         <span className="cursor-pointer hover:text-black" onClick={() => setView('HOME')}>Home</span> / 
         <span className="cursor-pointer hover:text-black" onClick={() => setView('SHOP')}> Clothing </span> / 
         <span className="font-bold text-black"> {product.name} </span>
       </div>
       
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="grid grid-cols-2 gap-2">
          {product.images.map((img, i) => (
            <div key={i} className="aspect-[3/4] overflow-hidden cursor-zoom-in">
              <ImageWithFallback 
                src={img} 
                alt="" 
                className="w-full h-full object-cover hover:scale-110 transition duration-500" 
              />
            </div>
          ))}
        </div>
        
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-[#282c3f] mb-1">{product.brand}</h1>
          <p className="text-xl text-[#535766] mb-4 font-light">{product.name}</p>
          
          <div className="border-t border-b py-3 mb-6">
             <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl font-bold text-[#282c3f]">₹{product.price}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                    <span className="text-lg text-[#ff905a] font-bold">({product.discount}% OFF)</span>
                  </>
                )}
             </div>
             <p className="text-[#03a685] text-sm font-bold">inclusive of all taxes</p>
          </div>

          <div className="mb-6">
            <h4 className="font-bold text-sm mb-3 flex items-center gap-4">SELECT SIZE <span className="text-[#ff3f6c] text-xs font-bold cursor-pointer">SIZE CHART ></span></h4>
            <div className="flex gap-3">
              {product.sizes.map(s => (
                <button 
                  key={s}
                  onClick={() => setSize(s)}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center text-sm font-bold transition-all
                    ${size === s ? 'border-[#ff3f6c] text-[#ff3f6c]' : 'border-gray-200 hover:border-[#ff3f6c]'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-bold text-sm mb-3">SELECT COLOR</h4>
             <div className="flex gap-3">
                {product.colors.map(c => (
                  <button 
                    key={c}
                    onClick={() => setColor(c)}
                    className={`px-4 py-2 border rounded-md text-sm ${color === c ? 'border-[#ff3f6c] bg-pink-50 text-[#ff3f6c]' : 'border-gray-200 hover:border-gray-400'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => {
                if(!size || !color) return alert('Please select size and color');
                addToCart(product, size, color);
                alert('Added to Bag!');
              }}
              className="flex-1 bg-[#ff3f6c] text-white py-4 font-bold rounded-md flex items-center justify-center gap-2 hover:bg-[#e6365f] transition"
            >
              <ShoppingBag size={20} /> ADD TO BAG
            </button>
            <button className="flex-1 border border-gray-300 py-4 font-bold rounded-md flex items-center justify-center gap-2 hover:border-black transition">
              <Heart size={20} /> WISHLIST
            </button>
          </div>

          <div className="space-y-4 text-sm text-[#282c3f]">
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2">PRODUCT DETAILS <div className="flex-1 h-px bg-gray-200"></div></h4>
              <p className="leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartView: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, setView, proceedToCheckout } = useStore();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalMRP = cart.reduce((acc, item) => acc + item.originalPrice * item.quantity, 0);
  const totalDiscount = totalMRP - subtotal;

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
           <ShoppingBag size={48} className="text-gray-300" />
        </div>
        <h2 className="text-xl font-bold mb-2 text-[#282c3f]">Hey, it feels so light!</h2>
        <p className="text-gray-500 mb-8 text-sm">There is nothing in your bag. Let's add some items.</p>
        <button onClick={() => setView('SHOP')} className="border border-[#ff3f6c] text-[#ff3f6c] px-12 py-3 rounded font-bold hover:bg-pink-50">
          ADD ITEMS FROM WISHLIST
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cart Items */}
        <div className="flex-1">
          
          <div className="border rounded-md p-4 mb-4 flex justify-between items-center bg-white">
             <div className="text-sm text-[#282c3f]">Check delivery time & services</div>
             <button className="text-[#ff3f6c] font-bold text-xs border border-[#ff3f6c] px-3 py-2 rounded hover:bg-pink-50">ENTER PIN CODE</button>
          </div>

          <div className="space-y-4">
            {cart.map((item, idx) => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 border border-gray-200 rounded-sm p-3 bg-white relative">
                <div onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)} className="absolute top-2 right-2 cursor-pointer hover:text-[#ff3f6c]">
                   <X size={18} />
                </div>
                <ImageWithFallback src={item.images[0]} alt={item.name} className="w-28 h-36 object-cover" />
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-[#282c3f] text-sm mb-1">{item.brand}</h3>
                  <p className="text-[#535766] text-sm mb-2">{item.name}</p>
                  
                  <div className="flex gap-2 text-xs text-gray-500 mb-3">
                     <span className="bg-gray-100 px-2 py-1 rounded">Size: {item.selectedSize}</span>
                     <span className="bg-gray-100 px-2 py-1 rounded">Qty: {item.quantity}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-sm text-[#282c3f]">₹{item.price * item.quantity}</span>
                    <span className="text-xs text-gray-400 line-through">₹{item.originalPrice * item.quantity}</span>
                    <span className="text-xs text-[#ff905a] font-bold">{item.discount}% OFF</span>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <button onClick={() => updateCartQuantity(item.id, item.selectedSize, item.selectedColor, -1)} className="w-6 h-6 rounded-full border flex items-center justify-center font-bold text-gray-500 hover:border-black">-</button>
                    <button onClick={() => updateCartQuantity(item.id, item.selectedSize, item.selectedColor, 1)} className="w-6 h-6 rounded-full border flex items-center justify-center font-bold text-gray-500 hover:border-black">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="w-full lg:w-80">
           <div className="border p-4 rounded-sm bg-white sticky top-24">
              <h3 className="font-bold text-xs text-[#535766] mb-4">PRICE DETAILS ({cart.length} Items)</h3>
              <div className="space-y-3 text-sm text-[#282c3f] mb-4 border-b pb-4">
                 <div className="flex justify-between">
                    <span>Total MRP</span>
                    <span>₹{totalMRP}</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Discount on MRP</span>
                    <span className="text-[#03a685]">-₹{totalDiscount}</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Convenience Fee</span>
                    <span><span className="line-through">₹99</span> <span className="text-[#03a685]">FREE</span></span>
                 </div>
              </div>
              <div className="flex justify-between font-bold text-base text-[#3e4152] mb-6">
                 <span>Total Amount</span>
                 <span>₹{subtotal}</span>
              </div>
              <button 
                onClick={proceedToCheckout}
                className="w-full bg-[#ff3f6c] text-white py-3.5 font-bold text-sm rounded-sm tracking-widest hover:bg-[#e6365f] transition"
              >
                PLACE ORDER
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

const CheckoutView: React.FC = () => {
  const { cart, placeOrder, user } = useStore();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    
    // Simulate Order Notification Email to Admin
    console.log(`Sending Order Notification Email to ayushs1904@gmail.com...`);
    alert(`Order Placed Successfully!\n\nOrder notification sent to Admin (ayushs1904@gmail.com).`);
    
    placeOrder(address);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8 border-b pb-4">
         <div className="flex-1">
            <h2 className="text-base font-bold uppercase tracking-wider text-[#282c3f]">Checkout</h2>
         </div>
         <div className="flex items-center gap-2 text-xs font-bold text-[#20bd99]">
            <div className="w-4 h-4 rounded-full border-2 border-[#20bd99] flex items-center justify-center text-[8px]">✓</div> 
            100% SECURE
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
           <div className="border rounded-sm p-6 mb-6">
              <h3 className="font-bold text-sm mb-4">CONTACT DETAILS</h3>
              <div className="text-sm text-[#282c3f]">
                 <div className="font-bold mb-1">{user.name}</div>
                 <div>{user.email}</div>
              </div>
           </div>

           <form onSubmit={handlePlaceOrder} className="space-y-6">
             <div className="border rounded-sm p-6">
                <h3 className="font-bold text-sm mb-4">ADDRESS</h3>
                  <textarea 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="w-full border p-3 rounded-sm text-sm focus:outline-none focus:border-black h-32" 
                    required 
                    placeholder="Street Address, Pincode, City, State..."
                  />
             </div>

             <div className="border rounded-sm p-6">
                <h3 className="font-bold text-sm mb-4">PAYMENT OPTIONS</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-3 border rounded-sm cursor-pointer hover:bg-gray-50 transition">
                    <input type="radio" name="payment" value="gpay" className="accent-[#ff3f6c]" onChange={(e) => setPaymentMethod(e.target.value)} />
                    <span className="font-bold text-sm text-[#282c3f]">Google Pay (GPay)</span>
                  </label>
                  <label className="flex items-center gap-4 p-3 border rounded-sm cursor-pointer hover:bg-gray-50 transition">
                    <input type="radio" name="payment" value="paytm" className="accent-[#ff3f6c]" onChange={(e) => setPaymentMethod(e.target.value)} />
                    <span className="font-bold text-sm text-[#282c3f]">Paytm</span>
                  </label>
                  <label className="flex items-center gap-4 p-3 border rounded-sm cursor-pointer hover:bg-gray-50 transition">
                    <input type="radio" name="payment" value="phonepe" className="accent-[#ff3f6c]" onChange={(e) => setPaymentMethod(e.target.value)} />
                    <span className="font-bold text-sm text-[#282c3f]">PhonePe</span>
                  </label>
                  <label className="flex items-center gap-4 p-3 border rounded-sm cursor-pointer hover:bg-gray-50 transition">
                    <input type="radio" name="payment" value="cod" className="accent-[#ff3f6c]" onChange={(e) => setPaymentMethod(e.target.value)} />
                    <div className="flex-1">
                      <span className="font-bold text-sm text-[#282c3f] block">Cash on Delivery (COD)</span>
                      <span className="text-xs text-gray-500">Pay on delivery (Cash/Card/UPI)</span>
                    </div>
                  </label>
                </div>
             </div>

             <button type="submit" className="w-full bg-[#ff3f6c] text-white py-4 font-bold text-sm rounded-sm hover:bg-[#e6365f] transition">
                CONFIRM ORDER
             </button>
           </form>
        </div>

        <div className="md:col-span-1">
          <div className="border rounded-sm p-4 sticky top-24">
             <div className="flex items-center gap-3 mb-4">
               <ImageWithFallback src={cart[0]?.images[0]} className="w-12 h-16 object-cover rounded-sm" alt="product" />
               <div className="flex-1">
                  <div className="text-xs text-gray-500">Estimated Delivery by</div>
                  <div className="text-sm font-bold text-[#282c3f]">12 Oct 2024</div>
               </div>
             </div>
             <div className="border-t pt-4">
                <h3 className="font-bold text-xs text-[#535766] mb-3">PRICE DETAILS</h3>
                <div className="flex justify-between font-bold text-sm text-[#3e4152]">
                  <span>Order Total</span>
                  <span>₹{subtotal}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminView: React.FC = () => {
  const { products, deleteProduct, addProduct, orders } = useStore();
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  
  // New Product Form State
  const [newProd, setNewProd] = useState<Partial<Product>>({ 
    name: '', brand: '', category: 'Women', price: 0, originalPrice: 0, discount: 0, description: '', sizes: ['S', 'M', 'L'], colors: ['Black'], images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop'] 
  });
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const handleAiDescription = async () => {
    if (!newProd.name || !newProd.category) return alert('Enter name and category first');
    setLoadingAi(true);
    const desc = await generateProductDescription(newProd.name, newProd.category);
    setNewProd({ ...newProd, description: desc });
    setLoadingAi(false);
  };

  const handleAiImage = async () => {
    if (!newProd.name) return alert('Enter product name first');
    setLoadingImage(true);
    const image = await generateProductImage(`${newProd.brand || ''} ${newProd.name} ${newProd.category || ''}`);
    if (image) {
      setNewProd({ ...newProd, images: [image] });
    } else {
      alert("Failed to generate image.");
    }
    setLoadingImage(false);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProd.name && newProd.price) {
      addProduct({
        ...newProd as Product,
        id: Date.now().toString(),
        // Simple random image to simulate varying uploads
        images: newProd.images && newProd.images.length > 0 ? newProd.images : [`https://images.unsplash.com/photo-${Date.now() % 2 === 0 ? '1483985988355-763728e1935b' : '1515886657613-9f3515b0c78f'}?q=80&w=2000&auto=format&fit=crop`]
      });
      // Reset
      setNewProd({ name: '', brand: '', category: 'Women', price: 0, originalPrice: 0, discount: 0, description: '', sizes: ['S', 'M', 'L'], colors: ['Black'], images: [''] });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <div className="flex gap-4">
          <button onClick={() => setTab('products')} className={`px-4 py-2 rounded ${tab === 'products' ? 'bg-[#ff3f6c] text-white' : 'bg-gray-200'}`}>Products</button>
          <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded ${tab === 'orders' ? 'bg-[#ff3f6c] text-white' : 'bg-gray-200'}`}>Orders</button>
        </div>
      </div>

      {tab === 'products' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <ImageWithFallback src={p.images[0]} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <div className="font-bold">{p.brand}</div>
                            <div className="text-gray-500 font-normal">{p.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{p.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow h-fit border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Add New Product</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <input 
                placeholder="Brand Name" 
                className="w-full border p-2 rounded text-sm" 
                value={newProd.brand} 
                onChange={e => setNewProd({...newProd, brand: e.target.value})} 
              />
              <input 
                placeholder="Product Name" 
                className="w-full border p-2 rounded text-sm" 
                value={newProd.name} 
                onChange={e => setNewProd({...newProd, name: e.target.value})} 
              />
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Price" 
                  className="w-1/2 border p-2 rounded text-sm" 
                  value={newProd.price || ''} 
                  onChange={e => setNewProd({...newProd, price: Number(e.target.value)})} 
                />
                <input 
                  type="number" 
                  placeholder="Orig. Price" 
                  className="w-1/2 border p-2 rounded text-sm" 
                  value={newProd.originalPrice || ''} 
                  onChange={e => setNewProd({...newProd, originalPrice: Number(e.target.value)})} 
                />
              </div>
              <div className="flex gap-2">
                 <input 
                  type="number" 
                  placeholder="Discount %" 
                  className="w-1/2 border p-2 rounded text-sm" 
                  value={newProd.discount || ''} 
                  onChange={e => setNewProd({...newProd, discount: Number(e.target.value)})} 
                />
                <select 
                  className="w-1/2 border p-2 rounded text-sm"
                  value={newProd.category}
                  onChange={e => setNewProd({...newProd, category: e.target.value})}
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Home">Home</option>
                </select>
              </div>
              <div>
                <textarea 
                  placeholder="Description" 
                  className="w-full border p-2 rounded h-24 mb-2 text-sm" 
                  value={newProd.description} 
                  onChange={e => setNewProd({...newProd, description: e.target.value})} 
                />
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={handleAiDescription}
                    disabled={loadingAi}
                    className="text-xs bg-purple-100 text-purple-700 px-3 py-2 rounded-full flex items-center gap-1 hover:bg-purple-200 w-fit transition-colors"
                  >
                    {loadingAi ? <Loader2 size={12} className="animate-spin" /> : <Star size={12} />} 
                    {loadingAi ? 'Generating...' : 'Generate Description'}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleAiImage}
                    disabled={loadingImage}
                    className="text-xs bg-indigo-100 text-indigo-700 px-3 py-2 rounded-full flex items-center gap-1 hover:bg-indigo-200 w-fit transition-colors"
                  >
                    {loadingImage ? <Loader2 size={12} className="animate-spin" /> : <ImageIcon size={12} />} 
                    {loadingImage ? 'Creating Image...' : 'Generate Image AI'}
                  </button>
                </div>
              </div>
              <input 
                placeholder="Image URL (or use AI)" 
                className="w-full border p-2 rounded text-sm" 
                value={newProd.images?.[0] || ''} 
                onChange={e => setNewProd({...newProd, images: [e.target.value]})} 
              />
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700">Add Product</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden border">
           <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? <tr><td colSpan={4} className="p-4 text-center text-gray-500">No orders yet</td></tr> : orders.map(o => (
                  <tr key={o.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{o.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{o.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">{o.status}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(o.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

const AuthView: React.FC = () => {
  const { login } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const triggerWelcomeEmail = (userEmail: string) => {
    alert(
      `Welcome to Shop Fusion\n\n` +
      `Continue Your Shopping\n\n` +
      `Contact Person: Drashti Patel\n` +
      `Contact Number: +91 1234546789\n\n` +
      `(Confirmation email sent to ${userEmail})`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin) {
      triggerWelcomeEmail(email);
    }
    
    if (email === 'admin@lumiere.com' && password === 'admin') {
      login(email, 'admin');
    } else {
      login(email, 'customer');
    }
  };

  const openGoogleWindow = () => {
    setShowGoogleModal(true);
  };

  const completeGoogleLogin = (mockEmail: string) => {
    setShowGoogleModal(false);
    if (!isLogin) {
      triggerWelcomeEmail(mockEmail);
    }
    login(mockEmail, 'customer');
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center bg-[#fdf5f6] py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-sm w-full bg-white p-8 shadow-2xl relative rounded-md">
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-pink-500 absolute top-0 left-0 rounded-t-md"></div>
        <div className="text-left mb-8">
          <h2 className="text-2xl font-bold text-[#282c3f] mb-1">
             {isLogin ? 'Login' : 'Signup'} <span className="text-sm font-normal text-gray-500">or {isLogin ? 'Signup' : 'Login'}</span>
          </h2>
          <p className="text-sm text-gray-500">Get access to your Orders, Wishlist and Unlimited Fashion.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input 
              type="email" 
              required 
              className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:border-[#ff3f6c] sm:text-sm rounded-sm" 
              placeholder="Email address" 
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input 
              type="password" 
              required 
              className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:border-[#ff3f6c] sm:text-sm rounded-sm" 
              placeholder="Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold text-white bg-[#ff3f6c] hover:bg-[#e6365f] focus:outline-none transition rounded-sm">
              {isLogin ? 'CONTINUE' : 'SIGN UP'}
            </button>
          </div>
        </form>

        <div className="mt-4">
           <button 
             onClick={openGoogleWindow}
             className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition rounded-sm"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isLogin ? 'Login with Google' : 'Sign up with Google'}
           </button>
        </div>
        
        <div className="mt-6 text-center">
           <button onClick={() => setIsLogin(!isLogin)} className="text-[#ff3f6c] text-sm font-bold">
             {isLogin ? "New to Shop Fusion? Create an account" : "Already have an account? Login"}
           </button>
        </div>
        
        <div className="mt-8 text-xs text-center text-gray-400">
           By continuing, I agree to the <span className="text-[#ff3f6c] font-bold">Terms of Use</span> & <span className="text-[#ff3f6c] font-bold">Privacy Policy</span>
        </div>
      </div>

      {/* Google Authentication Secondary Window Simulation */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-96 p-6 max-w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Sign in with Google</h3>
              <button onClick={() => setShowGoogleModal(false)} className="text-gray-400 hover:text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="text-center mb-6">
              <div className="text-xl font-bold text-blue-600 mb-1">Google</div>
              <div className="text-sm text-gray-600">Choose an account</div>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => completeGoogleLogin('user@gmail.com')}
                className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition text-left"
              >
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">J</div>
                <div>
                  <div className="text-sm font-medium text-gray-900">John Doe</div>
                  <div className="text-xs text-gray-500">user@gmail.com</div>
                </div>
              </button>
              <button 
                onClick={() => completeGoogleLogin('drashti.patel@gmail.com')}
                className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition text-left"
              >
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">D</div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Drashti Patel</div>
                  <div className="text-xs text-gray-500">drashti.patel@gmail.com</div>
                </div>
              </button>
               <button 
                onClick={() => completeGoogleLogin('fusion.shopper@gmail.com')}
                className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition text-left"
              >
                <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-sm">F</div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Fusion Shopper</div>
                  <div className="text-xs text-gray-500">fusion.shopper@gmail.com</div>
                </div>
              </button>
            </div>
            <div className="mt-6 text-xs text-gray-500 text-center">
              To continue, Google will share your name, email address, and profile picture with Shop Fusion.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PolicyView: React.FC = () => {
   return (
     <div className="max-w-4xl mx-auto px-4 py-12 min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-8 text-[#282c3f]">Shop Fusion Policies</h1>
        
        <div className="space-y-8">
           <section>
              <h2 className="text-xl font-bold mb-4">Terms of Use</h2>
              <p className="text-gray-600 leading-relaxed">
                 Welcome to Shop Fusion. By accessing our website, you agree to comply with our terms and conditions. 
                 We reserve the right to modify these terms at any time. All products listed are subject to availability.
              </p>
           </section>

           <section>
              <h2 className="text-xl font-bold mb-4">Shipping Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                 We strive to deliver products within 3-5 business days across India. 
                 Shipping is free on orders above ₹1000.
              </p>
           </section>

           <section>
              <h2 className="text-xl font-bold mb-4">Cancellation & Returns</h2>
              <p className="text-gray-600 leading-relaxed">
                 You can cancel your order before it ships. Returns are accepted within 30 days of delivery 
                 if the product is unused and in original packaging.
              </p>
           </section>

           <section>
              <h2 className="text-xl font-bold mb-4">Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                 Your data is safe with us. We use your contact information to communicate with you about your orders and
                 offers. We do not sell your personal data to third parties.
              </p>
           </section>
        </div>
     </div>
   );
}

const MainContent: React.FC = () => {
  const { view } = useStore();

  switch (view) {
    case 'HOME': return <><Hero /><ShopView /></>;
    case 'SHOP': return <ShopView />;
    case 'PRODUCT_DETAIL': return <ProductDetailView />;
    case 'CART': return <CartView />;
    case 'CHECKOUT': return <CheckoutView />;
    case 'LOGIN': return <AuthView />;
    case 'REGISTER': return <AuthView />;
    case 'ADMIN': return <AdminView />;
    case 'POLICY': return <PolicyView />;
    default: return <Hero />;
  }
};

const Footer: React.FC = () => {
  const { setView } = useStore();
  
  return (
    <footer className="bg-[#fafbfc] pt-12 pb-8 border-t">
      <div className="max-w-[1600px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div>
          <h4 className="font-bold text-[#282c3f] text-xs mb-6 tracking-wide">ONLINE SHOPPING</h4>
          <ul className="space-y-2 text-[#535766] text-sm">
            <li><button onClick={() => setView('SHOP')} className="hover:text-black">Men</button></li>
            <li><button onClick={() => setView('SHOP')} className="hover:text-black">Women</button></li>
            <li><button onClick={() => setView('SHOP')} className="hover:text-black">Kids</button></li>
            <li><button onClick={() => setView('SHOP')} className="hover:text-black">Home & Living</button></li>
            <li><button onClick={() => setView('SHOP')} className="hover:text-black">Beauty</button></li>
            <li><button onClick={() => setView('SHOP')} className="hover:text-black">Gift Cards</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[#282c3f] text-xs mb-6 tracking-wide">CUSTOMER POLICIES</h4>
          <ul className="space-y-2 text-[#535766] text-sm">
            <li><button onClick={() => setView('POLICY')} className="hover:text-black">Contact Us</button></li>
            <li><button onClick={() => setView('POLICY')} className="hover:text-black">FAQ</button></li>
            <li><button onClick={() => setView('POLICY')} className="hover:text-black">T&C</button></li>
            <li><button onClick={() => setView('POLICY')} className="hover:text-black">Terms Of Use</button></li>
            <li><button onClick={() => setView('POLICY')} className="hover:text-black">Track Orders</button></li>
            <li><button onClick={() => setView('POLICY')} className="hover:text-black">Shipping</button></li>
            <li><button onClick={() => setView('POLICY')} className="hover:text-black">Cancellation</button></li>
          </ul>
        </div>
        {/* 'Keep in Touch' section removed as requested */}
        <div>
          <h4 className="font-bold text-[#282c3f] text-xs mb-6 tracking-wide">IF YOU HAVE ANY CONCERN, CONTACT HERE</h4>
          <div className="text-sm text-[#535766] space-y-3">
             <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <span className="font-semibold">+91 123456789</span>
             </div>
             <div className="flex items-center gap-2">
                <UserIcon size={16} className="text-gray-400" />
                <span>Contact Person: <span className="font-semibold text-black">Drashti Patel</span></span>
             </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto px-4 border-t pt-6 text-[#535766] text-sm flex flex-col md:flex-row justify-between items-center">
         <div>
           In case of any concern, Contact Us <button onClick={() => setView('POLICY')} className="text-[#ff3f6c] font-bold">Here</button>
         </div>
         <div className="mt-2 md:mt-0 font-medium">© 2025 Shop Fusion. All rights reserved.</div>
      </div>
    </footer>
  );
};

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
        <Navbar />
        <main className="flex-grow">
          <MainContent />
        </main>
        <Footer />
        <AIStylist />
      </div>
    </StoreProvider>
  );
};