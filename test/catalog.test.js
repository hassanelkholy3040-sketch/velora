import test from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/data/products.js';
import { filterProducts } from '../src/utils/catalog.js';

test('collection scopes return only men, women, new, or discounted products', () => {
  assert.ok(filterProducts(products, { kind: 'men' }).every(product => product.gender === 'Men'));
  assert.ok(filterProducts(products, { kind: 'women' }).every(product => product.gender === 'Women'));
  assert.ok(filterProducts(products, { kind: 'new' }).every(product => product.isNew));
  assert.ok(filterProducts(products, { kind: 'sale' }).every(product => product.isSale));
});

test('English and Arabic search include names, descriptions, categories, and colors', () => {
  assert.ok(filterProducts(products, { query: 'Linen Shirt' }).some(product => product.id === 1));
  const arabicProduct = products.find(product => product.id === 1);
  assert.ok(filterProducts(products, { query: arabicProduct.nameAr.slice(0, 5), lang: 'ar' }).some(product => product.id === 1));
  assert.ok(filterProducts(products, { query: 'European linen' }).some(product => product.id === 1));
  assert.ok(filterProducts(products, { query: products[0].colors[0].name }).length > 0);
});

test('combined category, gender, size, color, and price filters intersect', () => {
  const result = filterProducts(products, {
    category: 'Shirts', gender: 'Men', size: 'M', color: 'White', minPrice: '80', maxPrice: '90',
  });
  assert.deepEqual(result.map(product => product.id), [1]);
  assert.deepEqual(filterProducts(products, { category: 'Shirts', gender: 'Women' }), []);
  assert.deepEqual(filterProducts(products, { minPrice: '90', maxPrice: '80' }), []);
  assert.deepEqual(filterProducts(products, { minPrice: '-1' }), products.slice().sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || Number(b.isBestseller) - Number(a.isBestseller)));
});

test('sale-only narrows the current results and handles invalid sort keys safely', () => {
  const result = filterProducts(products, { gender: 'Men', saleOnly: true });
  assert.ok(result.length > 0);
  assert.ok(result.every(product => product.gender === 'Men' && product.isSale));
  assert.deepEqual(filterProducts(products, { sort: 'not-a-sort' }).map(product => product.id), filterProducts(products).map(product => product.id));
});

test('all supported sort modes order the actual catalog', () => {
  const ascending = filterProducts(products, { sort: 'priceAsc' });
  const descending = filterProducts(products, { sort: 'priceDesc' });
  const newest = filterProducts(products, { sort: 'newest' });
  const alpha = filterProducts(products, { sort: 'alphaAsc' });
  assert.ok(ascending.every((item, i) => i === 0 || ascending[i - 1].price <= item.price));
  assert.ok(descending.every((item, i) => i === 0 || descending[i - 1].price >= item.price));
  assert.ok(newest.slice(0, 6).every(item => item.isNew));
  assert.deepEqual(alpha.map(item => item.name), products.map(item => item.name).slice().sort((a, b) => a.localeCompare(b, 'en')));
});
