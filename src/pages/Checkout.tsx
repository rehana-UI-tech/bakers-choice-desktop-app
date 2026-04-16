import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.scss';

interface AddressFormState {
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
}

const initialFormState: AddressFormState = {
  fullName: '',
  phone: '',
  streetAddress: '',
  city: '',
  state: '',
  pincode: ''
};

export default function Checkout() {
  const [form, setForm] = useState<AddressFormState>(initialFormState);
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [isPaymentDone, setIsPaymentDone] = useState<boolean>(false);
  const [paymentMessage, setPaymentMessage] = useState<string>('');
  const paymentTimerRef = useRef<number | null>(null);

  const { cartItems, cartCount, cartTotal, clearCart } = useCart();

  useEffect(() => {
    return () => {
      if (paymentTimerRef.current !== null) {
        window.clearTimeout(paymentTimerRef.current);
      }
    };
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPaying(true);
    setPaymentMessage('');

    if (paymentTimerRef.current !== null) {
      window.clearTimeout(paymentTimerRef.current);
    }

    paymentTimerRef.current = window.setTimeout(() => {
      setIsPaying(false);
      setIsPaymentDone(true);
      setPaymentMessage('Payment done. Delivery to your doorstep.');
      clearCart();
    }, 900);
  };

  if (cartItems.length === 0 && !isPaymentDone) {
    return (
      <section className="checkout-page checkout-page--empty" aria-labelledby="checkout-empty-title">
        <h1 id="checkout-empty-title">Checkout</h1>
        <p>Your cart is empty. Please add products before payment.</p>
        <Link to="/products" className="checkout-page__back-link">
          Go to products
        </Link>
      </section>
    );
  }

  return (
    <section className="checkout-page" aria-labelledby="checkout-page-title">
      <header className="checkout-page__header">
        <h1 id="checkout-page-title">Checkout</h1>
        <p>Secure payment (dummy) for your bakery order.</p>
      </header>

      {isPaymentDone ? (
        <div className="checkout-page__success" role="status" aria-live="polite">
          <h2>Payment Successful</h2>
          <p>{paymentMessage}</p>
          <Link to="/products" className="checkout-page__back-link">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="checkout-page__layout">
          <form className="checkout-page__form" onSubmit={handleSubmit}>
            <h2>Delivery Address</h2>

            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />

            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleInputChange}
              placeholder="10-digit mobile number"
              pattern="[0-9]{10}"
              required
            />

            <label htmlFor="streetAddress">Street Address</label>
            <textarea
              id="streetAddress"
              name="streetAddress"
              value={form.streetAddress}
              onChange={handleInputChange}
              placeholder="House no, street, area"
              rows={3}
              required
            />

            <div className="checkout-page__row">
              <div>
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={form.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  required
                />
              </div>
            </div>

            <label htmlFor="pincode">Pincode</label>
            <input
              id="pincode"
              name="pincode"
              type="text"
              value={form.pincode}
              onChange={handleInputChange}
              placeholder="6-digit pincode"
              pattern="[0-9]{6}"
              required
            />

            <button
              type="submit"
              className="checkout-page__pay-button"
              aria-label="Pay now with dummy payment link"
              disabled={isPaying}
            >
              {isPaying ? 'Processing payment...' : 'Pay now'}
            </button>
          </form>

          <aside className="checkout-page__summary" aria-label="Payment summary">
            <h2>Payment Link</h2>
            <p className="checkout-page__summary-note">
              This is a demo payment flow.
            </p>
            <p>
              <span>Items</span>
              <span>{cartCount}</span>
            </p>
            <p>
              <span>Total Amount</span>
              <strong>Rs. {cartTotal}</strong>
            </p>
            <button
              type="button"
              className="checkout-page__dummy-link"
              aria-label="Dummy payment link"
              onClick={() => setPaymentMessage('Payment link opened. Complete address and click Pay now.')}
            >
              Open payment link
            </button>
            {paymentMessage && (
              <p className="checkout-page__hint" role="status" aria-live="polite">
                {paymentMessage}
              </p>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}
