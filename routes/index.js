const express = require('express');
const { Op } = require('sequelize');
const Member = require('../models/Member');
const Book = require('../models/Book');
const BorrowedBook = require('../models/BorrowedBook');
const sequelize = require('../config/db');

const router = express.Router();

/**
 * @swagger
 *    components:
 *        schema:
 *            Book:
 *               type: object
 *               properties:
 *                    memberCode:
 *                        type: string
 *                    bookCode:
 *                        type: string
 */


/**
 * @swagger
 * /books:
 *     get:
 *          summary : This will call get all books
 *          description: To get all books in records
 *          responses:
 *                200:
 *                   description: Get all books
 */
router.get('/books', async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
});

/**
 * @swagger
 * /members:
 *     get:
 *          summary : This will call get all members
 *          description: To get all members in records
 *          responses:
 *                200:
 *                   description: Get all members
 */
router.get('/members', async (req, res) => {
  const members = await Member.findAll({ include: BorrowedBook });
  res.json(members);
});

/**
 * @swagger
 * /borrow:
 *     post:
 *          summary : This will borrow books from book records
 *          description: To borrow books in records
 *          requestBody:
 *                required: true
 *                content: 
 *                      application/json:
 *                          schema:
 *                            $ref: '#components/schema/Book'
 *          responses:
 *                200:
 *                   description: Borrowed Succesfully
 */
router.post('/borrow', async (req, res) => {
  const { memberCode, bookCode } = req.body;
  const member = await Member.findOne({ where: { code: memberCode }, include: BorrowedBook });

  if (!member) {
    return res.status(404).send('Member not found');
  }

  if (member.BorrowedBooks.length >= 2) {
    return res.status(400).send('Member cannot borrow more than 2 books');
  }

  if (member.penaltyUntil && member.penaltyUntil > new Date()) {
    return res.status(400).send('Member is currently penalized');
  }

  const book = await Book.findOne({ where: { code: bookCode } });

  if (!book || book.stock <= 0) {
    return res.status(400).send('Book is not in stock');
  }

  await sequelize.transaction(async (t) => {
    await BorrowedBook.create({
      memberCode,
      bookCode,
      borrowedAt: new Date()
    }, { transaction: t });

    await book.update({ stock: book.stock - 1 }, { transaction: t });
  });

  res.send('Book borrowed successfully');
});


/**
 * @swagger
 * /return:
 *     post:
 *          summary : This will return books
 *          description: To return books to records
 *          requestBody:
 *                required: true
 *                content: 
 *                      application/json:
 *                          schema:
 *                            $ref: '#components/schema/Book'
 *          responses:
 *                200:
 *                   description: Return Succesfully
 */
router.post('/return', async (req, res) => {
  const { memberCode, bookCode } = req.body;

  const borrowedBook = await BorrowedBook.findOne({ where: { memberCode, bookCode } });

  if (!borrowedBook) {
    return res.status(400).send('This book was not borrowed by the member');
  }

  await sequelize.transaction(async (t) => {
    await borrowedBook.destroy({ transaction: t });

    const book = await Book.findOne({ where: { code: bookCode }, transaction: t });
    await book.update({ stock: book.stock + 1 }, { transaction: t });

    const member = await Member.findOne({ where: { code: memberCode }, transaction: t });

    if (new Date() - new Date(borrowedBook.borrowedAt) > 7 * 24 * 60 * 60 * 1000) {
      await member.update({ penaltyUntil: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000) }, { transaction: t });
    }
  });

  res.send('Book returned successfully');
});

module.exports = router;