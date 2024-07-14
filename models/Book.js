const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Book = sequelize.define('Book', {
  code: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  title: DataTypes.STRING,
  author: DataTypes.STRING,
  stock: DataTypes.INTEGER
});

module.exports = Book;