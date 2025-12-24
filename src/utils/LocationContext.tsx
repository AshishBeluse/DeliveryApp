import React, { createContext, useContext, useState } from 'react';
import { getCurrentLocation, type Coords } from './locationHelper';

type LocationCtx = {
  location: Coords | null;
  refreshLocation: () => Promise<Coords | null>;
};

const LocationContext = createContext<LocationCtx>({
  location: null,
  refreshLocation: async () => null,
});

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => { 
  const [location, setLocation] = useState<Coords | null>(null);

  const refreshLocation = async (): Promise<Coords | null> => {
    const res = await getCurrentLocation();
    if (res.success && res.coords) {
      setLocation(res.coords);
      return res.coords;
    }
    console.warn('Location fetch failed:', res.error);
    return null;
  };

  // ❌ no auto-ask on mount

  return (
    <LocationContext.Provider value={{ location, refreshLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);

