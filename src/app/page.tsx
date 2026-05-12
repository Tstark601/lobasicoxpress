"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import CheckoutModal from '@/components/CheckoutModal';
import { fetchProducts, fetchCategories, Product, Category } from '@/services/api';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleCategorySelect = async (categoryId: number | null) => {
    setLoading(true);
    setSelectedCategory(categoryId);
    try {
      const productsData = await fetchProducts(categoryId || undefined);
      setProducts(productsData);
    } catch (error) {
      console.error("Error filtering products", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar onOpenCheckout={() => setIsCheckoutOpen(true)} />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
              Lo Básico, <span className="text-emerald-600">más rápido</span> que nunca.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-zinc-400 mb-10 leading-relaxed">
              Tus productos esenciales del día a día, validados automáticamente y entregados en minutos. Sin complicaciones, sin esperas.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#productos" className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/25 transition-all active:scale-95">
                Comprar Ahora
              </a>
              <a href="#como-funciona" className="w-full sm:w-auto px-8 py-4 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-900 dark:text-white font-bold rounded-2xl transition-all active:scale-95">
                Ver Cómo Funciona
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="productos" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Nuestro Catálogo</h2>
              <p className="text-gray-600 dark:text-zinc-400">Selecciona una categoría para filtrar tus productos.</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleCategorySelect(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === null ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              No se encontraron productos en esta categoría.
            </div>
          )}
        </div>
      </section>
      
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
              Lo Básico Express
            </div>
            <div className="text-sm text-gray-500 dark:text-zinc-500">
              © 2024 Lo Básico Express. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
