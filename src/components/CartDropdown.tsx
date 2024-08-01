import { For, Show, createSignal } from "solid-js";
import { useCartContext } from "../context/CartContext";
import { IoCartOutline } from "solid-icons/io";

const CartDropdown = () => {
  const { cartItems } = useCartContext();
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
      <div class="cart-dropdown bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-4 max-h-screen overflow-y-scroll">
      <For each={cartItems.items}>
            {(item) => (
              <div class="cart-item grid-cols-3 p-2 mb-2 bg-white dark:bg-neutral-700 rounded-lg shadow">
                <div class="flex items-center">
                  <img
                    src={`https://bortakvall.se/${item.images.thumbnail}`}
                    alt={item.name}
                    class="cart-item-image mr-2"
                  />
                  <div class="flex flex-col items-start">
                    <div class="font-bold text-name-cart text-left text-black dark:text-white">
                      {item.name}
                    </div>
                    <div class="flex items-center mt-2">
                      <div class="quantity-control flex items-center">
                        <div class="quantity-display mx-2 text-sm text-left text-black dark:text-white">
                          {item.quantity}
                        </div>
                      </div>
                      <div class="mx-2 ml-3 mr-3 font-bold text-left text-black dark:text-white">
                        <div class="text-sm">{item.price}kr</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </For>
          <div class="cart-total p-2 text-center text-black dark:text-white">
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

