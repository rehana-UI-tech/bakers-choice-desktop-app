import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.scss';

export default function Cart() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  return (
    <section className="cart-page" aria-labelledby="cart-page-title">
      <header className="cart-page__header">
        <h1 id="cart-page-title">Your Cart</h1>
        <p aria-label={`${cartCount} items selected`}>
          {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
        </p>
      </header>

      {cartItems.length === 0 ? (
        <div className="cart-page__empty" role="status" aria-live="polite">
          <p>Your cart is empty. Start adding your favorite bakes.</p>
          <Link to="/products" className="cart-page__back-link">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="cart-page__layout">
          <section className="cart-page__items" aria-label="Products in cart">
            {cartItems.map(({ product, quantity }) => (
              <article className="cart-item" key={product.id} aria-labelledby={`cart-item-${product.id}`}>
                <img src={product.image} alt={product.name} className="cart-item__image" />
                <div className="cart-item__details">
                  <h2 id={`cart-item-${product.id}`}>{product.name}</h2>
                  <p>{product.description}</p>
                  <p className="cart-item__price">Rs. {product.price}</p>
                </div>
                <div className="cart-item__controls">
                  <div className="cart-item__quantity" aria-label={`Quantity controls for ${product.name}`}>
                    <button
                      type="button"
                      aria-label={`Decrease ${product.name} quantity`}
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                    >
                      -
                    </button>
                    <span aria-label={`${quantity} in cart`}>{quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${product.name} quantity`}
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="cart-item__line-total">
                    Rs. {product.price * quantity}
                  </p>
                  <button
                    type="button"
                    className="cart-item__remove"
                    aria-label={`Remove ${product.name} from cart`}
                    onClick={() => removeFromCart(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="cart-page__summary" aria-label="Order summary">
            <h2>Order Summary</h2>
            <p>
              <span>Items</span>
              <span>{cartCount}</span>
            </p>
            <p>
              <span>Total</span>
              <strong>Rs. {cartTotal}</strong>
            </p>
            <Link
              to="/checkout"
              className="cart-page__checkout"
              aria-label="Proceed to checkout payment link"
            >
              Proceed to checkout
            </Link>
            <button
              type="button"
              className="cart-page__clear"
              aria-label="Clear all cart items"
              onClick={clearCart}
            >
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
