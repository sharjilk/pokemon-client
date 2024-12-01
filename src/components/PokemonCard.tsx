import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { BookmarkIcon, HeartIcon } from "@heroicons/react/16/solid";
import PokemonDetailModal from "@/components/PokemonDetailModal";
import { removeFavoriteAsync, addFavoriteAsync } from "@/store/favoritesSlice";
import { PokemonCardProps } from "@/type/types";
import { useToast } from "@/hooks/use-toast";

/**
 * The PokemonCard component displays a single Pokémon's details, including
 * its name, types, image, and a button to add/remove it from favorites.
 * It is memoized to avoid unnecessary re-renders.
 * @component
 */
const PokemonCard = ({
  id,
  showFavorite = false,
}: {
  id: number;
  showFavorite?: boolean;
}) => {
  let spriteUrl: string = "";
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const pokemons = useAppSelector((state) => state.pokemon.pokemons);
  const favorites = useAppSelector((state) => state.favorites.pokemonDetails);

  const selectedPokemon = showFavorite
    ? favorites.find((pokemon) => pokemon.id === id)
    : pokemons.find((pokemon) => pokemon.id === id);

  const isFavorite = favorites.some(
    (pokemon) => pokemon.id === selectedPokemon?.id
  );

  const handleFavoriteToggle = useCallback(() => {
    if (isFavorite && selectedPokemon) {
      dispatch(removeFavoriteAsync(selectedPokemon?.id));
      toast({
        className: "bg-yellow-900 text-white capitalize tracking-wider",
        description: `${selectedPokemon?.name} removed from the Favorite list!`,
      });
    } else {
      dispatch(addFavoriteAsync(selectedPokemon as PokemonCardProps));
      toast({
        className: "bg-emerald-900 text-white capitalize tracking-wider",
        description: `${selectedPokemon?.name} added to Favorite list!`,
      });
    }
  }, [dispatch, isFavorite, selectedPokemon, toast]);

  if (!selectedPokemon) {
    return <div className="text-white">Pokémon not found!</div>;
  }

  if ("sprites" in selectedPokemon) {
    if (
      typeof selectedPokemon.sprites === "object" &&
      "other" in selectedPokemon.sprites
    ) {
      spriteUrl = showFavorite
        ? selectedPokemon.sprites.other.dream_world.front_default
        : selectedPokemon.sprites.other.dream_world.front_default;
    } else {
      spriteUrl = selectedPokemon.sprites;
    }
  }

  return (
    <div
      key={selectedPokemon.name}
      className="card bg-gray-700 rounded-lg shadow-lg p-4 relative overflow-hidden"
    >
      {isFavorite && (
        <span className="absolute -top-1 right-4">
          <BookmarkIcon className="h-8 w-8 text-orange-600" />
        </span>
      )}
      <h2 className="block text-2xl capitalize text-white">
        {selectedPokemon.name}
      </h2>
      <div className="flex flex-wrap justify-between text-white text-xs">
        <div>
          <span className="mr-2">Type:</span>
          <span className="text-white mr-1 inline-block capitalize">
            {selectedPokemon.types
              .map((type) => (typeof type === "string" ? type : type.type.name))
              .join(", ")}
          </span>
        </div>
      </div>

      <picture>
        <source
          srcSet={spriteUrl}
          media="(min-width: 1024px)"
          type="image/svg+xml"
        />
        <source
          srcSet={spriteUrl}
          media="(min-width: 768px)"
          type="image/svg+xml"
        />
        <img
          src={spriteUrl}
          alt={selectedPokemon.name}
          className="w-2/3 max-w-md mx-auto h-48 md:h-64 lg:h-80 rounded-md hover:scale-105 transition-transform duration-300 ease-in-out"
          loading="lazy"
        />
      </picture>

      <div>
        <PokemonDetailModal
          id={selectedPokemon.id}
          showFavorite={showFavorite}
        />

        <div className="text-center mt-4">
          <button
            className={`text-sm rounded-full border px-4 py-1 ${
              isFavorite
                ? "bg-white text-black border-black"
                : "bg-transparent text-white border-white"
            }`}
            onClick={handleFavoriteToggle}
          >
            <HeartIcon className="w-6 h-6 inline-block" />{" "}
            <span>
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
