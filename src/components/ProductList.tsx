import { createSignal, onMount, For, Show } from "solid-js";
import { IProduct } from "../types/types";
import ProductCard from "./ProductCard";
import Spinner from "./Spinner";
import { useCartContext } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";

const ProductList = () => {
  const [products, setProducts] = createSignal<IProduct[]>([]);
  const [isModalOpen, setModalOpen] = createSignal(false);
  const [selectedProduct, setSelectedProduct] = createSignal<IProduct | undefined>();
  const { addToCart, updateCartItem, removeFromCart } = useCartContext();
  const { searchQuery } = useSearch();

  const fetchProducts = async () => {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("Network response was not ok");
    return (await response.json()).data;
  };

  const getProducts = async () => {
    try {
      const productsResponse = await fetchProducts();
      setProducts(productsResponse);
    } catch (err) {
      console.error("Problem with the server", err);
    }
  };

  onMount(() => {
    getProducts();
  });

  const handleAddToCart = async (product: IProduct) => {
    if (product.stock_quantity > 0) {
      await addToCart(product);
      await updateStock(product.id, product.stock_quantity - 1);
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id ? { ...p, stock_quantity: product.stock_quantity - 1 } : p
        )
      );
      if (selectedProduct() && selectedProduct()!.id === product.id) {
        setSelectedProduct((prevProduct) => ({
          ...prevProduct!,
          stock_quantity: prevProduct!.stock_quantity - 1
        }));
      }
    } else {
      alert('Out of stock');
    }
  };

  const handleUpdateCartItem = async (id: number, quantity: number) => {
    await updateCartItem(id, quantity);
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, stock_quantity: product.stock_quantity - quantity } : product
      )
    );
  };

  const handleRemoveFromCart = async (id: number, quantity: number) => {
    await removeFromCart(id, quantity);
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, stock_quantity: product.stock_quantity + quantity } : product
      )
    );
  };

  const updateStock = async (productId: number, newStock: number) => {
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_quantity: newStock }),
      });
    } catch (error) {
      console.error("Failed to update stock:", error);
    }
  };

  const openModal = (product: IProduct) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(undefined);
  };

  const filteredProducts = () => {
    const query = searchQuery().toLowerCase();
    const allProducts = products();
    if (!allProducts) return [];
    return allProducts.filter((product) => {
      const name = product.name ? product.name.toLowerCase() : '';
      const description = product.description ? product.description.toLowerCase() : '';
      return name.includes(query) || description.includes(query);
    });
  };

  return (
    <div class="flex flex-col items-center min-h-screen">
      <Show when={searchQuery().length > 0}>
        <p class="text-center text-black dark:text-gray-600">
          You have {filteredProducts().length} candies with the word "<span class="font-bold bg-yellow-300 text-black dark:bg-yellow-500 dark:text-black">{searchQuery()}</span>"
        </p>
      </Show>
      <Show
        when={Array.isArray(products())}
        fallback={<Spinner type="puff" strokeOpacity={0.125} />}
      >
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4 w-full max-w-screen-lg mx-auto mt-2">
          <For each={filteredProducts()}>
            {(product: IProduct) => (
              <ProductCard
                product={product}
                openModal={openModal}
                handleAddToCart={handleAddToCart}
                class="border-2 border-gray-200 dark:border-gray-700"
              />
            )}
          </For>
        </div>
      </Show>
      <Show when={isModalOpen()}>
        <div class="modal z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div class="modal-content bg-white dark:bg-neutral-800 p-5 rounded-lg max-w-md w-full relative">
            <Show when={selectedProduct()}>
              {(product) => (
                <>
                  <div class="flex flex-col items-center relative">
                    <div class="relative w-full max-w-xs mb-4">
                      <img
                        src={`https://bortakvall.se/${product().images?.thumbnail}`}
                        alt="product image"
                        class="w-full h-60 object-contain rounded-lg"
                      />
                      {product().stock_quantity === 0 && (
                        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-none">
                          <span class="text-white text-2xl font-bold">Sold Out</span>
                        </div>
                      )}
                    </div>
                    <h3 class="product-name text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                      {product().name}
                    </h3>
                    <p class="text-sm text-center text-gray-700 dark:text-gray-300 mb-4" innerHTML={product().description} />
                    <div class="flex justify-between items-center w-full my-4 px-4">
                      <p class="text-xl font-medium text-gray-900 dark:text-white">Stock: {product().stock_quantity}</p>
                      <p class="text-xl font-medium text-blue-600">Price: Only £{product().price}</p>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-center items-center mt-4 space-y-2 sm:space-y-0 sm:space-x-2 w-full">
                      <button
                        class="btn w-full sm:w-auto bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                        onClick={() => handleAddToCart(product())}
                        disabled={product().stock_quantity === 0}
                      >
                        {product().stock_quantity === 0 ? "Sold Out" : "Add to Cart"}
                      </button>
                      <button
                        class="btn w-full sm:w-auto bg-blue-500 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                        onClick={closeModal}
                      >
                        Back to Product List
                      </button>
                    </div>
                  </div>
                </>
              )}
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default ProductList;
