// Product Management Functions
import { Product, products } from './products';

// Variable mutable para gestión de productos
let productList: Product[] = [...products];

// Get all products
export function getAllProductsEditable(): Product[] {
    return productList;
}

// Get product by ID
export function getProductById(id: string): Product | undefined {
    return productList.find(p => p.id === id);
}

// Update product
export function updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = productList.findIndex(p => p.id === id);
    if (index === -1) return null;

    productList[index] = { ...productList[index], ...updates };
    return productList[index];
}

// Create new product
export function createProduct(productData: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
        ...productData,
        id: `product_${Date.now()}`,
    };

    productList.push(newProduct);
    return newProduct;
}

// Delete product
export function deleteProduct(id: string): boolean {
    const index = productList.findIndex(p => p.id === id);
    if (index === -1) return false;

    productList.splice(index, 1);
    return true;
}

// Upload image (simulated - returns URL)
export async function uploadProductImage(file: File): Promise<string> {
    // En producción, esto subiría a Cloudinary/S3
    // Por ahora, retornamos una URL de placeholder
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
    });
}
