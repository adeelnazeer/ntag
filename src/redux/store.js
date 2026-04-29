// src/redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import userReducer from './userSlice';
import queryReducer from './querySlice';
import authReducer from './authSlice';

// In mini-program WebView environments, localStorage is proxied through the
// native JS bridge. If the bridge's onInvokeFinished callback is undefined, it
// crashes. We use a safe adapter that falls back to in-memory storage.
const memoryStore = {};
const safeStorage = {
  getItem: (key) =>
    new Promise((resolve) => {
      try {
        resolve(localStorage.getItem(key));
      } catch {
        resolve(memoryStore[key] ?? null);
      }
    }),
  setItem: (key, value) =>
    new Promise((resolve) => {
      try {
        localStorage.setItem(key, value);
      } catch {
        memoryStore[key] = value;
      }
      resolve();
    }),
  removeItem: (key) =>
    new Promise((resolve) => {
      try {
        localStorage.removeItem(key);
      } catch {
        delete memoryStore[key];
      }
      resolve();
    }),
};

const persistConfig = {
  key: 'root',
  storage: safeStorage,
  whitelist: ['user', 'query'], // We don't persist auth data for security
};

const rootReducer = combineReducers({
  user: userReducer,
  query: queryReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);