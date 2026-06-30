const router = require('express').Router();
const { pratoController } = require('../controllers');

// Formularios HTML simples (sem fetch/JS), por isso so GET/POST -
// nada de PUT/DELETE aqui.
router.get('/', pratoController.editorLista);
router.post('/', pratoController.create);
router.get('/:codigo', pratoController.editor);
router.post('/:codigo', pratoController.update);
router.post('/:codigo/excluir', pratoController.destroy);
router.post('/:codigo/itens', pratoController.addItem);
router.post('/:codigo/itens/:itemId/excluir', pratoController.removeItem);

module.exports = router;
