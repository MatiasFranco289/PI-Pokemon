export function getPokemons(offset, limit, all){//This should get all the 40 pokemons
       return function(dispatch){//Devuelvo una funcion porque voy a realizar algo asincronico y quiero que el middleware agarre esto
        fetch(`http://localhost:3000/pokemons?offset=${offset}&limit=${limit}&all=${all}`)
        .then(data => data.json())
        .then(response => dispatch({
            type: 'GET_POKEMONS',
            payload: response
        }))
    } 
}

