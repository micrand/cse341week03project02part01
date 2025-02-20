const mongodb = require('../config/db');
const ObjectId = require('mongodb').ObjectId;

// Validate data
const validateBookData = (book) => {
    if (!book.title || !book.author_id || !book.edition || !book.pages || !book.genre) {
        return false;
    }
    return true;
};

const getAll = async (req, res) => {
    try {
        //#swagger.tags=['Books']
        const result = await mongodb.getDatabase().db().collection('books').find();
        result.toArray().then((Books) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(Books);
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching books' });
    }
};

const getSingle = async (req, res) => {
    try {
        //#swagger.tags=['Books']
        const bookId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('books').find({ _id: bookId });
        result.toArray().then((Books) => {
            if (Books.length > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(Books[0]);
            } else {
                res.status(404).json({ error: 'Book not found' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching book' });
    }
};

const createBook = async (req, res) => {
    try {
        //#swagger.tags=['Books']
        const book = req.body;        
        
        if (!validateBookData(book)) {
            return res.status(400).json({ error: 'Missing required book field' });
        }

        const response = await mongodb.getDatabase().db().collection('books').insertOne(book);
        if (response.acknowledged) {
            res.status(201).json({ message: 'Book created successfully' });
        } else {
            res.status(500).json({ error: 'Error creating a book' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error creating book' });
    }
};

const updateBook = async (req, res) => {
    try {
        //#swagger.tags=['Books']
        const bookId = new ObjectId(req.params.id);
        const book = req.body;
        
        if (!validateBookData(book)) {
            return res.status(400).json({ error: 'Missing required book field' });
        }

        const response = await mongodb.getDatabase().db().collection('books').replaceOne({ _id: bookId }, book);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating a book' });
    }
};

const deleteBook = async (req, res) => {
    try {
        //#swagger.tags=['Books']
        const bookId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('books').deleteOne({ _id: bookId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting book' });
    }
};

module.exports = {
    getAll,
    getSingle,
    createBook,
    updateBook,
    deleteBook
};