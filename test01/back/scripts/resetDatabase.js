require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

(async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    console.log('Connected to the database');

    const initSqlPath = path.join(__dirname, '../config/init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf-8');

    await client.query(initSql);
    console.log('Database reset successfully');
  } catch (error) {
    console.error('Error resetting the database:', error);
  } finally {
    await client.end();
    console.log('Disconnected from the database');
  }
})();
