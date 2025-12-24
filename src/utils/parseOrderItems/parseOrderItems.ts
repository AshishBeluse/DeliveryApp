export type OrderItem = {
  menuItemId: number;
  variantId: number | null;
  name: string;
  price: number;
  quantity: number;
  total: number;
  customizations?: any[];
  [k: string]: any;
};

export function parseOrderItems(raw: any): OrderItem[] {
  const items = raw?.items;
  if (!Array.isArray(items)) return [];

  return items.map((i: any) => {
    const price = Number(i?.price ?? i?.cost ?? 0);
    const quantity = Number(i?.quantity ?? 1);
    return {
      menuItemId: Number(i?.menuItemId ?? i?.menu_item_id ?? 0),
      variantId: i?.variantId ?? i?.variant_id ?? null,
      name: String(i?.name ?? i?.itemName ?? 'Item'),
      price,
      quantity,
      total: Number(i?.total ?? price * quantity),
      customizations: Array.isArray(i?.customizations) ? i.customizations : [],
      ...i,
    };
  });
}
