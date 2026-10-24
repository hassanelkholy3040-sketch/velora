import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { products, collectionCards, SHIPPING_THRESHOLD } from './data/products';
import translations from './translations';
import { addCartItem, calculateCartTotals, cartItemKey, changeCartQuantity, normalizeCart, normalizeDemoOrder, normalizeWishlist, removeCartItem, toggleWishlistItem } from './utils/cart';
import { filterProducts } from './utils/catalog';
import { readStoredJSON, writeStoredJSON } from './utils/storage';
import './styles.css';

const Store = createContext(null);
const extra = {
  en: {
    quickAdd: 'Quick add', allCategories: 'All categories', allGenders: 'All genders',
    minPrice: 'Min price', maxPrice: 'Max price', menDescription: 'Modern essentials, considered fabrics, and precise details for every day.',
    womenDescription: 'An effortless wardrobe built around refined shapes and beautiful materials.',
    newDescription: 'The latest VELORA pieces, selected for the season ahead.',
    saleDescription: 'A considered edit of selected pieces at a special price.',
    shopDescription: 'Discover considered essentials for a more personal wardrobe.',
    filterResults: 'Filters', apply: 'Apply', subtotalItems: 'items', mainNavigation: 'Main navigation',
    bagLabel: 'SHOPPING BAG', savedLabel: 'SAVED PIECES', letterLabel: 'VELORA LETTER', stockLimit: 'Only {n} item(s) are available for this product.',
    catalogEyebrows: { shop: 'COLLECTION', men: 'MEN', women: 'WOMEN', new: 'NEW ARRIVALS', sale: 'SALE' },
    orderStored: 'Your demo order summary is saved for this session.',
    noOrder: 'There is no recent demo order to display.', demoLabel: 'Front-end demo',
  },
  ar: {
    quickAdd: 'إضافة سريعة', allCategories: 'كل الفئات', allGenders: 'كل الأقسام',
    minPrice: 'أقل سعر', maxPrice: 'أعلى سعر', menDescription: 'قطع أساسية عصرية بخامات منتقاة وتفاصيل دقيقة لكل يوم.',
    womenDescription: 'خزانة أنيقة وبسيطة تجمع بين القصّات الراقية والخامات الجميلة.',
    newDescription: 'أحدث قطع VELORA المختارة للموسم القادم.',
    saleDescription: 'تشكيلة مختارة من القطع بأسعار خاصة.',
    shopDescription: 'اكتشف قطعاً أساسية مختارة لخزانة تعبّر عن أسلوبك.',
    filterResults: 'الفلاتر', apply: 'تطبيق', subtotalItems: 'منتجات', mainNavigation: 'التنقل الرئيسي',
    bagLabel: 'حقيبة التسوق', savedLabel: 'قطع محفوظة', letterLabel: 'رسالة فيلورا', stockLimit: 'الكمية المتاحة من هذا المنتج هي {n}.',
    catalogEyebrows: { shop: 'التشكيلة', men: 'الرجال', women: 'النساء', new: 'وصل حديثاً', sale: 'التخفيضات' },
    orderStored: 'تم حفظ ملخص الطلب التجريبي لهذه الجلسة.',
    noOrder: 'لا يوجد طلب تجريبي حديث لعرضه.', demoLabel: 'عرض تجريبي للواجهة',
  },
};

function getStorage(name) {
  try { return window[name]; } catch { return { getItem: () => null, setItem: () => {} }; }
}
function StoreProvider({ children }) {
  const local = getStorage('localStorage');
  const session = getStorage('sessionStorage');
  const [lang, setLang] = useState(() => readStoredJSON(local, 'velora-language', 'en') === 'ar' ? 'ar' : 'en');
  const [cart, setCart] = useState(() => normalizeCart(readStoredJSON(local, 'velora-cart', []), products));
  const cartRef = useRef(cart);
  const [wishlist, setWishlist] = useState(() => normalizeWishlist(readStoredJSON(local, 'velora-wishlist', []), products));
  const [demoOrder, setDemoOrder] = useState(() => normalizeDemoOrder(readStoredJSON(session, 'velora-demo-order', null), products));
  useEffect(() => { writeStoredJSON(local, 'velora-language', lang); }, [lang]);
  useEffect(() => { writeStoredJSON(local, 'velora-cart', cart); }, [cart]);
  useEffect(() => { writeStoredJSON(local, 'velora-wishlist', wishlist); }, [wishlist]);

  const addToCart = (product, size, color, quantity = 1) => {
    const result = addCartItem(cartRef.current, product, size, color, quantity);
    if (!result.added) return false;
    cartRef.current = result.cart;
    setCart(result.cart);
    return true;
  };
  const changeQuantity = (key, amount) => {
    const next = changeCartQuantity(cartRef.current, key, amount, products);
    if (next !== cartRef.current) { cartRef.current = next; setCart(next); }
  };
  const removeFromCart = key => {
    const next = removeCartItem(cartRef.current, key);
    cartRef.current = next;
    setCart(next);
  };
  const toggleWishlist = id => setWishlist(current => toggleWishlistItem(current, id, products));
  const finishDemoOrder = order => {
    const normalized = normalizeDemoOrder(order, products);
    const current = normalizeCart(cartRef.current, products);
    if (!normalized || JSON.stringify(normalized.items) !== JSON.stringify(current)) return false;
    writeStoredJSON(session, 'velora-demo-order', normalized);
    setDemoOrder(normalized);
    cartRef.current = [];
    setCart([]);
    return true;
  };
  return <Store.Provider value={{
    lang, setLang, cart, wishlist, demoOrder, addToCart, changeQuantity, removeFromCart, toggleWishlist, finishDemoOrder,
    cartCount: calculateCartTotals(cart, products).itemCount,
  }}>{children}</Store.Provider>;
}
function useStore() { return useContext(Store); }
function useWords() {
  const { lang } = useStore();
  return { t: translations[lang], x: extra[lang], lang };
}
function money(value, lang) {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(Number(value) || 0);
}
const fallbackImage = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 760"><rect width="600" height="760" fill="#eeece8"/><text x="300" y="390" text-anchor="middle" fill="#9d8b74" font-family="serif" font-size="34" letter-spacing="8">VELORA</text></svg>');
function SafeImage({ src, onError, ...props }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return <img {...props} src={failed ? fallbackImage : src} onError={event => { onError?.(event); setFailed(true); }} />;
}
function Icon({ name, size = 20 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7.25" /><path d="m16.5 16.5 4 4" /></>,
    heart: <path d="M20.8 8.7c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.7 4.7 0 0 1 12 6.8a4.7 4.7 0 0 1 8.8 1.9Z" />,
    bag: <><path d="M4 8h16l-1 13H5L4 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>, close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>, minus: <path d="M5 12h14" />,
    trash: <><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.arrow}</svg>;
}
function LanguageAttributes() {
  const { lang } = useStore();
  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; }, [lang]);
  return null;
}
function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const navLinks = [['/', 'home'], ['/shop', 'shopAll'], ['/men', 'men'], ['/women', 'women'], ['/new-arrivals', 'newArrivals'], ['/sale', 'sale']];
function Header() {
  const { t, x, lang } = useWords();
  const { cartCount, wishlist, setLang } = useStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInput = useRef(null);
  useEffect(() => {
    const closeOnEscape = event => {
      if (event.key === 'Escape') { setMenuOpen(false); setSearchOpen(false); }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);
  useEffect(() => { if (searchOpen) searchInput.current?.focus(); }, [searchOpen]);
  function submitSearch(event) {
    event.preventDefault();
    navigate('/shop' + (query.trim() ? '?q=' + encodeURIComponent(query.trim()) : ''));
    setMenuOpen(false); setSearchOpen(false);
  }
  const links = navLinks.map(([to, key]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)}>{t.nav[key]}</NavLink>);
  return <>
    <div className="announcement">{t.announcement}</div>
    <header className="site-header" id="top">
      <div className="header-inner">
        <button className="icon-button menu-toggle" type="button" aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu} aria-controls="mobile-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
        <Link className="wordmark" to="/" aria-label={'VELORA ' + t.nav.home}>VELORA<span>.</span></Link>
        <nav className="desktop-nav" aria-label={x.mainNavigation}>{links}</nav>
        <div className="header-actions">
          <form className={'header-search' + (searchOpen ? ' is-open' : '')} onSubmit={submitSearch}>
            <button className="icon-button search-toggle" type={searchOpen ? 'submit' : 'button'} aria-label={t.nav.search} onClick={() => !searchOpen && setSearchOpen(true)}><Icon name="search" /></button>
            <input ref={searchInput} value={query} onChange={event => setQuery(event.target.value)} placeholder={t.filters.searchPlaceholder} aria-label={t.nav.search} />
          </form>
          <button className="language-button" type="button" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} aria-label={t.lang.switch}>{lang === 'en' ? t.lang.ar : t.lang.en}</button>
          <Link className="icon-button counted" to="/wishlist" aria-label={t.nav.wishlist}><Icon name="heart" />{wishlist.length > 0 && <span className="count">{wishlist.length}</span>}</Link>
          <Link className="icon-button counted" to="/cart" aria-label={t.nav.cart}><Icon name="bag" />{cartCount > 0 && <span className="count">{cartCount}</span>}</Link>
        </div>
      </div>
      <nav id="mobile-navigation" className={'mobile-nav' + (menuOpen ? ' open' : '')} aria-label={x.mainNavigation} aria-hidden={!menuOpen}>{links}</nav>
    </header>
  </>;
}
function Footer() {
  const { t, x } = useWords();
  return <footer className="site-footer" id="footer">
    <div className="footer-main">
      <div className="footer-brand"><Link className="wordmark" to="/">VELORA<span>.</span></Link><p>{t.footer.brand}</p><p className="footer-demo">{t.footer.demo}</p></div>
      <div className="footer-column"><h3>{t.footer.shop.title}</h3><Link to="/shop">{t.footer.shop.shopAll}</Link><Link to="/men">{t.footer.shop.men}</Link><Link to="/women">{t.footer.shop.women}</Link><Link to="/new-arrivals">{t.footer.shop.newArrivals}</Link><Link to="/sale">{t.footer.shop.sale}</Link></div>
      <div className="footer-column"><h3>{t.footer.help.title}</h3><a href="mailto:hello@velora.demo?subject=FAQ">{t.footer.help.faq}</a><a href="mailto:hello@velora.demo?subject=Returns">{t.footer.help.returns}</a><Link to="/shop">{t.footer.help.sizeGuide}</Link><a href="mailto:hello@velora.demo">{t.footer.help.contact}</a></div>
      <div className="footer-column"><h3>{t.footer.social.title}</h3><p>{t.footer.social.note}</p><div className="social-links"><a href="https://www.instagram.com/" aria-label="Instagram">Instagram</a><a href="https://www.pinterest.com/" aria-label="Pinterest">Pinterest</a></div></div>
    </div>
    <div className="footer-bottom"><span>{t.footer.rights}</span><span>{t.footer.contact.email}</span></div>
  </footer>;
}
function ProductCard({ product }) {
  const { lang, t, x } = useWords();
  const { cart, wishlist, toggleWishlist, addToCart } = useStore();
  const [feedback, setFeedback] = useState('');
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickSize, setQuickSize] = useState('');
  const [quickColor, setQuickColor] = useState('');
  const saved = wishlist.some(item => String(item) === String(product.id));
  const name = lang === 'ar' ? product.nameAr : product.name;
  const inCart = cart.reduce((sum, item) => String(item.productId) === String(product.id) ? sum + Number(item.quantity || 0) : sum, 0);
  const stockMessage = x.stockLimit.replace('{n}', Math.max(0, product.stock - inCart));
  function openQuickAdd(event) {
    event.preventDefault(); event.stopPropagation();
    setQuickOpen(value => !value);
    setFeedback('');
  }
  function quickAdd(event) {
    event.preventDefault(); event.stopPropagation();
    if (!quickSize) { setFeedback('size'); return; }
    if (!quickColor) { setFeedback('color'); return; }
    const ok = addToCart(product, quickSize, quickColor, 1);
    setFeedback(ok ? 'added' : 'stock');
    if (ok) { setQuickOpen(false); setQuickSize(''); setQuickColor(''); }
    window.setTimeout(() => setFeedback(''), 2200);
  }
  const feedbackText = feedback === 'size' ? t.product.validationSize
    : feedback === 'color' ? t.product.validationColor
      : feedback === 'stock' ? stockMessage
        : feedback === 'added' ? t.toast.addedToCart : '';
  return <article className="product-card">
    <div className="product-media"><Link to={'/product/' + product.id} className="product-image-link" aria-label={name}><SafeImage src={product.image} alt={name} loading="lazy" /></Link>
      <div className="badges">{product.isSale && <span className="badge sale-badge">{t.badges.sale}</span>}{product.isNew && <span className="badge new-badge">{t.badges.new}</span>}</div>
      <button className={'wishlist-button' + (saved ? ' saved' : '')} type="button" onClick={() => toggleWishlist(product.id)} aria-label={saved ? t.wishlist.remove : t.nav.wishlist} aria-pressed={saved}><Icon name="heart" /></button>
    </div>
    <div className="product-info"><Link to={'/product/' + product.id} className="product-name">{name}</Link>
      <div className="product-price"><span>{money(product.price, lang)}</span>{product.originalPrice && <del>{money(product.originalPrice, lang)}</del>}</div>
      <div className="product-card-bottom"><span className="product-category">{lang === 'ar' ? product.categoryAr : product.category}</span><button type="button" className="text-action" onClick={openQuickAdd} disabled={!product.stock} aria-expanded={quickOpen}>{x.quickAdd}</button></div>
      {quickOpen && <div className="quick-variant" role="group" aria-label={x.quickAdd}>
        <label>{t.product.selectSize}<select value={quickSize} onChange={event => setQuickSize(event.target.value)}><option value="">{t.product.selectSize}</option>{product.sizes.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
        <label>{t.product.selectColor}<select value={quickColor} onChange={event => setQuickColor(event.target.value)}><option value="">{t.product.selectColor}</option>{product.colors.map(item => <option key={item.name} value={item.name}>{lang === 'ar' ? item.nameAr : item.name}</option>)}</select></label>
        <button className="button button-dark" type="button" onClick={quickAdd}>{t.product.addToCart}</button>
      </div>}
      {feedbackText && <p className={feedback === 'size' || feedback === 'color' || feedback === 'stock' ? 'form-error' : 'inline-status'} role={feedback === 'added' ? 'status' : 'alert'}>{feedbackText}</p>}
    </div>
  </article>;
}
function ProductGrid({ items }) {
  const { t } = useWords();
  return items.length ? <div className="product-grid">{items.map(product => <ProductCard key={product.id} product={product} />)}</div>
    : <EmptyState title={t.shop.noResults} description={t.shop.noResultsSub} href="/shop" />;
}
function EmptyState({ title, description, href = '/shop', action }) {
  const { t } = useWords();
  return <div className="empty-state"><span className="empty-mark">V</span><h2>{title}</h2><p>{description}</p><Link className="button button-dark" to={href}>{action || t.product.continueShopping}</Link></div>;
}
function HomePage() {
  const { t, lang } = useWords();
  const featured = products.filter(p => p.isFeatured).slice(0, 4);
  const arrivals = products.filter(p => p.isNew).slice(0, 4);
  const collectionTitles = { men: t.collections.mens, women: t.collections.womens, newArrivals: t.collections.newArrivals };
  return <div className="home-page">
    <section className="hero"><div className="hero-copy"><span className="eyebrow">{t.hero.badge}</span><h1>{t.hero.headline.split('\n').map((line, i) => <React.Fragment key={line}>{i > 0 && <br />}{line}</React.Fragment>)}</h1><p>{t.hero.sub}</p>
      <div className="button-row"><Link className="button button-dark" to="/shop">{t.hero.cta1}<Icon name="arrow" size={17} /></Link><Link className="button button-outline" to="/new-arrivals">{t.hero.cta2}</Link></div><span className="hero-note">01 / 04 <i></i> {t.hero.scrollHint}</span></div>
      <div className="hero-visual"><SafeImage src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&q=85" alt={lang === 'ar' ? 'إطلالة أزياء عصرية من VELORA' : 'Contemporary VELORA fashion look'} /><span className="hero-caption">{lang === 'ar' ? 'المجموعة العصرية — ٢٠٢٦' : 'THE MODERN EDIT — 2026'}</span></div>
    </section>
    <section className="section collection-section"><div className="section-heading"><div><span className="eyebrow">{t.collections.subtitle}</span><h2>{t.collections.title}</h2></div><Link className="underlined-link" to="/shop">{t.featured.viewAll}<Icon name="arrow" size={16} /></Link></div>
      <div className="collection-grid">{collectionCards.map(card => { const meta = collectionTitles[card.id]; return <Link className="collection-card" to={card.path} key={card.id}><SafeImage src={card.image} alt={meta.title} loading="lazy" /><span className="collection-shade"></span><span className="collection-copy"><small>{meta.sub}</small><strong>{meta.title}</strong><span>{t.collections.shopNow}<Icon name="arrow" size={15} /></span></span></Link>; })}</div>
    </section>
    <section className="section products-section"><div className="section-heading"><div><span className="eyebrow">{t.featured.subtitle}</span><h2>{t.featured.title}</h2></div><Link className="underlined-link" to="/shop">{t.featured.viewAll}<Icon name="arrow" size={16} /></Link></div><ProductGrid items={featured} /></section>
    <section className="new-edit"><div className="new-edit-image"><SafeImage src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1000&q=85" alt={lang === 'ar' ? 'تشكيلة VELORA الجديدة' : 'The new VELORA collection'} loading="lazy" /></div><div className="new-edit-copy"><span className="eyebrow">{t.newArrivalsSec.subtitle}</span><h2>{t.newArrivalsSec.title}</h2><p>{extra[lang].newDescription}</p><Link className="button button-dark" to="/new-arrivals">{t.newArrivalsSec.viewAll}<Icon name="arrow" size={17} /></Link></div></section>
    <section className="section products-section arrivals-section"><div className="section-heading"><div><span className="eyebrow">{t.newArrivalsSec.subtitle}</span><h2>{t.newArrivalsSec.title}</h2></div><Link className="underlined-link" to="/new-arrivals">{t.newArrivalsSec.viewAll}<Icon name="arrow" size={16} /></Link></div><ProductGrid items={arrivals} /></section>
    <section className="brand-story"><div className="brand-story-image"><SafeImage src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=1000&q=85" alt={lang === 'ar' ? 'تفاصيل خامة فاخرة' : 'Close detail of a premium garment'} loading="lazy" /></div><div className="brand-story-copy"><span className="eyebrow">{t.brand.subtitle}</span><h2>{t.brand.title.split('\n').map((line, i) => <React.Fragment key={line}>{i > 0 && <br />}{line}</React.Fragment>)}</h2><p>{t.brand.para1}</p><p>{t.brand.para2}</p><Link className="underlined-link" to="/shop">{t.brand.cta}<Icon name="arrow" size={16} /></Link></div></section>
    <section className="promo-banner"><div><span className="eyebrow">{t.promo.label}</span><h2>{t.promo.title}</h2><p>{t.promo.sub}</p><Link className="button button-light" to="/sale">{t.promo.cta}<Icon name="arrow" size={17} /></Link></div><span className="promo-number">40<span>%</span></span></section>
    <Newsletter />
  </div>;
}
function Newsletter() {
  const { t, x } = useWords();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  function submit(event) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus('error'); return; }
    setStatus('success'); setEmail('');
  }
  const statusText = status === 'error' ? t.newsletter.errorEmail : status === 'success' ? t.newsletter.successSub : '';
  return <section className="newsletter"><span className="eyebrow">VELORA / {x.letterLabel}</span><h2>{t.newsletter.title}</h2><p>{t.newsletter.sub}</p><form onSubmit={submit} noValidate><label className="sr-only" htmlFor="newsletter-email">{t.newsletter.placeholder}</label><input id="newsletter-email" type="email" value={email} onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus(''); }} placeholder={t.newsletter.placeholder} aria-invalid={status === 'error'} required /><button className="button button-dark" type="submit">{t.newsletter.submit}<Icon name="arrow" size={16} /></button></form>{statusText && <p className={'form-status' + (status === 'error' ? ' form-error' : '')} role={status === 'error' ? 'alert' : 'status'}>{statusText}</p>}</section>;
}

function CatalogPage({ kind }) {
  const { t, x, lang } = useWords();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterButton = useRef(null), firstFilter = useRef(null), hadOpenFilters = useRef(false);
  useEffect(() => {
    if (!filtersOpen) return undefined;
    const closeOnEscape = event => { if (event.key === 'Escape') setFiltersOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [filtersOpen]);
  useEffect(() => {
    if (filtersOpen) { firstFilter.current?.focus(); hadOpenFilters.current = true; }
    else if (hadOpenFilters.current) { filterButton.current?.focus(); hadOpenFilters.current = false; }
  }, [filtersOpen]);
  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === '' || value == null || value === false) next.delete(key); else next.set(key, String(value));
    setParams(next, { replace: true });
  };
  const clearFilters = () => setParams({}, { replace: true });
  const q = params.get('q') || '', category = params.get('category') || '', gender = params.get('gender') || '';
  const size = params.get('size') || '', color = params.get('color') || '', min = params.get('min') || '', max = params.get('max') || '';
  const sale = params.get('sale') === '1';
  const requestedSort = params.get('sort') || 'featured';
  const sort = ['featured', 'newest', 'priceAsc', 'priceDesc', 'alphaAsc'].includes(requestedSort) ? requestedSort : 'featured';
  const titles = { shop: t.shop.title, men: t.shop.menTitle, women: t.shop.womenTitle, new: t.shop.newArrivalsTitle, sale: t.shop.saleTitle };
  const descriptions = { shop: x.shopDescription, men: x.menDescription, women: x.womenDescription, new: x.newDescription, sale: x.saleDescription };
  const categories = [...new Set(products.map(p => p.category))];
  const sizes = [...new Set(products.flatMap(p => p.sizes))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const colors = [...new Map(products.flatMap(p => p.colors).map(c => [c.name, c])).values()];
  const filtered = filterProducts(products, { kind, query: q, category, gender, size, color, minPrice: min, maxPrice: max, saleOnly: sale, sort, lang });
  const active = [['q', q], ['category', category], ['gender', gender], ['size', size], ['color', color], ['min', min], ['max', max], ['sale', sale ? t.badges.sale : '']].filter(([, value]) => Boolean(value));
  function translatedCategory(value) { const item = products.find(p => p.category === value); return lang === 'ar' && item ? item.categoryAr : value; }
  return <div className="catalog-page"><div className="page-banner"><div className="page-banner-inner"><span className="eyebrow">VELORA / {x.catalogEyebrows[kind]}</span><h1>{titles[kind]}</h1><p>{descriptions[kind]}</p></div></div>
    <div className="catalog-wrap"><div className="catalog-toolbar"><p>{t.shop.showing} <strong>{filtered.length}</strong> {filtered.length === 1 ? t.shop.product : t.shop.products}</p><div className="toolbar-actions"><button ref={filterButton} className="filter-toggle" type="button" aria-controls="catalog-filters" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}><Icon name="plus" size={16} />{x.filterResults}</button><label className="sort-control"><span>{t.sort.label}</span><select value={sort} onChange={e => setFilter('sort', e.target.value)}><option value="featured">{t.sort.featured}</option><option value="newest">{t.sort.newest}</option><option value="priceAsc">{t.sort.priceAsc}</option><option value="priceDesc">{t.sort.priceDesc}</option><option value="alphaAsc">{t.sort.alphaAsc}</option></select></label></div></div>
      <div className="catalog-layout">{filtersOpen && <button className="filter-backdrop" type="button" aria-label={t.filters.close} onClick={() => setFiltersOpen(false)} />}<aside id="catalog-filters" className={'filter-panel' + (filtersOpen ? ' filter-panel-open' : '')} aria-label={t.filters.title} role={filtersOpen ? 'dialog' : undefined} aria-modal={filtersOpen ? 'true' : undefined}>
        <div className="filter-heading"><h2>{t.filters.title}</h2><button type="button" className="text-action" onClick={clearFilters}>{t.filters.clearAll}</button><button type="button" className="icon-button filter-close" aria-label={t.filters.close} onClick={() => setFiltersOpen(false)}><Icon name="close" /></button></div>
        <label className="filter-field">{t.filters.search}<input ref={firstFilter} type="search" value={q} onChange={e => setFilter('q', e.target.value)} placeholder={t.filters.searchPlaceholder} /></label>
        <label className="filter-field">{t.filters.category}<select value={category} onChange={e => setFilter('category', e.target.value)}><option value="">{x.allCategories}</option>{categories.map(c => <option key={c} value={c}>{translatedCategory(c)}</option>)}</select></label>
        <label className="filter-field">{t.filters.gender}<select value={gender} onChange={e => setFilter('gender', e.target.value)}><option value="">{x.allGenders}</option><option value="Men">{t.genders.Men}</option><option value="Women">{t.genders.Women}</option></select></label>
        <label className="filter-field">{t.filters.size}<select value={size} onChange={e => setFilter('size', e.target.value)}><option value="">{t.filters.all}</option>{sizes.map(s => <option key={s}>{s}</option>)}</select></label>
        <label className="filter-field">{t.filters.color}<select value={color} onChange={e => setFilter('color', e.target.value)}><option value="">{t.filters.all}</option>{colors.map(c => <option key={c.name} value={c.name}>{lang === 'ar' ? c.nameAr : c.name}</option>)}</select></label>
        <span className="filter-label">{t.filters.price}</span><div className="price-fields"><label className="filter-field">{x.minPrice}<input type="number" min="0" step="0.01" value={min} onChange={e => { const value = e.target.value; setFilter('min', value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0 ? value : ''); }} /></label><label className="filter-field">{x.maxPrice}<input type="number" min="0" step="0.01" value={max} onChange={e => { const value = e.target.value; setFilter('max', value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0 ? value : ''); }} /></label></div>
        <label className="check-field"><input type="checkbox" checked={sale} onChange={e => setFilter('sale', e.target.checked ? '1' : '')} />{t.filters.saleOnly}</label>
        <button className="button button-dark filter-apply" type="button" onClick={() => setFiltersOpen(false)}>{x.apply}</button>
      </aside><div className="catalog-results">
        {active.length > 0 && <div className="active-filters"><span>{t.filters.activeFilters}:</span>{active.map(([key, value]) => <button key={key} type="button" onClick={() => setFilter(key, '')}>{key === 'category' ? translatedCategory(value) : key === 'gender' ? t.genders[value] : value}<b> ×</b></button>)}<button className="clear-active" type="button" onClick={clearFilters}>{t.shop.clearFilters}</button></div>}
        {filtered.length ? <ProductGrid items={filtered} /> : <EmptyState title={t.shop.noResults} description={t.shop.noResultsSub} href={'/' + (kind === 'shop' ? 'shop' : kind === 'new' ? 'new-arrivals' : kind)} action={t.shop.clearFilters} />}
      </div></div></div></div>;
}

function ProductDetailsPage() {
  const { id } = useParams();
  const product = products.find(item => String(item.id) === id);
  const { lang, t, x } = useWords();
  const { addToCart, toggleWishlist, wishlist, cart } = useStore();
  const [size, setSize] = useState(''), [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1), [image, setImage] = useState('');
  const [error, setError] = useState(''), [added, setAdded] = useState(false);
  useLayoutEffect(() => {
    setSize(''); setColor(''); setQuantity(1); setImage(''); setError(''); setAdded(false);
  }, [id]);
  if (!product) return <NotFound />;
  const name = lang === 'ar' ? product.nameAr : product.name;
  const saved = wishlist.some(item => String(item) === String(product.id));
  const gallery = product.images?.length ? product.images : [product.image];
  const related = products.filter(p => p.gender === product.gender && p.id !== product.id).slice(0, 4);
  function add() {
    if (!size) { setError('size'); return; }
    if (!color) { setError('color'); return; }
    if (product.stock < 1) { setError('unavailable'); return; }
    const inCart = cart.reduce((sum, item) => String(item.productId) === String(product.id) ? sum + Number(item.quantity || 0) : sum, 0);
    if (quantity + inCart > product.stock || !addToCart(product, size, color, quantity)) { setError('stock'); return; }
    setError(''); setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }
  const errorText = error === 'size' ? t.product.validationSize
    : error === 'color' ? t.product.validationColor
      : error === 'unavailable' ? t.product.outOfStock
        : error === 'stock' ? x.stockLimit.replace('{n}', Math.max(0, product.stock - cart.reduce((sum, item) => String(item.productId) === String(product.id) ? sum + Number(item.quantity || 0) : sum, 0))) : '';
  return <div className="detail-page"><div className="breadcrumb"><Link to="/">{t.nav.home}</Link><span>/</span><Link to="/shop">{t.nav.shopAll}</Link><span>/</span><span>{name}</span></div>
    <div className="detail-layout"><div className="gallery"><div className="gallery-main"><SafeImage src={image || gallery[0]} alt={name} /></div><div className="gallery-thumbs">{gallery.map((src, i) => <button type="button" key={src} className={(image || gallery[0]) === src ? 'selected' : ''} onClick={() => setImage(src)} aria-label={(lang === 'ar' ? 'الصورة ' : 'Image ') + (i + 1)}><SafeImage src={src} alt="" /></button>)}</div></div>
      <div className="detail-copy"><span className="eyebrow">{lang === 'ar' ? product.categoryAr : product.category} / {lang === 'ar' ? product.gender === 'Men' ? t.genders.Men : t.genders.Women : product.gender}</span><h1>{name}</h1>
        <div className="detail-price"><strong>{money(product.price, lang)}</strong>{product.originalPrice && <><del>{money(product.originalPrice, lang)}</del><span className="discount-label">{Math.round((1 - product.price / product.originalPrice) * 100)}% {t.badges.sale}</span></>}</div>
        <p className="detail-description">{lang === 'ar' ? product.descriptionAr : product.description}</p>
        <div className="variant-group"><div className="variant-label"><strong>{t.product.selectColor}</strong>{color && <span>{lang === 'ar' ? product.colors.find(c => c.name === color)?.nameAr : color}</span>}</div><div className="swatches">{product.colors.map(c => <button key={c.name} type="button" className={'swatch' + (color === c.name ? ' selected' : '')} style={{ '--swatch': c.hex }} onClick={() => setColor(c.name)} aria-label={lang === 'ar' ? c.nameAr : c.name} aria-pressed={color === c.name}><i /></button>)}</div></div>
        <div className="variant-group"><div className="variant-label"><strong>{t.product.selectSize}</strong><details className="size-guide"><summary>{t.product.sizeGuide}</summary><p>{lang === 'ar' ? 'تختلف المقاسات حسب التصميم. اختر مقاسك المعتاد أو تواصل معنا للمساعدة.' : 'Fits vary by style. Choose your usual size or contact us for help.'}</p></details></div><div className="size-options">{product.sizes.map(s => <button key={s} type="button" className={size === s ? 'selected' : ''} onClick={() => setSize(s)} aria-pressed={size === s}>{s}</button>)}</div></div>
        <div className="availability">{product.stock > 0 ? <><span className="stock-dot"></span>{t.product.onlyLeft.replace('{n}', product.stock)}</> : t.product.outOfStock}</div>
        <div className="purchase-row"><div className="quantity-control"><button type="button" aria-label={t.product.quantity + ' −'} onClick={() => setQuantity(Math.max(1, quantity - 1))}><Icon name="minus" size={15} /></button><span>{quantity}</span><button type="button" aria-label={t.product.quantity + ' +'} onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}><Icon name="plus" size={15} /></button></div><button className="button button-dark add-detail" type="button" onClick={add} disabled={product.stock < 1}>{added ? t.product.addedToCart : t.product.addToCart}<Icon name="bag" size={18} /></button></div>
        {errorText && <p className="form-error" role="alert">{errorText}</p>}<button type="button" className={'detail-wishlist' + (saved ? ' saved' : '')} onClick={() => toggleWishlist(product.id)}><Icon name="heart" size={18} />{saved ? t.wishlist.remove : t.nav.wishlist}</button>
        <div className="shipping-note"><span>01</span><p>{t.product.shippingInfo}</p></div>
      </div>
    </div>
    <section className="section related-section"><div className="section-heading"><div><span className="eyebrow">{t.product.details}</span><h2>{t.product.relatedTitle}</h2></div></div><ProductGrid items={related} /></section>
  </div>;
}

function CartPage() {
  const { t, lang, x } = useWords();
  const { cart, changeQuantity, removeFromCart } = useStore();
  const { lines, itemCount, subtotal, shipping, total } = calculateCartTotals(cart, products);
  if (!lines.length) return <div className="page-shell"><EmptyState title={t.cart.empty} description={t.cart.emptySub} href="/shop" action={t.cart.continueShopping} /></div>;
  return <div className="page-shell cart-page"><div className="page-title"><span className="eyebrow">VELORA / {x.bagLabel}</span><h1>{t.cart.title}</h1><p>{itemCount} {x.subtotalItems}</p></div>
    <div className="cart-layout"><div className="cart-lines">{lines.map(line => {
      const key = cartItemKey(line.productId, line.size, line.color), p = line.product;
      const productName = lang === 'ar' ? p.nameAr : p.name, shade = p.colors.find(c => c.name === line.color);
      return <article className="cart-line" key={key}><Link to={'/product/' + p.id} className="cart-image"><SafeImage src={p.image} alt={productName} /></Link><div className="cart-line-info"><Link to={'/product/' + p.id} className="product-name">{productName}</Link><span>{t.product.size}: {line.size}</span><span>{t.product.color}: {lang === 'ar' ? shade?.nameAr : line.color}</span><span>{money(line.unitPrice, lang)}</span><div className="quantity-control"><button type="button" aria-label={t.cart.qty + ' −'} onClick={() => changeQuantity(key, -1)}><Icon name="minus" size={14} /></button><span>{line.quantity}</span><button type="button" aria-label={t.cart.qty + ' +'} disabled={line.quantity >= line.maxQuantity} onClick={() => changeQuantity(key, 1)}><Icon name="plus" size={14} /></button></div></div><div className="cart-line-end"><strong>{money(line.lineSubtotal, lang)}</strong><button className="remove-button" type="button" onClick={() => removeFromCart(key)} aria-label={t.cart.remove + ' ' + productName}><Icon name="trash" size={18} /></button></div></article>;
    })}<Link className="underlined-link continue-link" to="/shop">{t.cart.continueShopping}<Icon name="arrow" size={16} /></Link></div>
      <aside className="order-summary"><h2>{t.checkout.orderSummary}</h2><div className="summary-line"><span>{t.cart.subtotal}</span><strong>{money(subtotal, lang)}</strong></div><div className="summary-line"><span>{t.cart.shipping}</span><strong>{shipping === 0 ? t.cart.freeShipping : money(shipping, lang)}</strong></div><p className="shipping-hint">{shipping === 0 ? t.cart.freeShippingUnlocked : t.cart.addMoreForFree.replace('{amount}', money(Math.max(0, SHIPPING_THRESHOLD - subtotal), lang))}</p><div className="summary-line summary-total"><span>{t.cart.total}</span><strong>{money(total, lang)}</strong></div><Link className="button button-dark full-button" to="/checkout">{t.cart.checkout}<Icon name="arrow" size={16} /></Link><small>{t.checkout.demoNotice}</small></aside>
    </div></div>;
}
function WishlistPage() {
  const { t, x } = useWords(), { wishlist } = useStore();
  const items = wishlist.map(id => products.find(p => String(p.id) === String(id))).filter(Boolean);
  return <div className="page-shell wishlist-page"><div className="page-title"><span className="eyebrow">VELORA / {x.savedLabel}</span><h1>{t.wishlist.title}</h1><p>{items.length} {t.wishlist.items}</p></div>{items.length ? <ProductGrid items={items} /> : <EmptyState title={t.wishlist.empty} description={t.wishlist.emptySub} href="/shop" action={t.wishlist.continueShopping} />}</div>;
}
function CheckoutPage() {
  const { t, lang } = useWords(), { cart, finishDemoOrder } = useStore(), navigate = useNavigate();
  const { lines, subtotal, shipping, total } = calculateCartTotals(cart, products);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postal: '', country: '' });
  const [errorKey, setErrorKey] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);
  if (!lines.length) return <div className="page-shell"><EmptyState title={t.cart.empty} description={t.checkout.emptyCart} href="/shop" action={t.cart.continueShopping} /></div>;
  const fields = [['firstName', t.checkout.firstName, true], ['lastName', t.checkout.lastName, true], ['email', t.checkout.email, true], ['phone', t.checkout.phone, false], ['address', t.checkout.address, true], ['city', t.checkout.city, true], ['postal', t.checkout.postal, false], ['country', t.checkout.country, true]];
  function submit(event) {
    event.preventDefault();
    if (submitLock.current) return;
    if (['firstName', 'lastName', 'email', 'address', 'city', 'country'].some(key => !form[key].trim())) { setErrorKey('required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setErrorKey('email'); return; }
    const order = {
      reference: 'VLR-' + String(Date.now()).slice(-6),
      items: lines.map(line => ({ productId: line.productId, size: line.size, color: line.color, quantity: line.quantity })),
      subtotal, shipping, total,
      shippingTo: [form.firstName, form.lastName, form.address, form.city, form.country].filter(Boolean).join(', '),
    };
    submitLock.current = true;
    setSubmitting(true);
    if (!finishDemoOrder(order)) { submitLock.current = false; setSubmitting(false); setErrorKey('empty'); return; }
    navigate('/order-confirmation');
  }
  const errorText = errorKey === 'required' ? t.checkout.required
    : errorKey === 'email' ? t.checkout.emailInvalid
      : errorKey === 'empty' ? t.checkout.emptyCart : '';
  return <div className="page-shell checkout-page"><div className="page-title"><span className="eyebrow">{extra[lang].demoLabel}</span><h1>{t.checkout.title}</h1><p>{t.checkout.demoNotice}</p></div>
    <div className="checkout-layout"><form className="checkout-form" onSubmit={submit} noValidate><h2>{t.checkout.contact}</h2><div className="form-grid">{fields.map(([key, label, required]) => <label className={key === 'address' ? 'wide-field' : ''} key={key}>{label}{required && <span className="required-mark"> *</span>}<input type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'} required={required} autoComplete={key === 'firstName' ? 'given-name' : key === 'lastName' ? 'family-name' : key === 'address' ? 'address-line1' : key === 'city' ? 'address-level2' : key === 'postal' ? 'postal-code' : key === 'country' ? 'country-name' : key === 'phone' ? 'tel' : 'email'} value={form[key]} aria-invalid={(errorKey === 'required' && required && !form[key].trim()) || (errorKey === 'email' && key === 'email')} onChange={e => { setForm(current => ({ ...current, [key]: e.target.value })); if (errorKey) setErrorKey(''); }} /></label>)}</div>{errorText && <p className="form-error" role="alert">{errorText}</p>}<button className="button button-dark full-button" type="submit" disabled={submitting} aria-busy={submitting}>{submitting ? t.checkout.processing : t.checkout.placeOrder}<Icon name="arrow" size={16} /></button><small className="demo-disclaimer">{t.checkout.demoNotice}</small></form>
      <aside className="order-summary"><h2>{t.checkout.orderSummary}</h2>{lines.map(line => <div className="checkout-item" key={cartItemKey(line.productId, line.size, line.color)}><SafeImage src={line.product.image} alt="" /><div><strong>{lang === 'ar' ? line.product.nameAr : line.product.name}</strong><span>{line.size} / {lang === 'ar' ? line.product.colors.find(c => c.name === line.color)?.nameAr : line.color} · {line.quantity}</span></div><b>{money(line.lineSubtotal, lang)}</b></div>)}<div className="summary-line"><span>{t.cart.subtotal}</span><strong>{money(subtotal, lang)}</strong></div><div className="summary-line"><span>{t.cart.shipping}</span><strong>{shipping ? money(shipping, lang) : t.cart.freeShipping}</strong></div><div className="summary-line summary-total"><span>{t.cart.total}</span><strong>{money(total, lang)}</strong></div><Link className="underlined-link" to="/cart">{t.checkout.backToCart}<Icon name="arrow" size={15} /></Link></aside>
    </div></div>;
}
function ConfirmationPage() {
  const { t, lang, x } = useWords(), { demoOrder } = useStore();
  if (!demoOrder) return <div className="page-shell"><EmptyState title={t.confirmation.title} description={x.noOrder} href="/shop" action={t.confirmation.continueShopping} /></div>;
  const items = demoOrder.items.map(line => ({ ...line, product: products.find(p => String(p.id) === String(line.productId)) })).filter(line => line.product);
  return <div className="page-shell confirmation-page"><div className="confirmation-icon"><Icon name="check" size={27} /></div><span className="eyebrow">{x.demoLabel}</span><h1>{t.confirmation.title}</h1><p className="confirmation-copy">{t.confirmation.sub}</p><p className="order-reference">{t.confirmation.orderRef}: <strong>{demoOrder.reference}</strong></p><div className="confirmation-card"><h2>{t.confirmation.yourItems}</h2>{items.map((line, i) => <div className="summary-line" key={i}><span>{lang === 'ar' ? line.product.nameAr : line.product.name} × {line.quantity} · {line.size}</span><strong>{money(line.product.price * line.quantity, lang)}</strong></div>)}<div className="summary-line"><span>{t.cart.shipping}</span><strong>{demoOrder.shipping ? money(demoOrder.shipping, lang) : t.cart.freeShipping}</strong></div><div className="summary-line summary-total"><span>{t.confirmation.total}</span><strong>{money(demoOrder.total, lang)}</strong></div><p className="shipping-note-text">{t.confirmation.shippingTo}: {demoOrder.shippingTo}</p></div><p className="inline-status">{x.orderStored}</p><Link className="button button-dark" to="/shop">{t.confirmation.continueShopping}<Icon name="arrow" size={16} /></Link></div>;
}
function NotFound() {
  const { t } = useWords();
  return <div className="page-shell not-found"><span className="eyebrow">VELORA / 404</span><div className="not-found-code">404</div><h1>{t.notFound.title}</h1><p>{t.notFound.sub}</p><div className="button-row"><Link className="button button-dark" to="/">{t.notFound.backHome}</Link><Link className="button button-outline" to="/shop">{t.notFound.browse}</Link></div></div>;
}
function AppLayout() {
  return <><LanguageAttributes /><ScrollReset /><Header /><main id="main-content"><Routes>
    <Route path="/" element={<HomePage />} /><Route path="/shop" element={<CatalogPage kind="shop" />} />
    <Route path="/men" element={<CatalogPage kind="men" />} /><Route path="/women" element={<CatalogPage kind="women" />} />
    <Route path="/new-arrivals" element={<CatalogPage kind="new" />} /><Route path="/sale" element={<CatalogPage kind="sale" />} />
    <Route path="/product/:id" element={<ProductDetailsPage />} /><Route path="/cart" element={<CartPage />} />
    <Route path="/checkout" element={<CheckoutPage />} /><Route path="/order-confirmation" element={<ConfirmationPage />} />
    <Route path="/wishlist" element={<WishlistPage />} /><Route path="*" element={<NotFound />} />
  </Routes></main><Footer /></>;
}
export default function App() { return <StoreProvider><BrowserRouter><AppLayout /></BrowserRouter></StoreProvider>; }
