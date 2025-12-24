import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OrderTypeRef = 'DELIVERY' | 'TAKEAWAY';

interface OrderTypeState {
  value: OrderTypeRef;
}

const initialState: OrderTypeState = {
  value: 'DELIVERY', // default
};

const orderTypeSlice = createSlice({
  name: 'orderType',
  initialState,
  reducers: {
    setOrderType(state, action: PayloadAction<OrderTypeRef>) {
      state.value = action.payload;
    },
  },
});

export const { setOrderType } = orderTypeSlice.actions;
export default orderTypeSlice.reducer;
