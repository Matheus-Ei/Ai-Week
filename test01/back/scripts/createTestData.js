const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// Importar modelos e associações
require('../models/associations');
const { Cliente, Vendedor, Pedido, Produto, ItemPedido } = require('../models/associations');

async function criarDadosTeste() {
  try {
    // Sincronizar database
    await sequelize.sync({ force: true });
    console.log('Database sincronizado!');

    // Criar clientes
    const cliente1 = await Cliente.create({
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '11999999999',
      endereco: 'Rua A, 123'
    });

    const cliente2 = await Cliente.create({
      nome: 'Maria Santos',
      email: 'maria@email.com',
      telefone: '11888888888',
      endereco: 'Rua B, 456'
    });

    // Criar vendedores
    const vendedor1 = await Vendedor.create({
      nome: 'Carlos Vendedor',
      email: 'carlos@empresa.com',
      telefone: '11777777777',
      comissao: 5.0
    });

    const vendedor2 = await Vendedor.create({
      nome: 'Ana Vendedora',
      email: 'ana@empresa.com',
      telefone: '11666666666',
      comissao: 7.5
    });

    // Criar produtos
    const produto1 = await Produto.create({
      nome: 'Notebook Dell',
      categoria: 'Eletrônicos',
      preco_unitario: 2500.00,
      estoque: 10
    });

    const produto2 = await Produto.create({
      nome: 'Mouse Wireless',
      categoria: 'Acessórios',
      preco_unitario: 59.90,
      estoque: 50
    });

    const produto3 = await Produto.create({
      nome: 'Teclado Mecânico',
      categoria: 'Acessórios',
      preco_unitario: 299.90,
      estoque: 25
    });

    const produto4 = await Produto.create({
      nome: 'Monitor 24"',
      categoria: 'Eletrônicos',
      preco_unitario: 899.90,
      estoque: 8
    });

    // Criar pedidos
    const pedido1 = await Pedido.create({
      id_cliente: cliente1.id,
      id_vendedor: vendedor1.id,
      data_pedido: new Date(),
      valor_total: 0
    });

    const pedido2 = await Pedido.create({
      id_cliente: cliente2.id,
      id_vendedor: vendedor2.id,
      data_pedido: new Date(),
      valor_total: 0
    });

    const pedido3 = await Pedido.create({
      id_cliente: cliente1.id,
      id_vendedor: vendedor2.id,
      data_pedido: new Date(),
      valor_total: 0
    });

    // Criar alguns itens de pedido
    await ItemPedido.create({
      id_pedido: pedido1.id,
      id_produto: produto1.id,
      quantidade: 1,
      preco_unitario: produto1.preco_unitario
    });

    await ItemPedido.create({
      id_pedido: pedido1.id,
      id_produto: produto2.id,
      quantidade: 2,
      preco_unitario: produto2.preco_unitario
    });

    await ItemPedido.create({
      id_pedido: pedido2.id,
      id_produto: produto3.id,
      quantidade: 1,
      preco_unitario: produto3.preco_unitario
    });

    await ItemPedido.create({
      id_pedido: pedido2.id,
      id_produto: produto4.id,
      quantidade: 1,
      preco_unitario: produto4.preco_unitario
    });

    // Atualizar valores totais dos pedidos
    const valor1 = (produto1.preco_unitario * 1) + (produto2.preco_unitario * 2);
    await pedido1.update({ valor_total: valor1 });

    const valor2 = produto3.preco_unitario + produto4.preco_unitario;
    await pedido2.update({ valor_total: valor2 });

    console.log('Dados de teste criados com sucesso!');
    console.log(`
Dados criados:
- ${2} clientes
- ${2} vendedores  
- ${4} produtos
- ${3} pedidos
- ${4} itens de pedido
    `);

  } catch (error) {
    console.error('Erro ao criar dados de teste:', error);
  } finally {
    await sequelize.close();
  }
}

criarDadosTeste();
