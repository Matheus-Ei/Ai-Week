const request = require('supertest');
const app = require('../index');

describe('Testes para as rotas de Vendedor', () => {
  test('GET /vendedores - Deve retornar todos os vendedores', async () => {
    const response = await request(app).get('/vendedores');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /vendedores/:id - Deve retornar um vendedor específico', async () => {
    const response = await request(app).get('/vendedores/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('nome', 'Carlos Mendes');
    expect(response.body).toHaveProperty('regiao', 'Sudeste');
  });

  test('POST /vendedores - Deve criar um novo vendedor', async () => {
    const newVendedor = { 
      nome: 'Vendedor Teste', 
      regiao: 'Centro-Oeste' 
    };
    const response = await request(app).post('/vendedores').send(newVendedor);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('nome', 'Vendedor Teste');
    expect(response.body).toHaveProperty('regiao', 'Centro-Oeste');
  });

  test('PUT /vendedores/:id - Deve atualizar um vendedor existente', async () => {
    const updatedVendedor = { 
      nome: 'Carlos Mendes Atualizado', 
      regiao: 'Sul' 
    };
    const response = await request(app).put('/vendedores/1').send(updatedVendedor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('nome', 'Carlos Mendes Atualizado');
    expect(response.body).toHaveProperty('regiao', 'Sul');
  });

  test('DELETE /vendedores/:id - Deve deletar um vendedor', async () => {
    // Primeiro cria um vendedor para deletar
    const newVendedor = { 
      nome: 'Vendedor Para Deletar', 
      regiao: 'Norte' 
    };
    const createResponse = await request(app).post('/vendedores').send(newVendedor);
    const vendedorId = createResponse.body.id;

    const response = await request(app).delete(`/vendedores/${vendedorId}`);
    expect(response.statusCode).toBe(204);
  });
});
