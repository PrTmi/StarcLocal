import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import backendService from '../services/backendService';
import { Asset, AssetDetails, AssetStatus, AssetToSave } from '../models/models';

const initialState = {
  isLoading: false,
  assetDetails: null as AssetDetails | null,
  savingAsset: false,
  savingAssetDone: false,
  assets: [] as Asset[]
};

export const fetchAssetsByQuery = createAsyncThunk('assets/fetchByQuery', async (clientId: string | number | null) => {
  return await backendService.loadAssets(clientId);
});

export const saveAsset = createAsyncThunk('assets/save', async ({ id, name, image, clientId }: AssetToSave) => {
  return await backendService.saveAsset(id, name, image, clientId);
});

export const fetchAssetDetails = createAsyncThunk('assets/fetchDetails', async ({ assetId, clientId }: any) => {
  if (assetId === 'new') {
    return {
      id: null,
      status: AssetStatus.ready_for_augmentation,
      name: '',
      fileName: null,
      description: '',
      clientId: clientId
    } as AssetDetails;
  } else {
    return await backendService.loadAssetDetails(assetId);
  }
});

export const archiveAsset = createAsyncThunk('assets/archive', async (id: string) => {
  await backendService.archiveAsset(id);
});

export const unArchiveAsset = createAsyncThunk('assets/unArchive', async (id: string) => {
  await backendService.unArchiveAsset(id);
});

export const augmentAsset = createAsyncThunk('assets/augment', async (id: string) => {
  await backendService.augmentAsset(id);
});

export const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(saveAsset.pending, state => {
        state.savingAssetDone = false;
        state.savingAsset = true;
      })
      .addCase(saveAsset.fulfilled, (state, action) => {
        state.savingAsset = false;
        state.savingAssetDone = true;
      })
      .addCase(saveAsset.rejected, (state, action) => {
        state.savingAsset = false;
      })
      .addCase(fetchAssetsByQuery.pending, state => {
        state.assets = [];
        state.isLoading = true;
        state.savingAssetDone = false;
      })
      .addCase(fetchAssetsByQuery.fulfilled, (state, action) => {
        state.assets = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAssetDetails.pending, state => {
        state.savingAssetDone = false;
        state.isLoading = true;
      })
      .addCase(fetchAssetDetails.fulfilled, (state, action) => {
        state.assetDetails = action.payload;
        state.isLoading = false;
      });
  }
});

export default assetsSlice.reducer;

export const assetsSelector = (state: any) => state.assets;
