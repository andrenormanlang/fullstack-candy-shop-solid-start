import { createSignal, createEffect, For, Show } from "solid-js";
import { useCartContext } from "../context/CartContext";
import { IoCartOutline, IoTrash } from "solid-icons/io";
import { IOrder, IOrderRequest, IOrderResponse } from "../types/types";
import { Motion, Presence } from "solid-motionone";

const CartDropdown = () => {
  const { cartItems, updateCartItem, removeFromCart, clearCart } =
    useCartContext();
  const [isOpen, setIsOpen] = createSignal(false);
  const [modalMessage, setModalMessage] = createSignal("");
  const [showModal, setShowModal] = createSignal(false);
  const [modalAction, setModalAction] = createSignal(() => {});
  const [showCheckoutModal, setShowCheckoutModal] = createSignal(false);
  const [showLeaveSummaryModal, setShowLeaveSummaryModal] = createSignal(false);
  const [showOrderForm, setShowOrderForm] = createSignal(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = createSignal(false);
  const [orderData, setOrderData] = createSignal<IOrder | null>(null);
  const [products, setProducts] = createSignal([]);
  const [lastChange, setLastChange] = createSignal(0);

  const toggleCart = () => setIsOpen(!isOpen());

  const handleQuantityChange = (item, event) => {
    const now = Date.now();
    if (now - lastChange() < 500) {
      return;
    }
    setLastChange(now);
    const newQuantity = Math.min(
      Math.max(event.target.value, 1),
      item.product.stock_quantity + item.quantity
    );
    if (newQuantity <= item.product.stock_quantity + item.quantity) {
      updateCartItem(item.id, newQuantity);
    } else {
      alert(
        `Cannot add more than ${item.product.stock_quantity} items to the cart`
      );
    }
  };

  const promptRemoveFromCart = (item) => {
    setModalMessage(
      `Are you sure you want to delete ${item.product.name} from the cart?`
    );
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
    setShowOrderForm(true);
  };

  const handleOrderMore = () => {
    setShowCheckoutModal(false);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const result = await response.json();
      if (result.status === "success") {
        setProducts(result.data);
      }
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  // Example: Adding product_name in the OrderItem creation

  const handleOrderSubmit = async (formData: IOrderRequest) => {
    const orderItemsWithProductName = formData.order_items.map((item) => {
      const product = products().find((p) => p.id === item.product_id);
      return {
        ...item,
        product_name: product.name,
      };
    });

    const updatedFormData = {
      ...formData,
      order_items: orderItemsWithProductName,
    };

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });
      const result: IOrderResponse = await response.json();
      if (result.status === "success") {
        setOrderData(result.data);
        setShowOrderForm(false);
        setShowOrderConfirmation(true);
        clearCart();
        // Optionally re-fetch products to ensure the data is up-to-date
        await fetchProducts();
      } else {
        throw new Error("Order submission failed");
      }
    } catch (error) {
      console.error("Error submitting order", error);
      alert("Order submission failed");

      // Revert optimistic update if the request fails
      cartItems.items.forEach((item) => {
        setProducts((products) =>
          products.map((product) =>
            product.id === item.product_id
              ? {
                  ...product,
                  stock_quantity: product.stock_quantity + item.quantity,
                }
              : product
          )
        );
      });
    }
  };

  createEffect(() => {
    fetchProducts(); // Initial fetch
    const interval = setInterval(fetchProducts, 60000); // Poll every 60 seconds

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div class="cart-dropdown-container relative inline-block">
      <button onClick={toggleCart} class="cart-icon-wrapper">
        <IoCartOutline size={35} class="text-gray-800 dark:text-gray-200" />
        <Show when={cartItems.items.length > 0}>
          <span class="cart-counter">{cartItems.items.length}</span>
        </Show>
      </button>
      <Presence>
        <Show when={isOpen()}>
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            class="cart-dropdown bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto mt-2 mx-2"
            style={{ width: "350px" }}
          >
            <For each={cartItems.items}>
              {(item) => (
                <Motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  class="cart-item grid-cols-3 p-2 mb-2 bg-white dark:bg-neutral-700 rounded-lg shadow"
                >
                  <div class="flex items-center">
                    <button
                      class="mr-2 bg-red-500 p-1 rounded hover:bg-red-600 transition-colors duration-200"
                      onClick={() => promptRemoveFromCart(item)}
                    >
                      <IoTrash size={20} class="text-white" />
                    </button>
                    <img
                      src={
                        item.product.images.thumbnail.startsWith("http")
                          ? item.product.images.thumbnail
                          : `https://bortakvall.se/${item.product.images.thumbnail}`
                      }
                      alt={item.product.name}
                      class="cart-item-image mr-4"
                      style={{ width: "60px", height: "60px" }}
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
                          <div class="text-sm">
                            {(item.product.price * item.quantity).toFixed(2)}kr
                          </div>
                        </div>
                      </div>
                      <div class="text-sm font-semibold text-gray-800 dark:text-gray-300 mt-1">
                        Total stock: {item.product.stock_quantity}
                      </div>
                    </div>
                  </div>
                </Motion.div>
              )}
            </For>
            <div class="cart-total p-2 text-center text-black dark:text-white">
              Total: {cartItems.total.toFixed(2)} kr
            </div>
            <button
              class="checkout-button block p-2 w-auto mx-auto text-white bg-yellow-500 rounded-lg mb-2 hover:bg-yellow-600 transition-colors duration-200"
              onClick={handleCheckout}
            >
              To checkout
            </button>
            <button
              class="bg-red-500 text-white p-2 rounded mt-2 w-full hover:bg-red-600 transition-colors duration-200"
              onClick={promptClearCart}
            >
              Empty Cart
            </button>
          </Motion.div>
        </Show>
      </Presence>
      <Presence>
        <Show when={showModal()}>
          <Motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            class="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div class="modal-content bg-white p-4 rounded shadow-lg">
              <p>{modalMessage()}</p>
              <div class="flex justify-center mt-4">
                <button
                  class="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600 transition-colors duration-200"
                  onClick={modalAction()}
                >
                  Yes
                </button>
                <button
                  class="bg-gray-500 text-white p-2 rounded ml-2 hover:bg-gray-600 transition-colors duration-200"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Motion.div>
        </Show>
      </Presence>
      <Presence>
        <Show when={showCheckoutModal()}>
          <Motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            class="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40"
          >
            <div class="modal-content bg-white dark:bg-neutral-800 p-8 rounded shadow-lg max-w-lg w-full">
              <h2 class="text-2xl font-bold mb-4 text-center text-black dark:text-white">
                Checkout Summary
              </h2>
              <div class="flex flex-col gap-4 mb-4 max-h-96 overflow-y-auto">
                <For each={cartItems.items}>
                  {(item) => (
                    <div class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow border dark:border-gray-600">
                      <img
                        src={
                          item.product.images.thumbnail.startsWith("http")
                            ? item.product.images.thumbnail
                            : `https://bortakvall.se/${item.product.images.thumbnail}`
                        }
                        alt={item.product.name}
                        class="mr-4 w-16 h-16 rounded"
                      />

                      <div class="flex-1">
                        <div class="font-bold text-center text-black dark:text-white mb-2">
                          {item.product.name}
                        </div>
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
                        <div class="text-sm font-semibold text-gray-800 dark:text-gray-300 mt-1">
                          Total stock: {item.product.stock_quantity}
                        </div>
                      </div>
                      <div class="font-bold text-black dark:text-white ml-4">
                        {(item.product.price * item.quantity).toFixed(2)} kr
                      </div>
                    </div>
                  )}
                </For>
              </div>
              <div class="text-center text-xl font-bold mb-4 text-black dark:text-white">
                Total: {cartItems.total.toFixed(2)} kr
              </div>
              <div class="flex gap-4">
                <button
                  class="bg-blue-500 text-white p-2 rounded flex-1 hover:bg-blue-600 transition-colors duration-200"
                  onClick={handleProceedToForm}
                >
                  Proceed to Form
                </button>
                <button
                  class="bg-gray-500 text-white p-2 rounded flex-1 hover:bg-gray-600"
                  onClick={handleOrderMore}
                >
                  Order other types of Candy
                </button>
              </div>
            </div>
          </Motion.div>
        </Show>
      </Presence>
      <Presence>
        <Show when={showOrderForm()}>
          <Motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            class="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40"
          >
            <div class="modal-content bg-white dark:bg-neutral-800 p-4 rounded shadow-lg max-w-lg w-1/2 max-h-full overflow-y-auto">
              <h2 class="text-2xl font-bold mb-4 text-center text-black dark:text-white">
                Complete Your Form
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as typeof e.target & {
                    first_name: { value: string };
                    last_name: { value: string };
                    address: { value: string };
                    postcode: { value: string };
                    city: { value: string };
                    email: { value: string };
                    phone: { value: string };
                  };

                  const formData = {
                    customer_first_name: target.first_name.value,
                    customer_last_name: target.last_name.value,
                    customer_address: target.address.value,
                    customer_postcode: target.postcode.value,
                    customer_city: target.city.value,
                    customer_email: target.email.value,
                    customer_phone: target.phone.value,
                    order_date: new Date().toISOString(),
                    order_total: cartItems.total,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    order_items: cartItems.items.map((item) => ({
                      product_id: item.product_id,
                      qty: item.quantity,
                      item_price: item.product.price,
                      item_total: item.quantity * item.product.price,
                    })),
                  };

                  handleOrderSubmit(formData);
                }}
              >
                <div class="mb-4">
                  <input
                    type="text"
                    name="first_name"
                    required
                    placeholder="First Name"
                    class="w-full p-2 border rounded placeholder-gray-400"
                  />
                </div>
                <div class="mb-4">
                  <input
                    type="text"
                    name="last_name"
                    required
                    placeholder="Last Name"
                    class="w-full p-2 border rounded placeholder-gray-400"
                  />
                </div>
                <div class="mb-4">
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="Address"
                    class="w-full p-2 border rounded placeholder-gray-400"
                  />
                </div>
                <div class="mb-4">
                  <input
                    type="text"
                    name="postcode"
                    required
                    placeholder="ZIP Code (format: 225 39)"
                    class="w-full p-2 border rounded placeholder-gray-400"
                  />
                </div>
                <div class="mb-4">
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="City"
                    class="w-full p-2 border rounded placeholder-gray-400"
                  />
                </div>
                <div class="mb-4">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="E-mail"
                    class="w-full p-2 border rounded placeholder-gray-400"
                  />
                </div>
                <div class="mb-4">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Telephone (format: 07/+46)"
                    class="w-full p-2 border rounded placeholder-gray-400"
                  />
                </div>
                <div class="flex justify-between">
                  <button
                    type="submit"
                    class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    Purchase
                  </button>
                  <button
                    type="button"
                    class="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    onClick={() => setShowOrderForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </Motion.div>
        </Show>
      </Presence>

      <Presence>
        <Show when={showOrderConfirmation()}>
          <Motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            class="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40"
          >
            <div class="modal-content bg-white dark:bg-neutral-800 p-8 rounded shadow-lg max-w-lg w-full">
              <h2 class="text-2xl font-bold mb-4 text-center text-black dark:text-white">
                Order Confirmation
              </h2>
              <div class="text-center text-xl font-bold mb-4 text-black dark:text-white">
                Thank you for your order!
              </div>
              <div class="text-center text-black dark:text-white">
                <p>
                  <strong>Name:</strong> {orderData()?.customer_first_name}{" "}
                  {orderData()?.customer_last_name}
                </p>
                <p>
                  <strong>Order #:</strong> {orderData()?.id}
                </p>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(orderData()?.order_date).toLocaleString()}
                </p>
                <p>
                  <strong>Order Total:</strong> {orderData()?.order_total} Kr
                </p>
                <div class="mt-4">
                  <h3 class="font-bold">Order Items:</h3>
                  <ul>
                    <For each={orderData()?.items}>
                      {(item) => (
                        <li class="text-sm">
                          {item.qty} x {item.product_name} at {item.item_price}{" "}
                          Kr each
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              </div>
              <button
                class="bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600 transition-colors duration-200"
                onClick={() => setShowOrderConfirmation(false)}
              >
                Close
              </button>
            </div>
          </Motion.div>
        </Show>
      </Presence>
    </div>
  );
};

export default CartDropdown;
