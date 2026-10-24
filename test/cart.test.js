import test from 'node:test';
import assert from 'node:assert/strict';
import { products, SHIPPING_COST, SHIPPING_THRESHOLD } from '../src/data/products.js';
import {
  addCartItem,
  calculateCartTotals,
  cartItemKey,
  changeCartQuantity,
  normalizeCart,
  normalizeDemoOrder,
  normalizeWishlist,
  removeCartItem,
  toggleWishlistItem,
} from '../src/utils/cart.js';

const product = id => products.find(item => item.id === id);

test('cart keys keep product, size, and color combinations distinct', () => {
  assert.notEqual(cartItemKey(1, 'S', 'Navy'), cartItemKey(1, 'M', 'Navy'));
  assert.notEqual(cartItemKey(1, 'S', 'Navy'), cartItemKey(1, 'S', 'Sky Blue'));
  assert.equal(cartItemKey(1, 'S', 'Navy'), cartItemKey('1', 'S', 'Navy'));
});

test('adding the same variant merges it while different variants get separate lines', () => {
  const item = product(1);
  const size = item.sizes[0], otherSize = item.sizes[1];
  const color = item.colors[0].name, otherColor = item.colors[1].name;
  let cart = [];
  let result = addCartItem(cart, item, size, color, 2);
  assert.equal(result.added, true);
  cart = result.cart;
  cart = addCartItem(cart, item, size, color, 1).cart;
  cart = addCartItem(cart, item, otherSize, color, 1).cart;
  cart = addCartItem(cart, item, size, otherColor, 1).cart;
  assert.equal(cart.length, 3);
  assert.deepEqual(cart.map(line => line.quantity), [3, 1, 1]);
});

test('cart refuses invalid variants and prevents total product stock from being exceeded', () => {
  const item = product(1);
  assert.equal(addCartItem([], item, 'NOT-A-SIZE', item.colors[0].name).added, false);
  assert.equal(addCartItem([], item, item.sizes[0], 'NOT-A-COLOR').added, false);
  const cart = [{ productId: item.id, size: item.sizes[0], color: item.colors[0].name, quantity: item.stock - 1 }];
  const rejected = addCartItem(cart, item, item.sizes[1], item.colors[1].name, 2);
  assert.equal(rejected.added, false);
  assert.equal(rejected.reason, 'stock');
  assert.equal(rejected.cart, cart);
});

test('cart quantity changes stay between one and remaining product stock', () => {
  const item = product(1), other = item.colors[0].name;
  const first = { productId: item.id, size: item.sizes[0], color: other, quantity: 5 };
  const second = { productId: item.id, size: item.sizes[1], color: item.colors[1].name, quantity: item.stock - 5 };
  const cart = [first, second];
  const key = cartItemKey(first.productId, first.size, first.color);
  assert.equal(changeCartQuantity(cart, key, 8, products)[0].quantity, 5);
  assert.equal(changeCartQuantity(cart, key, -9, products)[0].quantity, 1);
});

test('cart normalization repairs malformed data, merges duplicate lines, and respects stock', () => {
  const item = product(1);
  const normalized = normalizeCart([
    { productId: item.id, size: item.sizes[0], color: item.colors[0].name, quantity: '2' },
    { productId: item.id, size: item.sizes[0], color: item.colors[0].name, quantity: 50 },
    { productId: 99999, size: 'M', color: 'Black', quantity: 1 },
    { productId: item.id, size: 'INVALID', color: item.colors[0].name, quantity: 1 },
    { productId: item.id, size: item.sizes[0], color: item.colors[0].name, quantity: 'bad' },
    null,
  ], products);
  assert.deepEqual(normalized, [{ productId: item.id, size: item.sizes[0], color: item.colors[0].name, quantity: item.stock }]);
  assert.deepEqual(normalizeCart('{bad json}', products), []);
});

test('shipping is free for an empty cart, charged below $100, and free at or above $100', () => {
  const empty = calculateCartTotals([], products);
  assert.deepEqual([empty.subtotal, empty.shipping, empty.total], [0, 0, 0]);

  const under = calculateCartTotals([{ productId: 1, size: product(1).sizes[0], color: product(1).colors[0].name, quantity: 1 }], products);
  assert.equal(under.subtotal, 89);
  assert.equal(under.shipping, SHIPPING_COST);
  assert.equal(under.total, 97);

  const exact = calculateCartTotals([
    { productId: 10, size: product(10).sizes[0], color: product(10).colors[0].name, quantity: 1 },
    { productId: 13, size: product(13).sizes[0], color: product(13).colors[0].name, quantity: 1 },
  ], products);
  assert.equal(exact.subtotal, SHIPPING_THRESHOLD);
  assert.equal(exact.shipping, 0);
  assert.equal(exact.total, SHIPPING_THRESHOLD);

  const over = calculateCartTotals([
    { productId: 8, size: product(8).sizes[0], color: product(8).colors[0].name, quantity: 1 },
    { productId: 9, size: product(9).sizes[0], color: product(9).colors[0].name, quantity: 1 },
  ], products);
  assert.equal(over.subtotal, 140);
  assert.equal(over.shipping, 0);
  assert.equal(over.total, 140);
});

test('cart totals round to cents without floating point drift', () => {
  const catalog = [
    { id: 'a', price: 0.1, stock: 4, sizes: ['S'], colors: [{ name: 'Black' }] },
    { id: 'b', price: 0.2, stock: 4, sizes: ['S'], colors: [{ name: 'Black' }] },
  ];
  const totals = calculateCartTotals([
    { productId: 'a', size: 'S', color: 'Black', quantity: 3 },
    { productId: 'b', size: 'S', color: 'Black', quantity: 1 },
  ], catalog);
  assert.equal(totals.subtotal, 0.5);
  assert.equal(totals.total, 8.5);
});

test('wishlist normalization removes duplicates and obsolete products', () => {
  assert.deepEqual(normalizeWishlist([1, '1', 99999], products), [1]);
  assert.deepEqual(toggleWishlistItem([1, 1], 1, products), []);
  assert.deepEqual(toggleWishlistItem([], 2, products), [2]);
  assert.deepEqual(toggleWishlistItem([], '3', products), [3]);
  assert.deepEqual(toggleWishlistItem([], 99999, products), []);
});

test('demo-order recovery rejects invalid data and recalculates stored totals', () => {
  assert.equal(normalizeDemoOrder({ items: 'bad' }, products), null);
  const item = product(1);
  const order = normalizeDemoOrder({
    reference: 'VLR-123',
    items: [{ productId: item.id, size: item.sizes[0], color: item.colors[0].name, quantity: 1 }],
    subtotal: 1, shipping: 0, total: 1, shippingTo: '<Test Address>', customerEmail: 'unused@example.test',
  }, products);
  assert.equal(order.subtotal, 89);
  assert.equal(order.shipping, 8);
  assert.equal(order.total, 97);
  assert.equal(Object.hasOwn(order, 'customerEmail'), false);
});

test('removing a cart item removes only its exact variant', () => {
  const item = product(1);
  const cart = [
    { productId: item.id, size: item.sizes[0], color: item.colors[0].name, quantity: 1 },
    { productId: item.id, size: item.sizes[1], color: item.colors[0].name, quantity: 1 },
  ];
  const result = removeCartItem(cart, cartItemKey(item.id, item.sizes[0], item.colors[0].name));
  assert.equal(result.length, 1);
  assert.equal(result[0].size, item.sizes[1]);
});
