const router = require('express').Router();
const { pratoController } = require('../controllers');
const { uploadCSV, uploadImagem } = require('../middlewares/upload');

// Rota e so a porta de entrada: valida o verbo/URL e chama o controller,
// que tem toda a logica (consulta, calculo, persistencia).
router.get('/', pratoController.list);
router.post('/importar', uploadCSV.single('csv'), pratoController.importCSV);
router.post('/:codigo/preco-venda', pratoController.updatePrecoVenda);
router.post('/:codigo/imagem', uploadImagem.single('imagem'), pratoController.uploadImagem);

module.exports = router;
