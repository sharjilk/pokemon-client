import { PokemonSliceProp, PokemonState } from "@/type/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: PokemonState = {
  pokemons: [],
  totalPokemons: 0,
  loading: false,
};

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    setPokemons(state, action: PayloadAction<PokemonSliceProp[]>) {
      state.pokemons = action.payload;
    },
    setTotalPokemons(state, action: PayloadAction<number>) {
      state.totalPokemons = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setPokemons, setTotalPokemons, setLoading } =
  pokemonSlice.actions;

export default pokemonSlice.reducer;
