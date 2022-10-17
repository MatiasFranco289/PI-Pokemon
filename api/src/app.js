//ESTO VA A SER LA API
const express = require('express');
const server = express();
require('./db.js');
//Mis routes
const Pokemons = require('./routes/Pokemons.js');
const Types = require('./routes/Types.js');

//Esto es un middleware CORS, basicamente esta prohibido que una pagina cargue contenido de otra pero aca abajo le permito el acceso a las request que vengan desde
//localhost:3001 para mas info leer https://www.ionos.es/digitalguide/paginas-web/desarrollo-web/cross-origin-resource-sharing/
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

server.use(express.json());
server.use('/pokemons', Pokemons);
server.use('/types', Types);

module.exports = server;//Aca lo exporto nomas, el server lo prendo en index
