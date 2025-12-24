export function getItemLabel(item: any): string {
  if (!item) return '';

  // If already string
  if (typeof item === 'string') return item;

  // common backend shapes
  const name =
    item?.name ?? item?.menuItem?.name ?? item?.itemName ?? item?.title ?? '';

  const qty = Number(item?.quantity ?? item?.qty ?? 0);
  const variant = item?.variantName ?? item?.variant?.name ?? '';

  const parts = [
    name || 'Item',
    variant ? `(${variant})` : '',
    qty ? `x${qty}` : '',
  ].filter(Boolean);

  return parts.join(' ');
}
