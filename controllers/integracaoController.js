const { IntegracaoApi } = require('../models');
const buscarJsonApi = require('./helpers/buscarJsonApi');
const sincronizarIntegracaoApi = require('./helpers/sincronizarIntegracaoApi');

// Achata um objeto em uma lista de caminhos "ponto" (ex.: { produto: { sku: 1 } }
// -> ["produto.sku"]) - usado para sugerir campos disponiveis no mapeamento
// apos o "Testar conexao", ja que a API externa pode ter qualquer formato.
function detectarCampos(obj, prefixo = '') {
  let campos = [];
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return campos;
  for (const chave of Object.keys(obj)) {
    const caminho = prefixo ? `${prefixo}.${chave}` : chave;
    const valor = obj[chave];
    if (valor !== null && typeof valor === 'object' && !Array.isArray(valor)) {
      campos = campos.concat(detectarCampos(valor, caminho));
    } else {
      campos.push(caminho);
    }
  }
  return campos;
}

function montarMapeamento(body) {
  const mapeamento = {
    codigo: (body.campo_codigo || '').trim(),
    nome: (body.campo_nome || '').trim(),
  };
  if (body.campo_lista && body.campo_lista.trim()) mapeamento.lista = body.campo_lista.trim();
  if (body.campo_unidade && body.campo_unidade.trim()) mapeamento.unidade = body.campo_unidade.trim();
  if (body.campo_custo_unitario && body.campo_custo_unitario.trim()) {
    mapeamento.custo_unitario = body.campo_custo_unitario.trim();
  }
  return mapeamento;
}

// GET /api-integracoes
async function list(req, res, next) {
  try {
    const integracoes = await IntegracaoApi.findAll({ order: [['nome', 'ASC']] });
    res.render('integracoes', {
      title: 'API',
      integracoes,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api-integracoes/testar - preview AJAX, nao persiste nada
async function testar(req, res) {
  try {
    const { url, metodo, auth_header: authHeader, campo_lista: caminhoLista } = req.body;
    if (!url || !url.trim()) {
      return res.status(400).json({ ok: false, erro: 'Informe a URL.' });
    }
    const lista = await buscarJsonApi(url.trim(), metodo, authHeader, caminhoLista || undefined);
    if (!lista.length) {
      return res.json({ ok: true, total: 0, campos: [], amostra: null, aviso: 'A API retornou uma lista vazia. Nao e possivel detectar campos sem ao menos 1 item.' });
    }
    const amostra = lista[0];
    const campos = detectarCampos(amostra);
    res.json({ ok: true, total: lista.length, campos, amostra });
  } catch (error) {
    res.status(200).json({ ok: false, erro: error.message });
  }
}

// POST /api-integracoes
async function create(req, res, next) {
  try {
    const intervalo = parseInt(req.body.intervalo_minutos, 10);
    await IntegracaoApi.create({
      nome: (req.body.nome || '').trim(),
      url: (req.body.url || '').trim(),
      metodo: req.body.metodo === 'POST' ? 'POST' : 'GET',
      tipo_padrao: req.body.tipo_padrao === 'EMBALAGEM' ? 'EMBALAGEM' : 'INSUMO',
      mapeamento: montarMapeamento(req.body),
      auth_header: req.body.auth_header && req.body.auth_header.trim() ? req.body.auth_header.trim() : null,
      intervalo_minutos: Number.isFinite(intervalo) && intervalo > 0 ? intervalo : 360,
      ativo: req.body.ativo === 'on',
    });
    res.redirect('/api-integracoes');
  } catch (error) {
    next(error);
  }
}

// POST /api-integracoes/:id
async function update(req, res, next) {
  try {
    const integracao = await IntegracaoApi.findByPk(req.params.id);
    if (!integracao) return res.redirect('/api-integracoes');

    const intervalo = parseInt(req.body.intervalo_minutos, 10);
    await integracao.update({
      nome: (req.body.nome || '').trim(),
      url: (req.body.url || '').trim(),
      metodo: req.body.metodo === 'POST' ? 'POST' : 'GET',
      tipo_padrao: req.body.tipo_padrao === 'EMBALAGEM' ? 'EMBALAGEM' : 'INSUMO',
      mapeamento: montarMapeamento(req.body),
      auth_header: req.body.auth_header && req.body.auth_header.trim() ? req.body.auth_header.trim() : null,
      intervalo_minutos: Number.isFinite(intervalo) && intervalo > 0 ? intervalo : 360,
    });
    res.redirect('/api-integracoes');
  } catch (error) {
    next(error);
  }
}

// POST /api-integracoes/:id/excluir
async function remove(req, res, next) {
  try {
    const integracao = await IntegracaoApi.findByPk(req.params.id);
    if (integracao) await integracao.destroy();
    res.redirect('/api-integracoes');
  } catch (error) {
    next(error);
  }
}

// POST /api-integracoes/:id/ativar - liga/desliga a sincronizacao automatica
async function ativar(req, res, next) {
  try {
    const integracao = await IntegracaoApi.findByPk(req.params.id);
    if (integracao) await integracao.update({ ativo: !integracao.ativo });
    res.redirect('/api-integracoes');
  } catch (error) {
    next(error);
  }
}

// POST /api-integracoes/:id/sincronizar - disparo manual (mesma logica do
// agendador automatico, usada quando o usuario quer sincronizar agora)
async function sincronizar(req, res, next) {
  try {
    await sincronizarIntegracaoApi(req.params.id);
  } catch (error) {
    // erro ja foi registrado em ultimo_status/ultimo_resultado pelo helper;
    // segue para a listagem em vez de quebrar a pagina.
  }
  res.redirect('/api-integracoes');
}

module.exports = { list, testar, create, update, remove, ativar, sincronizar };
