// src/redux/querySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  queryParams: null
};

export const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setQueryParams: (state, action) => {
      state.queryParams = action.payload;
    },
    clearQueryParams: (state) => {
      state.queryParams = null;
    }
  }
});

export const { setQueryParams, clearQueryParams } = querySlice.actions;
export default querySlice.reducer;