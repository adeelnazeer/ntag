// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: null,
  corporateDocuments: [],
  customerId: null,
  phoneNumber: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      
      // Also set these fields if they exist in the payload
      if (action.payload?.customer_account_id) {
        state.customerId = action.payload.customer_account_id;
      }
      
      if (action.payload?.phone_number) {
        state.phoneNumber = action.payload.phone_number;
      }
    },
    setCorporateDocuments: (state, action) => {
      state.corporateDocuments = action.payload;
    },
    setCustomerId: (state, action) => {
      state.customerId = action.payload;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
      state.corporateDocuments = [];
      state.customerId = null;
      state.phoneNumber = null;
    }
  }
});

export const { 
  setUserData, 
  setCorporateDocuments, 
  setCustomerId,
  setPhoneNumber,
  clearUserData 
} = userSlice.actions;

export default userSlice.reducer;