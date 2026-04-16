import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard, { type BakeryProduct } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import './Products.scss';

interface ProductCategory {
  id: string;
  name: string;
}

interface BakeryMenuData {
  categories: ProductCategory[];
  items: BakeryProduct[];
}

type ProductTopTabId = 'overview' | 'order-online' | 'photos' | 'menu';

interface ProductTopTab {
  id: ProductTopTabId;
  label: string;
}

const topTabs: ProductTopTab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'order-online', label: 'Order Online' },
  { id: 'photos', label: 'Photos' },
  { id: 'menu', label: 'Menu' }
];

const initialMenuData: BakeryMenuData = {
  categories: [],
  items: []
};

export default function Products() {
  const navigate = useNavigate();
  const { addToCart, cartCount, getQuantity } = useCart();
  const [activeTopTab, setActiveTopTab] = useState<ProductTopTabId>('order-online');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [cartAnnouncement, setCartAnnouncement] = useState<string>('');
  const [menuData, setMenuData] = useState<BakeryMenuData>(initialMenuData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string>('');

  useEffect(() => {
    let isCancelled = false;

    const loadMenuData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/bakery-menu.json');
        if (!response.ok) {
          throw new Error('Failed to load menu data');
        }

        const parsed = (await response.json()) as BakeryMenuData;
        if (isCancelled) {
          return;
        }

        setMenuData(parsed);
        setLoadError('');
      } catch {
        if (isCancelled) {
          return;
        }
        setLoadError('Unable to load bakery menu right now.');
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadMenuData();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (menuData.categories.length === 0) {
      return;
    }

    const selectedCategoryExists = menuData.categories.some(
      (category) => category.id === selectedCategoryId
    );

    if (!selectedCategoryId || !selectedCategoryExists) {
      setSelectedCategoryId(menuData.categories[0].id);
    }
  }, [menuData.categories, selectedCategoryId]);

  const productsByCategoryId = useMemo(() => {
    const groups: Record<string, BakeryProduct[]> = {};

    for (const category of menuData.categories) {
      groups[category.id] = [];
    }

    for (const product of menuData.items) {
      if (!groups[product.categoryId]) {
        groups[product.categoryId] = [];
      }
      groups[product.categoryId].push(product);
    }

    return groups;
  }, [menuData.categories, menuData.items]);

  const selectedProducts = productsByCategoryId[selectedCategoryId] ?? [];
  const selectedCategoryName =
    menuData.categories.find((category) => category.id === selectedCategoryId)?.name ?? 'Menu';
  const visibleProducts =
    activeTopTab === 'menu' ? menuData.items : selectedProducts;
  const photos = menuData.items.slice(0, 18);
  const sectionTitle =
    activeTopTab === 'menu'
      ? `Full Menu (${menuData.items.length})`
      : activeTopTab === 'overview'
        ? 'Bakery Overview'
        : activeTopTab === 'photos'
          ? 'Bakery Photos'
          : selectedCategoryName;
  const pageTitle =
    activeTopTab === 'menu'
      ? 'Menu'
      : activeTopTab === 'overview'
        ? 'Overview'
        : activeTopTab === 'photos'
          ? 'Photos'
          : 'Order Online';
  const pageSubtitle =
    activeTopTab === 'menu'
      ? 'All bakery items in one menu list.'
      : activeTopTab === 'overview'
        ? 'Quick snapshot of all bakery categories.'
        : activeTopTab === 'photos'
          ? 'Browse product photos from the bakery menu.'
          : 'Add your favorite bakery products to cart.';

  const handleAddToCart = (product: BakeryProduct) => {
    addToCart(product);
    const nextQuantity = getQuantity(product.id) + 1;
    setCartAnnouncement(`${product.name} added to cart. Quantity ${nextQuantity}.`);
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  return (
    <section className="products-page" aria-labelledby="products-page-title">
      <header className="products-page__tabs" aria-label="Menu sections" role="tablist">
        {topTabs.map((tab) => {
          const isActive = activeTopTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              className={`products-page__tab${isActive ? ' products-page__tab--active' : ''}`}
              aria-selected={isActive}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => setActiveTopTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </header>

      <div
        className={`products-page__layout${activeTopTab !== 'order-online' ? ' products-page__layout--wide' : ''}`}
      >
        <div className="products-page__content">
          <div className="products-page__headline">
            <div>
              <h1 id="products-page-title">{pageTitle}</h1>
              <p>{pageSubtitle}</p>
            </div>
            <div className="products-page__headline-actions">
              <div className="products-page__cart" aria-label={`${cartCount} items in cart`}>
                Cart: {cartCount}
              </div>
              {cartCount > 0 && (
                <button
                  type="button"
                  className="products-page__go-to-cart"
                  aria-label="Go to cart page"
                  onClick={handleGoToCart}
                >
                  Go to cart
                </button>
              )}
            </div>
          </div>

          <h2 className="products-page__section-title">{sectionTitle}</h2>

          {isLoading ? (
            <p className="products-page__status">Loading bakery menu...</p>
          ) : loadError ? (
            <p className="products-page__status products-page__status--error">{loadError}</p>
          ) : activeTopTab === 'overview' ? (
            <div className="products-page__overview-grid" aria-label="Bakery category overview">
              {menuData.categories.map((category) => {
                const count = productsByCategoryId[category.id]?.length ?? 0;
                return (
                  <article key={category.id} className="products-page__overview-card">
                    <h3>{category.name}</h3>
                    <p>{count} items</p>
                  </article>
                );
              })}
            </div>
          ) : activeTopTab === 'photos' ? (
            <div className="products-page__photos-grid" aria-label="Bakery product photos">
              {photos.map((item) => (
                <figure key={`${item.id}-photo`} className="products-page__photo-card">
                  <img src={item.image} alt={item.name} />
                  <figcaption>{item.name}</figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="products-page__list" role="list" aria-label="Available products">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantityInCart={getQuantity(product.id)}
                  onAddToCart={handleAddToCart}
                  onGoToCart={handleGoToCart}
                />
              ))}
            </div>
          )}
        </div>

        {activeTopTab === 'order-online' && (
          <aside className="products-page__categories" aria-label="Product categories">
            <ul>
              {menuData.categories.map((category) => {
                const count = productsByCategoryId[category.id]?.length ?? 0;
                const isActive = selectedCategoryId === category.id;

                return (
                  <li key={category.id}>
                    <button
                      type="button"
                      className={`products-page__category-button${isActive ? ' products-page__category-button--active' : ''}`}
                      aria-pressed={isActive}
                      aria-label={`${category.name} ${count} products`}
                      onClick={() => setSelectedCategoryId(category.id)}
                    >
                      <span>{category.name}</span>
                      <span>({count})</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}
      </div>

      <p className="products-page__sr-only" role="status" aria-live="polite">
        {cartAnnouncement}
      </p>
    </section>
  );
}
