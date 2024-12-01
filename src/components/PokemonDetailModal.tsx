import { useEffect, useState } from "react";
import { EyeIcon } from "@heroicons/react/16/solid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import StatsBar from "@/components/StatsBar";
import { DamageRelations } from "@/type/types";

/**
 * The PokemonDetailModal component is responsible for displaying detailed
 * information about a specific Pokemon, including its stats, type advantages,
 * and weaknesses.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {number} props.id - The ID of the Pokemon to display.
 * @param {boolean} props.showFavorite - A flag indicating if the Pokemon is from the favorites list.
 * @returns {JSX.Element} The rendered modal with Pokemon details.
 */
const PokemonDetailModal = ({
  id,
  showFavorite,
}: {
  id: number;
  showFavorite: boolean;
}) => {
  const [damageRelations, setDamageRelations] =
    useState<DamageRelations | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  let spriteUrl: string = "";

  const pokemonList = useAppSelector((state) => state.pokemon.pokemons);
  const favorites = useAppSelector((state) => state.favorites.pokemonDetails);

  const pokemon = showFavorite
    ? favorites.find((pokemon) => pokemon.id === id)
    : pokemonList.find((pokemon) => pokemon.id === id);

  /**
   * Fetch damage relations of the Pokemon's type
   */
  useEffect(() => {
    const fetchTypeDetails = async () => {
      if (!pokemon) return;
      try {
        setLoading(true);
        const response = await axios.get(
          `https://pokeapi.co/api/v2/type/${pokemon.types[0]}`
        );
        setDamageRelations(response.data.damage_relations);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching type details:", err);
        setError("Failed to load type details.");
        setLoading(false);
      }
    };

    fetchTypeDetails();
  }, [pokemon]);

  /**
   * Determine image URL based on availability
   */
  if (pokemon && "sprites" in pokemon) {
    if (typeof pokemon.sprites === "object" && "other" in pokemon.sprites) {
      spriteUrl = showFavorite
        ? pokemon.sprites.other.dream_world.front_default
        : pokemon.sprites.other.dream_world.front_default;
    } else {
      spriteUrl = pokemon.sprites;
    }
  }

  const pokemonStat = pokemon?.stats.map(
    (stat: {
      base_stat?: number;
      stat?: { name: string };
      name?: string;
      value?: number;
    }) => (
      <StatsBar
        key={stat.stat?.name || stat.name}
        statName={stat.stat?.name ?? stat.name ?? "Unknown"}
        statValue={stat.base_stat || stat.value || 0}
      />
    )
  );

  if (loading) return <p></p>;
  if (error) return <p>{error}</p>;

  if (!pokemon) {
    return <div className="text-white">Pokémon not found!</div>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="text-center mt-4">
          {
            <button className=" text-white text-sm rounded-full border border-white px-4 py-1">
              <EyeIcon className="w-6 h-6 inline-block" />{" "}
              <span>More Info</span>
            </button>
          }
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl h-screen md:h-[90vh] bg-gray-800 text-white rounded-none overflow-x-auto">
        <DialogHeader>
          <DialogTitle className="font-bold tracking-wide uppercase text-3xl">
            {pokemon.name}
          </DialogTitle>
          <DialogDescription className="text-white">
            <span className="flex flex-col md:flex-row gap-4 tracking-wide">
              <span className="block">
                <span className="text-white">Type: </span>
                <span className="capitalize">
                  {pokemon.types.map((type) => type).join(", ")}
                </span>
              </span>
              <span className="">Height: {pokemon.height / 10}m</span>
              <span className="">Weight: {pokemon.weight / 10}kg</span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <div>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <picture className="md:w-2/5">
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
                alt={pokemon.name}
                className="w-full max-w-md mx-auto h-48 md:h-64 lg:h-80 rounded-md hover:scale-105 transition-transform duration-300 ease-in-out"
                loading="lazy"
              />
            </picture>

            <div className="bg-gray-700 text-white p-4 rounded-lg md:w-3/5">
              <h2 className="text-2xl font-bold capitalize mb-4">
                Strengths & Weaknesses
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="capitalize">
                  <h3 className="font-semibold">Double Damage To:</h3>
                  {damageRelations?.double_damage_to.map((type) => (
                    <span
                      className="text-white bg-fuchsia-900 px-2 mr-2 py-1 uppercase text-xs font-semibold leading-4 inline-block rounded-full"
                      key={type.name}
                    >
                      {type.name}
                    </span>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold">Double Damage From:</h3>
                  {damageRelations?.double_damage_from.map((type) => (
                    <span
                      className="text-white bg-fuchsia-900 px-2 mr-2 py-1 uppercase text-xs font-semibold leading-4 inline-block rounded-full"
                      key={type.name}
                    >
                      {type.name}
                    </span>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold">Half Damage To:</h3>
                  {damageRelations?.half_damage_to.map((type) => (
                    <span
                      className="text-white bg-fuchsia-900 px-2 mr-2 py-1 uppercase text-xs font-semibold leading-4 inline-block rounded-full"
                      key={type.name}
                    >
                      {type.name}
                    </span>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold">Half Damage From:</h3>
                  {damageRelations?.half_damage_from.map((type) => (
                    <span
                      className="text-white bg-fuchsia-900 px-2 mr-2 py-1 uppercase text-xs font-semibold leading-4 inline-block rounded-full"
                      key={type.name}
                    >
                      {type.name}
                    </span>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold">No Damage To:</h3>
                  <ul>
                    {damageRelations?.no_damage_to.map((type) => (
                      <span
                        className="text-white bg-fuchsia-900 px-2 mr-2 py-1 uppercase text-xs font-semibold leading-4 inline-block rounded-full"
                        key={type.name}
                      >
                        {type.name}
                      </span>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold">No Damage From:</h3>
                  <ul>
                    {damageRelations?.no_damage_from.map((type) => (
                      <span
                        className="text-white bg-fuchsia-900 px-2 mr-2 py-1 uppercase text-xs font-semibold leading-4 inline-block rounded-full"
                        key={type.name}
                      >
                        {type.name}
                      </span>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-lg font-bold mb-2">Stats:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pokemonStat}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PokemonDetailModal;
