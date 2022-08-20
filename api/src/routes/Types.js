const {Router} = require('express');
const axios = require('axios');
const router = Router();
const sequelize = require('sequelize');
const {types} = require('../db.js');//Necesito el modelo de la tabla para modificarla
//(Recorda que esto no es el modelo en si, que ese modelo fue agregado mediante el metodo define a db que es la instancia de conexion actual, por eso hacer destructuring)

router.get('/', async (req, res, next) => {//Esto obtienes los datos de api pokemon, los devuelve desde ahi y los guarda en la db para futuro uso
   /*  Obtener todos los tipos de pokemons posibles
    En una primera instancia deberán traerlos desde pokeapi y guardarlos en su propia base de datos y luego ya utilizarlos desde allí */
    
    try{
        const tableLength = await types.findAll({//SELECT (COUNT) FROM tipos AS types_count;
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'types_count']
            ]
        });
        

        if(parseInt(tableLength[0].dataValues.types_count)) return next();//Si tengo los datos en la db lo manejo en otro endpoint

        const {data} = await axios.get('https://pokeapi.co/api/v2/type');//fetch a la api para obtener todos los tipos
        let allTypes = [];

        data.results.forEach(type => {//Por cada tipo
            allTypes.push({//Pusheo un nuevo objeto con el tipo y la id que tendra en la db a un array vacio
                id: type.url.split('/')[6],
                name: type.name
            })
        })

        await types.bulkCreate(allTypes);//Creo los tipos en la db
        res.status(200).json(allTypes)//Devuelvo los tipos desde la variable
    }
    catch(err){//Se colgo we
        res.status(404).send(err.message);
    }
})

router.get('/', async (req, res) => {//Esto obtiene los tipos desde la db
    try{
        const allTypes = await types.findAll();
        res.status(200).json(
            allTypes.map(type => {
                return type.dataValues;
            })
        );
    }
    catch(err){
        res.status(404).send(err.message);
    }

})

module.exports = router;