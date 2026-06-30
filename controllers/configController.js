const getConfiguracao = require('./helpers/getConfiguracao');

// POST /config
async function update(req, res, next) {
  try {
    const configuracao = await getConfiguracao();
    const markupInformado = parseFloat(String(req.body.markup).replace(',', '.'));
    const markup = Number.isFinite(markupInformado) && markupInformado > 0 ? markupInformado : configuracao.markup;

    await configuracao.update({
      markup,
      markup_inclui_embalagem: req.body.markup_inclui_embalagem === 'on' || req.body.markup_inclui_embalagem === 'true',
      cmv_inclui_embalagem: req.body.cmv_inclui_embalagem === 'on' || req.body.cmv_inclui_embalagem === 'true',
    });

    res.redirect(req.body.voltar || '/fichas');
  } catch (error) {
    next(error);
  }
}

module.exports = { update };
