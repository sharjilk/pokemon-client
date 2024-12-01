import { useEffect } from "react";
import axios from "axios";
import PokemonCard from "@/components/PokemonCard";
import SkeletonPokemonCard from "@/components/SkeletonPokemonCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setFavorites,
  setLoading,
  setFavoriteDetails,
} from "@/store/favoritesSlice";

/**
 * The FavoritePokemons component fetches, displays, and manages the list of favorite Pokémon.
 * It displays either a loading skeleton or a grid of favorite Pokémon cards, depending on the loading state.
 * @component
 */
const FavoritePokemons = () => {
  const dispatch = useAppDispatch();

  const favorites = useAppSelector((state) => state.favorites.pokemonDetails);
  const favoriteIds = useAppSelector((state) => state.favorites.pokemonIds);
  const loading = useAppSelector((state) => state.favorites.loading);

  /**
   * Fetches the list of favorite Pokémon IDs from the API and stores them in Redux.
   * @async
   * @function loadFavoriteIds
   */
  useEffect(() => {
    const loadFavoriteIds = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get("http://localhost:4000/api/favorites");
        dispatch(setFavorites(response.data));
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error loading favorite Pokémon IDs:", error);
        dispatch(setLoading(false));
      }
    };

    loadFavoriteIds();
  }, [dispatch]);

  /**
   * Fetches detailed information about the favorite Pokémon using their IDs.
   * This is triggered when the list of favorite IDs changes.
   * @async
   * @function fetchFavoriteDetails
   */
  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      try {
        dispatch(setLoading(true));
        const favoritePromises = favoriteIds.map((id: number) =>
          axios
            .get(`http://localhost:4000/api/pokemon/${id}`)
            .then((res) => res.data)
        );
        const favoriteData = await Promise.all(favoritePromises);

        dispatch(setFavoriteDetails(favoriteData));
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching favorite Pokémon details:", error);
        dispatch(setLoading(false));
      }
    };

    if (favoriteIds.length > 0) fetchFavoriteDetails();
  }, [favoriteIds, dispatch]);

  return (
    <div className="bg-gray-800">
      <div className="mx-auto max-w-7xl p-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Favorite Pokémon
        </h1>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 16 }).map((_, index) => (
              <SkeletonPokemonCard key={index} />
            ))}
          </div>
        ) : favorites.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((pokemon) => (
              <PokemonCard
                showFavorite={true}
                key={pokemon.id}
                id={pokemon.id}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-white text-lg">
            No favorites added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default FavoritePokemons;
