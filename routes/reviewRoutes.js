const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/middleware');
const { addReview, updateReview, deleteReview, searchBooks } = require('../controllers/controller');

router.post('/books/:id/reviews', authenticate, addReview);
router.put('/reviews/:id', authenticate, updateReview);
router.delete('/reviews/:id', authenticate, deleteReview);
router.get('/search', searchBooks);

module.exports = router;