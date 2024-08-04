import { IProduct } from "../types/types";
import { AiOutlineInfoCircle } from "solid-icons/ai";

interface ProductCardProps {
  product: IProduct;
  openModal: (product: IProduct) => void;
  handleAddToCart: (product: IProduct) => void;
}

const ProductCard = ({ product, openModal, handleAddToCart }: ProductCardProps) => (
  <div class="card rounded shadow-lg transform transition duration-500 hover:scale-105 relative">
    <div class="relative">
      <div class="relative">
        <img
          src={product.images ? `https://bortakvall.se/${product.images.thumbnail}` : "/path/to/default-thumbnail.jpg"}
          alt="product image"
          class="w-full h-40 object-cover"
        />
        {product.stock_quantity === 0 && (
          <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span class="text-white text-2xl font-bold">Sold Out</span>
          </div>
        )}
      </div>
      <AiOutlineInfoCircle
        size={24}
        class="text-gray-800 hover:text-blue-500 transition duration-300 ease-in-out absolute top-0 right-0 m-2 cursor-pointer"
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
    <div class="p-4 flex flex-col items-center">
      <h1 class="text-lg font-bold">{product.name}</h1>
    </div>
    <div class="flex flex-col sm:flex-row justify-center items-center mt-4 space-y-2 sm:space-y-0 sm:space-x-2">
      <button
        class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleAddToCart(product)}
        disabled={product.stock_quantity === 0}
      >
        {product.stock_quantity === 0 ? "Sold Out" : "Add to Cart"}
      </button>
      
    </div>
  </div>
);

export default ProductCard;

