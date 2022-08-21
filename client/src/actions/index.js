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

export function createPokemon(name, img, types){
    //Cuando un usuario crea un pokemon este no aparecera inmediatamente en el home porque para eso tendriamos que hacer un nuevo get/pokemons
    //Como esto lleva mucho tiempo y estariamos trayendo todos los pokemons que ya tenemos en la store + 1 nuevo, es mejor simplemente
    //Que cuando un usuario cree un pokemon se a;ada a la db pero ademas se a;ada a la store para que se pueda ver en el home sin necesidad
    //De tener que traer todos los pokemons otra vez
    return {
        type: 'CREATE_POKEMON',
        payload: {
            name: name,
            img: img,
            types: types
        }
    }
}

export function setOnlyOriginals(){
    return {
        type: 'SET_ONLY_ORIGINALS'
    }
}

export function setTypeFilter(type){
    return{
        type: 'SET_TYPE_FILTER',
        payload: type
    }
}


