/* [ ] Tipo con las siguientes propiedades:
ID
Nombre */
const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('tipo', {
        id: {
            type: DataTypes.STRING,//Creo que un int seria mas rapido pero la api de pokemon usa string asi que yo tambien
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        }
    },{
        timestamps: false
    })
}