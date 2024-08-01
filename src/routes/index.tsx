import {
  createResource,
  createSignal,
  Show,
  For,
  createEffect,
} from "solid-js";
import { JSX } from "solid-js";

import { useParams } from "@solidjs/router";

import { ParentProps } from "solid-js";
import { IProduct, IProductResponse } from "../types/types";
import {
  AiFillCloseCircle,
  AiOutlineInfoCircle,
} from "solid-icons/ai";
import { Spinner, SpinnerType } from "solid-spinner";
import { useCartContext } from "../context/CartContext";


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
  <div class={props.class}>{props.children}</div>
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
  const params = useParams();
  const { addToCart } = useCartContext();
  const [stockQuantity, setStockQuantity] = createSignal<number>(0); // Default value is 0

  const [isModalOpen, setModalOpen] = createSignal(false);

  const handleAddToCart = async () => {
    const quantity = stockQuantity() || 0; // Ensure the quantity is never undefined
    const product = selectedProduct();
    if (product && quantity > 0) {
      setStockQuantity(quantity - 1);
      // Add the product to the cart
      addToCart(product);
      // Update the stock in the database
      await updateStock(product.id.toString(), quantity - 1); 
    } else {
      alert('Out of stock');
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

  return (
    <div class="flex justify-center items-center min-h-screen">

      <Show
        when={Array.isArray(products())}
        fallback={<Spinner type={SpinnerType.puff} stroke-opacity=".125" />}
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4 w-full max-w-6xl">
          <For each={products()}>
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
                    onClick={() => handleAddToCart()}
                  >
                    Add to Cart
                  </button>
                </div>
              </Card>
            )}
          </For>
        </div>
      </Show>

      <Show when={isModalOpen()}>
        <div class="modal z-50 fixed inset-0">
          <div class="modal-content bg-white p-5 rounded-lg max-w-lg w-full">
            <Show when={selectedProduct()}>
              {(product) => (
                <>
                  <button
                    onClick={closeModal}
                    class="close-btn absolute top-15 p-3"
                  >
                    <AiFillCloseCircle
                      size={24}
                      class="text-gray-800 hover:text-red-500 transition duration-300 ease-in-out"
                    />
                  </button>
                  <div class="flex items-center">
                    <h3 class="product-name text-2xl font-bold mb-4">
                      {product.name}
                    </h3>
                    <img
                      src={`https://bortakvall.se/${
                        product().images?.thumbnail
                      }`}
                      alt="product image"
                      class="mb-4" /* Add container class if needed */
                    />
                  </div>
                  <p innerHTML={product().description} />
                  <div class="flex justify-between items-center my-7">
                    <p class="text-2xl">Stock: {product().stock_quantity}</p>
                    <p class="text-2xl">Price: Only £{product().price}</p>
                  </div>
                  <div class="flex justify-between">
                    <button
                      class="btn mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleAddToCart()}
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

