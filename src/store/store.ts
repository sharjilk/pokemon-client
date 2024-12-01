import { configureStore } from "@reduxjs/toolkit";
import pokemonReducer from "@/store/pokemonSlice";
import favoritesReducer from "@/store/favoritesSlice";

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
