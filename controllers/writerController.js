const mongodb = require('../config/db');
const ObjectId = require('mongodb').ObjectId;

// Validate data
const validateWriterData = (writer) => {
    if (!writer.name || !writer.birth || !writer.nationality || !writer.genre) {
        return false;
    }
    return true;
};

const getAllWriters = async (req, res) => {
    try {
        //#swagger.tags=['Writers']
        const result = await mongodb.getDatabase().db().collection('writers').find();
        result.toArray().then((writers) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(writers);
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching writers' });
    }
};

const getSingleWriter = async (req, res) => {
    try {
        //#swagger.tags=['Writers']
        const WriterId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('writers').find({ _id: WriterId });
        result.toArray().then((writers) => {
            if (writers.length > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(writers[0]);
            } else {
                res.status(404).json({ error: 'Writer not found' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching writer' });
    }
};

const createWriter = async (req, res) => {
    try {
        //#swagger.tags=['Writers']
        const writer = req.body;        
        
        if (!validateWriterData(writer)) {
            return res.status(400).json({ error: 'Missing required writer field' });
        }

        const response = await mongodb.getDatabase().db().collection('writers').insertOne(writer);
        if (response.acknowledged) {
            res.status(201).json({ message: 'Writer created successfully' });
        } else {
            res.status(500).json({ error: 'Error creating the writer' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error creating writer' });
    }
};

const updateWriter = async (req, res) => {
    try {
        //#swagger.tags=['Writers']
        const WriterId = new ObjectId(req.params.id);
        const writer = req.body;
        
        // Validate data
        if (!validateWriterData(writer)) {
            return res.status(400).json({ error: 'Missing required writer fields' });
        }

        const response = await mongodb.getDatabase().db().collection('writers').replaceOne({ _id: WriterId }, writer);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Writer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating writer' });
    }
};

const deleteWriter = async (req, res) => {
    try {
        //#swagger.tags=['Writers']
        const WriterId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('writers').deleteOne({ _id: WriterId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Writer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting writer' });
    }
};

module.exports = {
    getAllWriters,
    getSingleWriter,
    createWriter,
    updateWriter,
    deleteWriter
};