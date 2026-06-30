const router = require('express').Router();
const { integracaoController } = require('../controllers');

router.get('/', integracaoController.list);
router.post('/testar', integracaoController.testar);
router.post('/', integracaoController.create);
router.post('/:id', integracaoController.update);
router.post('/:id/excluir', integracaoController.remove);
router.post('/:id/ativar', integracaoController.ativar);
router.post('/:id/sincronizar', integracaoController.sincronizar);

module.exports = router;
