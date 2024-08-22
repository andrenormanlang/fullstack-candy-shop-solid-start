import { IProduct } from "../types/types";
import { AiOutlineInfoCircle } from "solid-icons/ai";
import { Motion } from "solid-motionone";

interface ProductCardProps {
  product: IProduct;
  openModal: (product: IProduct) => void;
  handleAddToCart: (product: IProduct) => void;
  class?: string;
}

const ProductCard = ({ product, openModal, handleAddToCart, class: className }: ProductCardProps) => (
  <Motion.div
    class={`card rounded shadow-lg relative ${className} flex flex-col bg-white dark:bg-red-500`}
    animate={{ scale: [1, 1.05] }}
    transition={{ duration: 0.3 }}
  >
    <div class="relative flex-grow">
      <div class="relative">
      <img
          src={
            product.images?.thumbnail.startsWith('http')
              ? product.images.thumbnail
              : `https://bortakvall.se/${product.images?.thumbnail}`
          }
          alt="product image"
          class="w-full h-50 object-cover"
        />
        {product.stock_quantity === 0 && (
          <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span class="text-white text-2xl font-bold">Sold Out</span>
          </div>
        )}
      </div>
      <AiOutlineInfoCircle
        size={24}
        class="text-gray-800 dark:text-gray-300 hover:text-blue-500 transition duration-300 ease-in-out absolute top-0 right-0 m-2 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
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
    <div class="p-4 flex flex-col flex-grow justify-between">
      <h1 class="text-lg font-bold text-center text-gray-900 dark:text-white">{product.name}</h1>
      <div class="flex flex-col items-center mt-4">
        <button
          class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleAddToCart(product)}
          disabled={product.stock_quantity === 0}
        >
          {product.stock_quantity === 0 ? "Sold Out" : "Add to Cart"}
        </button>
      </div>
    </div>
  </Motion.div>
);


export default ProductCard;
