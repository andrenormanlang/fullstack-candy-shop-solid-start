import { createContext, useContext, createEffect, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { JSX } from "solid-js/jsx-runtime";
import { IProduct } from "../types/types";

type CartProviderProps = {
  children: JSX.Element;
};

type CartItem = IProduct & { quantity: number };

type CartState = {
  items: CartItem[];
  total: number;
};

const CART_STORAGE_KEY = "cartItems";

export const CartContext = createContext<{
  cartItems: CartState;
  addToCart: (product: IProduct, quantity?: number) => void;
  removeFromCart: (productId: number, quantity?: number) => void;
  clearCart: () => void;
}>({
  cartItems: { items: [], total: 0 },
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export function useCartContext() {
  return useContext(CartContext);
}

export function CartProvider(props: CartProviderProps) {
  const loadCartFromAPI = async (): Promise<CartState> => {
    try {
      const response = await fetch('/api/cart/get');
      const result = await response.json();
      if (result.status === "success") {
        return { items: result.data, total: calculateTotal(result.data) };
      } else {
        return { items: [], total: 0 };
      }
    } catch (error) {
      console.error("Failed to load cart from API:", error);
      return { items: [], total: 0 };
    }
  };

  const [cartItems, setCartItems] = createStore<CartState>({ items: [], total: 0 });

  onMount(async () => {
    const initialCart = await loadCartFromAPI();
    setCartItems(initialCart);
  });

  createEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  });

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const updateStock = async (productId: number, newStock: number) => {
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock_quantity: newStock }),
      });
    } catch (error) {
      console.error("Failed to update stock:", error);
    }
  };

  const addToCart = async (product: IProduct, quantity = 1) => {
    if (product.stock_quantity < quantity) {
      alert("Out of stock");
      return;
    }

    setCartItems((prevCartItems) => {
      const existingProductIndex = prevCartItems.items.findIndex((p) => p.id === product.id);
      const newItems = [...prevCartItems.items];

      if (existingProductIndex !== -1) {
        const existingProduct = newItems[existingProductIndex];
        if (existingProduct.quantity + quantity > product.stock_quantity) {
          alert(`Only ${product.stock_quantity} items in stock`);
          return prevCartItems;
        }
        newItems[existingProductIndex].quantity += quantity;
      } else {
        newItems.push({ ...product, quantity });
      }

      const newTotal = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

      updateStock(product.id, product.stock_quantity - quantity);

      return {
        items: newItems,
        total: newTotal,
      };
    });
  };

  const removeFromCart = async (productId: number, quantity = 1) => {
    setCartItems((prevCartItems) => {
      const existingProductIndex = prevCartItems.items.findIndex((p) => p.id === productId);
      const newItems = [...prevCartItems.items];

      if (existingProductIndex !== -1) {
        const existingProduct = newItems[existingProductIndex];
        newItems[existingProductIndex].quantity -= quantity;
        if (newItems[existingProductIndex].quantity <= 0) {
          newItems.splice(existingProductIndex, 1);
        }

        const newTotal = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        updateStock(productId, existingProduct.stock_quantity + quantity);

        return {
          items: newItems,
          total: newTotal,
        };
      }

      return prevCartItems;
    });
  };

  const clearCart = () => {
    cartItems.items.forEach(item => {
      updateStock(item.id, item.stock_quantity + item.quantity);
    });

    setCartItems({ items: [], total: 0 });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {props.children}
    </CartContext.Provider>
  );
}
