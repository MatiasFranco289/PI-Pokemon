const server = require('./src/app.js');//Pido la api
const {conn} = require('./src/db.js');//Esto es la instancia actual de la conexion exportada en db.js


//CAMBIAR ESTE PARAMETRO A TRUE ANTES DE TERMINAR
conn.sync({force: true}).then(() => {//Sincronizo los modelos, creando las tablas si no existian
  server.listen(3000, () => {//Levanto la api
    console.log('El servidor esta escuchando en el puerto 3000.');
  })
  
})
