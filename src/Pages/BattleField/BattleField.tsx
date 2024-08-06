import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import s from './BattleField.module.scss';

interface Stat {
    hp: number;
    defense: number;
    attack: number;
}

interface Pokemon {
    name: string;
    stats: Stat;
    sprites: {
        other: {
            dream_world: {
                front_default: string;
            };
        };
    };
}

interface LocationState {
    pokemons: Pokemon[];
}

const BattleField: React.FC = () => {
    const location = useLocation();
    const state = location.state as LocationState;
    const initialPokemons = state?.pokemons || [];

    const [pokemons, setPokemons] = useState(initialPokemons);
    const [currentTurn, setCurrentTurn] = useState(0);
    const [log, setLog] = useState<string[]>([]);

    const calculateDamage = (attacker: Pokemon, defender: Pokemon) => {
        const effectiveDefense = defender.stats.defense / 5;
        const reducedDamage = attacker.stats.attack - effectiveDefense;
        const finalDamage = reducedDamage > 0 ? reducedDamage : attacker.stats.attack * 0.1; // At least 10% of the attack value
        return finalDamage;
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
            <h1>Battle Field</h1>
            <div className={s.cardsContainer}>
                {pokemons.map((pokemon, index) => (
                    <div
                        key={index}
                        className={`${s.card} ${index === 0 ? s.selectedBlue : s.selectedRed}`}
                    >
                        <img src={pokemon.sprites.other.dream_world.front_default} alt={pokemon.name} />
                        <p>{pokemon.name}</p>
                        <p>HP: {pokemon.stats.hp.toFixed(2)}</p>
                        <p>Defense: {pokemon.stats.defense.toFixed(2)}</p>
                        <p>Attack: {pokemon.stats.attack.toFixed(2)}</p>
                    </div>
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
