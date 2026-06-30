const { Configuracao } = require('../../models');
const Config = require('../../config/Config');

// A configuracao de calculo (markup, toggles de embalagem) e uma linha
// singleton (id=1). Cria com os defaults do .env se ainda nao existir.
async function getConfiguracao() {
  const [configuracao] = await Configuracao.findOrCreate({
    where: { id: 1 },
    defaults: {
      markup: Config.defaults.markup,
      markup_inclui_embalagem: false,
      cmv_inclui_embalagem: false,
    },
  });
  return configuracao;
}

module.exports = getConfiguracao;
