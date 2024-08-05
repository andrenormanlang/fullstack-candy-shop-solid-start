// CartContext.tsx
import { createContext, useContext, createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { JSX } from "solid-js/jsx-runtime";
import { IProduct } from "../types/types";

type CartProviderProps = {
  children: JSX.Element;
};

type CartItem = {
  id: number;
  product_id: number;
  product: IProduct;
  quantity: number;
  created_at: string;
  total_stock_quantity: number; // Add this field
};

type CartState = {
  items: CartItem[];
  total: number;
};

export const CartContext = createContext<{
  cartItems: CartState;
  addToCart: (product: IProduct, quantity?: number) => void;
  updateCartItem: (id: number, quantity: number) => void;
  removeFromCart: (id: number, quantity?: number) => void;
  clearCart: () => void;
}>({
  cartItems: { items: [], total: 0 },
  addToCart: () => {},
  updateCartItem: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export function useCartContext() {
  return useContext(CartContext);
}

export function CartProvider(props: CartProviderProps) {
  const [cartItems, setCartItems] = createStore<CartState>({ items: [], total: 0 });

  const loadCartFromAPI = async () => {
    try {
      const response = await fetch('/api/cart/get');
      const result = await response.json();
      if (result.status === "success") {
        // Assuming the API returns total_stock_quantity for each cart item
        setCartItems({ items: result.data, total: calculateTotal(result.data) });
      }
    } catch (error) {
      console.error("Failed to load cart from API:", error);
    }
  };

  onMount(loadCartFromAPI);

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  const updateTotal = () => {
    setCartItems('total', calculateTotal(cartItems.items));
  };

  const addToCart = async (product: IProduct, quantity = 1) => {
    try {
      const existingItem = cartItems.items.find(item => item.product_id === product.id);

      // if (existingItem) {
      //   const newQuantity = existingItem.quantity + quantity;
      //   if (newQuantity > product.stock_quantity) {
      //     alert(`Cannot add more than ${product.stock_quantity} items to the cart`);
      //     return;
      //   }
      // } else if (quantity > product.stock_quantity) {
      //   alert(`Cannot add more than ${product.stock_quantity} items to the cart`);
      //   return;
      // }

      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: product.id, quantity }),
      });
      const result = await response.json();
      if (result.status === "success") {
        await loadCartFromAPI();
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const updateCartItem = async (id: number, newQuantity: number) => {
    try {
      const cartItem = cartItems.items.find(item => item.id === id);
      if (!cartItem) return;

      const quantityDifference = newQuantity - cartItem.quantity;

      if (quantityDifference > 0 && cartItem.product.stock_quantity < quantityDifference) {
        alert("Insufficient stock.");
        return;
      }

      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, quantity: newQuantity }),
      });
      const result = await response.json();
      if (result.status === "success") {
        await loadCartFromAPI();
      } else {
        console.error('Failed to update cart item:', result.message);
      }
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  };

  const removeFromCart = async (id: number, quantity = 1) => {
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, quantity }),
      });
      const result = await response.json();
      if (result.status === "success") {
        await loadCartFromAPI();
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'POST',
      });
      const result = await response.json();
      if (result.status === "success") {
        await loadCartFromAPI();
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateCartItem, removeFromCart, clearCart }}>
      {props.children}
    </CartContext.Provider>
  );
}
