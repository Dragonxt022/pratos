const { Prato, Insumo, ItemPrato, HistoricoPrecoPrato, sequelize } = require('../models');
const getConfiguracao = require('./helpers/getConfiguracao');
const { calcularPrato } = require('../utils/calculoFicha');

// Tendencia de custo medio do cardapio: para cada dia em que houve pelo
// menos um snapshot de preco registrado (reimportacao de CSV ou edicao no
// Editor), calcula a media do custo total de todos os pratos atualizados
// naquele dia. Alimenta o grafico de linha "Tendencia de custo" no
// dashboard.
async function buscarTendenciaCusto() {
  const linhas = await HistoricoPrecoPrato.findAll({
    attributes: [
      [sequelize.fn('DATE', sequelize.col('created_at')), 'dia'],
      [sequelize.fn('AVG', sequelize.col('custo_total')), 'custo_medio'],
    ],
    group: [sequelize.fn('DATE', sequelize.col('created_at'))],
    order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
    raw: true,
  });

  return {
    labels: linhas.map((l) => {
      const d = new Date(l.dia);
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    }),
    valores: linhas.map((l) => Number(parseFloat(l.custo_medio).toFixed(2))),
  };
}

// GET /
async function index(req, res, next) {
  try {
    const configuracao = await getConfiguracao();
    const pratos = await Prato.findAll({
      include: [{ model: ItemPrato, as: 'itens', include: [{ model: Insumo, as: 'insumo' }] }],
      order: [['nome', 'ASC']],
    });

    const calculos = pratos.map((prato) => ({ prato, calc: calcularPrato(prato, configuracao) }));
    const totalPratos = calculos.length;
    const comPreco = calculos.filter((c) => c.calc.cmv !== null);

    const cmvMedio = comPreco.length ? comPreco.reduce((s, c) => s + c.calc.cmv, 0) / comPreco.length : null;
    const margemMedia = comPreco.length ? comPreco.reduce((s, c) => s + c.calc.margem, 0) / comPreco.length : null;
    const custoMedio = totalPratos ? calculos.reduce((s, c) => s + c.calc.custoTotal, 0) / totalPratos : 0;
    const valorTotalProducao = calculos.reduce((s, c) => s + c.calc.custoTotal, 0);

    const kpis = { totalPratos, custoMedio, cmvMedio, margemMedia, valorTotalProducao };

    const charts = {
      labels: calculos.map((c) => c.prato.nome),
      cmv: calculos.map((c) => (c.calc.cmv !== null ? Number(c.calc.cmv.toFixed(1)) : null)),
      margem: calculos.map((c) => (c.calc.margem !== null ? Number(c.calc.margem.toFixed(1)) : null)),
      custoTotal: calculos.map((c) => Number(c.calc.custoTotal.toFixed(2))),
    };

    const tendenciaCusto = await buscarTendenciaCusto();

    res.render('dashboard', {
      title: 'Dashboard',
      kpis,
      charts,
      tendenciaCusto,
      temDados: totalPratos > 0,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { index };
