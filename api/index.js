/* const server = require('./src/app.js');
const { conn } = require('./src/db.js');

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  server.listen(3001, () => {
    console.log('%s listening at 3001'); // eslint-disable-line no-console
  });
});
 */

const server = require('./src/app.js');//Pido la api
const {conn} = require('./src/db.js');//Esto es la instancia actual de la conexion exportada en db.js

conn.sync({force: true}).then(() => {//Sincronizo los modelos, creando las tablas si no existian
  server.listen(3000, () => {//Levanto la api
    console.log('El servidor esta escuchando en el puerto 3000.');
  })
  
})
