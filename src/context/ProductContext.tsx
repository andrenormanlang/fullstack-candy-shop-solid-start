import { createContext, useContext, createSignal, JSX } from "solid-js";
import { IProduct } from "../types/types";

type ProductProviderProps = {
  children: JSX.Element;
};

type ProductContextType = {
  updateProduct: (productId: number, productData: IProduct) => Promise<IProduct>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
}

export function ProductProvider(props: ProductProviderProps) {
  const [products, setProducts] = createSignal<IProduct[]>([]);

  const updateProduct = async (productId: number, productData: IProduct) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      const result = await response.json();

      // Update local state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? result.data : product
        )
      );

      return result.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider value={{ updateProduct }}>
      {props.children}
    </ProductContext.Provider>
  );
}
