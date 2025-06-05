const request = require('supertest');
const app = require('../index');

describe('Testes para as rotas de Produto', () => {
  test('GET /produtos - Deve retornar todos os produtos', async () => {
    const response = await request(app).get('/produtos');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /produtos/:id - Deve retornar um produto específico', async () => {
    const response = await request(app).get('/produtos/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('nome', 'Notebook Dell');
    expect(response.body).toHaveProperty('categoria', 'Informática');
    expect(response.body).toHaveProperty('preco_unitario', '3500.00');
  });

  test('POST /produtos - Deve criar um novo produto', async () => {
    const newProduto = { 
      nome: 'Produto Teste', 
      categoria: 'Teste',
      preco_unitario: 100.00,
      estoque: 10
    };
    const response = await request(app).post('/produtos').send(newProduto);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('nome', 'Produto Teste');
    expect(response.body).toHaveProperty('categoria', 'Teste');
    expect(response.body).toHaveProperty('preco_unitario', '100.00');
  });

  test('PUT /produtos/:id - Deve atualizar um produto existente', async () => {
    const updatedProduto = { 
      nome: 'Notebook Dell Atualizado', 
      categoria: 'Informática',
      preco_unitario: 3800.00,
      estoque: 5
    };
    const response = await request(app).put('/produtos/1').send(updatedProduto);    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('nome', 'Notebook Dell Atualizado');
    expect(response.body).toHaveProperty('preco_unitario', 3800);
  });

  test('DELETE /produtos/:id - Deve deletar um produto', async () => {
    // Primeiro cria um produto para deletar
    const newProduto = { 
      nome: 'Produto Para Deletar', 
      categoria: 'Teste',
      preco_unitario: 50.00,
      estoque: 1
    };
    const createResponse = await request(app).post('/produtos').send(newProduto);
    const produtoId = createResponse.body.id;    const response = await request(app).delete(`/produtos/${produtoId}`);
    expect(response.statusCode).toBe(204);
  });
});
