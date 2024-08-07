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
        back_default: string;
        front_default: string;
        other: {
            dream_world: {
                front_default: string;
            };
        };
    };
}
