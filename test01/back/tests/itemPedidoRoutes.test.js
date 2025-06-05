const request = require('supertest');
const app = require('../index');

describe('Testes para as rotas de ItemPedido', () => {
  test('GET /itens-pedido - Deve retornar todos os itens de pedido', async () => {
    const response = await request(app).get('/itens-pedido');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /itens-pedido/:id - Deve retornar um item de pedido específico', async () => {
    const response = await request(app).get('/itens-pedido/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('id_pedido', 1);
    expect(response.body).toHaveProperty('id_produto', 1);
    expect(response.body).toHaveProperty('quantidade', 1);
    expect(response.body).toHaveProperty('preco_unitario', '3500.00');
  });
  test('POST /itens-pedido - Deve criar um novo item de pedido', async () => {
    // Vamos usar um pedido que já existe no banco (do init.sql)
    const newItemPedido = {
      id_pedido: 1, // Pedido que existe no init.sql
      id_produto: 2, // Mouse Logitech existe no init.sql
      quantidade: 2,
      preco_unitario: 120.00
    };
    const response = await request(app).post('/itens-pedido').send(newItemPedido);
    expect(response.statusCode).toBe(201);    expect(response.body).toHaveProperty('id_pedido', 1);
    expect(response.body).toHaveProperty('id_produto', 2);
    expect(response.body).toHaveProperty('quantidade', 2);
    expect(response.body).toHaveProperty('preco_unitario', '120.00');
  });

  test('PUT /itens-pedido/:id - Deve atualizar um item de pedido existente', async () => {
    const updatedItemPedido = {
      id_pedido: 1, // Pedido existe no init.sql
      id_produto: 3, // Monitor LG existe no init.sql
      quantidade: 1,
      preco_unitario: 800.00
    };
    const response = await request(app).put('/itens-pedido/1').send(updatedItemPedido);
    expect(response.statusCode).toBe(200);    expect(response.body).toHaveProperty('id_produto', 3);
    expect(response.body).toHaveProperty('quantidade', 1);
    expect(response.body).toHaveProperty('preco_unitario', 800);
  });
  test('DELETE /itens-pedido/:id - Deve deletar um item de pedido', async () => {
    // Primeiro cria um item para deletar usando um pedido existente
    const newItemPedido = {
      id_pedido: 2, // Pedido que existe no init.sql
      id_produto: 4, // Teclado Mecânico existe no init.sql
      quantidade: 1,
      preco_unitario: 250.00
    };
    const createResponse = await request(app).post('/itens-pedido').send(newItemPedido);
    const itemId = createResponse.body.id;

    const response = await request(app).delete(`/itens-pedido/${itemId}`);
    expect(response.statusCode).toBe(204);
  });
});
