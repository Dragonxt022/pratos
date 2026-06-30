const { Insumo, ItemPrato } = require('../models');

// GET /insumos
async function list(req, res, next) {
  try {
    const q = (req.query.q || '').trim().toLowerCase();
    const tipo = req.query.tipo || '';

    const insumos = await Insumo.findAll({
      include: [{ model: ItemPrato, as: 'itensPrato' }],
      order: [['nome', 'ASC']],
    });

    const porBusca = insumos.filter(
      (i) => !q || i.nome.toLowerCase().includes(q) || i.codigo.toLowerCase().includes(q)
    );
    const contagens = {
      todos: porBusca.length,
      INSUMO: porBusca.filter((i) => i.tipo === 'INSUMO').length,
      EMBALAGEM: porBusca.filter((i) => i.tipo === 'EMBALAGEM').length,
    };

    const lista = porBusca
      .filter((i) => !tipo || i.tipo === tipo)
      .map((insumo) => {
        const itens = insumo.itensPrato || [];
        const qtdMedia = itens.length
          ? itens.reduce((soma, item) => soma + Number(item.quantidade), 0) / itens.length
          : 0;
        const custoMedio = itens.length
          ? itens.reduce((soma, item) => soma + Number(item.custo_total), 0) / itens.length
          : 0;
        return {
          insumo,
          qtdMedia,
          custoMedio,
          emPratos: itens.length,
        };
      });

    res.render('insumos', {
      title: 'Insumos',
      insumos: lista,
      search: req.query.q || '',
      tipo,
      contagens,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { list };
