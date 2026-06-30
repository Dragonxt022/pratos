// Busca uma URL externa e valida que a resposta contem uma lista (array) de
// itens. Se caminhoLista for informado (ex.: "data", "result.items"), navega
// ate esse caminho dentro do JSON antes de validar - util para APIs que
// envolvem o array em um objeto { "data": [...] }. Sem caminhoLista, espera
// um array na raiz. Reaproveitado pelo "Testar conexao" e pela sincronizacao.
async function buscarJsonApi(url, metodo, authHeader, caminhoLista) {
  const headers = { Accept: 'application/json' };
  if (authHeader) headers.Authorization = authHeader;

  let resposta;
  try {
    resposta = await fetch(url, { method: metodo || 'GET', headers });
  } catch (err) {
    throw new Error(`Falha de conexao: ${err.message}`);
  }

  if (!resposta.ok) {
    throw new Error(`A API respondeu HTTP ${resposta.status}`);
  }

  let dados;
  try {
    dados = await resposta.json();
  } catch (err) {
    throw new Error('A resposta nao e um JSON valido');
  }

  if (caminhoLista && caminhoLista.trim()) {
    dados = caminhoLista
      .trim()
      .split('.')
      .reduce((acc, parte) => (acc && typeof acc === 'object' ? acc[parte] : undefined), dados);
  }

  if (!Array.isArray(dados)) {
    if (caminhoLista) {
      throw new Error(`Nao foi encontrado um array no caminho "${caminhoLista}". Verifique o campo "Caminho da lista".`);
    }
    throw new Error('A resposta nao e uma lista (array). Se a lista estiver dentro de um campo (ex.: { "data": [...] }), informe o caminho no campo "Caminho da lista".');
  }

  return dados;
}

module.exports = buscarJsonApi;
