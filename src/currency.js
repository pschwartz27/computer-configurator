// Currency support. Catalog prices are stored in USD; everything shown to the
// user is converted with the fixed rates below. Rates are hand-maintained for
// now — there is no live FX feed.

export const BASE_CURRENCY = 'USD';

export const CURRENCIES = {
  DKK: { code: 'DKK', label: 'Danish krone (kr.)', locale: 'da-DK', rate: 6.85 },
  EUR: { code: 'EUR', label: 'Euro (€)', locale: 'de-DE', rate: 0.92 }
};

export const DEFAULT_CURRENCY = 'DKK';

export function isCurrency(code) {
  return typeof code === 'string' && Object.hasOwn(CURRENCIES, code.toUpperCase());
}

export function normalizeCurrency(code) {
  return isCurrency(code) ? code.toUpperCase() : DEFAULT_CURRENCY;
}

/** Convert an amount in USD to the given currency, rounded to whole units. */
export function convert(amountUsd, code) {
  const currency = CURRENCIES[normalizeCurrency(code)];
  return Math.round(amountUsd * currency.rate);
}

/** Convert and format an USD amount for display. */
export function formatMoney(amountUsd, code) {
  const currency = CURRENCIES[normalizeCurrency(code)];
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    maximumFractionDigits: 0
  }).format(convert(amountUsd, currency.code));
}
