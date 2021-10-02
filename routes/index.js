const express = require('express');
const router = express.Router();

const contentsController = require('../controllers/contentsController');

router.get('/:linkId', contentsController.getContents);
router.post('/:linkId', contentsController.saveContents);

module.exports = router;
