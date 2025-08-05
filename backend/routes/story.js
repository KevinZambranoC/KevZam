const router = require('express').Router()
const { getStory, userStory, newStory, addSeen, homeStory, reactStory  } = require('../controllers/story')
const { isAuthenticated } = require('../middlewares/auth')

router.route('/').post(isAuthenticated, newStory)
router.route('/home').get(isAuthenticated, homeStory)
router.route('/:id').get(isAuthenticated, getStory)
router.route('/seen/:id').put(isAuthenticated, addSeen)
router.route('/user/:uid').get(isAuthenticated, userStory)
router.route('/react/:id').post(isAuthenticated, reactStory)

module.exports = router