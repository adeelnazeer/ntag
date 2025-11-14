// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  otpId: null,
  // Add other auth-related state as needed
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setOtpId: (state, action) => {
      state.otpId = action.payload;
    },
    clearOtpId: (state) => {
      state.otpId = null;
    },
    // Add other auth-related actions as needed
  }
});

export const { setOtpId, clearOtpId } = authSlice.actions;
export default authSlice.reducer;