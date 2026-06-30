const { Prato, ItemPrato, Insumo, HistoricoPrecoPrato } = require('../../models');
const { calcularPrato } = require('../../utils/calculoFicha');

// Registra uma nova versao (snapshot) do preco/custo do prato sempre que o
// valor de algum insumo dele mudar - seja por reimportacao de CSV ou por
// edicao manual de itens no Editor de Pratos. Guarda custo de insumos,
// custo de embalagem, custo total, preco sugerido e CMV no momento exato
// da mudanca, para alimentar o grafico do dashboard e a pagina
// /analise-precos.
//
// Evita registros duplicados: se o custo total nao mudou desde a ultima
// versao (ex.: reimportacao de CSV com os mesmos valores), nao cria nada.
async function registrarHistoricoPreco(pratoId, configuracao, transaction) {
  const prato = await Prato.findByPk(pratoId, {
    include: [{ model: ItemPrato, as: 'itens', include: [{ model: Insumo, as: 'insumo' }] }],
    transaction,
  });
  if (!prato) return null;

  const calc = calcularPrato(prato, configuracao);

  const ultimo = await HistoricoPrecoPrato.findOne({
    where: { prato_id: pratoId },
    order: [['created_at', 'DESC']],
    transaction,
  });

  const custoMudou = !ultimo || Math.abs(Number(ultimo.custo_total) - calc.custoTotal) > 0.004;
  if (!custoMudou) return ultimo;

  return HistoricoPrecoPrato.create(
    {
      prato_id: pratoId,
      custo_insumos: calc.custoInsumos,
      custo_embalagem: calc.custoEmbalagem,
      custo_total: calc.custoTotal,
      preco_sugerido: calc.precoSugerido,
      cmv: calc.cmv,
    },
    { transaction }
  );
}

module.exports = registrarHistoricoPreco;
