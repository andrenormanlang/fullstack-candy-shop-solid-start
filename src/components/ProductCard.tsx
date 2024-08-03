import { IProduct } from "../types/types";
import { useCartContext } from "../context/CartContext";

const ProductCard = (props: { product: IProduct }) => {
  const { product } = props;
  const { addToCart } = useCartContext();

  return (
    <div class="card shadow-lg relative" data-product-id={product.id} style="width: 18rem;">
      <h1 class="text-uppercase product-card-title mt-2">{product.name}</h1>
      <img class="card-img card-img-top img-fluid cardImg p-3 products-images" src={`https://bortakvall.se${product.images.thumbnail}`} alt={`picture of ${product.name}`} />
      <div class="card-body">
        <i class="info-icon">i</i>
        <div class="d-flex justify-content-start align-items-center">
          <p class="price-tag mr-2">{product.price}kr</p>
          <p id={`product-status${product.id}`} class="stock-tag bg-red ml-2">{product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "SOLD OUT"}</p>
        </div>
        <a href="#"></a>
        <div class="d-flex flex-column card-body card-buttons">
          <button type="button" class="cart-btn btn btn-success card-btn" data-cart-id={product.id} onClick={() => addToCart(product)}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
