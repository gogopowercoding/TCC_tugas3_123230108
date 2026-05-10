const express = require('express');
const router = express.Router();
const controller = require('../controllers/noteController');

router.get('/user/:user_id', controller.getNotesByUser);
router.post('/', controller.createNote);
router.put('/:id', controller.updateNote);
router.delete('/:id', controller.deleteNote);

module.exports = router;