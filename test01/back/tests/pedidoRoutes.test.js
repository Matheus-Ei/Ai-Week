const request = require('supertest');
const app = require('../index');

describe('Testes para as rotas de Pedido', () => {
  test('GET /pedidos - Deve retornar todos os pedidos', async () => {
    const response = await request(app).get('/pedidos');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /pedidos/:id - Deve retornar um pedido específico', async () => {
    const response = await request(app).get('/pedidos/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('id_cliente', 1);
    expect(response.body).toHaveProperty('id_vendedor', 1);
    expect(response.body).toHaveProperty('valor_total', '3620.00');
  });

  test('POST /pedidos - Deve criar um novo pedido', async () => {
    const newPedido = {
      id_cliente: 2,
      id_vendedor: 2,
      data_pedido: '2025-06-01',
      valor_total: 1000.00
    };
    const response = await request(app).post('/pedidos').send(newPedido);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id_cliente', 2);
    expect(response.body).toHaveProperty('id_vendedor', 2);
    expect(response.body).toHaveProperty('valor_total', '1000.00');
  });

  test('PUT /pedidos/:id - Deve atualizar um pedido existente', async () => {
    const updatedPedido = {
      id_cliente: 3,
      id_vendedor: 3,
      data_pedido: '2025-06-02',
      valor_total: 2000.00
    };
    const response = await request(app).put('/pedidos/1').send(updatedPedido);
    expect(response.statusCode).toBe(200);    expect(response.body).toHaveProperty('id_cliente', 3);
    expect(response.body).toHaveProperty('id_vendedor', 3);
    expect(response.body).toHaveProperty('valor_total', 2000);
  });
  test('DELETE /pedidos/:id - Deve deletar um pedido', async () => {
    // Primeiro cria um pedido para deletar
    const newPedido = {
      id_cliente: 4,
      id_vendedor: 4,
      data_pedido: '2025-06-01',
      valor_total: 500.00
    };
    const createResponse = await request(app).post('/pedidos').send(newPedido);
    const createdPedidoId = createResponse.body.id;

    // Verifica se o pedido foi criado com sucesso
    expect(createResponse.statusCode).toBe(201);
    expect(createdPedidoId).toBeDefined();

    const response = await request(app).delete(`/pedidos/${createdPedidoId}`);
    expect(response.statusCode).toBe(204);
  });
});
