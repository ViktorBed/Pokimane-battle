import React from 'react';
import {useNavigate} from 'react-router-dom';
import useSelectedPokemonStore from '../../store/selectedPokemonStore';
import s from './BattleTable.module.scss';

const BattleTable: React.FC = () => {
    const navigate = useNavigate();
    const {selectedPokemons} = useSelectedPokemonStore();
    const {clearPokemons} = useSelectedPokemonStore();

    const handleBattleStart = () => {
        if (selectedPokemons.length === 2) {
            navigate('/battle-field', {state: {pokemons: selectedPokemons}});
        }
    };

    const formatName = (name: string): string => {
        const nameWithSpaces = name.replace(/-/g, ' ');
        return nameWithSpaces.charAt(0).toUpperCase() + nameWithSpaces.slice(1);
    };

    return (
        <div className={s.container}>
            <div className={s.cardsContainer}>
                {selectedPokemons.map((pokemon, index) => (
                    <div
                        key={index}
                        className={`${s.card} ${index === 0 ? s.selectedBlue : s.selectedRed}`}
                    >
                        <img src={pokemon.sprites.other.dream_world.front_default}
                             alt={`${pokemon.name} default`} draggable={false}/>
                        <p>{formatName(pokemon.name)}</p>
                    </div>
                ))}
            </div>
            <button className={s.startBattleButton} onClick={handleBattleStart}
                    disabled={selectedPokemons.length !== 2}>
                Start Battle
            </button>
            <button className={s.startBattleButton} onClick={() => clearPokemons()}>Deselect</button>
        </div>
    );
};

export default BattleTable;
