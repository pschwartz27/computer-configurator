import test from 'node:test';
import assert from 'node:assert/strict';
import { CURRENCIES, DEFAULT_CURRENCY, convert, formatMoney, isCurrency, normalizeCurrency } from '../src/currency.js';

test('exposes exactly DKK and EUR', () => {
  assert.deepEqual(Object.keys(CURRENCIES).sort(), ['DKK', 'EUR']);
  assert.ok(isCurrency(DEFAULT_CURRENCY));
});

test('isCurrency accepts known codes case-insensitively and rejects others', () => {
  assert.equal(isCurrency('dkk'), true);
  assert.equal(isCurrency('EUR'), true);
  assert.equal(isCurrency('USD'), false);
  assert.equal(isCurrency(null), false);
  assert.equal(isCurrency('toString'), false);
});

test('normalizeCurrency falls back to the default', () => {
  assert.equal(normalizeCurrency('eur'), 'EUR');
  assert.equal(normalizeCurrency('GBP'), DEFAULT_CURRENCY);
});

test('convert applies the rate and rounds to whole units', () => {
  assert.equal(convert(100, 'EUR'), Math.round(100 * CURRENCIES.EUR.rate));
  assert.equal(convert(100, 'DKK'), Math.round(100 * CURRENCIES.DKK.rate));
  assert.equal(convert(0, 'DKK'), 0);
});

test('unknown currency converts using the default', () => {
  assert.equal(convert(250, 'JPY'), convert(250, DEFAULT_CURRENCY));
});

test('formatMoney renders the currency without decimals', () => {
  const eur = formatMoney(100, 'EUR');
  assert.match(eur, /€/);
  assert.doesNotMatch(eur, /[.,]\d\d$/);

  const dkk = formatMoney(100, 'DKK');
  assert.match(dkk, /kr/i);
});
