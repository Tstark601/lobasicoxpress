import React from 'react';
import { useCart } from '@/context/CartContext';
import { Product, BACKEND_URL } from '@/services/api';

const ProductCard = (product: Product) => {
  const { name, description, price, image, category_name } = product;
  const { addToCart } = useCart();
  
  const imageUrl = image 
    ? (image.startsWith('http') ? image : `${BACKEND_URL}${image}`)
    : 'https://placehold.co/400x400/059669/ffffff?text=Producto';

  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-zinc-800">
        <img 
          src={imageUrl} 
          alt={name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-600 border border-emerald-100 dark:border-emerald-900/30">
            {category_name}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1 line-clamp-2 min-h-[40px]">
          {description}
        </p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase font-medium">Precio</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ${price.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <button 
            onClick={() => addToCart(product)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-600/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
