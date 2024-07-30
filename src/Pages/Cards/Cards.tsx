import React, { useEffect, useState } from 'react';
import getPokemonData from '../../services/pokemone';
import cardBackground  from '../../Assets/Card/cardbackground.png'
import s from './Cards.module.scss'

function Cards() {
    const [pokemonData, setPokemonData] = useState<any[]>([]);
    const [detailedPokemonData, setDetailedPokemonData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPokemonData();
                console.log(data);
                setPokemonData(data.results);

                // Витягування детальної інформації для кожного покемона
                const detailedDataPromises = data.results.map(async (pokemon: any) => {
                    const response = await fetch(pokemon.url);
                    const detailedData = await response.json();
                    return detailedData;
                });

                const detailedData = await Promise.all(detailedDataPromises);

                // Фільтруємо покемонів без зображень
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

    return (
        <div className="App">
            <h1>Pokemon Data</h1>
            <div className={s.cardSpace}>
                {detailedPokemonData.length > 0 ? (
                    detailedPokemonData.map((pokemon, index) => (
                        <div className={s.card} key={index} style={{backgroundImage: `url(${cardBackground})`}}>
                            <img src={pokemon.sprites.other.dream_world.front_default}
                                 alt={`${pokemon.name} default`}/>
                            <p>{capitalizeFirstLetter(pokemon.name)}</p>
                            {/*<p>Height: {pokemon.height}</p>*/}
                            {/*<p>Weight: {pokemon.weight}</p>*/}
                            {/*<p>Base Experience: {pokemon.base_experience}</p>*/}
                        </div>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}

export default Cards;
