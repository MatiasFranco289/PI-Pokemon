const { DataTypes, UUID, UUIDV1 } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('pokemon', {
    id:{
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,//No puede haber dos pokemons con el mismo nombre
    },
    img: {
      type: DataTypes.STRING,
      unique: true//No puede haber dos pokemons con la misma imagen
    },
    hp: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    attack: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    defense: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    speed: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    height: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    weight: {
      type: DataTypes.FLOAT,
      defaultValue: 100
    }
  }, {
		timestamps: false
	});
};
