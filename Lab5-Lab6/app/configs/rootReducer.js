import counterSlice from './counterSlice';
import imagesSlice from './imageSlice';
import { combineReducers } from 'redux';
import { pokemonApi } from './pokemonAPI';
import { authApi } from './authAPI';

// Combine reducers
const rootReducer = combineReducers({
  counter: counterSlice.reducer,
  images: imagesSlice.reducer,
  [pokemonApi.reducerPath]: pokemonApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
});

export default rootReducer;
