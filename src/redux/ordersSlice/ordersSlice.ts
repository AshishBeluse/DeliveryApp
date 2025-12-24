import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DriverApi } from '../../services/driverApi';
import { getApiErrorMessage } from '../../services/http';

export type Order = any;

export type OrdersState = {
  polling: { running: boolean; intervalMs: number };

  pending: Order[];
  activeOrder: Order | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

let pollingTimer: ReturnType<typeof setInterval> | null = null;

const initialState: OrdersState = {
  pending: [],
  activeOrder: null,
  status: 'idle',
  error: null,
  polling: { running: false, intervalMs: 10000 },
};

const normalizeOrder = (o: any) => {
  if (!o) return null;
  return {
    ...o,
    id: o.id ?? o.orderId,
    items: Array.isArray(o.items) ? o.items : [],
    restaurant:
      o.restaurant && typeof o.restaurant === 'object'
        ? o.restaurant
        : { name: o.restaurantName ?? 'Restaurant' },
    totalAmount: Number(o.totalAmount ?? o.totalCost ?? o.subtotal ?? 0),
    deliveryAddress:
      o.deliveryAddress ?? o.address?.full ?? o.delivery?.address ?? null,
  };
};

export const transformOrder = (order: any) => {
  return {
    id: order.id,
    restaurantName: order.restaurant?.name ?? 'Restaurant',
    items: order.items ?? [],
    totalAmount: Number(order.totalAmount ?? 0),
    deliveryAddress:
      order.deliveryAddress ?? order.address?.full ?? 'Address not available',
  };
};

export const fetchPendingOrdersThunk = createAsyncThunk(
  'orders/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const data = await DriverApi.pendingOrders();
      return data.orders ?? [];
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e, 'Failed to fetch orders'));
    }
  },
);

export const acceptOrderThunk = createAsyncThunk(
  'orders/accept',
  async (payload: { orderId: number }, { rejectWithValue }) => {
    try {
      const data = await DriverApi.acceptOrder(payload.orderId);
      // backend returns { success, message, order }
      return data.order ?? null;
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e, 'Failed to accept order'));
    }
  },
);

export const updateStatusThunk = createAsyncThunk(
  'orders/updateStatus',
  async (
    payload: {
      orderId: number;
      status: 'picked_up' | 'on_the_way' | 'delivered' | string;
    },
    { rejectWithValue },
  ) => {
    try {
      const data = await DriverApi.updateStatus(
        payload.orderId,
        payload.status,
      );
      return { ...payload, response: data };
    } catch (e) {
      return rejectWithValue(
        getApiErrorMessage(e, 'Failed to update order status'),
      );
    }
  },
);

export const startOrdersPollingThunk = createAsyncThunk(
  'orders/startPolling',
  async (payload: { intervalMs?: number } | undefined, { dispatch }) => {
    const intervalMs = payload?.intervalMs ?? 10000;

    if (pollingTimer) return { running: true, intervalMs };

    // initial fetch right away
    dispatch(fetchPendingOrdersThunk());

    pollingTimer = setInterval(() => {
      dispatch(fetchPendingOrdersThunk());
    }, intervalMs);

    return { running: true, intervalMs };
  },
);

export const stopOrdersPollingThunk = createAsyncThunk(
  'orders/stopPolling',
  async () => {
    if (pollingTimer) clearInterval(pollingTimer);
    pollingTimer = null;
    return { running: false };
  },
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrdersError: state => {
      state.error = null;
    },
    setActiveOrder: (state, action: PayloadAction<Order | null>) => {
      state.activeOrder = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(startOrdersPollingThunk.fulfilled, (state, action) => {
        state.polling.running = action.payload.running;
        state.polling.intervalMs = action.payload.intervalMs;
      })
      .addCase(stopOrdersPollingThunk.fulfilled, state => {
        state.polling.running = false;
      })
      .addCase(fetchPendingOrdersThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPendingOrdersThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pending = action.payload;
      })
      .addCase(fetchPendingOrdersThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string) || action.error.message || null;
      })
      .addCase(acceptOrderThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(acceptOrderThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.activeOrder = normalizeOrder(action.payload);

        if (state.activeOrder?.id) {
          state.pending = state.pending.filter(
            o => o?.id !== state.activeOrder?.id,
          );
        }
      })

      .addCase(acceptOrderThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string) || action.error.message || null;
      })

      .addCase(updateStatusThunk.fulfilled, (state, action) => {
        if (state.activeOrder?.id === action.payload.orderId) {
          if (action.payload.status === 'delivered') {
            state.activeOrder = null;
          } else {
            state.activeOrder = {
              ...state.activeOrder,
              status: action.payload.status,
            };
          }
        }
      });
  },
});

export const { clearOrdersError, setActiveOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
