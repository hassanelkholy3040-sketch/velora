import { SHIPPING_COST, SHIPPING_THRESHOLD } from '../data/products.js';

export function cartItemKey(productId, size, color) {
  return JSON.stringify([String(productId), String(size), String(color)]);
}

function wholeQuantity(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

export function normalizeCart(value, catalog) {
  if (!Array.isArray(value)) return [];
  const productsById = new Map(catalog.map(product => [String(product.id), product]));
  const remaining = new Map(catalog.map(product => [String(product.id), Math.max(0, wholeQuantity(product.stock))]));
  const normalized = [];
  const lineIndexes = new Map();

  for (const item of value) {
    const product = item && productsById.get(String(item.productId));
    const requested = wholeQuantity(item?.quantity);
    if (!product || !product.sizes.includes(item.size) || !product.colors.some(color => color.name === item.color) || !requested) continue;

    const id = String(product.id);
    const quantity = Math.min(remaining.get(id) || 0, requested);
    if (!quantity) continue;
    const key = cartItemKey(product.id, item.size, item.color);
    const index = lineIndexes.get(key);
    if (index === undefined) {
      lineIndexes.set(key, normalized.length);
      normalized.push({ productId: product.id, size: item.size, color: item.color, quantity });
    } else {
      normalized[index] = { ...normalized[index], quantity: normalized[index].quantity + quantity };
    }
    remaining.set(id, remaining.get(id) - quantity);
  }

  return normalized;
}

export function addCartItem(cart, product, size, color, quantity = 1) {
  const amount = wholeQuantity(quantity);
  if (!product || !product.sizes.includes(size) || !product.colors.some(item => item.name === color) || !amount) {
    return { cart, added: false, reason: 'invalid' };
  }

  const totalForProduct = cart.reduce((sum, item) => String(item.productId) === String(product.id) ? sum + wholeQuantity(item.quantity) : sum, 0);
  if (totalForProduct + amount > wholeQuantity(product.stock)) return { cart, added: false, reason: 'stock' };

  const key = cartItemKey(product.id, size, color);
  const index = cart.findIndex(item => cartItemKey(item.productId, item.size, item.color) === key);
  const next = index < 0
    ? cart.concat({ productId: product.id, size, color, quantity: amount })
    : cart.map((item, i) => i === index ? { ...item, quantity: wholeQuantity(item.quantity) + amount } : item);
  return { cart: next, added: true, reason: null };
}

export function changeCartQuantity(cart, key, delta, catalog) {
  const index = cart.findIndex(item => cartItemKey(item.productId, item.size, item.color) === key);
  const change = Number(delta);
  if (index < 0 || !Number.isFinite(change)) return cart;

  const current = cart[index];
  const product = catalog.find(item => String(item.id) === String(current.productId));
  if (!product) return cart;
  const otherQuantity = cart.reduce((sum, item, itemIndex) => itemIndex !== index && String(item.productId) === String(product.id)
    ? sum + wholeQuantity(item.quantity) : sum, 0);
  const maxQuantity = wholeQuantity(product.stock) - otherQuantity;
  if (maxQuantity < 1) return cart;
  const quantity = Math.min(maxQuantity, Math.max(1, wholeQuantity(current.quantity) + Math.trunc(change)));
  return cart.map((item, itemIndex) => itemIndex === index ? { ...item, quantity } : item);
}

export function removeCartItem(cart, key) {
  return cart.filter(item => cartItemKey(item.productId, item.size, item.color) !== key);
}

export function normalizeWishlist(value, catalog) {
  if (!Array.isArray(value)) return [];
  const productsById = new Map(catalog.map(product => [String(product.id), product]));
  return [...new Map(value.flatMap(id => {
    const product = productsById.get(String(id));
    return product ? [[String(product.id), product.id]] : [];
  })).values()];
}

export function toggleWishlistItem(wishlist, id, catalog) {
  const normalized = normalizeWishlist(wishlist, catalog);
  const product = catalog.find(item => String(item.id) === String(id));
  return normalized.some(item => String(item) === String(id))
    ? normalized.filter(item => String(item) !== String(id))
    : product ? normalized.concat(product.id) : normalized;
}

export function calculateCartTotals(cart, catalog, threshold = SHIPPING_THRESHOLD, shippingCost = SHIPPING_COST) {
  const normalized = normalizeCart(cart, catalog);
  const productsById = new Map(catalog.map(product => [String(product.id), product]));
  const quantityByProduct = normalized.reduce((totals, item) => {
    const id = String(item.productId);
    totals.set(id, (totals.get(id) || 0) + item.quantity);
    return totals;
  }, new Map());
  const lines = normalized.map(item => {
    const product = productsById.get(String(item.productId));
    const unitPriceCents = Math.round(Number(product.price) * 100);
    return {
      ...item,
      product,
      unitPrice: unitPriceCents / 100,
      lineSubtotal: unitPriceCents * item.quantity / 100,
      maxQuantity: item.quantity + Math.max(0, wholeQuantity(product.stock) - quantityByProduct.get(String(product.id))),
    };
  });
  const itemCount = normalized.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalCents = lines.reduce((sum, line) => sum + Math.round(line.unitPrice * 100) * line.quantity, 0);
  const thresholdCents = Math.round(Number(threshold) * 100);
  const shippingCents = itemCount === 0 ? 0 : subtotalCents >= thresholdCents ? 0 : Math.round(Number(shippingCost) * 100);
  const subtotal = subtotalCents / 100;
  const shipping = shippingCents / 100;
  return { lines, itemCount, subtotal, shipping, total: (subtotalCents + shippingCents) / 100 };
}

export function normalizeDemoOrder(value, catalog) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const items = normalizeCart(value.items, catalog);
  if (!items.length) return null;
  const totals = calculateCartTotals(items, catalog);
  return {
    reference: typeof value.reference === 'string' && value.reference.length <= 40 ? value.reference : 'DEMO',
    items,
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    total: totals.total,
    shippingTo: typeof value.shippingTo === 'string' ? value.shippingTo.slice(0, 500) : '',
  };
}
