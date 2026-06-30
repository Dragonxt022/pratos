'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('integracoes_api', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      metodo: {
        type: Sequelize.ENUM('GET', 'POST'),
        allowNull: false,
        defaultValue: 'GET',
      },
      // Tipo fixo aplicado a todos os itens sincronizados por essa
      // integracao, ja que a API externa nao informa se e insumo ou
      // embalagem (decisao tomada com o Bruno: uma integracao = um tipo).
      tipo_padrao: {
        type: Sequelize.ENUM('INSUMO', 'EMBALAGEM'),
        allowNull: false,
        defaultValue: 'INSUMO',
      },
      // Mapeamento de campos: { codigo: 'sku', nome: 'descricao', unidade: 'un', custo_unitario: 'preco' }
      mapeamento: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      auth_header: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      intervalo_minutos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 360,
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ultima_sincronizacao: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      ultimo_status: {
        type: Sequelize.ENUM('sucesso', 'erro'),
        allowNull: true,
      },
      ultimo_resultado: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('integracoes_api');
  },
};
