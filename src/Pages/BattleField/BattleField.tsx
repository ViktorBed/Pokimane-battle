import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import useSelectedPokemonStore from "../../store/selectedPokemonStore";
import {DetailedPokemon} from "../../Utils/type";
import s from './BattleField.module.scss';

interface LocationState {
    pokemons: DetailedPokemon[];
}

const BattleField: React.FC = () => {
    const location = useLocation();
    const state = location.state as LocationState;
    const initialPokemons = state?.pokemons || [];
    const { clearPokemons } = useSelectedPokemonStore();

    const [pokemons, setPokemons] = useState(initialPokemons);
    const [currentTurn, setCurrentTurn] = useState(0);
    const [log, setLog] = useState<string[]>([]);

    const calculateDamage = (attacker: DetailedPokemon, defender: DetailedPokemon) => {
        const adjustedDefense = defender.stats.defense / 1.5;
        const blockPercentage = adjustedDefense / 100;
        const reducedDamage = attacker.stats.attack * (1 - blockPercentage);
        return reducedDamage;
    };

    const attack = (attackerIndex: number, defenderIndex: number) => {
        const attacker = pokemons[attackerIndex];
        const defender = pokemons[defenderIndex];
        const damage = calculateDamage(attacker, defender);

        const newDefenderHp = defender.stats.hp - damage;
        const updatedDefender = { ...defender, stats: { ...defender.stats, hp: newDefenderHp } };
        const updatedPokemons = pokemons.map((p, index) =>
            index === defenderIndex ? updatedDefender : p
        );

        setPokemons(updatedPokemons);
        setLog(prevLog => [
            ...prevLog,
            `${attacker.name} attacks ${defender.name} for ${damage.toFixed(2)} damage. ${defender.name} has ${newDefenderHp.toFixed(2)} HP left.`,
        ]);

        if (newDefenderHp <= 0) {
            setLog(prevLog => [
                ...prevLog,
                `${defender.name} has fainted. ${attacker.name} wins!`,
            ]);
            clearPokemons();
            return true;
        }
        return false;
    };

    const handleNextTurn = () => {
        const attackerIndex = currentTurn % 2;
        const defenderIndex = (currentTurn + 1) % 2;

        const gameOver = attack(attackerIndex, defenderIndex);

        if (!gameOver) {
            setCurrentTurn(currentTurn + 1);
        }
    };

    useEffect(() => {
        if (pokemons.length === 2 && pokemons.every(p => p.stats.hp > 0)) {
            const timer = setTimeout(handleNextTurn, 3000);
            return () => clearTimeout(timer);
        }
    }, [currentTurn]);

    return (
        <div className={s.container}>
            <div className={s.cardsContainer}>
                {pokemons.map((pokemon, index) => (
                    <>
                        <div
                            key={index}
                            className={`${s.card} ${index === 0 ? s.selectedBlue : s.selectedRed}`}
                        >
                            <img
                                src={index === 0 ? pokemon.sprites.back_default : pokemon.sprites.front_default}
                                alt={pokemon.name}
                            />
                        </div>
                        <span className={s.stats}>
                            <p>{pokemon.name}</p>
                            <p>HP: {pokemon.stats.hp.toFixed(2)}</p>
                            <p>Defense: {pokemon.stats.defense.toFixed(2)}</p>
                            <p>Attack: {pokemon.stats.attack.toFixed(2)}</p>
                        </span>
                    </>
                ))}
            </div>

            <div className={s.log}>
                {log.map((entry, index) => (
                    <p key={index}>{entry}</p>
                ))}
            </div>
        </div>
    );
};

export default BattleField;
