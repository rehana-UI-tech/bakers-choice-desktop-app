export interface BakeryProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  categoryId: string;
  price: number;
}

interface ProductCardProps {
  product: BakeryProduct;
  quantityInCart: number;
  onAddToCart: (product: BakeryProduct) => void;
  onGoToCart: () => void;
}

export default function ProductCard({
  product,
  quantityInCart,
  onAddToCart,
  onGoToCart
}: ProductCardProps) {
  const productTitleId = `product-title-${product.id}`;
  const productDescriptionId = `product-description-${product.id}`;

  return (
    <article className="product-card" role="listitem" aria-labelledby={productTitleId}>
      <img src={product.image} alt={product.name} className="product-card__image" />

      <div className="product-card__content">
        <h3 id={productTitleId} className="product-card__name">
          {product.name}
        </h3>
        <p id={productDescriptionId} className="product-card__description">
          {product.description}
        </p>
      </div>

      <div className="product-card__actions">
        <p className="product-card__price" aria-label={`Price ${product.price} rupees`}>
          Rs. {product.price}
        </p>
        <button
          type="button"
          className="product-card__button"
          aria-label={`Add ${product.name} to cart`}
          aria-describedby={productDescriptionId}
          onClick={() => onAddToCart(product)}
        >
          Add to cart
        </button>
        {quantityInCart > 0 && (
          <button
            type="button"
            className="product-card__go-to-cart"
            aria-label={`Go to cart page after adding ${product.name}`}
            onClick={onGoToCart}
          >
            Go to cart
          </button>
        )}
        <p className="product-card__quantity" aria-label={`${quantityInCart} in cart`}>
          In cart: {quantityInCart}
        </p>
      </div>
    </article>
  );
}
