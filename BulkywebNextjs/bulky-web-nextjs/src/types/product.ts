export interface Category {
  id: number;
  name: string;
  displayOrder?: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  isbn: string;
  author: string;
  listPrice: number;
  price: number;
  price50: number;
  price100: number;
  categoryId: number;
  category?: Category | null;
  imageUrl: string;
}

export interface ShoppingCart {
  id: number;
  productId: number;
  product: Product;
  count: number;
  applicationUserId?: string | null;
  price: number;
}