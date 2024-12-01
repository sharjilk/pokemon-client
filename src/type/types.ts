export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      dream_world: {
        front_default: string;
      };
    };
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  types: {
    type: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
  }[];
  base_experience: number;
  url: string;
}

export interface PokemonCardProps {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      dream_world: {
        front_default: string;
      };
    };
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  types: { type: { name: string } }[];
  abilities: { ability: { name: string; url: string } }[];
  base_experience: number;
  url: string;
}

export interface SimplifiedPokemon {
  id: number;
  name: string;
  sprites: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  stats: { name: string; value: number }[];
}

export interface DamageRelations {
  double_damage_to: { name: string }[];
  double_damage_from: { name: string }[];
  half_damage_to: { name: string }[];
  half_damage_from: { name: string }[];
  no_damage_to: { name: string }[];
  no_damage_from: { name: string }[];
}

export interface LayoutProps {
  children: React.ReactNode;
}

export interface PokemonSliceProp {
  id: number;
  name: string;
  sprites: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  stats: { name: string; value: number }[];
}

export interface PokemonState {
  pokemons: PokemonSliceProp[];
  totalPokemons: number;
  loading: boolean;
}
