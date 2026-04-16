/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import type { BakeryProduct } from '../components/ProductCard';

interface CartEntry {
  product: BakeryProduct;
  quantity: number;
}

interface CartContextType {
  cartItems: CartEntry[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: BakeryProduct) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getQuantity: (productId: string) => number;
}

const STORAGE_KEY = 'bakers-choice-cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

const readStoredCart = (): Record<string, CartEntry> => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as Record<string, CartEntry>;
    return parsed ?? {};
  } catch {
    return {};
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartByProductId, setCartByProductId] = useState<Record<string, CartEntry>>(
    readStoredCart
  );

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartByProductId));
  }, [cartByProductId]);

  const addToCart = (product: BakeryProduct) => {
    setCartByProductId((previous) => {
      const existingQuantity = previous[product.id]?.quantity ?? 0;
      return {
        ...previous,
        [product.id]: {
          product,
          quantity: existingQuantity + 1
        }
      };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartByProductId((previous) => {
      const existingEntry = previous[productId];
      if (!existingEntry) {
        return previous;
      }

      if (quantity <= 0) {
        const updated = { ...previous };
        delete updated[productId];
        return updated;
      }

      return {
        ...previous,
        [productId]: {
          ...existingEntry,
          quantity
        }
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCartByProductId((previous) => {
      if (!previous[productId]) {
        return previous;
      }

      const updated = { ...previous };
      delete updated[productId];
      return updated;
    });
  };

  const clearCart = () => {
    setCartByProductId({});
  };

  const cartItems = useMemo(() => {
    return Object.values(cartByProductId);
  }, [cartByProductId]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  const getQuantity = (productId: string) => {
    return cartByProductId[productId]?.quantity ?? 0;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
