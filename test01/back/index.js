const express = require('express');
const cors = require('cors');
const clienteRoutes = require('./routes/clienteRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const vendedorRoutes = require('./routes/vendedorRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const itemPedidoRoutes = require('./routes/itemPedidoRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const sequelize = require('./config/database');

// Importar associações
require('./models/associations');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/clientes', clienteRoutes);
app.use('/produtos', produtoRoutes);
app.use('/vendedores', vendedorRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/itens-pedido', itemPedidoRoutes);
app.use('/dashboard', dashboardRoutes);

sequelize.authenticate()
  .then(() => {
    // Database connected successfully
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
 });
}

module.exports = app;
