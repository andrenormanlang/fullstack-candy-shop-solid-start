import { For, Show, createSignal } from "solid-js";
import { useCartContext } from "../context/CartContext";
import { IoCartOutline, IoTrash } from "solid-icons/io";

const CartDropdown = () => {
  const { cartItems, addToCart, updateCartItem, removeFromCart, clearCart } = useCartContext();
  const [isOpen, setIsOpen] = createSignal(false);
  const [modalMessage, setModalMessage] = createSignal("");
  const [showModal, setShowModal] = createSignal(false);
  const [modalAction, setModalAction] = createSignal(() => {});
  const [showCheckoutModal, setShowCheckoutModal] = createSignal(false);
  const [showLeaveSummaryModal, setShowLeaveSummaryModal] = createSignal(false);

  const toggleCart = () => setIsOpen(!isOpen());

  const handleAddToCart = (item) => {
    if (item.product.stock_quantity > item.quantity) {
      updateCartItem(item.id, item.quantity + 1);
    } else {
      setModalMessage(`Total stock amount of ${item.product.name} has already been added to your cart.`);
      setShowModal(true);
    }
  };

  const handleRemoveFromCart = (item) => {
    if (item.quantity > 1) {
      updateCartItem(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id, item.quantity);
    }
  };

  const promptRemoveFromCart = (item) => {
    setModalMessage(`Are you sure you want to delete ${item.product.name} from the cart?`);
    setModalAction(() => () => confirmRemoveFromCart(item));
    setShowModal(true);
  };

  const confirmRemoveFromCart = (item) => {
    removeFromCart(item.id, item.quantity);
    setShowModal(false);
  };

  const promptClearCart = () => {
    setModalMessage("Are you sure you want to clear the entire cart?");
    setModalAction(() => confirmClearCart);
    setShowModal(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  const handleCheckout = () => {
    setShowCheckoutModal(true);
    setIsOpen(false);
  };

  const handleProceedToForm = () => {
    setShowCheckoutModal(false);
    // Redirect to form or perform form action
  };

  const handleOrderMore = () => {
    setShowLeaveSummaryModal(true);
  };

  const confirmLeaveSummary = () => {
    setShowCheckoutModal(false);
    setShowLeaveSummaryModal(false);
  };

  const cancelLeaveSummary = () => {
    setShowLeaveSummaryModal(false);
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
        <div class="cart-dropdown bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-4 max-h-screen overflow-y-scroll mt-2 mx-2" style={{ width: '350px' }}>
          <For each={cartItems.items}>
            {(item) => (
              <div class="cart-item grid-cols-3 p-2 mb-2 bg-white dark:bg-neutral-700 rounded-lg shadow">
                <div class="flex items-center">
                  <button class="mr-2 bg-red-500 p-1 rounded" onClick={() => promptRemoveFromCart(item)}>
                    <IoTrash size={20} class="text-white" />
                  </button>
                  <img
                    src={`https://bortakvall.se/${item.product.images.thumbnail}`}
                    alt={item.product.name}
                    class="cart-item-image mr-4"
                    style={{ width: '80px', height: '80px' }}
                  />
                  <div class="flex flex-col items-start w-full">
                    <div class="font-bold text-name-cart text-left text-black dark:text-white">
                      {item.product.name}
                    </div>
                    <div class="flex items-center mt-2 justify-between w-full">
                      <button class="bg-gray-300 dark:bg-gray-600 p-1 rounded" onClick={() => handleRemoveFromCart(item)}>-</button>
                      <div class="quantity-display mx-2 text-sm text-left text-black dark:text-white">
                        {item.quantity}
                      </div>
                      <button class="bg-gray-300 dark:bg-gray-600 p-1 rounded" onClick={() => handleAddToCart(item)}>+</button>
                      <div class="ml-4 font-bold text-left text-black dark:text-white">
                        <div class="text-sm">{(item.product.price * item.quantity).toFixed(2)}kr</div>
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
          <button class="checkout-button block p-2 w-auto mx-auto text-white bg-yellow-500 rounded-lg mb-2" onClick={handleCheckout}>
            To checkout
          </button>
          <button class="bg-red-500 text-white p-2 rounded mt-2 w-full" onClick={promptClearCart}>Empty Cart</button>
        </div>
      </Show>
      <Show when={showModal()}>
        <div class="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div class="modal-content bg-white p-4 rounded shadow-lg">
            <p>{modalMessage()}</p>
            <div class="flex justify-center mt-4">
              <button class="bg-blue-500 text-white p-2 rounded mr-2" onClick={modalAction()}>Yes</button>
              <button class="bg-gray-500 text-white p-2 rounded ml-2" onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      </Show>
      <Show when={showCheckoutModal()}>
        <div class="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div class="modal-content bg-white p-8 rounded shadow-lg max-w-lg w-full">
            <h2 class="text-2xl font-bold mb-4 text-center">Checkout Summary</h2>
            <div class="flex flex-col gap-4 mb-4">
              <For each={cartItems.items}>
                {(item) => (
                  <div class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow border dark:border-gray-600">
                    <img
                      src={`https://bortakvall.se/${item.product.images.thumbnail}`}
                      alt={item.product.name}
                      class="mr-4 w-20 h-20 rounded"
                    />
                    <div class="flex-1 text-center">
                      <div class="font-bold text-black dark:text-white mb-2">{item.product.name}</div>
                      <div class="flex items-center justify-center gap-1">
                        <button class="bg-gray-300 dark:bg-gray-600 p-2 rounded" onClick={() => updateCartItem(item.id, item.quantity - 1)}>-</button>
                        <div class="quantity-display text-lg font-bold text-black dark:text-white mx-2">{item.quantity}</div>
                        <button class="bg-gray-300 dark:bg-gray-600 p-2 rounded" onClick={() => handleAddToCart(item)}>+</button>
                      </div>
                    </div>
                    <div class="font-bold text-black dark:text-white ml-4">
                      {(item.product.price * item.quantity).toFixed(2)} kr
                    </div>
                  </div>
                )}
              </For>
            </div>
            <div class="text-center text-xl font-bold mb-4">Total: {(cartItems.total).toFixed(2)} kr</div>
            <div class="flex gap-4">
              <button class="bg-blue-500 text-white p-2 rounded flex-1" onClick={handleProceedToForm}>Proceed to Form</button>
              <button class="bg-gray-500 text-white p-2 rounded flex-1" onClick={handleOrderMore}>Order More</button>
            </div>
          </div>
        </div>
      </Show>
      <Show when={showLeaveSummaryModal()}>
        <div class="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div class="modal-content bg-white p-4 rounded shadow-lg">
            <p>Are you sure you want to leave the summary?</p>
            <div class="flex justify-center mt-4">
              <button class="bg-blue-500 text-white p-2 rounded mr-2" onClick={confirmLeaveSummary}>Yes</button>
              <button class="bg-gray-500 text-white p-2 rounded ml-2" onClick={cancelLeaveSummary}>Cancel</button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default CartDropdown;





