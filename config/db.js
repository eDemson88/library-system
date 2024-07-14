const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('library', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false
  }
});

module.exports = sequelize;