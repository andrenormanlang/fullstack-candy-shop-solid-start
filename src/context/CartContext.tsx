// context/CartContext.tsx
import { createContext, useContext, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { JSX } from "solid-js/jsx-runtime";

type CartProviderProps = {
  children: JSX.Element;
};

type CartState = {
  items: { id: number; name: string; price: number; quantity: number }[];
  total: number;
};

export const CartContext = createContext<{
  cartItems: CartState;
  addToCart: (product: { id: number; name: string; price: number }, quantity?: number) => void;
}>({
  cartItems: { items: [], total: 0 },
  addToCart: () => {},
});

export function useCartContext() {
  return useContext(CartContext);
}

export function CartProvider(props: CartProviderProps) {
  const [cartItems, setCartItems] = createStore<CartState>({ items: [], total: 0 });

  const addToCart = (product: { id: number; name: string; price: number }, quantity = 1) => {
    setCartItems((prevCartItems) => {
      const existingProductIndex = prevCartItems.items.findIndex((p) => p.id === product.id);
      const newItems = [...prevCartItems.items];

      if (existingProductIndex !== -1) {
        newItems[existingProductIndex].quantity += quantity;
      } else {
        newItems.push({ ...product, quantity });
      }

      return {
        ...prevCartItems,
        items: newItems,
        total: newItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
      };
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {props.children}
    </CartContext.Provider>
  );
}
