const initialState = {
    pokemons: [],
    order: 'none',
    types: [],
    filters: {
        originals: false,
        types: []
    }
}

export default function rootReducer(state = initialState, action){
    switch(action.type){
        case 'GET_POKEMONS':
            //Esto de los tipos es necesario porque el componente filtros necesita saber todos los tipos de pokemones disponibles para mostrarlos
            //Antes esto lo hacia en ese mismo componente, sin embargo como ese componente genera los dispatchs de filtrado y ordenamiento
            //Cada vez que genera un dispatch, el home que es el padre de el componente filtros, se actualiza, obligando a re renderizarse a filtros
            //Y por lo tanto se vuelve a correr toda esa funcion para buscar tipos, lo que es ineficiente, de esta forma, solo se corre una vez
            let types = {};
            let pokemonTypes = [];
            action.payload.forEach(pokemon => {//Recorro el array de pokemons
                pokemon.types.forEach(type => {//Recorro su array de tipos
                    type = type[0].toUpperCase() + type.slice(1);
                    types[type] = null;//Los pusheo a este objeto
                })
            })

            for(let key in types){
                pokemonTypes.push(key);
            }

            let newPokemonsState = state.pokemons.concat(action.payload);
            let newPokemonTypes = state.types.concat(pokemonTypes);
            return {...state, pokemons: newPokemonsState, types: newPokemonTypes};
        case 'CREATE_POKEMON'://Esto es porque si creas un pokemon y volves atras(al home), como el home muestra los pokemons de la store sin esto no se ve tu pokemon hasta que recargues
            if(!state.pokemons.length) return state;//Si no hay pokemons no hace nada
            let newStateType = state.types;
            let newStatePokemons = state.pokemons;

            action.payload.types.forEach(newType => {//Por cada tipo que hayan mandado en el payload
                if(!state.types.includes(newType)){//Si no esta incluido en ${types} en la store
                    newStateType.push(newType);
                }
            })
            newStatePokemons.push(action.payload);
            return {...state, pokemons: newStatePokemons, types: newStateType}
        case 'SET_ONLY_ORIGINALS':
            return {...state, filters: {...state.filters, originals: !state.filters.originals}}
        case 'SET_TYPE_FILTER':
            return {...state, filters: {...state.filters, types: action.payload}}
        case 'ADD_ATTACK_INFO'://Esto a;ade la info del ataque a cada pokemon, sip hubiera sido mucho mas eficiente pedirla desde el principio pero la consiga dice que solo puedo pedir name, types y img, asi que bueh
            let pokemonsName = state.pokemons.map(pokemon => pokemon.name);//Guardo los nombres de los pokemons aca, los necesito para usar el indexOf
            let updatedPokemons = state.pokemons;

            action.payload.forEach(pokemon => {
                let index = pokemonsName.indexOf(pokemon.name);
                updatedPokemons[index].attack = pokemon.attack;
            })
            return {...state, pokemons: updatedPokemons};
        case 'SORT':
            return {...state, order: action.payload}
        default:
            return state;
    }

}