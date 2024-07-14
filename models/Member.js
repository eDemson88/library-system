const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Member = sequelize.define('Member', {
  code: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: DataTypes.STRING,
  penaltyUntil: DataTypes.DATE
});

module.exports = Member;