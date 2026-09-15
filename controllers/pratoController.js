const { Prato, Insumo, ItemPrato, HistoricoPrecoPrato, sequelize } = require('../models');
const getConfiguracao = require('./helpers/getConfiguracao');
const registrarHistoricoPreco = require('./helpers/registrarHistoricoPreco');
const registrarHistoricoPrecoInsumo = require('./helpers/registrarHistoricoPrecoInsumo');
const { calcularPrato } = require('../utils/calculoFicha');
const logger = require('../utils/logger');

function serializeItens(itens) {
  return (itens || []).map((item) => ({
    id: item.id,
    insumo_id: item.insumo_id,
    nome: item.insumo ? item.insumo.nome : '',
    codigo: item.insumo ? item.insumo.codigo : '',
    tipo: item.insumo ? item.insumo.tipo : '',
    unidade: item.insumo ? item.insumo.unidade : '',
    quantidade: Number(item.quantidade),
    custo_total: Number(item.custo_total),
  }));
}

// Remove prato(s) e seus dependentes (itens e historico) de forma explicita.
// Necessario porque o sync() do SQLite cria as FKs de prato_id como
// ON DELETE NO ACTION e o destroy em massa nao dispara os hooks de cascata
// das associacoes, o que resultava em FOREIGN KEY constraint failed.
async function removerPratos(where) {
  return sequelize.transaction(async (t) => {
    const pratos = await Prato.findAll({ where, attributes: ['id'], transaction: t });
    const ids = pratos.map((p) => p.id);
    if (!ids.length) return 0;
    await HistoricoPrecoPrato.destroy({ where: { prato_id: ids }, transaction: t });
    await ItemPrato.destroy({ where: { prato_id: ids }, transaction: t });
    await Prato.destroy({ where: { id: ids }, transaction: t });
    return ids.length;
  });
}

// GET /fichas
async function list(req, res, next) {
  try {
    const q = (req.query.q || '').trim().toLowerCase();
    const configuracao = await getConfiguracao();
    const pratos = await Prato.findAll({
      include: [{ model: ItemPrato, as: 'itens', include: [{ model: Insumo, as: 'insumo' }] }],
      order: [['nome', 'ASC']],
    });

    const lista = pratos
      .filter((p) => !q || p.nome.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q))
      .map((prato) => ({
        prato,
        calc: calcularPrato(prato, configuracao),
        itens: serializeItens(prato.itens),
      }));

    res.render('fichas', {
      title: 'Fichas',
      pratos: lista,
      search: req.query.q || '',
      configuracao,
      mensagem: req.query.importado ? `${req.query.importado} prato(s) importado(s).` : null,
    });
  } catch (error) {
    next(error);
  }
}

// GET /fichas/imprimir — folha A4 com 4 fichas por pagina.
// Respeita o filtro de busca (q) e permite incluir/omitir as fotos (foto=0).
async function imprimir(req, res, next) {
  try {
    const q = (req.query.q || '').trim().toLowerCase();
    const incluirFotos = req.query.foto !== '0';
    const configuracao = await getConfiguracao();
    const pratos = await Prato.findAll({
      include: [{ model: ItemPrato, as: 'itens', include: [{ model: Insumo, as: 'insumo' }] }],
      order: [['nome', 'ASC']],
    });

    const lista = pratos
      .filter((p) => !q || p.nome.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q))
      .map((prato) => ({
        prato,
        calc: calcularPrato(prato, configuracao),
        itens: serializeItens(prato.itens),
      }));

    res.render('fichas-impressao', {
      title: 'Impressao de Fichas',
      layout: false,
      pratos: lista,
      search: req.query.q || '',
      incluirFotos,
      configuracao,
    });
  } catch (error) {
    next(error);
  }
}

// POST /fichas/:codigo/preco-venda
async function updatePrecoVenda(req, res, next) {
  try {
    const { codigo } = req.params;
    const valor = String(req.body.preco_venda || '').replace(',', '.');
    const precoVenda = valor ? parseFloat(valor) : null;
    await Prato.update({ preco_venda: precoVenda }, { where: { codigo } });
    res.redirect('/fichas');
  } catch (error) {
    next(error);
  }
}

// GET /editor — lista de pratos com stats calculados
async function editorLista(req, res, next) {
  try {
    const configuracao = await getConfiguracao();
    const pratos = await Prato.findAll({
      include: [{ model: ItemPrato, as: 'itens', include: [{ model: Insumo, as: 'insumo' }] }],
      order: [['nome', 'ASC']],
    });
    const lista = pratos.map((prato) => ({
      prato,
      calc: calcularPrato(prato, configuracao),
      itens: serializeItens(prato.itens),
    }));
    res.render('editor', {
      title: 'Editor de Pratos',
      pratos: lista,
      mensagem: req.query.excluidos ? `${req.query.excluidos} prato(s) excluido(s).` : null,
    });
  } catch (error) {
    next(error);
  }
}

// GET /editor/:codigo — pagina de edicao full-width
async function editor(req, res, next) {
  try {
    const { codigo } = req.params;
    const insumos = await Insumo.findAll({ order: [['nome', 'ASC']] });
    const pratoSelecionado = await Prato.findOne({
      where: { codigo },
      include: [{ model: ItemPrato, as: 'itens', include: [{ model: Insumo, as: 'insumo' }] }],
    });
    if (!pratoSelecionado) return res.redirect('/editor');
    const configuracao = await getConfiguracao();
    const itens = serializeItens(pratoSelecionado.itens);
    const calc = calcularPrato(pratoSelecionado, configuracao);
    res.render('editor-detalhe', {
      title: pratoSelecionado.nome,
      pratoSelecionado,
      itens,
      insumos,
      calc,
    });
  } catch (error) {
    next(error);
  }
}

// POST /editor
async function create(req, res, next) {
  try {
    const { codigo, nome, rendimento } = req.body;
    const prato = await Prato.create({
      codigo: String(codigo).trim(),
      nome: String(nome).trim(),
      rendimento: parseFloat(String(rendimento).replace(',', '.')) || 1,
    });
    res.redirect('/editor/' + encodeURIComponent(prato.codigo));
  } catch (error) {
    next(error);
  }
}

// PUT /editor/:codigo
async function update(req, res, next) {
  try {
    const { codigo } = req.params;
    const { nome, rendimento, preco_venda } = req.body;
    await Prato.update(
      {
        nome,
        rendimento: parseFloat(String(rendimento).replace(',', '.')) || 1,
        preco_venda: preco_venda ? parseFloat(String(preco_venda).replace(',', '.')) : null,
      },
      { where: { codigo } }
    );
    res.redirect('/editor/' + encodeURIComponent(codigo));
  } catch (error) {
    next(error);
  }
}

// POST /editor/:codigo/excluir
async function destroy(req, res, next) {
  try {
    const { codigo } = req.params;
    await removerPratos({ codigo });
    res.redirect('/editor');
  } catch (error) {
    next(error);
  }
}

// POST /editor/excluir-massa — remove varios pratos selecionados na listagem.
async function destroyMassa(req, res, next) {
  try {
    let codigos = req.body.codigos || [];
    if (!Array.isArray(codigos)) codigos = [codigos];
    codigos = codigos.map((c) => String(c).trim()).filter(Boolean);
    if (!codigos.length) return res.redirect('/editor');
    const total = await removerPratos({ codigo: codigos });
    res.redirect('/editor?excluidos=' + total);
  } catch (error) {
    next(error);
  }
}

// POST /editor/:codigo/itens
async function addItem(req, res, next) {
  try {
    const { codigo } = req.params;
    const { insumo_id, quantidade, custo_total } = req.body;
    const prato = await Prato.findOne({ where: { codigo } });
    if (!prato) return res.redirect('/editor');
    await ItemPrato.create({
      prato_id: prato.id,
      insumo_id,
      quantidade: parseFloat(String(quantidade).replace(',', '.')) || 0,
      custo_total: parseFloat(String(custo_total).replace(',', '.')) || 0,
    });
    const configuracao = await getConfiguracao();
    await registrarHistoricoPreco(prato.id, configuracao);
    await registrarHistoricoPrecoInsumo(insumo_id);
    res.redirect('/editor/' + encodeURIComponent(codigo));
  } catch (error) {
    next(error);
  }
}

// DELETE /editor/:codigo/itens/:itemId
async function removeItem(req, res, next) {
  try {
    const { codigo, itemId } = req.params;
    const prato = await Prato.findOne({ where: { codigo } });
    const item = await ItemPrato.findOne({ where: { id: itemId } });
    const insumoId = item ? item.insumo_id : null;
    await ItemPrato.destroy({ where: { id: itemId } });
    if (prato) {
      const configuracao = await getConfiguracao();
      await registrarHistoricoPreco(prato.id, configuracao);
    }
    if (insumoId) {
      await registrarHistoricoPrecoInsumo(insumoId);
    }
    res.redirect('/editor/' + encodeURIComponent(codigo));
  } catch (error) {
    next(error);
  }
}

// POST /fichas/:codigo/imagem  (voltar pode ser /fichas ou /editor/:codigo)
async function uploadImagem(req, res, next) {
  try {
    const { codigo } = req.params;
    if (req.file) {
      const imagemUrl = '/uploads/pratos/' + req.file.filename;
      await Prato.update({ imagem_url: imagemUrl }, { where: { codigo } });
    }
    res.redirect(req.body.voltar || '/fichas');
  } catch (error) {
    next(error);
  }
}

/* -- IMPORTACAO CSV --
   Mesmo formato usado no prototipo:
   CODIGO_PRATO, NOME_PRATO, RENDIMENTO, TIPO_ITEM, CODIGO_ITEM, NOME_ITEM, UNIDADE, QUANTIDADE, CUSTO_TOTAL
*/
function parseCSV(texto) {
  const linhas = texto.replace(/\r/g, '').trim().split('\n');
  const sep = (linhas[0].match(/;/g) || []).length > (linhas[0].match(/,/g) || []).length ? ';' : ',';
  const splitLinha = (linha) => {
    const res = [];
    let cur = '';
    let aspas = false;
    for (let i = 0; i < linha.length; i++) {
      const ch = linha[i];
      if (ch === '"') {
        aspas = !aspas;
        continue;
      }
      if (ch === sep && !aspas) {
        res.push(cur.trim());
        cur = '';
        continue;
      }
      cur += ch;
    }
    res.push(cur.trim());
    return res;
  };
  const cabecalho = splitLinha(linhas[0]);
  return linhas
    .slice(1)
    .map((linha) => {
      const valores = splitLinha(linha);
      const obj = {};
      cabecalho.forEach((h, i) => {
        obj[h] = (valores[i] || '').trim();
      });
      return obj;
    })
    .filter((row) => row[cabecalho[0]]);
}

function parseMoeda(valor) {
  if (!valor) return 0;
  return parseFloat(String(valor).replace(/R\$\s?/, '').replace(/\./g, '').replace(',', '.')) || 0;
}

// POST /fichas/importar  (multipart, campo "csv")
async function importCSV(req, res, next) {
  if (!req.file) {
    return res.redirect('/fichas?erro=arquivo_ausente');
  }
  const t = await sequelize.transaction();
  try {
    const texto = req.file.buffer.toString('utf-8');
    const linhas = parseCSV(texto);
    if (!linhas.length) {
      await t.rollback();
      return res.redirect('/fichas?erro=csv_vazio');
    }

    const pratosImportados = new Set();
    const pratoIdsImportados = new Set();
    const insumoIdsImportados = new Set();

    for (const linha of linhas) {
      const codigoPrato = linha.CODIGO_PRATO;
      if (!codigoPrato) continue;

      const [prato] = await Prato.findOrCreate({
        where: { codigo: codigoPrato },
        defaults: {
          nome: linha.NOME_PRATO || codigoPrato,
          rendimento: parseFloat(String(linha.RENDIMENTO).replace(',', '.')) || 1,
        },
        transaction: t,
      });

      const tipo = (linha.TIPO_ITEM || '').toUpperCase() === 'EMBALAGEM' ? 'EMBALAGEM' : 'INSUMO';
      const [insumo] = await Insumo.findOrCreate({
        where: { codigo: linha.CODIGO_ITEM },
        defaults: {
          nome: linha.NOME_ITEM || linha.CODIGO_ITEM,
          tipo,
          unidade: linha.UNIDADE || 'un',
        },
        transaction: t,
      });

      const quantidade = parseFloat(String(linha.QUANTIDADE).replace(',', '.')) || 0;
      const custoTotal = parseMoeda(linha.CUSTO_TOTAL);

      const itemExistente = await ItemPrato.findOne({
        where: { prato_id: prato.id, insumo_id: insumo.id },
        transaction: t,
      });

      if (itemExistente) {
        await itemExistente.update({ quantidade, custo_total: custoTotal }, { transaction: t });
      } else {
        await ItemPrato.create(
          { prato_id: prato.id, insumo_id: insumo.id, quantidade, custo_total: custoTotal },
          { transaction: t }
        );
      }

      pratosImportados.add(codigoPrato);
      pratoIdsImportados.add(prato.id);
      insumoIdsImportados.add(insumo.id);
    }

    const configuracaoAtual = await getConfiguracao();
    for (const pratoId of pratoIdsImportados) {
      await registrarHistoricoPreco(pratoId, configuracaoAtual, t);
    }
    for (const insumoId of insumoIdsImportados) {
      await registrarHistoricoPrecoInsumo(insumoId, t);
    }

    await t.commit();
    logger.info(`Importacao CSV concluida: ${pratosImportados.size} prato(s)`);
    res.redirect('/fichas?importado=' + pratosImportados.size);
  } catch (error) {
    await t.rollback();
    logger.error('Erro ao importar CSV', error);
    next(error);
  }
}

module.exports = {
  list,
  imprimir,
  updatePrecoVenda,
  editorLista,
  editor,
  create,
  update,
  destroy,
  destroyMassa,
  addItem,
  removeItem,
  uploadImagem,
  importCSV,
  serializeItens,
};
