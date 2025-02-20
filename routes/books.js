const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');

//authentication
const { isAuthenticated } = require('../middleware/authenticate');
//

//get
router.get('/', bookController.getAll);

router.get('/:id', bookController.getSingle);

// post and put
router.post('/', bookController.createBook);

router.put('/:id', bookController.updateBook);

// delete
router.delete('/:id', bookController.deleteBook);

module.exports = router;