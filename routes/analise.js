const router = require('express').Router();
const { historicoController } = require('../controllers');

router.get('/', historicoController.analise);

module.exports = router;
