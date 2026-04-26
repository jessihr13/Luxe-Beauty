/**
 * Products Store - Manages all products in the system
 */
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { products as initialProducts, type Product } from '@/lib/data/products';

interface ProductsStore {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => string;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    updateStock: (id: string, newStock: number) => void;
    getProductById: (id: string) => Product | undefined;
    getAllProducts: () => Product[];
    getProductsByCategory: (category: Product['category']) => Product[];
    getBestsellers: () => Product[];
    getTrendingProducts: () => Product[];
    getNewProducts: () => Product[];
    getLowStockProducts: (threshold?: number) => Product[];
}

export const useProductsStore = create<ProductsStore>()(
    persist(
        (set, get) => ({
            products: initialProducts,

            addProduct: (productData) => {
                const newId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const newProduct: Product = {
                    ...productData,
                    id: newId,
                    image: productData.images[0] || '',
                };

                set({ products: [...get().products, newProduct] });
                console.log('✅ Product added:', newProduct.name);
                
                return newId;
            },

            updateProduct: (id, updates) => {
                set({
                    products: get().products.map(product =>
                        product.id === id
                            ? { ...product, ...updates, image: updates.images?.[0] || product.image }
                            : product
                    )
                });
                console.log('✅ Product updated:', id);
            },

            deleteProduct: (id) => {
                set({
                    products: get().products.filter(product => product.id !== id)
                });
                console.log('✅ Product deleted:', id);
            },

            updateStock: (id, newStock) => {
                set({
                    products: get().products.map(product =>
                        product.id === id
                            ? { ...product, stock: newStock }
                            : product
                    )
                });
            },

            getProductById: (id) => {
                return get().products.find(p => p.id === id);
            },

            getAllProducts: () => {
                return get().products;
            },

            getProductsByCategory: (category) => {
                return get().products.filter(p => p.category === category);
            },

            getBestsellers: () => {
                return get().products.filter(p => p.neuromarketing.isBestseller);
            },

            getTrendingProducts: () => {
                return get().products.filter(p => p.neuromarketing.isTrending);
            },

            getNewProducts: () => {
                return get().products.filter(p => p.neuromarketing.isNew);
            },

            getLowStockProducts: (threshold = 10) => {
                return get().products.filter(p => p.stock > 0 && p.stock <= threshold);
            }
        }),
        {
            name: 'luxe-products-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
