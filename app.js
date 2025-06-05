const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.use('/', authRoutes);
app.use('/books', bookRoutes);
app.use('/', reviewRoutes);

module.exports = app;
