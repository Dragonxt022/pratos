const router = require('express').Router();
const { insumoController } = require('../controllers');

router.get('/', insumoController.list);

module.exports = router;
