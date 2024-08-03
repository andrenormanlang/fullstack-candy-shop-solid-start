import {
  createResource,
  createSignal,
  Show,
  For,
  JSX
} from "solid-js";
import { useParams } from "@solidjs/router";
import { ParentProps } from "solid-js";
import { IProduct } from "../types/types";
import {
  AiFillCloseCircle,
  AiOutlineInfoCircle,
} from "solid-icons/ai";
import { Spinner, SpinnerType } from "solid-spinner";
import { useCartContext } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";

interface CardProps {
  product?: IProduct;
  onClick?: (product: IProduct) => void;
  children?: JSX.Element;
  class?: string;
}

interface HomeProps {
  addToCart: (product: IProduct) => void;
}

const Card = (props: ParentProps<CardProps>) => (
  <div class={`relative overflow-hidden rounded shadow-lg cursor-pointer ${props.class} border-2 border-gray-300 dark:border-gray-600`}
    onClick={props.product && props.onClick ? () => props.onClick(props.product) : undefined}>
    {props.children}
    {props.product && (
      <>
        <img
          src={props.product.images!.thumbnail}
          alt={props.product.name}
          class="w-full h-auto"
        />
        <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-opacity duration-300 opacity-0 hover:bg-opacity-25">
          <h1 class="text-white text-xl font-bold opacity-0 hover:opacity-100 transition-opacity duration-300">
            {props.product.name}
          </h1>
        </div>
      </>
    )}
  </div>
);

const fetchProducts = async () => {
  const response = await fetch(
    "https://candy-shop-rest-api.onrender.com/products"
  );
  if (!response.ok) throw new Error("Network response was not ok");
  return (await response.json()).data;
};

const fetchProduct = async (id: string) => {
  try {
    const response = await fetch(
      `https://candy-shop-rest-api.onrender.com/products/${id}`
    );
    if (!response.ok) throw new Error("Error fetching product");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null; // Return null or a default state in case of an error
  }
};

export default function Home(props: HomeProps) {
  const [products] = createResource<IProduct[]>(fetchProducts);
  const [productId, setProductId] = createSignal<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = createSignal<IProduct | undefined>();
  const { searchQuery } = useSearch();
  const params = useParams();
  const { addToCart, cartItems, removeFromCart } = useCartContext();
  const [stockQuantity, setStockQuantity] = createSignal<number>(0); // Default value is 0

  const [isModalOpen, setModalOpen] = createSignal(false);

  const handleAddToCart = async (product: IProduct) => {
    if (product.stock_quantity > 0) {
      // Add the product to the cart
      addToCart(product);
      // Update the stock in the database
      await updateStock(product.id.toString(), product.stock_quantity - 1);
      // Update the local stock quantity
      product.stock_quantity -= 1;
      setSelectedProduct({ ...product });
    } else {
      alert('Out of stock');
    }
  };

  const handleRemoveFromCart = async (product: IProduct) => {
    // Check if the product exists in the cart
    const cartProduct = cartItems.items.find((item) => item.id === product.id);

    if (cartProduct && cartProduct.quantity > 0) {
      // Remove the product from the cart
      removeFromCart(product.id);
      // Update the stock in the database
      await updateStock(product.id.toString(), product.stock_quantity + 1);
      // Update the local stock quantity
      product.stock_quantity += 1;
      setSelectedProduct({ ...product });
    }
  };

  const updateStock = async (productId: string, newStock: number) => {
    try {
      await fetch(`https://candy-shop-rest-api.onrender.com/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stock_quantity: newStock })
      });
    } catch (error) {
      console.error("Failed to update stock:", error);
    }
  };

  const openModal = (product: IProduct | undefined) => {
    if (product) {
      setProductId(product.id?.toString());
      setSelectedProduct(product);
      setStockQuantity(product.stock_quantity || 0); // Ensure the stock quantity is never undefined
      setModalOpen(true);
    } else {
      // Handle the case where product is undefined
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(undefined); // Correctly setting the selectedProduct to undefined
  };

  const filteredProducts = () => {
    const query = searchQuery().toLowerCase();
    const allProducts = products();
    if (!allProducts) return [];
    return allProducts.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  };

  return (
    <div class="flex flex-col items-center min-h-screen">
      <Show when={searchQuery().length > 0}>
        <p class="text-center text-black dark:text-gray-600">
          You have {filteredProducts().length} candies with the word "<span class="font-bold text-black dark:text-white">{searchQuery()}</span>"
        </p>
      </Show>
      <Show
        when={Array.isArray(products())}
        fallback={<Spinner type={SpinnerType.puff} stroke-opacity=".125" />}
      >
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4 w-full max-w-screen-lg mx-auto mt-2">
          <For each={filteredProducts()}>
            {(product: IProduct) => (
              <Card class="card rounded shadow-lg transform transition duration-500 hover:scale-105 relative">
                <div class="relative">
                  <img
                    src={
                      product.images
                        ? `https://bortakvall.se/${product.images.thumbnail}`
                        : "default-thumbnail.jpg"
                    }
                    alt="product image"
                    class="w-full"
                  />
                  <AiOutlineInfoCircle
                    size={24}
                    class="text-gray-800 hover:text-blue-500 transition duration-300 ease-in-out absolute top-0 right-0 m-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the click from triggering the card's onClick
                      openModal(product);
                    }}
                  />
                  <div class="absolute top-0 left-0 m-2 bg-blue-500 text-white py-1 px-2 rounded text-sm">
                    {product.price} kr
                  </div>
                  <div class="absolute bottom-0 left-0 m-2 bg-red-500 text-white py-1 px-2 rounded text-sm">
                    {product.stock_quantity} in stock
                  </div>
                </div>
                <div class="p-4 flex flex-col items-center">
                  <h1 class="text-lg font-bold">{product.name}</h1>
                </div>
                <div class="flex justify-center items-center mt-4">
                  <button
                    class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  {/* <button
                    class="btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={() => handleRemoveFromCart(product)}
                  >
                    Remove from Cart
                  </button> */}
                </div>
              </Card>
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
                  <button
                    onClick={closeModal}
                    class="close-btn absolute top-4 right-4 p-2"
                  >
                    <AiFillCloseCircle
                      size={32}
                      class="text-gray-800 dark:text-gray-200 hover:text-red-500 transition duration-300 ease-in-out"
                    />
                  </button>
                  <div class="flex flex-col items-center">
                    <img
                      src={`https://bortakvall.se/${product().images?.thumbnail}`}
                      alt="product image"
                      class="w-full max-w-xs mb-4 rounded-lg"
                      style={{ 'max-width': "150px" }} // Adjust the max-width to reduce the image size
                    />
                    <h3 class="product-name text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                      {product().name}
                    </h3>
                    <p class="text-sm text-center text-gray-700 dark:text-gray-300 mb-4" innerHTML={product().description} />
                    <div class="flex justify-between items-center w-full my-4 px-4">
                      <p class="text-xl font-medium text-gray-900 dark:text-white">Stock: {product().stock_quantity}</p>
                      <p class="text-xl font-medium text-blue-600">Price: Only £{product().price}</p>
                    </div>
                    <button
                      class="btn bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                      onClick={() => handleAddToCart(product())}
                    >
                      Add to Cart
                    </button>
                  </div>
                </>
              )}
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}
