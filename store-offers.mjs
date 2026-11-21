const start = Date.parse('2026-12-01T00:00:00-05:00');
const end = Date.parse('2027-01-01T00:00:00-05:00');

const isCD = item => /(?:^|\s)CD(?:\s|$)/i.test(item.format);
const isFullSizeVinyl = item => /^vinyl$/i.test(item.format);
const isSevenInch = item => /^7-inch vinyl$/i.test(item.format);
const count = (items, matches) => items.filter(matches).reduce((sum, item) => sum + item.quantity, 0);
const unitCents = item => Math.round(item.price * 100);

export function decemberOffersActive(now = Date.now()) {
  return now >= start && now < end;
}

const blackFridayStart = Date.parse('2026-11-27T00:00:00-05:00');
const blackFridayEnd = Date.parse('2026-11-28T00:00:00-05:00');
export function blackFridayActive(now = Date.now()) {
  return now >= blackFridayStart && now < blackFridayEnd;
}

function halfOffCheapest(items, matches, offer) {
  const cheapest = items.filter(matches).sort((a, b) => unitCents(a) - unitCents(b) || a.id.localeCompare(b.id))[0];
  return cheapest && {id: cheapest.id, cents: Math.floor(unitCents(cheapest) / 2), offer};
}

export function priceDecemberCart(items, now = Date.now()) {
  const itemsCents = items.reduce((sum, item) => sum + unitCents(item) * item.quantity, 0);
  const discounts = [];
  if (blackFridayActive(now)) {
    for (const item of items.filter(isCD)) {
      const unitDiscount = Math.round(unitCents(item) / 10);
      discounts.push({id: item.id, offer: 'black-friday', unitDiscount, cents: unitDiscount * item.quantity});
    }
  }
  if (decemberOffersActive(now)) {
    if (count(items, isCD) >= 3) discounts.push(halfOffCheapest(items, isCD, 'cd'));
    if (count(items, isFullSizeVinyl) >= 2) {
      const sevenInch = halfOffCheapest(items, isSevenInch, 'vinyl');
      if (sevenInch) discounts.push(sevenInch);
    }
  }
  const discountCents = discounts.reduce((sum, discount) => sum + discount.cents, 0);
  return {itemsCents, discounts, subtotalCents: itemsCents - discountCents};
}
