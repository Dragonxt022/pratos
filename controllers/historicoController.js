const { Prato, Insumo, HistoricoPrecoPrato, HistoricoPrecoInsumo } = require('../models');

function formatarChave(data, periodo) {
  const d = new Date(data);
  if (periodo === 'ano') return String(d.getFullYear());
  if (periodo === 'mes') return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

// Agrupa os snapshots por dia/mes/ano. Dentro de cada grupo, usa o ultimo
// registro (valor de fechamento do periodo) - registros chegam ordenados
// por created_at ASC, entao a ultima escrita no Map sempre sobrescreve com
// o mais recente do periodo. `mapValor` extrai os campos especificos de
// prato ou insumo de cada registro.
function agruparPorPeriodo(registros, periodo, mapValor) {
  const grupos = new Map();
  registros.forEach((r) => {
    const chave = formatarChave(r.createdAt, periodo);
    grupos.set(chave, r);
  });
  return Array.from(grupos.entries()).map(([label, r]) => ({
    label,
    ...mapValor(r),
  }));
}

function mapValorPrato(r) {
  return {
    custoTotal: Number(r.custo_total),
    precoSugerido: Number(r.preco_sugerido),
    cmv: r.cmv !== null && r.cmv !== undefined ? Number(r.cmv) : null,
  };
}

function mapValorInsumo(r) {
  return {
    custoUnitario: Number(r.custo_unitario),
  };
}

// Adiciona, a cada ponto, o percentual da barra de comparacao (relativo ao
// maior valor da serie) e a variacao % em relacao ao ponto anterior - usado
// na lista "Versoes registradas" para a visualizacao de barra de progresso.
function comPercentuais(pontos, tipo) {
  const valorDe = (p) => (tipo === 'insumo' ? p.custoUnitario : p.custoTotal);
  const valores = pontos.map(valorDe);
  const max = Math.max(0.0001, ...valores);
  return pontos.map((p, i) => {
    const valor = valorDe(p);
    const anterior = i > 0 ? valorDe(pontos[i - 1]) : null;
    const deltaPct = anterior ? ((valor - anterior) / anterior) * 100 : null;
    return {
      ...p,
      valor,
      barPct: Math.max(3, (valor / max) * 100),
      deltaPct,
    };
  });
}

// GET /analise-precos
async function analise(req, res, next) {
  try {
    const tipo = req.query.tipo === 'insumo' ? 'insumo' : 'prato';
    const periodo = ['dia', 'mes', 'ano'].includes(req.query.periodo) ? req.query.periodo : 'dia';

    if (tipo === 'insumo') {
      const insumos = await Insumo.findAll({ order: [['nome', 'ASC']] });
      const codigo = req.query.item || (insumos[0] && insumos[0].codigo) || '';

      let selecionado = null;
      let pontos = [];
      if (codigo) {
        selecionado = await Insumo.findOne({ where: { codigo } });
        if (selecionado) {
          const registros = await HistoricoPrecoInsumo.findAll({
            where: { insumo_id: selecionado.id },
            order: [['created_at', 'ASC']],
          });
          pontos = comPercentuais(agruparPorPeriodo(registros, periodo, mapValorInsumo), 'insumo');
        }
      }

      return res.render('analise', {
        title: 'Progresso de preço',
        tipo,
        opcoes: insumos,
        codigo,
        periodo,
        selecionado,
        pontos,
      });
    }

    const pratos = await Prato.findAll({ order: [['nome', 'ASC']] });
    const codigo = req.query.item || (pratos[0] && pratos[0].codigo) || '';

    let selecionado = null;
    let pontos = [];
    if (codigo) {
      selecionado = await Prato.findOne({ where: { codigo } });
      if (selecionado) {
        const registros = await HistoricoPrecoPrato.findAll({
          where: { prato_id: selecionado.id },
          order: [['created_at', 'ASC']],
        });
        pontos = comPercentuais(agruparPorPeriodo(registros, periodo, mapValorPrato), 'prato');
      }
    }

    res.render('analise', {
      title: 'Progresso de preço',
      tipo,
      opcoes: pratos,
      codigo,
      periodo,
      selecionado,
      pontos,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { analise };
