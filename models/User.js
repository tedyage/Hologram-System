const db = require("../db");
const Sequelize = require("sequelize");

var User = db.defineModel("user",{
    username:{
        type:Sequelize.STRING(20),
        allowNull:false,
        unique:'userNameIndex',
    },
    password:{
        type:Sequelize.STRING(100),
        allowNull:false
    },
});

module.exports = User;