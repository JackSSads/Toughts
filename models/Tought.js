const { DataTypes } =  require("sequelize");

const db = require("../db/conn");

const User = require("./User");

const Tougts = db.define("Toughts", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
});

Tougts.belongsTo(User);
User.hasMany(Tougts);

module.exports = Tougts;