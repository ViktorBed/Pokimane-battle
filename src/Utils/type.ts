export interface Pokemon {
    name: string;
    url: string;
}

export interface Stat {
    base_stat: number;
    stat: {
        name: string;
    };
}

export interface DetailedPokemon {
    name: string;
    stats: {
        hp: number;
        defense: number;
        attack: number;
    };
    sprites: {
        other: {
            dream_world: {
                front_default: string;
            };
        };
    };
}
