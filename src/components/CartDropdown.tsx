import { For, Show, createSignal } from "solid-js";
import { useCartContext } from "../context/CartContext";
import { IoCartOutline, IoTrash } from "solid-icons/io";

const CartDropdown = () => {
  const { cartItems, updateCartItem, removeFromCart, clearCart } = useCartContext();
  const [isOpen, setIsOpen] = createSignal(false);
  const [modalMessage, setModalMessage] = createSignal("");
  const [showModal, setShowModal] = createSignal(false);
  const [modalAction, setModalAction] = createSignal(() => {});
  const [showCheckoutModal, setShowCheckoutModal] = createSignal(false);
  const [showLeaveSummaryModal, setShowLeaveSummaryModal] = createSignal(false);

  const toggleCart = () => setIsOpen(!isOpen());

  const handleQuantityChange = (item, event) => {
    const newQuantity = Math.min(Math.max(event.target.value, 1), item.product.stock_quantity + item.quantity);
    if (newQuantity <= item.product.stock_quantity + item.quantity) {
      updateCartItem(item.id, newQuantity);
    } else {
      alert(`Cannot add more than ${item.product.stock_quantity} items to the cart`);
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
    if (cartItems.total === 0) {
      window.location.href = "/";
    } else {
      setShowCheckoutModal(true);
      setIsOpen(false);
    }
  };

  const handleProceedToForm = () => {
    setShowCheckoutModal(false);
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
        <IoCartOutline size={35} class="text-gray-800 dark:text-gray-200" />
        <Show when={cartItems.items.length > 0}>
          <span class="cart-counter">{cartItems.items.length}</span>
        </Show>
      </button>
      <Show when={isOpen()}>
        <div class="cart-dropdown bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto mt-2 mx-2" style={{ width: '350px' }}>
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
                    style={{ width: '60px', height: '60px' }}
                  />
                  <div class="flex flex-col items-start w-full">
                    <div class="font-bold text-name-cart text-left text-black dark:text-white">
                      {item.product.name}
                    </div>
                    <div class="flex items-center mt-2 justify-between w-full">
                      <input
                        type="number"
                        class="quantity-input text-center w-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white rounded"
                        value={item.quantity}
                        min="1"
                        max={item.product.stock_quantity + item.quantity}
                        onInput={(e) => handleQuantityChange(item, e)}
                      />
                      <div class="ml-4 font-bold text-left text-black dark:text-white">
                        <div class="text-sm">{(item.product.price * item.quantity).toFixed(2)}kr</div>
                      </div>
                    </div>
                    <div class="text-sm font-semibold text-gray-800 dark:text-gray-300 mt-1">Total stock: {item.product.stock_quantity}</div>
                  </div>
                </div>
              </div>
            )}
          </For>
          <div class="cart-total p-2 text-center text-black dark:text-white">
            Total: {cartItems.total.toFixed(2)} kr
          </div>
          <button class="checkout-button block p-2 w-auto mx-auto text-white bg-yellow-500 rounded-lg mb-2" onClick={handleCheckout}>
            To checkout
          </button>
          <button class="bg-red-500 text-white p-2 rounded mt-2 w-full" onClick={promptClearCart}>Empty Cart</button>
        </div>
      </Show>
      <Show when={showModal()}>
        <div class="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
        <div class="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div class="modal-content bg-white dark:bg-neutral-800 p-8 rounded shadow-lg max-w-lg w-full">
            <h2 class="text-2xl font-bold mb-4 text-center text-black dark:text-white">Checkout Summary</h2>
            <div class="flex flex-col gap-4 mb-4 max-h-96 overflow-y-auto">
              <For each={cartItems.items}>
                {(item) => (
                  <div class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow border dark:border-gray-600">
                    <img
                      src={`https://bortakvall.se/${item.product.images.thumbnail}`}
                      alt={item.product.name}
                      class="mr-4 w-16 h-16 rounded"
                    />
                    <div class="flex-1">
                      <div class="font-bold text-center text-black dark:text-white mb-2">{item.product.name}</div>
                      <div class="flex items-center justify-center">
                        <input
                          type="number"
                          class="quantity-input text-center w-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white rounded"
                          value={item.quantity}
                          min="1"
                          max={item.product.stock_quantity + item.quantity}
                          onInput={(e) => handleQuantityChange(item, e)}
                        />
                      </div>
                      <div class="text-sm font-semibold text-gray-800 dark:text-gray-300 mt-1">Total stock: {item.product.stock_quantity}</div>
                    </div>
                    <div class="font-bold text-black dark:text-white ml-4">
                      {(item.product.price * item.quantity).toFixed(2)} kr
                    </div>
                  </div>
                )}
              </For>
            </div>
            <div class="text-center text-xl font-bold mb-4 text-black dark:text-white">Total: {cartItems.total.toFixed(2)} kr</div>
            <div class="flex gap-4">
              <button class="bg-blue-500 text-white p-2 rounded flex-1" onClick={handleProceedToForm}>Proceed to Form</button>
              <button class="bg-gray-500 text-white p-2 rounded flex-1" onClick={handleOrderMore}>Order other types of Candy</button>
            </div>
          </div>
        </div>
      </Show>
      <Show when={showLeaveSummaryModal()}>
        <div class="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
