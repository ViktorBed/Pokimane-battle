import React, {useEffect, useState} from 'react';
import getPokemonData from '../../services/pokemone';
import s from './Cards.module.scss'

function Cards() {
    const [detailedPokemonData, setDetailedPokemonData] = useState<any[]>([]);
    const [visibleCount, setVisibleCount] = useState(20);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPokemonData();

                const detailedDataPromises = data.results.map(async (pokemon: any) => {
                    const response = await fetch(pokemon.url);
                    const detailedData = await response.json();
                    return detailedData;
                });

                const detailedData = await Promise.all(detailedDataPromises);

                const filteredData = detailedData.filter(pokemon => pokemon.sprites.other['dream_world'].front_default);

                setDetailedPokemonData(filteredData);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    const loadMore = () => {
        setVisibleCount(prevCount => prevCount + 20); // Додаємо ще 20 карток при завантаженні
    };

    return (
        <div className={s.background}>
            <div className={s.cardSpace}>
                {detailedPokemonData.length > 0 ? (
                    detailedPokemonData.slice(0, visibleCount).map((pokemon, index) => (
                        <div className={s.card} key={index}>
                            <img src={pokemon.sprites.other.dream_world.front_default}
                                 alt={`${pokemon.name} default`} draggable={false}/>
                            <p>{capitalizeFirstLetter(pokemon.name)}</p>
                        </div>
                    ))
                ) : (
                    <div className={s.background}>
                        <p>Loading...</p>
                    </div>
                )}
            </div>
            {visibleCount < detailedPokemonData.length && (
                <button onClick={loadMore} className={s.loadMoreButton}>Load More</button>
            )}
        </div>
    );
}

export default Cards;
