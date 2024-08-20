import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import useSelectedPokemonStore from "../../store/selectedPokemonStore";
import {DetailedPokemon} from "../../Utils/type";
import s from './BattleField.module.scss';

interface LocationState {
    pokemons: DetailedPokemon[];
}

const BattleField: React.FC = () => {
    const location = useLocation();
    const state = location.state as LocationState;
    const initialPokemons = state?.pokemons.map(pokemon => ({
        ...pokemon,
        stats: {
            ...pokemon.stats,
            initialHp: pokemon.stats.initialHp || pokemon.stats.hp,
        }
    })) || [];
    const {clearPokemons} = useSelectedPokemonStore();
    const navigate = useNavigate();

    const [pokemons, setPokemons] = useState<DetailedPokemon[]>(initialPokemons);
    const [currentTurn, setCurrentTurn] = useState<number>(0);
    const [log, setLog] = useState<string[]>([]);
    const [attackingPokemon, setAttackingPokemon] = useState<number | null>(null);
    const [defendingPokemon, setDefendingPokemon] = useState<number | null>(null);
    const [opacity, setOpacity] = useState<number[]>([1, 1]);
    const [buttonVisible, setButtonVisible] = useState<boolean>(false);

    const calculateDamage = (attacker: DetailedPokemon, defender: DetailedPokemon): number => {
        const attackVariation = 1 + (Math.random() * 0.02 - 0.01);
        const adjustedAttack = (attacker.stats.attack * attackVariation) / 1.3;
        const adjustedDefense = defender.stats.defense / 2.2;
        const blockPercentage = adjustedDefense / 100;
        const reducedDamage = adjustedAttack * (1 - blockPercentage);
        return reducedDamage;
    };

    const attack = (attackerIndex: number, defenderIndex: number): boolean => {
        setAttackingPokemon(attackerIndex);
        setDefendingPokemon(defenderIndex);

        const attacker = pokemons[attackerIndex];
        const defender = pokemons[defenderIndex];
        const damage = calculateDamage(attacker, defender);

        const newDefenderHp = Math.max(0, defender.stats.hp - damage);
        const updatedDefender = {...defender, stats: {...defender.stats, hp: newDefenderHp}};
        const updatedPokemons = pokemons.map((p, index) =>
            index === defenderIndex ? updatedDefender : p
        );

        setPokemons(updatedPokemons);
        setLog(prevLog => [
            ...prevLog,
            `${attacker.name} attacks ${defender.name} for ${damage.toFixed(2)} damage.`,
        ]);

        if (newDefenderHp <= 0) {
            setLog(prevLog => [
                ...prevLog,
                `${defender.name} has fainted. ${attacker.name} wins!`,
            ]);

            setTimeout(() => {
                setOpacity((prevOpacity) => {
                    const updatedOpacity = [...prevOpacity];
                    updatedOpacity[defenderIndex] = 0;
                    return updatedOpacity;
                });
                setButtonVisible(true);
            }, 2000);

            clearPokemons();
            return true;
        }

        setTimeout(() => {
            setDefendingPokemon(null);
        }, 1000);
        setTimeout(() => {
            setAttackingPokemon(null);
        }, 200);

        return false;
    };

    const handleNextTurn = (): void => {
        const attackerIndex = currentTurn % 2;
        const defenderIndex = (currentTurn + 1) % 2;

        const gameOver = attack(attackerIndex, defenderIndex);

        if (!gameOver) {
            setCurrentTurn(currentTurn + 1);
        }
    };

    const getHpBarColor = (hp: number, initialHp: number): string => {
        const hpPercentage = (hp / initialHp) * 100;
        if (hpPercentage > 50) return '#3fea08';
        if (hpPercentage > 20) return '#fea807';
        return '#fe0707';
    };

    const handleReturn = (): void => {
        clearPokemons();
        navigate('/');
    };

    useEffect(() => {
        if (pokemons.length === 2 && pokemons.every(p => p.stats.hp > 0)) {
            const timer = setTimeout(handleNextTurn, 2500);
            return () => clearTimeout(timer);
        }
    }, [currentTurn]);

    return (
        <div className={s.container}>
            <div className={s.cardsContainer}>
                {pokemons.map((pokemon, index) => (
                    <React.Fragment key={index}>
                        <div
                            className={`${s.card} ${index === 0 ? s.selectedBlue : s.selectedRed}`}
                            style={{
                                opacity: opacity[index],
                                transition: 'opacity 1s, transform 0.2s',
                                transform: index === attackingPokemon
                                    ? index === 0
                                        ? 'translateX(20px)'
                                        : 'translateX(-20px)'
                                    : 'translateX(0)',
                            }}
                        >
                            <img
                                src={index === 0 ? pokemon.sprites.back_default : pokemon.sprites.front_default}
                                alt={pokemon.name}
                                draggable={false}
                                className={` ${index === defendingPokemon ? s.attacking : ''}`}
                            />
                        </div>

                        <span className={s.stats}>
                            <h2>{pokemon.name}</h2>
                            <div>
                                <div className={s.attacDef}>
                                    <p>{pokemon.stats.attack.toFixed(2)}</p>
                                    <p>{pokemon.stats.defense.toFixed(2)}</p>
                                </div>
                                <div className={s.hpBarContainer}>
                                    <div className={s.hpBar}>
                                        <div
                                            className={s.hpBarFill}
                                            style={{
                                                width: `${(pokemon.stats.hp / pokemon.stats.initialHp) * 100}%`,
                                                backgroundColor: getHpBarColor(pokemon.stats.hp, pokemon.stats.initialHp)
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </span>
                    </React.Fragment>
                ))}
            </div>
            <div className={s.log}>
                {log.map((entry, index) => (
                    <p key={index}>{entry}</p>
                ))}
            </div>
            <div className={s.return}>
                <button className={s.returnBtn} onClick={handleReturn}
                        style={{display: buttonVisible ? 'block' : 'none'}}>Go Back
                </button>
            </div>
        </div>
    );
};

export default BattleField;
