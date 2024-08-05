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

  const handleQuantityChange = (item, event) => {
    const newQuantity = Math.min(Math.max(event.target.value, 1), item.total_stock_quantity);
    if (newQuantity <= item.total_stock_quantity) {
      updateCartItem(item.id, newQuantity);
    } else {
      alert(`Cannot add more than ${item.total_stock_quantity} items to the cart`);
    }
  };


  const handleRemoveFromCart = (item) => {
    promptRemoveFromCart(item);
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
        <IoCartOutline size={35} class="text-gray-800" />
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
                  <button class="mr-2 bg-red-500 p-1 rounded" onClick={() => removeFromCart(item.id, item.quantity)}>
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
                        class="quantity-input text-center w-12"
                        value={item.quantity}
                        min="1"
                        max={item.total_stock_quantity}
                        onInput={(e) => handleQuantityChange(item, e)}
                      />
                      <div class="ml-4 font-bold text-left text-black dark:text-white">
                        <div class="text-sm">{(item.product.price * item.quantity).toFixed(2)}kr</div>
                      </div>
                    </div>
                    <div class="text-xs text-gray-500">Total stock: {item.total_stock_quantity}</div> {/* Display total stock */}
                  </div>
                </div>
              </div>
            )}
          </For>
          <div class="cart-total p-2 text-center text-black dark:text-white">
            Total: {cartItems.total.toFixed(2)} kr
          </div>
          <button class="checkout-button block p-2 w-auto mx-auto text-white bg-yellow-500 rounded-lg mb-2" onClick={() => { /* handle checkout */ }}>
            To checkout
          </button>
          <button class="bg-red-500 text-white p-2 rounded mt-2 w-full" onClick={() => clearCart()}>Empty Cart</button>
        </div>
      </Show>
    </div>
  );
};

export default CartDropdown;


