const { Insumo, HistoricoPrecoInsumo, IntegracaoApi } = require('../../models');
const buscarJsonApi = require('./buscarJsonApi');

// Le um campo do item da API, com suporte a caminho com ponto (ex.:
// "produto.codigo") para JSONs aninhados.
function getCampo(obj, caminho) {
  if (!caminho) return undefined;
  return caminho
    .split('.')
    .reduce((acc, parte) => (acc && typeof acc === 'object' ? acc[parte] : undefined), obj);
}

async function registrarFalha(integracao, mensagem) {
  await integracao.update({
    ultima_sincronizacao: new Date(),
    ultimo_status: 'erro',
    ultimo_resultado: mensagem,
  });
}

// Executa a sincronizacao de uma integracao: busca a lista de itens na API
// externa e faz upsert dos insumos (codigo/nome/unidade), aplicando o
// tipo_padrao fixo (a API nao informa INSUMO/EMBALAGEM). Se o mapeamento
// incluir um campo de custo, registra tambem um snapshot em
// historico_precos_insumos quando o valor mudar - alimentando o grafico de
// /analise-precos diretamente com o preco informado pelo fornecedor.
async function sincronizarIntegracaoApi(integracaoId) {
  const integracao = await IntegracaoApi.findByPk(integracaoId);
  if (!integracao) throw new Error('Integracao nao encontrada');

  const mp = integracao.mapeamento || {};

  let lista;
  try {
    lista = await buscarJsonApi(integracao.url, integracao.metodo, integracao.auth_header, mp.lista || undefined);
  } catch (err) {
    await registrarFalha(integracao, err.message);
    throw err;
  }

  if (!lista.length) {
    const resumo = 'A API retornou 0 itens - nenhuma alteracao realizada.';
    await integracao.update({
      ultima_sincronizacao: new Date(),
      ultimo_status: 'sucesso',
      ultimo_resultado: resumo,
    });
    return { criados: 0, atualizados: 0, ignorados: 0, total: 0, resumo };
  }

  let criados = 0;
  let atualizados = 0;
  let ignorados = 0;

  for (const item of lista) {
    const codigo = getCampo(item, mp.codigo);
    const nome = getCampo(item, mp.nome);
    if (!codigo || !nome) {
      ignorados += 1;
      continue;
    }
    const unidadeBruta = mp.unidade ? getCampo(item, mp.unidade) : null;
    const unidade = unidadeBruta ? String(unidadeBruta) : 'un';

    const [insumo, foiCriado] = await Insumo.findOrCreate({
      where: { codigo: String(codigo) },
      defaults: {
        nome: String(nome),
        tipo: integracao.tipo_padrao,
        unidade,
      },
    });

    if (foiCriado) {
      criados += 1;
    } else {
      await insumo.update({ nome: String(nome), unidade });
      atualizados += 1;
    }

    if (mp.custo_unitario) {
      const custoBruto = getCampo(item, mp.custo_unitario);
      const custoUnitario = parseFloat(String(custoBruto).replace(',', '.'));
      if (Number.isFinite(custoUnitario)) {
        const ultimo = await HistoricoPrecoInsumo.findOne({
          where: { insumo_id: insumo.id },
          order: [['created_at', 'DESC']],
        });
        const mudou = !ultimo || Math.abs(Number(ultimo.custo_unitario) - custoUnitario) > 0.0005;
        if (mudou) {
          await HistoricoPrecoInsumo.create({
            insumo_id: insumo.id,
            custo_unitario: custoUnitario,
            custo_total_uso: custoUnitario,
          });
        }
      }
    }
  }

  const resumo = `${criados} criado(s), ${atualizados} atualizado(s), ${ignorados} ignorado(s) (sem codigo/nome) de ${lista.length} item(ns).`;
  await integracao.update({
    ultima_sincronizacao: new Date(),
    ultimo_status: 'sucesso',
    ultimo_resultado: resumo,
  });

  return { criados, atualizados, ignorados, total: lista.length, resumo };
}

module.exports = sincronizarIntegracaoApi;
