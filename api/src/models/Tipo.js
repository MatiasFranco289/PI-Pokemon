/* [ ] Tipo con las siguientes propiedades:
ID
Nombre */
const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('tipo', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            required: true
        },
        name: {
            type: DataTypes.STRING,
            required: true
        }
    },{
        timestamps: false
    })
}