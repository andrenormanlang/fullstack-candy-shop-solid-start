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

    const existingItem = cartItems.items.find((item) => item.product.id === product.id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock_quantity) {
        alert(`Only ${product.stock_quantity} items in stock`);
        return;
      }

      await updateCartItem(existingItem.id, newQuantity);
    } else {
      const newItem = {
        id: product.id,
        product_id: product.id,
        product,
        quantity,
        created_at: new Date().toISOString(),
      };

      try {
        const response = await fetch('/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity,
          }),
        });

        const result = await response.json();
        if (result.status === "success") {
          setCartItems((prevCartItems) => ({
            items: [...prevCartItems.items, newItem],
            total: prevCartItems.total + product.price * quantity,
          }));
          updateStock(product.id, product.stock_quantity - quantity);
        }
      } catch (error) {
        console.error("Failed to add to cart in DB:", error);
      }
    }
  };

  const updateCartItem = async (id: number, quantity: number) => {
    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, quantity }),
      });

      const result = await response.json();
      if (result.status === "success") {
        setCartItems((prevCartItems) => {
          const newItems = prevCartItems.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          return {
            items: newItems,
            total: calculateTotal(newItems),
          };
        });
      }
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  };

  const removeFromCart = async (id: number, quantity = 1) => {
    const existingItem = cartItems.items.find((item) => item.id === id);

    if (existingItem) {
      const newQuantity = existingItem.quantity - quantity;

      if (newQuantity <= 0) {
        try {
          const response = await fetch('/api/cart/remove', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
          });

          const result = await response.json();
          if (result.status === "success") {
            setCartItems((prevCartItems) => {
              const newItems = prevCartItems.items.filter((item) => item.id !== id);
              return {
                items: newItems,
                total: calculateTotal(newItems),
              };
            });
            updateStock(existingItem.product.id, existingItem.product.stock_quantity + existingItem.quantity);
          }
        } catch (error) {
          console.error("Failed to remove cart item in DB:", error);
        }
      } else {
        await updateCartItem(id, newQuantity);
      }
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'POST',
      });

      const result = await response.json();
      if (result.status === "success") {
        cartItems.items.forEach(item => {
          updateStock(item.product.id, item.product.stock_quantity + item.quantity);
        });

        setCartItems({ items: [], total: 0 });
      }
    } catch (error) {
      console.error("Failed to clear cart in DB:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateCartItem, removeFromCart, clearCart }}>
      {props.children}
    </CartContext.Provider>
  );
}
