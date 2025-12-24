import { GOOGLE_MAPS_KEY } from "@env";

export const reverseGeocode = async (lat: number, lng: number) => {
  const key = GOOGLE_MAPS_KEY;
  if (!key) return ''; // avoid bad calls without a key

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.status === 'OK' && json.results?.length) {
    return json.results[0].formatted_address as string;
  } 
  return '';
};

