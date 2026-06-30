// Formulas da ficha tecnica - espelham exatamente o que o prototipo HTML
// (taiksu-ficha-tecnica.html) fazia no browser, agora calculado no
// controller a partir dos dados do banco.
//
// prato: instancia (ou objeto) com `itens`, cada item com `insumo.tipo`,
//        `insumo.unidade`, `quantidade`, `custo_total`.
// configuracao: { markup, markup_inclui_embalagem, cmv_inclui_embalagem }

function toNumber(value) {
  return value === null || value === undefined ? 0 : Number(value);
}

function calcularPrato(prato, configuracao) {
  const itens = prato.itens || [];
  const insumos = itens.filter((item) => item.insumo && item.insumo.tipo === 'INSUMO');
  const embalagens = itens.filter((item) => item.insumo && item.insumo.tipo === 'EMBALAGEM');

  const custoInsumos = insumos.reduce((soma, item) => soma + toNumber(item.custo_total), 0);
  const custoEmbalagem = embalagens.reduce((soma, item) => soma + toNumber(item.custo_total), 0);
  const custoTotal = custoInsumos + custoEmbalagem;

  const markup = toNumber(configuracao.markup) || 3.5;
  const baseMarkup = configuracao.markup_inclui_embalagem ? custoTotal : custoInsumos;
  const precoSugerido = baseMarkup * markup;

  const precoVenda = toNumber(prato.preco_venda);
  const baseCmv = configuracao.cmv_inclui_embalagem ? custoTotal : custoInsumos;
  const cmv = precoVenda > 0 ? (baseCmv / precoVenda) * 100 : null;
  const margem = precoVenda > 0 ? ((precoVenda - custoTotal) / precoVenda) * 100 : null;

  const pesoTotal = itens
    .filter((item) => item.insumo && (item.insumo.unidade === 'g' || item.insumo.unidade === 'ml'))
    .reduce((soma, item) => soma + toNumber(item.quantidade), 0);

  return {
    custoInsumos,
    custoEmbalagem,
    custoTotal,
    precoSugerido,
    precoVenda,
    cmv,
    margem,
    pesoTotal,
  };
}

function classificarCmv(cmv) {
  if (cmv === null || cmv === undefined) return null;
  if (cmv <= 35) return 'ok';
  if (cmv <= 50) return 'warn';
  return 'bad';
}

module.exports = { calcularPrato, classificarCmv, toNumber };
