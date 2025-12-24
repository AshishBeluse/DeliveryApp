export type SavedPlace = {
  id: string;
  kind: 'home' | 'work';
  title: string; // "Home" / "Work"
  addressLine: string; // pretty address 
  coords?: { latitude: number; longitude: number };
};

