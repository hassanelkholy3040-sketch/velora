import test from 'node:test';
import assert from 'node:assert/strict';
import { readStoredJSON, writeStoredJSON } from '../src/utils/storage.js';

test('storage reads missing and invalid JSON safely', () => {
  const missing = { getItem: () => null };
  const malformed = { getItem: () => '{not json' };
  assert.deepEqual(readStoredJSON(missing, 'cart', []), []);
  assert.deepEqual(readStoredJSON(malformed, 'cart', []), []);
  assert.equal(readStoredJSON({ getItem: () => '"ar"' }, 'language', 'en'), 'ar');
});

test('storage read and write failures are contained', () => {
  const denied = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.equal(readStoredJSON(denied, 'cart', null), null);
  assert.equal(writeStoredJSON(denied, 'cart', []), false);
  let value;
  const available = { setItem(key, raw) { value = [key, raw]; } };
  assert.equal(writeStoredJSON(available, 'cart', [{ quantity: 1 }]), true);
  assert.deepEqual(value, ['cart', '[{"quantity":1}]']);
});
