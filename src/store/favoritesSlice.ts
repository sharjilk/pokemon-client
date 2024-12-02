import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { PokemonCardProps } from "@/type/types";

interface FavoritesState {
  pokemonIds: number[];
  pokemonDetails: PokemonCardProps[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  pokemonIds: [],
  pokemonDetails: [],
  loading: false,
  error: null,
};

export const addFavoriteAsync = createAsyncThunk<
  PokemonCardProps,
  PokemonCardProps
>(
  "favorites/addFavoriteAsync",
  async (pokemon: PokemonCardProps, { rejectWithValue }) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}api/favorites`, {
        id: pokemon.id,
      });
      return pokemon;
    } catch (error) {
      console.error("Error adding favorite:", error);
      return rejectWithValue(error || "An error occurred");
    }
  }
);

export const removeFavoriteAsync = createAsyncThunk<number[], number>(
  "favorites/removeFavoriteAsync",
  async (pokemonId: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}api/favorites/${pokemonId}`
      );
      return response.data as number[];
    } catch (error) {
      console.error("Error removing favorite:", error);
      return rejectWithValue(error || "An error occurred");
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavorites(state, action: PayloadAction<number[]>) {
      state.pokemonIds = action.payload;
    },
    setFavoriteDetails(state, action: PayloadAction<PokemonCardProps[]>) {
      state.pokemonDetails = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addFavoriteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavoriteAsync.fulfilled, (state, action) => {
        const newPokemon = action.payload;
        if (!state.pokemonIds.includes(newPokemon.id)) {
          state.pokemonIds.push(newPokemon.id);
          state.pokemonDetails.push(newPokemon);
        }
        state.loading = false;
      })
      .addCase(addFavoriteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeFavoriteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavoriteAsync.fulfilled, (state, action) => {
        const remainingIds = action.payload;
        state.pokemonIds = remainingIds;
        state.pokemonDetails = state.pokemonDetails.filter((pokemon) =>
          remainingIds.includes(pokemon.id)
        );
        state.loading = false;
      })
      .addCase(removeFavoriteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFavorites, setFavoriteDetails, setLoading } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
