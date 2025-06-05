import React, { useState, useEffect } from 'react';
import { Settings, X, Save, RotateCcw, Palette, Layout, Eye } from 'lucide-react';

const ConfiguracoesDashboard = ({ isOpen, onClose, configuracoes, onSalvar }) => {
  const [config, setConfig] = useState({
    tema: 'dark',
    layoutColunas: 2,
    mostrarAnimacoes: true,
    alturaGraficos: 350,
    limitePadrao: 10,
    periodoPadrao: 30,
    coresPersonalizadas: {
      primaria: '#3B82F6',
      secundaria: '#10B981',
      destaque: '#F59E0B',
      perigo: '#EF4444'
    },
    graficosVisiveis: {
      vendasPeriodo: true,
      topProdutos: true,
      topVendedores: true,
      distribuicaoCidades: true,
      evolucaoMensal: true,
      analiseClientes: true,
      alertasEstoque: true
    },
    formatoMoeda: 'BRL',
    formatoData: 'DD/MM/YYYY',
    ...configuracoes
  });

  useEffect(() => {
    if (configuracoes) {
      setConfig(prev => ({ ...prev, ...configuracoes }));
    }
  }, [configuracoes]);

  const handleSalvar = () => {
    onSalvar(config);
    onClose();
  };

  const resetarConfiguracoes = () => {
    setConfig({
      tema: 'dark',
      layoutColunas: 2,
      mostrarAnimacoes: true,
      alturaGraficos: 350,
      limitePadrao: 10,
      periodoPadrao: 30,
      coresPersonalizadas: {
        primaria: '#3B82F6',
        secundaria: '#10B981',
        destaque: '#F59E0B',
        perigo: '#EF4444'
      },
      graficosVisiveis: {
        vendasPeriodo: true,
        topProdutos: true,
        topVendedores: true,
        distribuicaoCidades: true,
        evolucaoMensal: true,
        analiseClientes: true,
        alertasEstoque: true
      },
      formatoMoeda: 'BRL',
      formatoData: 'DD/MM/YYYY'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-100">Configurações do Dashboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Configurações Gerais */}
          <section>
            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
              <Layout className="h-5 w-5 mr-2 text-blue-400" />
              Layout e Aparência
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Colunas do Layout
                </label>
                <select
                  value={config.layoutColunas}
                  onChange={(e) => setConfig(prev => ({ ...prev, layoutColunas: parseInt(e.target.value) }))}
                  className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-3 py-2"
                >
                  <option value={1}>1 Coluna</option>
                  <option value={2}>2 Colunas</option>
                  <option value={3}>3 Colunas</option>
                  <option value={4}>4 Colunas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Altura dos Gráficos (px)
                </label>
                <input
                  type="number"
                  min="200"
                  max="600"
                  step="50"
                  value={config.alturaGraficos}
                  onChange={(e) => setConfig(prev => ({ ...prev, alturaGraficos: parseInt(e.target.value) }))}
                  className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Limite Padrão de Resultados
                </label>
                <select
                  value={config.limitePadrao}
                  onChange={(e) => setConfig(prev => ({ ...prev, limitePadrao: parseInt(e.target.value) }))}
                  className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-3 py-2"
                >
                  <option value={5}>5 resultados</option>
                  <option value={10}>10 resultados</option>
                  <option value={15}>15 resultados</option>
                  <option value={20}>20 resultados</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Período Padrão (dias)
                </label>
                <select
                  value={config.periodoPadrao}
                  onChange={(e) => setConfig(prev => ({ ...prev, periodoPadrao: parseInt(e.target.value) }))}
                  className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-3 py-2"
                >
                  <option value={7}>7 dias</option>
                  <option value={30}>30 dias</option>
                  <option value={90}>90 dias</option>
                  <option value={365}>365 dias</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.mostrarAnimacoes}
                  onChange={(e) => setConfig(prev => ({ ...prev, mostrarAnimacoes: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-300">Mostrar animações</span>
              </label>
            </div>
          </section>

          {/* Cores Personalizadas */}
          <section>
            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2 text-blue-400" />
              Cores Personalizadas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(config.coresPersonalizadas).map(([nome, cor]) => (
                <div key={nome}>
                  <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                    {nome}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={cor}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        coresPersonalizadas: {
                          ...prev.coresPersonalizadas,
                          [nome]: e.target.value
                        }
                      }))}
                      className="w-12 h-10 bg-gray-700 border border-gray-600 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={cor}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        coresPersonalizadas: {
                          ...prev.coresPersonalizadas,
                          [nome]: e.target.value
                        }
                      }))}
                      className="flex-1 bg-gray-700 border border-gray-600 text-gray-100 rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Gráficos Visíveis */}
          <section>
            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-blue-400" />
              Gráficos Visíveis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(config.graficosVisiveis).map(([grafico, visivel]) => (
                <label key={grafico} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={visivel}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      graficosVisiveis: {
                        ...prev.graficosVisiveis,
                        [grafico]: e.target.checked
                      }
                    }))}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300 capitalize">
                    {grafico.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Formatos */}
          <section>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Formatos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Formato de Moeda
                </label>
                <select
                  value={config.formatoMoeda}
                  onChange={(e) => setConfig(prev => ({ ...prev, formatoMoeda: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-3 py-2"
                >
                  <option value="BRL">Real Brasileiro (R$)</option>
                  <option value="USD">Dólar Americano ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Formato de Data
                </label>
                <select
                  value={config.formatoData}
                  onChange={(e) => setConfig(prev => ({ ...prev, formatoData: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-3 py-2"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <button
            onClick={resetarConfiguracoes}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Resetar</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Salvar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesDashboard;
