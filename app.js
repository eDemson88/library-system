const express = require('express');
const swaggerUi = require('swagger-ui-express');
const sequelize = require('./config/db');
const swaggerSpecs = require('./swagger/swagger');
const routes = require('./routes/index');

const app = express();
app.use(express.json());

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/', routes);

sequelize.sync({ force: true }).then(() => {
  console.log('Database synchronized');
  // Initialize data
  const Member = require('./models/Member');
  const Book = require('./models/Book');

  Member.bulkCreate([
    { code: 'M001', name: 'Angga' },
    { code: 'M002', name: 'Ferry' },
    { code: 'M003', name: 'Putri' },
  ]);

  Book.bulkCreate([
    { code: 'JK-45', title: 'Harry Potter', author: 'J.K Rowling', stock: 1 },
    { code: 'SHR-1', title: 'A Study in Scarlet', author: 'Arthur Conan Doyle', stock: 1 },
    { code: 'TW-11', title: 'Twilight', author: 'Stephenie Meyer', stock: 1 },
    { code: 'HOB-83', title: 'The Hobbit, or There and Back Again', author: 'J.R.R. Tolkien', stock: 1 },
    { code: 'NRN-7', title: 'The Lion, the Witch and the Wardrobe', author: 'C.S. Lewis', stock: 1 },
  ]);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});