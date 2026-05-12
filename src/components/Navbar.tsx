import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface NavbarProps {
  onOpenCheckout: () => void;
}

const Navbar = ({ onOpenCheckout }: NavbarProps) => {
  const { totalItems } = useCart();
  return (
    <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-zinc-900/80 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <img src="/icono_paginas.png" alt="Logo" className="h-10 w-auto object-contain transition-transform hover:scale-105" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                Lo Básico Express
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-zinc-400">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Inicio</Link>
            <Link href="#productos" className="hover:text-emerald-600 transition-colors">Productos</Link>
            <Link href="#como-funciona" className="hover:text-emerald-600 transition-colors">¿Cómo funciona?</Link>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenCheckout}
              className="relative p-2 text-gray-600 dark:text-zinc-400 hover:text-emerald-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-emerald-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
