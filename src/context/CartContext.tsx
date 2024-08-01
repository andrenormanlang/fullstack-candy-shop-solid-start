// context/CartContext.tsx
import { createContext, useContext } from "solid-js";
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

export const CartContext = createContext<{
  cartItems: CartState;
  addToCart: (product: IProduct, quantity?: number) => void;
}>({
  cartItems: { items: [], total: 0 },
  addToCart: () => {},
});

export function useCartContext() {
  return useContext(CartContext);
}

export function CartProvider(props: CartProviderProps) {
  const [cartItems, setCartItems] = createStore<CartState>({ items: [], total: 0 });

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
        newItems[existingProductIndex].quantity += quantity;
      } else {
        newItems.push({ ...product, quantity });
      }

      const newTotal = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

      // Update stock on the backend
      updateStock(product.id, product.stock_quantity - quantity);

      return {
        ...prevCartItems,
        items: newItems,
        total: newTotal,
      };
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {props.children}
    </CartContext.Provider>
  );
}
