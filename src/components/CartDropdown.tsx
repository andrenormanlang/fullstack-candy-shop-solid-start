import { For, Show, createSignal } from "solid-js";
import { useCartContext } from "../context/CartContext";
import { IoCartOutline } from "solid-icons/io";

const CartDropdown = () => {
  const { cartItems, addToCart, updateCartItem, removeFromCart, clearCart } = useCartContext();
  const [isOpen, setIsOpen] = createSignal(false);
  const [modalMessage, setModalMessage] = createSignal("");
  const [showModal, setShowModal] = createSignal(false);

  const toggleCart = () => setIsOpen(!isOpen());

  const handleAddToCart = (item) => {
    if (item.product.stock_quantity > item.quantity) {
      updateCartItem(item.id, item.quantity + 1); // Ensure item.id is being passed correctly
    } else {
      setModalMessage(`Total stock amount of ${item.product.name} has already been added to your cart.`);
      setShowModal(true);
    }
  };

  const handleRemoveFromCart = (item) => {
    if (item.quantity > 1) {
      updateCartItem(item.id, item.quantity - 1); // Ensure item.id is being passed correctly
    } else {
      removeFromCart(item.id, item.quantity);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  return (
    <div class="cart-dropdown-container relative inline-block">
      <button onClick={toggleCart} class="cart-icon-wrapper">
        <IoCartOutline size={35} class="text-gray-800" />
        <Show when={cartItems.items.length > 0}>
          <span class="cart-counter">{cartItems.items.length}</span>
        </Show>
      </button>
      <Show when={isOpen()}>
        <div class="cart-dropdown bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-4 max-h-screen overflow-y-scroll mt-2 mx-2">
          <For each={cartItems.items}>
            {(item) => (
              <div class="cart-item grid-cols-3 p-2 mb-2 bg-white dark:bg-neutral-700 rounded-lg shadow">
                <div class="flex items-center">
                  <button class="ml-auto bg-red-500 p-1 rounded" onClick={() => removeFromCart(item.id, item.quantity)}>🗑️</button>
                  <img
                    src={`https://bortakvall.se/${item.product.images.thumbnail}`}
                    alt={item.product.name}
                    class="cart-item-image mr-2"
                  />
                  <div class="flex flex-col items-start">
                    <div class="font-bold text-name-cart text-left text-black dark:text-white">
                      {item.product.name}
                    </div>
                    <div class="flex items-center mt-2">
                      <button class="bg-gray-300 p-1 rounded" onClick={() => handleRemoveFromCart(item)}>-</button>
                      <div class="quantity-display mx-2 text-sm text-left text-black dark:text-white">
                        {item.quantity}
                      </div>
                      <button class="bg-gray-300 p-1 rounded" onClick={() => handleAddToCart(item)}>+</button>
                      <div class="mx-2 ml-3 mr-3 font-bold text-left text-black dark:text-white">
                        <div class="text-sm">{item.product.price}kr</div>
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
          <button class="bg-red-500 text-white p-2 rounded mt-2 w-full" onClick={clearCart}>Empty Cart</button>
        </div>
      </Show>
      <Show when={showModal()}>
        <div class="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div class="modal-content bg-white p-4 rounded shadow-lg">
            <p>{modalMessage()}</p>
            <button class="bg-blue-500 text-white p-2 rounded mt-2" onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default CartDropdown;
