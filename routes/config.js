const router = require('express').Router();
const { configController } = require('../controllers');

router.post('/', configController.update);

module.exports = router;
