const User = require('../models/userModel');
const Book = require('../models/bookModel');
const Review = require('../models/reviewModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed });
        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addBook = async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getBooks = async (req, res) => {
    const { author, genre, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (author) filter.author = new RegExp(author, 'i');
    if (genre) filter.genre = new RegExp(genre, 'i');

    const books = await Book.find(filter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    res.json(books);
};


const getBookById = async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const book = await Book.findById(req.params.id);

        const reviews = await Review.find({ book: book._id })
            .populate('user', 'name')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const avgRating = await Review.aggregate([
            { $match: { book: book._id } },
            { $group: { _id: null, avg: { $avg: '$rating' } } }
        ]);

        res.json({ book, reviews, averageRating: avgRating[0]?.avg || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const searchBooks = async (req, res) => {
    const { title, author } = req.query;
    const filter = {};
    if (title) filter.title = new RegExp(title, 'i');
    if (author) filter.author = new RegExp(author, 'i');
    const books = await Book.find(filter);
    res.json(books);
};

const addReview = async (req, res) => {
    try {
        const existingReview = await Review.findOne({
            user: req.user.id,
            book: req.params.id
        });

        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this book' });
        }

        const review = await Review.create({
            user: req.user.id,
            book: req.params.id,
            ...req.body,
        });

        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const updateReview = async (req, res) => {
    try {
        const review = await Review.findOneAndUpdate(
            { book: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        console.log(req.params.id)
        if (!review) return res.status(404).json({ error: 'Not found' });
        res.json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({ book: req.params.id, user: req.user.id });
        if (!review) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    signup,
    login,
    addBook,
    getBooks,
    getBookById,
    searchBooks,
    addReview,
    updateReview,
    deleteReview
};
