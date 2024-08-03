import { createSignal, For, onMount } from "solid-js";
import { IProduct } from "../types/types";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const [products, setProducts] = createSignal<IProduct[]>([]);

  const fetchProducts = async () => {
    const response = await fetch(
      "https://candy-shop-rest-api.onrender.com/products"
    );
    if (!response.ok) throw new Error("Network response was not ok");
    return (await response.json()).data;
  };

  const getProducts = async () => {
    try {
      const productsResponse = await fetchProducts();
      setProducts(productsResponse.data);
    } catch (err) {
      console.error("Problem with the server", err);
    }
  };

  onMount(() => {
    getProducts();
  });

  return (
    <div id="main-page" class="main-page">
      <div class="container mx-auto mt-5">
        <div id="card-container" class="d-flex flex-wrap gap-3 text-center padding-top justify-content-center">
          <For each={products()}>
            {(product) => (
              <ProductCard product={product} />
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
