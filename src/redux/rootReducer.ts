import { combineReducers } from '@reduxjs/toolkit';

import user from '../redux/userSlice/userSlice';
import auth from '../redux/authSlice/authSlice';
import driver from '../redux/driverSlice/driverSlice';
import orders from '../redux/ordersSlice/ordersSlice';
const rootReducer = combineReducers({
  user,
  auth,
  driver,
  orders,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
