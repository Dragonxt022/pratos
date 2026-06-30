const { ItemPrato, HistoricoPrecoInsumo } = require('../../models');

// Registra uma nova versao (snapshot) do custo unitario de um insumo
// sempre que ele mudar - seja por reimportacao de CSV ou por edicao manual
// de itens no Editor de Pratos. O custo unitario e a media ponderada entre
// todos os usos atuais daquele insumo: soma(custo_total) / soma(quantidade).
// Isso lida bem com o caso (comum apos importacao de CSV) de o mesmo
// insumo aparecer em varios pratos com custos levemente diferentes.
//
// Evita registros duplicados: se o custo unitario nao mudou desde a
// ultima versao, nao cria nada.
async function registrarHistoricoPrecoInsumo(insumoId, transaction) {
  const itens = await ItemPrato.findAll({
    where: { insumo_id: insumoId },
    transaction,
  });

  const qtdTotal = itens.reduce((soma, item) => soma + Number(item.quantidade), 0);
  const custoTotalUso = itens.reduce((soma, item) => soma + Number(item.custo_total), 0);
  const custoUnitario = qtdTotal > 0 ? custoTotalUso / qtdTotal : 0;

  const ultimo = await HistoricoPrecoInsumo.findOne({
    where: { insumo_id: insumoId },
    order: [['created_at', 'DESC']],
    transaction,
  });

  const custoMudou = !ultimo || Math.abs(Number(ultimo.custo_unitario) - custoUnitario) > 0.0005;
  if (!custoMudou) return ultimo;

  return HistoricoPrecoInsumo.create(
    {
      insumo_id: insumoId,
      custo_unitario: custoUnitario,
      custo_total_uso: custoTotalUso,
    },
    { transaction }
  );
}

module.exports = registrarHistoricoPrecoInsumo;
