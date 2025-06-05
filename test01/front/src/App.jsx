import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ClientesNew from './pages/ClientesNew';
import ProdutosNew from './pages/ProdutosNew';
import PedidosNew from './pages/PedidosNew';
import VendedoresNew from './pages/VendedoresNew';
import ItensPedidoNew from './pages/ItensPedidoNew';
import SystemTest from './pages/SystemTest';
import DashboardBI from './pages/DashboardBI';
import ErrorBoundary, { ToastProvider, NetworkStatus } from './components/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
            <NetworkStatus />
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<DashboardBI />} />
                <Route path="/clientes" element={<ClientesNew />} />
                <Route path="/produtos" element={<ProdutosNew />} />
                <Route path="/pedidos" element={<PedidosNew />} />
                <Route path="/vendedores" element={<VendedoresNew />} />
                <Route path="/itens-pedido" element={<ItensPedidoNew />} />
                <Route path="/teste" element={<SystemTest />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
