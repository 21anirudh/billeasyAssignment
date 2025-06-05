const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/middleware');
const { addBook, getBooks, getBookById } = require('../controllers/controller');

router.post('/', authenticate, addBook);
router.get('/', getBooks);
router.get('/:id', getBookById);

module.exports = router;
