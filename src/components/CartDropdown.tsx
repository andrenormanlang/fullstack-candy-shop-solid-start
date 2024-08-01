import { For, Show, createSignal } from "solid-js";
import { useCartContext } from "../context/CartContext";
import { IoCartOutline } from "solid-icons/io";

const CartDropdown = () => {
  const { cartItems, addToCart } = useCartContext();
  const [isOpen, setIsOpen] = createSignal(false);

  const toggleCart = () => setIsOpen(!isOpen());

  return (
    <div class="cart-dropdown-container relative inline-block">
      <button onClick={toggleCart} class="cart-icon-wrapper">
        <IoCartOutline size={35} class="text-gray-800" />
        {cartItems.items.length > 0 && (
          <span class="cart-counter">{cartItems.items.length}</span>
        )}
      </button>
      <Show when={isOpen()}>
        <div class="cart-dropdown">
          <For each={cartItems.items}>
            {(item) => (
              <div
                class="cart-item grid-cols-3
              p-2 mb-2 bg-white rounded-lg shadow"
              >
                <div class="flex items-center">
                  <img
                    src={`https://www.bortakvall.se/${item.images?.thumbnail}`}
                    alt={item.name}
                    class="cart-item-image mr-2"
                  />
                  <div class="flex flex-col items-start">
                    <div class="font-bold text-name-cart text-left">
                      {item.name}
                    </div>
                    <div class="flex items-center mt-2">
                      <div class="quantity-control flex items-center">
                        <button class="quantity-btn">-</button>
                        <div class="quantity-display mx-2 text-sm text-left">
                          {item.quantity}
                        </div>
                        <button class="quantity-btn">+</button>
                      </div>
                      <div class="mx-2 ml-3 mr-3 font-bold text-left">
                        <div class="text-sm">{item.price}kr</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </For>
          <div class="cart-total p-2 text-center">
            Total: £{cartItems.total.toFixed(2)}
          </div>
          <button class="checkout-button block p-2 w-auto mx-auto text-white bg-yellow-500 rounded-lg mb-2">
            To checkout
          </button>
        </div>
      </Show>
    </div>
  );
};

export default CartDropdown;
