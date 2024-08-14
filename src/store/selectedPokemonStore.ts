import {create} from 'zustand';
import {DetailedPokemon} from '../Utils/type';

interface SelectedPokemonStore {
    selectedPokemons: DetailedPokemon[];
    addPokemon: (pokemon: DetailedPokemon) => void;
    removePokemon: (pokemon: DetailedPokemon) => void;
    clearPokemons: () => void;
}

const useSelectedPokemonStore = create<SelectedPokemonStore>((set) => ({
    selectedPokemons: [],
    addPokemon: (pokemon) => set((state) => {
        if (state.selectedPokemons.length < 2 && !state.selectedPokemons.includes(pokemon)) {
            return {selectedPokemons: [...state.selectedPokemons, pokemon]};
        }
        return state;
    }),
    removePokemon: (pokemon) => set((state) => {
        return {selectedPokemons: state.selectedPokemons.filter(p => p !== pokemon)};
    }),
    clearPokemons: () => {
        set({selectedPokemons: []});
        localStorage.removeItem('selectedPokemons');
    },
}));

export default useSelectedPokemonStore;
