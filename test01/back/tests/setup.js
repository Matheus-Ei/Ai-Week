const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');
require('dotenv').config();

// Setup que executa antes de todos os testes
beforeAll(async () => {
  // Reset do banco de dados antes dos testes
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  try {
    await client.connect();
    const initSqlPath = path.join(__dirname, '../config/init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf-8');
    await client.query(initSql);
  } catch (error) {
    console.error('Error resetting database for tests:', error);
  } finally {
    await client.end();
  }
});

// Cleanup após todos os testes
afterAll(async () => {  try {
    // Fecha todas as conexões do Sequelize
    await sequelize.connectionManager.close();
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
});
