export const BACKEND_URL = 'https://tienda-abarrotes.onrender.com';
const API_BASE_URL = `${BACKEND_URL}/api/public`;

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category_name: string;
  stock: number;
}

export interface Category {
  id: number;
  name: string;
}

export const fetchProducts = async (categoryId?: number, search?: string): Promise<Product[]> => {
  let url = `${API_BASE_URL}/products`;
  const params = new URLSearchParams();
  if (categoryId) params.append('category_id', categoryId.toString());
  if (search) params.append('search', search);
  
  if (params.toString()) url += `?${params.toString()}`;
  
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};
