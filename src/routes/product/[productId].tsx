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
    <div class="my-7">
      <Show when={product()} fallback={<Spinner type={SpinnerType.hearts} stroke-opacity=".125" />}>
        <div class="grid grid-cols-5 gap-7">
          <div class="col-span-2">
            <img src={product().data.images.large} alt="product image" />
          </div>
          <div class="col-span-3">
            <h2 class="text-3xl font-bold mb-7">{product().data.name}</h2>
            <p innerHTML={product().data.description} />
            <p class="my-7 text-2xl">Only kr{product().data.price}</p>
            <button
              class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
