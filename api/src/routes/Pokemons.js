const {Router} = require('express');
const router = Router();
const axios = require('axios');
const {pokemon, types} = require('../db.js');

router.get('/', async(req, res, next) => {
    if(req.query.name) return next();//Si recibis por query un atributo {name}, segui para delante, aca no lo voy a manejar

    const {offset, limit, all} = req.query;
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${!offset?0:offset}&limit=${!limit?40:limit}`;//Esto pide {limit} pokemons desde el pokemons numero {offset}
    let result = [];
    let dbPokemons;
    //si {all} es true traera pokemons desde la db, si es false, solo traera desde la api
    if(all==='true'){
        //Esto es necesario que no tenga await porque me interes que mientras busca cosas de la db pueda tambien ir buscando lo de la api
        pokemon.findAll({//Esto pide los pokemons desde la db, fijate que no tiene await
        attributes: ['name','img'],
        include: {
            model: types,
            required: true,
            attributes: ['name'],
            through: {
            attributes: []
        }
        }
        })
        .then(data => {//Cuando esta promesa se resolvio
            dbPokemons = data.map(pokemon => {
                return {
                    name: pokemon.name,
                    img: pokemon.img,
                    types: pokemon.types.map(type => {return type.name})
                }
            })

            if(result.length){//Si results es diferente a un array vacio es porque ya termino de pedir los pokemons a la api
                result = result.concat(dbPokemons);//Por lo tanto concateno el resultado de esta promesa con el resultado de la api
                return res.status(200).json(result);//Y envio todo
            }
        })
        .catch(err => {
            //Me interesa tirar un console y no un error porque aunque no pueda traer los pokemons de la db me interesa que traiga los de la api
            dbPokemons = [];//Esto es para que no se cuelgue en el if de abajo de todo con el send
            console.error('The following error has ocurred and pokemons created by users cannot be accessed: '+err.message);
        })
    }
    else{
        dbPokemons = [];
    }


    try{
        const {data} = await axios.get(url);//Intento guardar la info del fetch aca
        //Una vez que tengo el resultado del fetch con el link de los 40 primeros pokemons
        let AllRequests = [];
        data.results.forEach((pokemon) => {//Recorro el resultado del fetch que deberia ser un array que contiene los links de cada uno de los pokemons
            AllRequests.push(axios.get(pokemon.url));//Guardo 40 promesas en este array
        });

        let pokemonsInfo = await axios.all(AllRequests);//Hago un fetch masivo con cada uno de las 40 urls de los pokemons, esto deberia devolver un array de objetos

           result = pokemonsInfo.map((pokemon) => {//Mapeo el array obteniendo las propiedades que me interesan
            return {
                name: pokemon.data.name,
                img: pokemon.data.sprites.other.home.front_default,
                types: pokemon.data.types.map(types => {return types.type.name})
                //types es un array de objetos que a su vez contienen otro objeto llamado type que contiene una propiedad name por eso el .map()
            }
        })

        if(dbPokemons){//Si la promesa pidiendo pokemons a la db ya termino
            result = result.concat(dbPokemons);//Concateno todo
            return res.status(200).json(result);//Envio
        }

    }
    catch(err){
        res.status(404).send(`The following error has ocurred: ${err.message}`);
    }
})

 router.get('/', async (req, res) => {//Si recibe info por query entra aca, esto es un buscador de pokemons por nombre
    let {name, extensive} = req.query;
    const link = `https://pokeapi.co/api/v2/pokemon/${name}`;

    try{//Intenta buscar el pokemon en la db
        name = name[0].toUpperCase() + name.slice(1);
        return await searchOnDb();
    }
    catch(err){
        //Si entro aca puede ser que el nombre que me pasaron no este en la db
        //Si extensive es falso retorno error, si es cierto todavia tengo que intentar buscarlo en la api
        if(extensive === 'false'){
            let error = `The specified pokemon may not exist, maybe you should try to set 'extensive=true' to search too in the db`;
            error += `, the following error has ocurred: ${err.message}`;
            return res.status(204).json(error);//Aca no devuelvo 404 porque se empieza a llenar la consola de errores y el fetch toma
                                               //El 404 como exito asi que no lo puedo manejar con el catch
        }

        name = name.toLowerCase();

        try{
            return await searchOnApi();
        }
        catch(err){
            return res.status(404).json('The specified pokemon may not exist, the following error has ocurred: '+err.message);
        }
    }

    async function searchOnApi(){
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

        return res.status(200).json(pokemonFullInfo);
    }

    async function searchOnDb(){
        const dbPokemon = await pokemon.findAll({
            where: {
                name: name
            },
            attributes: ['name','img','id','hp','attack','defense','speed','weight','height'],
            include: {
                model: types,
                attributes: ['name'],
                through:{
                    attributes: []
                }
            }
        })

        return res.status(200).json({
            name: dbPokemon[0].dataValues.name,
            img: dbPokemon[0].dataValues.img,
            types: dbPokemon[0].dataValues.types.map(type => {return type.dataValues.name}),
            id: dbPokemon[0].dataValues.id,
            hp: dbPokemon[0].dataValues.hp, 
            attack: dbPokemon[0].dataValues.attack,
            defense: dbPokemon[0].dataValues.defense,
            speed: dbPokemon[0].dataValues.speed,
            weight: dbPokemon[0].dataValues.weight,
            height: dbPokemon[0].dataValues.height,
        })
    }
})

router.post('/', async (req, res) => {

    try{
        const {name, types, img, hp, attack, defense, speed, height, weight} = req.body;//Saco los parametros que vienen por body
        //*Types es un array de ids

        try{
            //Intento buscar el nombre que me pasaron en la api y en la db
            const nameVerification = await axios.get(`http://localhost:3000/pokemons?name=${name}`);
            return res.status(400).json('SequelizeUniqueConstraintError')//Si llego aca es porque ya existe alguien con el mismo nombre en la api o db, tiro error
        }
        catch(err){}
       
        const createdPokemon  = await pokemon.create({//Creo el pokemon
            name: name,
            img: img,
            hp: hp,
            attack: attack,
            defense: defense,
            speed: speed,
            height: height,
            weight: weight
        });
        //Devuelvo un array de promesas, una por cada tipo que me hayan dado
        const relationToCreate = types.map(type => createdPokemon.setTypes(type));
        await Promise.all(relationToCreate);//Espero a que terminen todas las promesas
        res.status(200).json('Ok!');//Exito
    }
    catch(err){
        res.status(400).json(err.name);
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