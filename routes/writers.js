const express = require('express');
const router = express.Router();

const writerController = require('../controllers/writerController');

//authentication
// const { isAuthenticated } = require('../middleware/authenticate');
//

router.get('/', writerController.getAllWriters);

router.get('/:id', writerController.getSingleWriter);

//part 2
router.post('/', writerController.createWriter);

router.put('/:id', writerController.updateWriter);

router.delete('/:id', writerController.deleteWriter);

module.exports = router;