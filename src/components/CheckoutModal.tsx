"use client";
import React, { useState, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '200px'
};

const center = {
  lat: 10.4806, // Caracas por defecto
  lng: -66.9036
};

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const { cart, totalPrice, clearCart, removeFromCart } = useCart();
  const [location, setLocation] = useState(center);
  const [reference, setReference] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false); // Toggle para login

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setLocation({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
    }
  }, []);

  const handleOrder = async () => {
    if (!reference || !phone || !name || !customerId || !address) {
        alert("Por favor completa todos los campos obligatorios (incluyendo la dirección de entrega).");
        return;
    }
    setLoading(true);
    try {
      const orderData = {
        customer_phone: phone,
        customer_name: name,
        customer_id: customerId,
        customer_email: email,
        delivery_address: address,
        latitude: location.lat,
        longitude: location.lng,
        payment_reference: reference,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      const response = await fetch('http://localhost:5000/api/public/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Error al procesar pedido');
      
      const result = await response.json();
      
      // Generar mensaje de WhatsApp
      const message = `*Nuevo Pedido: Lo Básico Express*%0A` +
        `--------------------------%0A` +
        `*ID Orden:* ${result.order_id}%0A` +
        `*Cliente:* ${phone}%0A` +
        `*Total:* $${totalPrice.toFixed(2)}%0A` +
        `*Ref. Pago:* ${reference}%0A` +
        `--------------------------%0A` +
        `*Ubicación:* https://www.google.com/maps?q=${location.lat},${location.lng}%0A` +
        `--------------------------%0A` +
        `Por favor, valide mi pedido.`;
      
      const whatsappUrl = `https://wa.me/584121234567?text=${message}`; // Número de ejemplo
      
      clearCart();
      alert("¡Pedido recibido con éxito! Serás redirigido a WhatsApp para confirmar.");
      window.open(whatsappUrl, '_blank');
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al procesar el pedido. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-start md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-10 md:pt-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 my-auto">
        <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Finalizar Pedido</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Resumen */}
          <div className="mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Resumen de Productos</h3>
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-xl">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-emerald-600">${(item.price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                      title="Quitar producto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <p className="text-lg text-gray-500">Total a pagar:</p>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Ubicación */}
          <div className="mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Ubicación de Entrega</h3>
            <p className="text-xs text-gray-500 mb-2">Haz clic en el mapa para marcar dónde quieres recibir tu pedido.</p>
            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-inner mb-4">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={13}
                  onClick={onMapClick}
                >
                  <Marker position={location} />
                </GoogleMap>
              ) : (
                <div className="h-[200px] bg-gray-100 animate-pulse flex items-center justify-center">
                  Cargando Mapa...
                </div>
              )}
            </div>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Dirección detallada (Calle, Edificio, Apartamento)"
              className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Identificación y Facturación */}
          <div className="mb-6 p-5 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">Datos para Facturación</h3>
                <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                >
                    {isLogin ? "← Volver a invitado" : "¿Ya tienes cuenta? Login"}
                </button>
            </div>

            {isLogin ? (
                <div className="space-y-4">
                    <p className="text-xs text-gray-500 mb-4">Ingresa con tus credenciales de la App para cargar tus datos automáticamente.</p>
                    <input 
                        type="text" 
                        placeholder="Email o Teléfono"
                        className="w-full bg-white dark:bg-zinc-800 border-none rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña"
                        className="w-full bg-white dark:bg-zinc-800 border-none rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                    <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm">Entrar</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nombre Completo / Razón Social</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Juan Pérez"
                            className="w-full bg-white dark:bg-zinc-800 border-none rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Cédula o NIT</label>
                        <input 
                            type="text" 
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            placeholder="V-12345678"
                            className="w-full bg-white dark:bg-zinc-800 border-none rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Correo Electrónico</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="usuario@gmail.com"
                            className="w-full bg-white dark:bg-zinc-800 border-none rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>
            )}
          </div>

          {/* Pago y Teléfono */}
          <div className="mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Información de Pago Móvil</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Teléfono Origen</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej: 04121234567"
                  className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Referencia del Pago</label>
                <input 
                  type="text" 
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Últimos 6 dígitos"
                  className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-zinc-800/50 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 font-bold text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleOrder}
            disabled={loading || cart.length === 0}
            className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-2xl font-bold shadow-xl shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {loading ? (
                <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Procesando...
                </>
            ) : (
                "Confirmar y Pagar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
