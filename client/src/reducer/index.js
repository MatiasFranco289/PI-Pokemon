const initialState = {
    pokemons: [],
    order: 'none',
    types: []
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

            return {...state, pokemons: action.payload, types: pokemonTypes}
        case 'ORDER_ALPH_ASC':
            let sortedPokemonsAsc = [...state.pokemons];
            OrderAlph(sortedPokemonsAsc, [1,-1], 'name');
            return{...state, pokemons: sortedPokemonsAsc, order: 'ORDER_ALPH_ASC'};
        case 'ORDER_ALPH_DESC':
            let sortedPokemonsDesc = [...state.pokemons];
            OrderAlph(sortedPokemonsDesc, [-1,1], 'name');
            return{...state, pokemons: sortedPokemonsDesc, order: 'ORDER_ALPH_DESC'};
        case 'ORDER_ATT_ASC':
            
        default:
            return state;
    }

    function OrderAlph(ArrObj, order, prop){//order [1,-1] es ascendente, order [-1,1] es descendente, esto ordena un objeto por la propiedad dada
        ArrObj.sort((a,b) => (a[prop] > b[prop])?order[0]:order[1]);
    }
}