export type Restaurant = {
  id: string;
  name: string;
  priceDisplay: string;
  etaMins: [number, number];
  rating: number; 
  image: string;
  tags: string[];
  promo?: string;

  // used by Browse / Filters
  priceTier?: 1 | 2 | 3 | 4; // $ … $$$$
  deliveryFee?: number; // e.g., 2.99
  pickup?: boolean;
  cuisines?: string[]; // ['Pizza','Italian','Salads']

  // 👇 add these for the details screen
  subtitle?: string; // "American, new american fast food - $"
  ratingCount?: number; // 400
  addressLine?: string; // "Madison Street, Hendersonville, Maryland"
  menuCategories?: { id: string; name: string }[];
  menuItems?: Array<{
    id: string;
    name: string;
    price: number;
    currency?: string; // 'PLN' or '$'
    image: string;
    categoryId?: string; // matches a menuCategories id
  }>;
};


export type RestaurantLocation = {
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  latitude: string | null;
  longitude: string | null;
};

export const defaultRestaurantLocation: RestaurantLocation = {
  addressLine1: null,
  addressLine2: null,
  city: null,
  state: null,
  postalCode: null,
  country: null,
  latitude: null,
  longitude: null,
};


export type MenuItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  image?: string;
  isVegetarian?: boolean;
  isFavorite?: boolean;
  // add other fields from backend as needed
};

export type MenuItemResponse = {
  success: boolean;
  data: MenuItem;
  message?: string;
};
