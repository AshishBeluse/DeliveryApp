import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Driver, DriverApi } from '../../services/driverApi';
import { getApiErrorMessage, setApiToken } from '../../services/http';
import { tokenStorage } from '../../utils/tokenStorage';

import { getFcmTokenSafe } from '../../utils/pushNotifications';

export type AuthState = {
  token: string | null;
  driver: Driver | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: AuthState = {
  token: null,
  driver: null,
  status: 'idle',
  error: null,
};

/**
 * Bootstrap token from storage (call once on app start).
 */
export const bootstrapAuthThunk = createAsyncThunk(
  'auth/bootstrap',
  async (_, { rejectWithValue }) => {
    try {
      const token = await tokenStorage.get();
      if (token) setApiToken(token);
      return { token };
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e, 'Failed to load auth'));
    }
  },
);

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: { phone: string; password: string }, { rejectWithValue }) => {
    try {
      const fcmToken = await getFcmTokenSafe();

      const data = await DriverApi.login(
        payload.phone,
        payload.password,
        fcmToken ?? undefined,
      );

      await tokenStorage.set(data.token);
      setApiToken(data.token);

      return { token: data.token, driver: data.driver };
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e, 'Login failed'));
    }
  },
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (
    payload: {
      name: string;
      email: string;
      phone: string;
      password: string;
      vehicleType: string;
      vehicleNumber: string;
      licenseNumber: string;
      licenseImage?: { uri: string; name: string; type: string };
      idProofImage?: { uri: string; name: string; type: string };
    },
    { rejectWithValue },
  ) => {
    try {
      const data = await DriverApi.register(payload);
      return data; // { message, phone, otp? }
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e, 'Register failed'));
    }
  },
);

export const verifyOtpThunk = createAsyncThunk(
  'auth/verifyOtp',
  async (payload: { phone: string; otp: string }, { rejectWithValue }) => {
    try {
      const data = await DriverApi.verifyOtp(payload.phone, payload.otp);
      await tokenStorage.set(data.token);
      setApiToken(data.token);
      return { token: data.token, driver: data.driver };
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e, 'OTP verification failed'));
    }
  },
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await tokenStorage.clear();
  setApiToken(null);
  return true;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthFromResponse: (
      state,
      action: PayloadAction<{ token: string; driver?: Driver | null }>,
    ) => {
      state.token = action.payload.token;
      state.driver = action.payload.driver ?? state.driver;
      state.error = null;
    },
    clearAuthError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(bootstrapAuthThunk.fulfilled, (state, action) => {
        state.token = action.payload.token ?? null;
      })
      .addCase(loginThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.driver = action.payload.driver;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string) || action.error.message || null;
      })
      .addCase(registerThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, state => {
        state.status = 'succeeded';
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string) || action.error.message || null;
      })
      .addCase(verifyOtpThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.driver = action.payload.driver;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string) || action.error.message || null;
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.token = null;
        state.driver = null;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { setAuthFromResponse, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
