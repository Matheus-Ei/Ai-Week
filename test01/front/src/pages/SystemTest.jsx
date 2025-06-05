import React, { useState, useEffect } from 'react';
import ServicoCliente from '../services/ServicoCliente';
import ServicoProduto from '../services/ServicoProduto';
import ServicoVendedor from '../services/ServicoVendedor';
import ServicoPedido from '../services/ServicoPedido';
import ServicoItemPedido from '../services/ServicoItemPedido';

const SystemTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const runTests = async () => {
    setIsRunning(true);
    const results = {};

    // Test 1: Backend Connectivity
    setCurrentTest('Testando conectividade com o backend...');
    try {
      await ServicoCliente.listarClientes();
      results.backendConnectivity = { status: 'success', message: 'Conectado com sucesso' };
    } catch (error) {
      results.backendConnectivity = { status: 'error', message: error.message };
    }

    // Test 2: Cliente Service
    setCurrentTest('Testando serviço de clientes...');
    try {
      const clientes = await ServicoCliente.listarClientes();
      results.clienteService = { 
        status: 'success', 
        message: `${clientes.length} clientes encontrados`,
        data: clientes.slice(0, 2) // Show first 2 for preview
      };
    } catch (error) {
      results.clienteService = { status: 'error', message: error.message };
    }

    // Test 3: Produto Service
    setCurrentTest('Testando serviço de produtos...');
    try {
      const produtos = await ServicoProduto.listarProdutos();
      results.produtoService = { 
        status: 'success', 
        message: `${produtos.length} produtos encontrados`,
        data: produtos.slice(0, 2)
      };
    } catch (error) {
      results.produtoService = { status: 'error', message: error.message };
    }

    // Test 4: Vendedor Service
    setCurrentTest('Testando serviço de vendedores...');
    try {
      const vendedores = await ServicoVendedor.listarVendedores();
      results.vendedorService = { 
        status: 'success', 
        message: `${vendedores.length} vendedores encontrados`,
        data: vendedores.slice(0, 2)
      };
    } catch (error) {
      results.vendedorService = { status: 'error', message: error.message };
    }

    // Test 5: Pedido Service
    setCurrentTest('Testando serviço de pedidos...');
    try {
      const pedidos = await ServicoPedido.listarPedidos();
      results.pedidoService = { 
        status: 'success', 
        message: `${pedidos.length} pedidos encontrados`,
        data: pedidos.slice(0, 2)
      };
    } catch (error) {
      results.pedidoService = { status: 'error', message: error.message };
    }

    // Test 6: ItemPedido Service
    setCurrentTest('Testando serviço de itens de pedido...');
    try {
      const itens = await ServicoItemPedido.listarItensPedido();
      results.itemPedidoService = { 
        status: 'success', 
        message: `${itens.length} itens de pedido encontrados`,
        data: itens.slice(0, 2)
      };
    } catch (error) {
      results.itemPedidoService = { status: 'error', message: error.message };
    }

    // Test 7: Responsive Design
    setCurrentTest('Testando responsividade...');
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;
    const isDesktop = screenWidth >= 1024;
    
    results.responsiveDesign = {
      status: 'success',
      message: `Tela ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'} - ${screenWidth}px`,
      data: { screenWidth, isMobile, isTablet, isDesktop }
    };

    // Test 8: Local Storage
    setCurrentTest('Testando local storage...');
    try {
      localStorage.setItem('test', 'value');
      const value = localStorage.getItem('test');
      localStorage.removeItem('test');
      results.localStorage = { 
        status: value === 'value' ? 'success' : 'error',
        message: value === 'value' ? 'Local storage funcionando' : 'Falha no local storage'
      };
    } catch (error) {
      results.localStorage = { status: 'error', message: error.message };
    }

    setTestResults(results);
    setIsRunning(false);
    setCurrentTest('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'error': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Teste do Sistema
        </h1>
        <p className="text-gray-300 mt-2">
          Verificação completa da funcionalidade do sistema de pedidos
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                   disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-medium transition-all duration-200
                   transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {isRunning ? 'Executando Testes...' : 'Executar Testes'}
        </button>
      </div>

      {isRunning && currentTest && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
            <span className="text-blue-400">{currentTest}</span>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(testResults).map(([testName, result]) => (
          <div
            key={testName}
            className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg">{getStatusIcon(result.status)}</span>
              <h3 className="font-semibold capitalize">
                {testName.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
            </div>
            
            <p className="text-sm text-gray-300 mb-2">{result.message}</p>
            
            {result.data && (
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-400 hover:text-gray-300">
                  Ver dados
                </summary>
                <pre className="mt-2 p-2 bg-gray-800 rounded text-gray-300 overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold mb-2">Resumo dos Testes</h3>
          <div className="flex gap-4 text-sm">
            <span className="text-green-400">
              ✅ Sucessos: {Object.values(testResults).filter(r => r.status === 'success').length}
            </span>
            <span className="text-red-400">
              ❌ Falhas: {Object.values(testResults).filter(r => r.status === 'error').length}
            </span>
            <span className="text-gray-400">
              📊 Total: {Object.keys(testResults).length}
            </span>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <h3 className="font-semibold text-yellow-400 mb-2">💡 Informações do Sistema</h3>
        <div className="text-sm text-gray-300 space-y-1">
          <p><strong>Frontend:</strong> React + Vite rodando em http://localhost:5173</p>
          <p><strong>Backend:</strong> Node.js + Express rodando em http://localhost:3000</p>
          <p><strong>Resolução:</strong> {window.innerWidth} x {window.innerHeight}</p>
          <p><strong>User Agent:</strong> {navigator.userAgent.split(' ').slice(0, 3).join(' ')}...</p>
        </div>
      </div>
    </div>
  );
};

export default SystemTest;
