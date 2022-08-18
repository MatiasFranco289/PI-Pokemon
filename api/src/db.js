/* {require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pokemon`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Pokemon, Tipo } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};}
 */

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
const {pokemon, tipo} = db.models;

//Por aca te faltaria definir las relaciones

module.exports = {
  ...db.models,
  conn: db
}


