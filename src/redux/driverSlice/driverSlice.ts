import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DriverApi, DashboardResponse } from '../../services/driverApi';
import { getApiErrorMessage } from '../../services/http';
import type { RootState } from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = 'driver_location_queue_v1';

type QueuedLocation = { lat: number; lng: number; at: number };

async function loadQueue(): Promise<QueuedLocation[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveQueue(items: QueuedLocation[]): Promise<void> {
  try {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

async function enqueueLocation(
  item: QueuedLocation,
): Promise<QueuedLocation[]> {
  const q = await loadQueue();
  q.push(item);
  // keep last 50 to avoid unlimited growth
  const trimmed = q.slice(-50);
  await saveQueue(trimmed);
  return trimmed;
}
export type DriverState = {
  isOnline: boolean;
  lastLocation: { lat: number; lng: number } | null;
  queuedLocations: QueuedLocation[];
  dashboard: DashboardResponse['data'] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: DriverState = {
  isOnline: false,
  lastLocation: null,
  queuedLocations: [],
  dashboard: null,
  status: 'idle',
  error: null,
};

export const setOnlineThunk = createAsyncThunk(
  'driver/setOnline',
  async (payload: { isOnline: boolean }, { rejectWithValue }) => {
    try {
      const data = await DriverApi.setOnline(payload.isOnline);
      return data;
    } catch (e) {
      return rejectWithValue(
        getApiErrorMessage(e, 'Failed to update online status'),
      );
    }
  },
);

export const updateLocationThunk = createAsyncThunk(
  'driver/updateLocation',
  async (payload: { lat: number; lng: number }, { rejectWithValue }) => {
    try {
      const data = await DriverApi.updateLocation(payload.lat, payload.lng);
      return { ...data, lat: payload.lat, lng: payload.lng, queued: false };
    } catch (e: any) {
      // If it's a network-ish error (no response), queue for later and don't block UX.
      const isNetwork =
        (e && e.isAxiosError && !e.response) ||
        String(e?.message || '')
          .toLowerCase()
          .includes('network');
      if (isNetwork) {
        const queuedLocations = await enqueueLocation({
          lat: payload.lat,
          lng: payload.lng,
          at: Date.now(),
        });
        return {
          lat: payload.lat,
          lng: payload.lng,
          queued: true,
          queuedLocations,
        };
      }
      return rejectWithValue(
        getApiErrorMessage(e, 'Failed to update location'),
      );
    }
  },
);

export const flushQueuedLocationsThunk = createAsyncThunk(
  'driver/flushQueuedLocations',
  async (_, { rejectWithValue }) => {
    try {
      const queue = await loadQueue();
      if (!queue.length)
        return { flushed: 0, remaining: [] as QueuedLocation[] };

      const remaining: QueuedLocation[] = [];
      let flushed = 0;

      for (const item of queue) {
        try {
          await DriverApi.updateLocation(item.lat, item.lng);
          flushed += 1;
        } catch {
          remaining.push(item);
        }
      }

      await saveQueue(remaining);
      return { flushed, remaining };
    } catch (e) {
      return rejectWithValue(
        getApiErrorMessage(e, 'Failed to flush queued locations'),
      );
    }
  },
);

export const loadQueuedLocationsThunk = createAsyncThunk(
  'driver/loadQueuedLocations',
  async () => {
    const q = await loadQueue();
    return { queuedLocations: q };
  },
);

export const dashboardThunk = createAsyncThunk(
  'driver/dashboard',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const driverId = state.auth.driver?.id;
      if (!driverId)
        return rejectWithValue('Missing driver id. Please login again.');
      const data = await DriverApi.dashboard(driverId);
      return data.data;
    } catch (e) {
      return rejectWithValue(
        getApiErrorMessage(e, 'Failed to fetch dashboard'),
      );
    }
  },
);

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setOnlineLocal: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(setOnlineThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(setOnlineThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isOnline = !!action.payload.isOnline;
      })
      .addCase(setOnlineThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string) || action.error.message || null;
      })
      .addCase(updateLocationThunk.fulfilled, (state, action) => {
        state.lastLocation = {
          lat: action.payload.lat,
          lng: action.payload.lng,
        };

        // ✅ if it queued, save queue in redux
        if (
          action.payload.queued &&
          Array.isArray(action.payload.queuedLocations)
        ) {
          state.queuedLocations = action.payload.queuedLocations;
        }
      })
      .addCase(loadQueuedLocationsThunk.fulfilled, (state, action) => {
        state.queuedLocations = action.payload.queuedLocations;
      })
      .addCase(flushQueuedLocationsThunk.fulfilled, (state, action) => {
        state.queuedLocations = action.payload.remaining;
      })
      .addCase(dashboardThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(dashboardThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dashboard = action.payload;
      })
      .addCase(dashboardThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string) || action.error.message || null;
      });
  },
});

export const { setOnlineLocal } = driverSlice.actions;
export default driverSlice.reducer;
