import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import backendService from '../services/backendService';
import { Event, EventOrder } from '../models/models';

const prefix = 'events';

const initialState = {
  isLoading: false,
  events: [] as Event[],
  eventOrders: [] as EventOrder[],
  eventDetails: null as Event | null,
  isLoadingOrders: false
};

export const fetchEventsByQuery = createAsyncThunk(`${prefix}/fetchByQuery`, async query => {
  return await backendService.loadEvents(query);
});

export const fetchEventDetails = createAsyncThunk(`${prefix}/fetchDetails`, async (id: string) => {
  return await backendService.loadEventDetails(id);
});

export const fetchEventOrders = createAsyncThunk(`${prefix}/fetchOrders`, async (id: string) => {
  return await backendService.loadEventOrders(id);
});

export const syncEventOrders = createAsyncThunk('eventDetails/sync', async (id: string) => {
  return await backendService.syncEventOrders(id);
});

export const eventsSlice = createSlice({
  name: prefix,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchEventsByQuery.pending, state => {
        state.eventDetails = null;
        state.isLoading = true;
      })
      .addCase(fetchEventsByQuery.fulfilled, (state, action) => {
        state.events = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchEventDetails.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchEventDetails.fulfilled, (state, action) => {
        state.eventDetails = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchEventOrders.pending, (state, action) => {
        state.isLoadingOrders = true;
      })
      .addCase(fetchEventOrders.fulfilled, (state, action) => {
        state.eventOrders = action.payload;
        state.isLoadingOrders = false;
      })
      .addCase(syncEventOrders.fulfilled, (state, action) => {
        state.eventDetails = Object.assign({}, state.eventDetails, { isOrdersAssetSynchronizing: true });
      });
  }
});

export default eventsSlice.reducer;

export const eventsSelector = (state: any) => state.events;
