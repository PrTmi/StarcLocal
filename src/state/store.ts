import { configureStore } from '@reduxjs/toolkit';
import assetsReducer from './assetsSlice';
import userReducer from './userSlice';
import ordersReducer from './ordersSlice';
import eventsReducer from './eventsSlice';
import clientsReducer from './clientsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    assets: assetsReducer,
    orders: ordersReducer,
    events: eventsReducer,
    clients: clientsReducer
  }
});
