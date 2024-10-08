import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from "../../Utils/Loader";
import usePokemonStore from '../../store/pokemonStore';
import useSearchStore from '../../store/searchStore';
import useSelectedPokemonStore from '../../store/selectedPokemonStore';
import { DetailedPokemon } from '../../Utils/type';
import InfiniteScroll from 'react-infinite-scroll-component';
import s from './Cards.module.scss';

const Cards: React.FC = () => {
    const [visibleCount, setVisibleCount] = useState<number>(20);
    const navigate = useNavigate();
    const { searchQuery } = useSearchStore();
    const { selectedPokemons, addPokemon, removePokemon, clearPokemons } = useSelectedPokemonStore();
    const { detailedPokemonData, loading, fetchPokemonData } = usePokemonStore();

    useEffect(() => {
        if (detailedPokemonData.length === 0) {
            fetchPokemonData();
        }
        clearPokemons();
    }, [fetchPokemonData, detailedPokemonData.length, clearPokemons]);

    useEffect(() => {
        const storedPokemons = localStorage.getItem('selectedPokemons');
        if (storedPokemons) {
            const parsedPokemons = JSON.parse(storedPokemons);
            const validPokemons = parsedPokemons.filter((pokemon: DetailedPokemon) =>
                detailedPokemonData.some((dp: DetailedPokemon) => dp.name === pokemon.name)
            );
            validPokemons.forEach((pokemon: DetailedPokemon) => addPokemon(pokemon));
        }
    }, [addPokemon, detailedPokemonData]);

    useEffect(() => {
        localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));
    }, [selectedPokemons]);

    const formatName = (name: string): string => {
        const nameWithSpaces = name.replace(/-/g, ' ');
        return nameWithSpaces.charAt(0).toUpperCase() + nameWithSpaces.slice(1);
    };

    const loadMore = (): void => {
        setVisibleCount(prevCount => prevCount + 20);
    };

    const filteredPokemonData = detailedPokemonData.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCardClick = (pokemon: DetailedPokemon): void => {
        if (selectedPokemons.includes(pokemon)) {
            removePokemon(pokemon);
        } else if (selectedPokemons.length < 2) {
            addPokemon(pokemon);
        }
    };

    const handleGoBattle = () => {
        navigate('/battle-table');
    };

    const getCardClass = (pokemon: DetailedPokemon) => {
        const index = selectedPokemons.indexOf(pokemon);
        if (index === 0) return `${s.card} ${s.selectedBlue}`;
        if (index === 1) return `${s.card} ${s.selectedRed}`;
        return s.card;
    };

    return (
        <div className={s.background}>
                {loading ? (
                    <div className={s.loading}>
                        <Loader />
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={visibleCount}
                        next={loadMore}
                        hasMore={visibleCount < filteredPokemonData.length}
                        loader={<Loader />}
                        className={s.cardSpace}
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>Це всі доступні покемони</b>
                            </p>
                        }
                    >
                        {filteredPokemonData.slice(0, visibleCount).map((pokemon, index) => (
                            <div
                                className={getCardClass(pokemon)}
                                key={index}
                                onClick={() => handleCardClick(pokemon)}
                            >
                                <img src={pokemon.sprites.other.dream_world.front_default}
                                     alt={`${pokemon.name} default`} draggable={false} />
                                <p>{formatName(pokemon.name)}</p>
                            </div>
                        ))}
                    </InfiniteScroll>
                )}
                {selectedPokemons.length === 2 && (
                    <div className={s.goBattle}>
                        <button onClick={handleGoBattle} className={s.goBattleButton}>Go Battle</button>
                    </div>
                )}
        </div>
    );
}

export default Cards;
