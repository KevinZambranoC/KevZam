const { getMessages, addMessage } = require('../controllers/message');
const { isAuthenticated } = require('../middlewares/auth');
const router = require('express').Router();

router.route('/:roomId').get(isAuthenticated, getMessages);
router.route('/send').post(isAuthenticated, addMessage);

module.exports = router;