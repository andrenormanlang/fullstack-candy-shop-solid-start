import { useParams } from "@solidjs/router";
import { Show, createResource } from "solid-js";
import { Spinner, SpinnerType } from "solid-spinner";
import { useCartContext } from "../../context/CartContext";
import { IProductResponse } from "../../types/types";

const fetchProduct = async (id: string): Promise<IProductResponse> => {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) {
    throw new Error('Error fetching product');
  }
  const product = await res.json();
  return product;
};

export default function Product() {
  const params = useParams();
  const [product] = createResource(params.id, fetchProduct);
  const { addToCart } = useCartContext();

  return (
    <div class="container mx-auto my-7 p-4 bg-white rounded-lg shadow-lg">
      <Show when={product()} fallback={<Spinner type={SpinnerType.hearts} stroke-opacity=".125" />}>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-7">
          <div class="col-span-2 flex justify-center items-center">
            <img src={product().data.images.large} alt="product image" class="w-full h-auto rounded-lg" />
          </div>
          <div class="col-span-3 flex flex-col justify-center">
            <h2 class="text-3xl font-bold mb-4">{product().data.name}</h2>
            <p class="text-gray-700 mb-4" innerHTML={product().data.description} />
            <p class="my-4 text-2xl font-semibold text-blue-600">Only kr{product().data.price}</p>
            <button
              class="btn bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              onClick={() => addToCart(product().data)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
}
