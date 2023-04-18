import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import loginService from '../services/loginService';
import { LoginRequest, ResetPasswordRequest, UserInformation } from '../models/models';
import authService from '../services/authService';
import backendService from '../services/backendService';

const initialState = {
  userInfo: null as UserInformation | null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: ''
};

export const loginUser = createAsyncThunk('user/login', async ({ username, password }: LoginRequest) => {
  const response = await loginService.login(username, password);
  authService.setToken(response.token!!);
  return response;
});

export const resetPassword = createAsyncThunk('user/resetPassword', async ({ username }: ResetPasswordRequest) => {
  return await loginService.resetPassword(username);
});

export const loadUserInfo = createAsyncThunk('user/loadInfo', async () => {
  return await backendService.loadUserInfo();
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearState: () => initialState
  },
  extraReducers: builder => {
    builder
      .addCase(loadUserInfo.fulfilled, (state, { payload }) => {
        state.userInfo = payload;
      })
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(loginUser.rejected, (state, { error }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = error.message!!;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(resetPassword.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(resetPassword.rejected, (state, { error }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = error.message!!;
      })
      .addCase(resetPassword.fulfilled, state => {
        state.isLoading = false;
        state.isSuccess = true;
      });
  }
});

export const { clearState } = userSlice.actions;

export default userSlice.reducer;

export const userSelector = (state: any) => state.user;
