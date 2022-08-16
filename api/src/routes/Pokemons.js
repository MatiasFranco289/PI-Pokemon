const {Router} = require('express');
const router = Router();
const axios = require('axios');

router.get('/', async(req, res, next) => {
    if(req.query.name) return next();//Si recibis por query un atributo {name}, segui para delante, aca no lo voy a manejar

    const {offset, limit, all} = req.query;
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${!offset?0:offset}&limit=${!limit?40:limit}`;//Esto pide {limit} pokemons desde el pokemons numero {offset}

    try{
        const {data} = await axios.get(url);//Intento guardar la info del fetch aca
        //Una vez que tengo el resultado del fetch con el link de los 40 primeros pokemons
        let AllRequests = [];
        data.results.forEach((pokemon) => {//Recorro el resultado del fetch que deberia ser un array que contiene los links de cada uno de los pokemons
            AllRequests.push(axios.get(pokemon.url));//Guardo 40 promesas en este array
        });

        let pokemonsInfo = await axios.all(AllRequests);//Hago un fetch masivo con cada uno de las 40 urls de los pokemons, esto deberia devolver un array de objetos

           let result = pokemonsInfo.map((pokemon) => {//Mapeo el array obteniendo las propiedades que me interesan
            return {
                name: pokemon.data.name,
                img: pokemon.data.sprites.other.home.front_default,
                types: pokemon.data.types.map(types => {return types.type.name})
                //types es un array de objetos que a su vez contienen otro objeto llamado type que contiene una propiedad name por eso el .map()
            }
        })

        return res.status(200).json(result);
    }
    catch(err){
        res.status(404).send(`The following error has ocurred: ${err.message}`);
    }
})

 router.get('/', async (req, res) => {//Si recibe info por query entra aca, esto es un buscador de pokemons por nombre
    const {name} = req.query;
    const link = `https://pokeapi.co/api/v2/pokemon/${name}`;

    try{
        let {data} = await axios.get(link);
        let pokemonFullInfo = {
            name : data.name,
            img: data.sprites.other.home.front_default,
            types: data.types.map(types => {return types.type.name}),
            id: data.id,
            hp: data.stats[0].base_stat,
            attack: data.stats[1].base_stat,
            defense: data.stats[2].base_stat,
            speed: data.stats[5].base_stat,
            weight: data.weight,
            height: data.height
        };

        res.status(200).json(pokemonFullInfo);
    }
    catch(err){
        res.status(404).send(new Error(err.message));
    }

})

module.exports = router;

//IMPORANTE:

//La variable {all} por ahora no tiene uso pero mas adelante, en caso de que sea true deberias traer y agregar al array result, los pokemons que tengas
//Guardados en la base de datos, su valor defecto deberia ser TRUE

//Documentacion

//Esta ruta trae el nombre, tipo y imagen de pokemons.
//Recibe por query los parametros {offset} {limit} y {all}
//{offset indica desde que pokemon empezara la busqueda, por ejemplo si se le da un tres, ignorara los primeros 2 y empezara a traer a partir del 3cer pokemon} Su valor es 0 por default.
//{limit} indica cuantos pokemons traera en total, si no se indica, su valor es 40 por default
//{all} indica si debe traer solo los pokemons desde la api 'PokeApi' o si tambien debe traerlo desde la DB, su valor por defecto es TRUE