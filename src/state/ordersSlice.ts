import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoundingBox, EventOrder, OrderReport, OrderStats, OrderStatus } from '../models/models';
import backendService from '../services/backendService';
import { Asset } from '../models/models';

const prefix = 'orders';

const initialState = {
  isLoading: false,
  isStatsLoading: false,
  ordersStats: Object.keys(OrderStatus).map(it => {
    return { type: it, count: -1 } as OrderStats;
  }),
  orderDetails: null as EventOrder | null,
  boxes: [] as BoundingBox[][],
  orders: [] as EventOrder[],
  savingOrder: false,
  selectedAsset: null as Asset | null,
  selectedPlacement: null as string | null,
  errorSavingOrder: false,
  report: null as OrderReport | null
};

export const fetchReport = createAsyncThunk(`${prefix}/fetchReport`, async (id: string) => {
  return backendService.loadReport(id);
});

export const generateReport = createAsyncThunk(`${prefix}/generateReport`, async (id: string) => {
  return backendService.generateReport(id);
});

export const loadOrdersStats = createAsyncThunk(`${prefix}/stats`, async () => {
  return backendService.loadOrdersStats();
});

export const loadOrders = createAsyncThunk(`${prefix}/orders`, async (status: OrderStatus) => {
  return backendService.loadOrders(status);
});

export const fetchOrderDetails = createAsyncThunk(`${prefix}/fetchDetails`, async (id: string) => {
  return backendService.loadOrdersDetails(id);
});

export const createOrder = createAsyncThunk(`${prefix}/create`, async (o: EventOrder) => {
  return backendService.createOrder(o);
});

export const ordersSlice = createSlice({
  name: prefix,
  initialState,
  reducers: {
    setSelectedAsset(state, action: PayloadAction<Asset>) {
      state.selectedAsset = action.payload;
    },
    setSelectedPlacement(state, action: PayloadAction<string>) {
      state.selectedPlacement = action.payload;
    },
    resetOrderSave(state) {
      state.savingOrder = false;
      state.selectedAsset = null;
      state.selectedPlacement = null;
      state.errorSavingOrder = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchReport.pending, state => {
        state.report = null;
      })
      .addCase(fetchReport.fulfilled, (state, { payload }) => {
        state.report = payload.report;
        state.boxes = payload.boxes;
      })
      .addCase(loadOrders.pending, (state, { payload }) => {
        state.isLoading = true;
        state.orders = [];
      })
      .addCase(loadOrders.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.orders = payload;
      })
      .addCase(loadOrdersStats.fulfilled, (state, { payload }) => {
        state.ordersStats = payload;
        state.isStatsLoading = false;
      })
      .addCase(loadOrdersStats.pending, state => {
        state.isStatsLoading = true;
      })
      .addCase(createOrder.pending, state => {
        state.savingOrder = true;
        state.errorSavingOrder = false;
      })
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.savingOrder = false;
        state.errorSavingOrder = false;
      })
      .addCase(createOrder.rejected, state => {
        state.savingOrder = false;
        state.errorSavingOrder = true;
      })
      .addCase(fetchOrderDetails.pending, state => {
        state.report = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, { payload }) => {
        state.orderDetails = payload;
      });
  }
});

export default ordersSlice.reducer;

export const { setSelectedAsset, setSelectedPlacement, resetOrderSave } = ordersSlice.actions;

export const ordersSelector = (state: any) => state.orders;
