import test from 'node:test';
import assert from 'node:assert/strict';
import { products, collectionCards } from '../src/data/products.js';
import translations from '../src/translations/index.js';

test('catalog has at least 16 unique, complete bilingual products', () => {
  assert.ok(products.length >= 16);
  assert.equal(new Set(products.map(product => product.id)).size, products.length);
  for (const product of products) {
    assert.equal(typeof product.price, 'number', product.name);
    assert.ok(product.price >= 0, product.name);
    assert.ok(product.name && product.nameAr && product.description && product.descriptionAr, product.name);
    assert.ok(product.sizes.length && product.colors.length, product.name);
    assert.ok(['Men', 'Women'].includes(product.gender), product.name);
    assert.ok(Number.isInteger(product.stock) && product.stock >= 0, product.name);
    assert.ok(new URL(product.image).protocol === 'https:', product.name);
    for (const image of product.images) assert.ok(new URL(image).protocol === 'https:', product.name);
    if (product.isSale) assert.ok(product.originalPrice > product.price, product.name);
    else assert.equal(product.originalPrice, null, product.name);
  }
});

test('men, women, arrivals, and sale collections are backed by product flags', () => {
  assert.equal(products.filter(product => product.gender === 'Men').length, 8);
  assert.equal(products.filter(product => product.gender === 'Women').length, 8);
  assert.ok(products.some(product => product.isNew));
  assert.ok(products.some(product => product.isSale));
  assert.deepEqual(collectionCards.map(card => card.path), ['/men', '/women', '/new-arrivals']);
});

test('English and Arabic translation trees have matching keys', () => {
  function paths(value, prefix = '') {
    return Object.entries(value).flatMap(([key, child]) => {
      const path = prefix ? prefix + '.' + key : key;
      return child && typeof child === 'object' && !Array.isArray(child) ? paths(child, path) : [path];
    }).sort();
  }
  assert.deepEqual(paths(translations.en), paths(translations.ar));
});
