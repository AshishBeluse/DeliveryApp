import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useAppDispatch } from '../redux/hooks';
import { flushQueuedLocationsThunk } from '../redux/driverSlice/driverSlice';

interface NetworkContextProps {
  isConnected: boolean;
}

const NetworkContext = createContext<NetworkContextProps>({
  isConnected: false,
});

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState(false);

  // 👇 Track previous state to avoid duplicate flushes
  const wasConnectedRef = useRef<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = !!state.isConnected;

      setIsConnected(connected);

      // ✅ Offline → Online transition
      if (!wasConnectedRef.current && connected) {
        dispatch(flushQueuedLocationsThunk());
      }

      wasConnectedRef.current = connected;
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
