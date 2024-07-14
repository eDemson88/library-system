const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Member = require('./Member');
const Book = require('./Book');

const BorrowedBook = sequelize.define('BorrowedBook', {
  memberCode: {
    type: DataTypes.STRING,
    references: {
      model: Member,
      key: 'code'
    }
  },
  bookCode: {
    type: DataTypes.STRING,
    references: {
      model: Book,
      key: 'code'
    }
  },
  borrowedAt: DataTypes.DATE
});

Member.hasMany(BorrowedBook, { foreignKey: 'memberCode' });
BorrowedBook.belongsTo(Member, { foreignKey: 'memberCode' });
Book.hasMany(BorrowedBook, { foreignKey: 'bookCode' });
BorrowedBook.belongsTo(Book, { foreignKey: 'bookCode' });

module.exports = BorrowedBook;