require('dotenv').config();//Dotenv es un modulo que carga variable de entorno desde un archivo .env
const {Sequelize, Op} = require('sequelize');//Importo sequelize
const {//Estos datos estan en el archivo .env
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;

//Requiero los modelos
const modelPokemon = require('./models/Pokemon.js');
const modelTipo = require('./models/Tipo.js');

const db = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pokemon`, {
  logging: console.log('La conexion a la DB ha sido exitosa'),
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});

//Los modelos exportar una funcion que toma la instancia actual de conexion
//Llamo a esas funciones pasandole la conexion actual y esas funciones agregaran a {db}
//Su modelo por medio del metodo define
modelPokemon(db);
modelTipo(db);
//Ahora hago destructuring para obtener los modelos que esas funciones cargaron en db
const {pokemon, types} = db.models;

//Relaciones
pokemon.belongsToMany(types, {through: 'pokemons_tipos',timestamps: false});
types.belongsToMany(pokemon, {through: 'pokemons_tipos', timestamps: false});

module.exports = {
  ...db.models,
  conn: db
}


