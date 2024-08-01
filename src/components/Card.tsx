import { IProduct } from "../types/types";
import { JSX } from 'solid-js';

interface CardProps {
  product?: IProduct;
  onClick?: (product: IProduct) => void;
  children?: JSX.Element;
  class?: string;
}

const Card = ({ product, onClick, children, class: className }: CardProps) => (
  <div
    class={`relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 ${className}`}
    onClick={product && onClick ? () => onClick(product) : undefined}
  >
    {children}
    {product && (
      <>
        <img
          src={product.images!.thumbnail}
          alt={product.name}
          class="w-full h-auto rounded-t-lg"
        />
        <div class="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-0 transition-opacity duration-300 opacity-0 hover:bg-opacity-75">
          <h1 class="text-white text-xl font-bold opacity-0 hover:opacity-100 transition-opacity duration-300 mb-2">
            {product.name}
          </h1>
          <p class="text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
            {product.price} kr
          </p>
        </div>
      </>
    )}
  </div>
);

export default Card;

