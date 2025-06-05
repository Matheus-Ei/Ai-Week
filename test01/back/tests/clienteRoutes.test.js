const request = require('supertest');
const app = require('../index');

describe('Testes para as rotas de Cliente', () => {
  test('GET /clientes - Deve retornar todos os clientes', async () => {
    const response = await request(app).get('/clientes');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /clientes/:id - Deve retornar um cliente específico', async () => {
    const response = await request(app).get('/clientes/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('nome', 'Maria Souza');
    expect(response.body).toHaveProperty('email', 'maria@gmail.com');
  });

  test('POST /clientes - Deve criar um novo cliente', async () => {
    const newCliente = { 
      nome: 'Novo Cliente Teste', 
      email: 'cliente@teste.com',
      telefone: '11999999999',
      cidade: 'São Paulo',
      estado: 'SP'
    };
    const response = await request(app).post('/clientes').send(newCliente);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('nome', 'Novo Cliente Teste');
    expect(response.body).toHaveProperty('email', 'cliente@teste.com');
  });

  test('PUT /clientes/:id - Deve atualizar um cliente existente', async () => {
    const updatedCliente = { 
      nome: 'Maria Souza Atualizada', 
      email: 'maria.atualizada@gmail.com',
      telefone: '11988888888',
      cidade: 'São Paulo',
      estado: 'SP'
    };
    const response = await request(app).put('/clientes/1').send(updatedCliente);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('nome', 'Maria Souza Atualizada');
    expect(response.body).toHaveProperty('email', 'maria.atualizada@gmail.com');
  });

  test('DELETE /clientes/:id - Deve deletar um cliente', async () => {
    // Primeiro cria um cliente para deletar
    const newCliente = { 
      nome: 'Cliente Para Deletar', 
      email: 'deletar@teste.com',
      telefone: '11777777777',
      cidade: 'São Paulo',
      estado: 'SP'
    };
    const createResponse = await request(app).post('/clientes').send(newCliente);
    const clienteId = createResponse.body.id;

    const response = await request(app).delete(`/clientes/${clienteId}`);
    expect(response.statusCode).toBe(204);
  });
});
