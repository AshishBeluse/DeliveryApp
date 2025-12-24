export type MenuCategory = { id: string; name: string };

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  prevPrice?: number;
  currency?: string;
  image: string;
  categoryId: string; 
   restaurantId:string | number;
};

