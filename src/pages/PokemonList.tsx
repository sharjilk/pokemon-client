import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import PokemonCard from "@/components/PokemonCard";
import SkeletonPokemonCard from "@/components/SkeletonPokemonCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setPokemons,
  setTotalPokemons,
  setLoading,
} from "@/store/pokemonSlice";
import { Pokemon, SimplifiedPokemon } from "@/type/types";

/**
 * The PokemonList component fetches, displays, and paginates a list of Pokémon.
 * It allows users to view details for each Pokémon and navigate between pages.
 * @component
 */
const PokemonList = () => {
  const [totalPages, setTotalPages] = useState(0);

  const dispatch = useAppDispatch();
  const pokemons = useAppSelector((state) => state.pokemon.pokemons);
  const loading = useAppSelector((state) => state.pokemon.loading);
  const totalPokemons = useAppSelector((state) => state.pokemon.totalPokemons);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);

  /**
   * Fetches Pokémon data based on the current page and updates Redux store.
   * Uses pagination to display a subset of the Pokémon list.
   * @async
   * @function fetchPokemons
   */
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        dispatch(setLoading(true));
        const limit = 50;
        const offset = (currentPage - 1) * limit;
        const response = await axios.get(
          `http://localhost:4000/api/pokemon?limit=${limit}&offset=${offset}`
        );

        const PokemonData = response.data.results.map(async (item: Pokemon) => {
          const res = await axios.get(item.url);
          const data = res.data;
          return {
            id: data.id,
            name: data.name,
            sprites: data.sprites.other.dream_world.front_default || "",
            types: data.types.map(
              (type: { type: { name: string } }) => type.type.name
            ),
            height: data.height,
            weight: data.weight,
            stats: data.stats.map(
              (stat: { base_stat: number; stat: { name: string } }) => ({
                name: stat.stat.name,
                value: stat.base_stat,
              })
            ),
            abilities: data.abilities.map(
              (ability: { ability: { name: string } }) => ability.ability.name
            ),
          } as SimplifiedPokemon;
        });

        const responseData = await Promise.all(PokemonData);

        setTotalPages(Math.ceil(response.data.count / limit));
        dispatch(setPokemons(responseData));
        dispatch(setTotalPokemons(response.data.count));
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        dispatch(setLoading(false));
      }
    };

    fetchPokemons();
  }, [currentPage, dispatch]);

  /**
   * Handles the page navigation, updating the current page parameter.
   * @param {number} page - The target page number.
   */
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPokemons / 50) {
      dispatch(setLoading(true));
      setSearchParams({ page: page.toString() });
    }
  };

  return (
    <div className="bg-gray-800">
      <div className="mx-auto max-w-7xl justify-between p-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between py-10">
          <h1 className="text-3xl font-bold text-center text-white">
            Browse all {totalPokemons} Pokémon
          </h1>
          <div className="flex items-center mt-4 md:mt-0 text-center text-white">
            <button
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 disabled:ring-gray-600 disabled:pointer-events-none hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="size-5" />
            </button>

            <span className="mx-4">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="size-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 16 }).map((_, index) => (
                <SkeletonPokemonCard key={index} />
              ))
            : pokemons.map((pokemon) => (
                <PokemonCard key={pokemon.id} id={pokemon.id} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonList;
