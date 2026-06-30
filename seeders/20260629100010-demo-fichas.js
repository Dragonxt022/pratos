'use strict';

// Dados de demonstracao baseados no exemplo "Hot Filadelia 10 un" usado
// no prototipo HTML original (taiksu-ficha-tecnica.html), so para a
// aplicacao nao subir vazia na primeira execucao.

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('insumos', [
      { id: 1, codigo: 'SAL001', nome: 'Salmao Fresco', tipo: 'INSUMO', unidade: 'g', created_at: now, updated_at: now },
      { id: 2, codigo: 'ARZ001', nome: 'Arroz Japones', tipo: 'INSUMO', unidade: 'g', created_at: now, updated_at: now },
      { id: 3, codigo: 'CHE001', nome: 'Cream Cheese', tipo: 'INSUMO', unidade: 'g', created_at: now, updated_at: now },
      { id: 4, codigo: 'PAN001', nome: 'Farinha Panko', tipo: 'INSUMO', unidade: 'g', created_at: now, updated_at: now },
      { id: 5, codigo: 'OLE001', nome: 'Oleo de Soja', tipo: 'INSUMO', unidade: 'ml', created_at: now, updated_at: now },
      { id: 6, codigo: 'TAR001', nome: 'Molho Tare', tipo: 'INSUMO', unidade: 'ml', created_at: now, updated_at: now },
      { id: 7, codigo: 'SHO001', nome: 'Molho Shoyu', tipo: 'INSUMO', unidade: 'ml', created_at: now, updated_at: now },
      { id: 8, codigo: 'EMB001', nome: 'Embalagem Sushi 10 un', tipo: 'EMBALAGEM', unidade: 'un', created_at: now, updated_at: now },
      { id: 9, codigo: 'EMB002', nome: 'Hashi de Bambu', tipo: 'EMBALAGEM', unidade: 'un', created_at: now, updated_at: now },
      { id: 10, codigo: 'EMB003', nome: 'Pote para Molho 30ml', tipo: 'EMBALAGEM', unidade: 'un', created_at: now, updated_at: now },
    ]);

    await queryInterface.bulkInsert('pratos', [
      {
        id: 1,
        codigo: 'PR001',
        nome: 'Hot Filadelia 10 un',
        rendimento: 10,
        preco_venda: 32.9,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('itens_prato', [
      { prato_id: 1, insumo_id: 1, quantidade: 120, custo_total: 7.2, created_at: now, updated_at: now },
      { prato_id: 1, insumo_id: 2, quantidade: 150, custo_total: 1.38, created_at: now, updated_at: now },
      { prato_id: 1, insumo_id: 3, quantidade: 40, custo_total: 0.76, created_at: now, updated_at: now },
      { prato_id: 1, insumo_id: 4, quantidade: 40, custo_total: 0.64, created_at: now, updated_at: now },
      { prato_id: 1, insumo_id: 5, quantidade: 30, custo_total: 0.27, created_at: now, updated_at: now },
      { prato_id: 1, insumo_id: 6, quantidade: 20, custo_total: 0.36, created_at: now, updated_at: now },
      { prato_id: 1, insumo_id: 7, quantidade: 20, custo_total: 0.27, created_at: now, updated_at: now },
      { prato_id: 1, insumo_id: 8, quantidade: 10, custo_total: 1.5, created_at: now, updated_at: now },
      { prato_id: 1, insumo_id: 9, quantidade: 1, custo_total: 0.14, created_at: now, updated_at: now },
      { prato_id: 1, insumo_id: 10, quantidade: 1, custo_total: 0.15, created_at: now, updated_at: now },
    ]);

    await queryInterface.bulkInsert('configuracoes', [
      {
        id: 1,
        markup: 3.5,
        markup_inclui_embalagem: false,
        cmv_inclui_embalagem: false,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('itens_prato', null, {});
    await queryInterface.bulkDelete('pratos', null, {});
    await queryInterface.bulkDelete('insumos', null, {});
    await queryInterface.bulkDelete('configuracoes', null, {});
  },
};
