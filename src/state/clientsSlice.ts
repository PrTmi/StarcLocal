import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import backendService from '../services/backendService';
import { ClientToSave, Client } from '../models/models';

const prefix = 'clients';

const initialState = {
  isLoading: false,
  savingClient: false,
  clientDetails: null as Client | null,
  savingClientDone: false,
  clients: [] as Client[]
};

export const fetchClientsByQuery = createAsyncThunk(`${prefix}/fetchByQuery`, async query => {
  return await backendService.loadClients(query);
});

export const saveClient = createAsyncThunk(`${prefix}/save`, async ({ id, name, contactEmail }: ClientToSave) => {
  return await backendService.saveClient(id, name, contactEmail);
});

export const archiveClient = createAsyncThunk(`${prefix}/archive`, async (id: string) => {
  await backendService.archiveClient(id);
});

export const unArchiveClient = createAsyncThunk(`${prefix}/unArchive`, async (id: string) => {
  await backendService.unArchiveClient(id);
});

export const fetchClientDetails = createAsyncThunk(`${prefix}/fetchDetails`, async (id: string) => {
  if (id === 'new') {
    return {
      id: null,
      name: '',
      contactEmail: ''
    } as Client;
  } else {
    return await backendService.loadClientDetails(id);
  }
});

export const clientsSlice = createSlice({
  name: prefix,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(saveClient.pending, state => {
        state.savingClientDone = false;
        state.savingClient = true;
      })
      .addCase(saveClient.fulfilled, (state, action) => {
        state.savingClient = false;
        state.savingClientDone = true;
      })
      .addCase(saveClient.rejected, (state, action) => {
        state.savingClient = false;
      })

      .addCase(fetchClientsByQuery.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchClientsByQuery.fulfilled, (state, action) => {
        state.clients = action.payload;
        state.isLoading = false;
        state.savingClientDone = false;
      })

      .addCase(fetchClientDetails.pending, state => {
        state.savingClientDone = false;
        state.isLoading = true;
      })
      .addCase(fetchClientDetails.fulfilled, (state, action) => {
        state.clientDetails = action.payload;
        state.isLoading = false;
      });
  }
});

export default clientsSlice.reducer;

export const clientsSelector = (state: any) => state.clients;
