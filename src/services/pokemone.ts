import axios from 'axios';

const getPokemonData = async () => {
    const apiUrl = process.env.REACT_APP_POKEMON_API ?? '';

    console.log('API URL:', apiUrl);

    if (!apiUrl) {
        console.error('API URL is not defined');
        return;
    }
    try {
        const response = await axios.get(apiUrl);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching the data', error);
        throw error;
    }
};

export default getPokemonData;
