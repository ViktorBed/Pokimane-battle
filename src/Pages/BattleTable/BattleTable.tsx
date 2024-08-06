import React from 'react';
import { useNavigate } from 'react-router-dom';
import s from './BattleTable.module.scss';
import useSelectedPokemonStore from '../../store/selectedPokemonStore';

const BattleTable: React.FC = () => {
    const navigate = useNavigate();
    const { selectedPokemons } = useSelectedPokemonStore();

    const handleBattleStart = () => {
        if (selectedPokemons.length === 2) {
            navigate('/battle-field', { state: { pokemons: selectedPokemons } });
        }
    };

    return (
        <div className={s.container}>
            <div className={s.cardsContainer}>
                {selectedPokemons.map((pokemon, index) => (
                    <div
                        key={index}
                        className={`${s.card} ${index === 0 ? s.selectedBlue : s.selectedRed}`}
                    >
                        <img src={pokemon.sprites.other.dream_world.front_default} alt={pokemon.name} />
                        <p>{pokemon.name}</p>
                    </div>
                ))}
            </div>
            <button className={s.startBattleButton} onClick={handleBattleStart} disabled={selectedPokemons.length !== 2}>
                Start Battle
            </button>
        </div>
    );
};

export default BattleTable;
