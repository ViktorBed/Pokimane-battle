import {create} from 'zustand';
import {DetailedPokemon, Stat} from '../Utils/type';
import {shuffleArray} from "../Utils/Shuffle";

interface PokemonStore {
    detailedPokemonData: DetailedPokemon[];
    loading: boolean;
    fetchPokemonData: () => Promise<void>;
}

const usePokemonStore = create<PokemonStore>((set) => ({
    detailedPokemonData: [],
    loading: false,
    fetchPokemonData: async () => {
        set({loading: true});
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
            const data = await response.json();
            const detailedDataPromises = data.results.map(async (pokemon: { name: string; url: string }) => {
                const res = await fetch(pokemon.url);
                const detailedData = await res.json();
                const stats = detailedData.stats.reduce((acc: {
                    hp: number;
                    defense: number;
                    attack: number
                }, stat: Stat) => {
                    if (stat.stat.name === 'hp') acc.hp = stat.base_stat;
                    if (stat.stat.name === 'defense') acc.defense = stat.base_stat;
                    if (stat.stat.name === 'attack') acc.attack = stat.base_stat;
                    return acc;
                }, {hp: 0, defense: 0, attack: 0});

                return {
                    name: detailedData.name,
                    stats,
                    sprites: detailedData.sprites,
                };
            });

            const detailedData = await Promise.all(detailedDataPromises);
            const filteredData = detailedData.filter(pokemon => pokemon.sprites.other.dream_world.front_default);
            const shuffledData = shuffleArray(filteredData);

            set({detailedPokemonData: shuffledData, loading: false});
        } catch (error) {
            console.error('Error:', error);
            set({loading: false});
        }
    },
}));

export default usePokemonStore;
