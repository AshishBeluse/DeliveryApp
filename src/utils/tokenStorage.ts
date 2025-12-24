import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth.token';

export const tokenStorage = {
  async get(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async set(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch {
      // ignore
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  },
};
