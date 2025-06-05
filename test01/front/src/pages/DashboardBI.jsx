import React, { useState, useEffect } from 'react';
import { 
  Users, ShoppingCart, Package, DollarSign, 
  TrendingUp, BarChart3, PieChart, Activity,
  Settings, RefreshCw, Download, Filter,
  Maximize2, Minimize2
} from 'lucide-react';

import ServicoDashboard from '../services/ServicoDashboard';
import { 
  GraficoLinha, 
  GraficoArea, 
  GraficoBarra, 
  GraficoPizza 
} from '../components/GraficosChart';
import { 
  CardEstatistica, 
  TabelaDados, 
  AlertaEstoque, 
  ControlesFiltro 
} from '../components/ComponentesDashboard';
import ConfiguracoesDashboard from '../components/ConfiguracoesDashboard';

const DashboardBI = () => {
  // Estados para dados
  const [stats, setStats] = useState({});
  const [vendasPeriodo, setVendasPeriodo] = useState([]);
  const [topProdutos, setTopProdutos] = useState([]);
  const [topVendedores, setTopVendedores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [evolucaoMensal, setEvolucaoMensal] = useState([]);
  // Estados para controles
  const [periodo, setPeriodo] = useState(30);
  const [limite, setLimite] = useState(10);
  const [carregando, setCarregando] = useState(true);
  const [abaSelecionada, setAbaSelecionada] = useState('geral');
  const [configuracoesAbertas, setConfiguracoesAbertas] = useState(false);
  const [configuracoes, setConfiguracoes] = useState({
    tema: 'dark',
    layoutColunas: 2,
    alturaGraficos: 350,
    mostrarAnimacoes: true,
    graficosVisiveis: {
      vendasPeriodo: true,
      topProdutos: true,
      topVendedores: true,
      distribuicaoCidades: true,
      evolucaoMensal: true,
      analiseClientes: true,
      alertasEstoque: true
    }
  });
  const [telaCheia, setTelaCheia] = useState(false);

  // Carregar dados
  const carregarDados = async () => {
    setCarregando(true);
    try {
      const [
        statsData,
        vendasData,
        produtosData,
        vendedoresData,
        clientesData,
        cidadesData,
        estoqueData,
        evolucaoData
      ] = await Promise.all([
        ServicoDashboard.getStats(),
        ServicoDashboard.getVendasPorPeriodo(periodo),
        ServicoDashboard.getTopProdutos(limite),
        ServicoDashboard.getTopVendedores(limite),
        ServicoDashboard.getAnaliseClientes(),
        ServicoDashboard.getDistribuicaoCidades(),
        ServicoDashboard.getAnaliseEstoque(),
        ServicoDashboard.getEvolucaoMensal()
      ]);

      setStats(statsData);
      setVendasPeriodo(vendasData);
      setTopProdutos(produtosData);
      setTopVendedores(vendedoresData);
      setClientes(clientesData);
      setCidades(cidadesData);
      setEstoque(estoqueData);
      setEvolucaoMensal(evolucaoData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };
  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    carregarDados();
  }, [periodo, limite]);

  // Carregar configurações do localStorage
  useEffect(() => {
    const configSalvas = localStorage.getItem('dashboardConfig');
    if (configSalvas) {
      const configParsed = JSON.parse(configSalvas);
      setConfiguracoes(prev => ({ ...prev, ...configParsed }));
      setPeriodo(configParsed.periodoPadrao || 30);
      setLimite(configParsed.limitePadrao || 10);
    }
  }, []);

  // Salvar configurações
  const salvarConfiguracoes = (novasConfiguracoes) => {
    setConfiguracoes(novasConfiguracoes);
    localStorage.setItem('dashboardConfig', JSON.stringify(novasConfiguracoes));
    if (novasConfiguracoes.periodoPadrao) setPeriodo(novasConfiguracoes.periodoPadrao);
    if (novasConfiguracoes.limitePadrao) setLimite(novasConfiguracoes.limitePadrao);
  };

  // Exportar dados
  const exportarDados = () => {
    const dadosExport = {
      stats,
      vendasPeriodo,
      topProdutos,
      topVendedores,
      clientes: clientes.slice(0, 50), // Limitar para não ser muito grande
      cidades,
      evolucaoMensal,
      dataExportacao: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dadosExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-dados-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Formatar dados para gráficos
  const formatarVendasPeriodo = vendasPeriodo.map(item => ({
    data: new Date(item.data).toLocaleDateString('pt-BR'),
    pedidos: parseInt(item.quantidade_pedidos) || 0,
    valor: parseFloat(item.valor_total) || 0
  }));

  const formatarTopProdutos = topProdutos.map(item => ({
    nome: item.nome,
    vendidos: parseInt(item.total_vendido) || 0,
    receita: parseFloat(item.receita_total) || 0
  }));

  const formatarTopVendedores = topVendedores.map(item => ({
    nome: item.nome,
    pedidos: parseInt(item.total_pedidos) || 0,
    receita: parseFloat(item.receita_total) || 0
  }));

  const formatarCidades = cidades.map(item => ({
    cidade: item.cidade,
    clientes: parseInt(item.total_clientes) || 0
  }));

  const formatarEvolucaoMensal = evolucaoMensal.map(item => ({
    mes: `${item.mes}/${item.ano}`,
    pedidos: parseInt(item.total_pedidos) || 0,
    receita: parseFloat(item.receita) || 0
  }));

  // Colunas para tabelas
  const colunasClientes = [
    { titulo: 'Nome', chave: 'nome' },
    { titulo: 'Email', chave: 'email' },
    { titulo: 'Cidade', chave: 'cidade' },
    { 
      titulo: 'Total Pedidos', 
      chave: 'total_pedidos',
      render: (valor) => parseInt(valor) || 0
    },
    { 
      titulo: 'Valor Total', 
      chave: 'valor_total_compras',
      render: (valor) => `R$ ${(parseFloat(valor) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    },
    { 
      titulo: 'Ticket Médio', 
      chave: 'ticket_medio',
      render: (valor) => `R$ ${(parseFloat(valor) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    }
  ];

  const colunasEstoque = [
    { titulo: 'Produto', chave: 'nome' },
    { titulo: 'Estoque Atual', chave: 'estoque' },
    { 
      titulo: 'Preço', 
      chave: 'preco',
      render: (valor) => `R$ ${(parseFloat(valor) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    },
    { titulo: 'Categoria', chave: 'categoria' }
  ];

  const abas = [
    { id: 'geral', nome: 'Visão Geral', icone: Activity },
    { id: 'vendas', nome: 'Vendas', icone: TrendingUp },
    { id: 'produtos', nome: 'Produtos', icone: Package },
    { id: 'clientes', nome: 'Clientes', icone: Users },
    { id: 'estoque', nome: 'Estoque', icone: BarChart3 }
  ];
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black ${telaCheia ? 'fixed inset-0 z-50 overflow-auto' : 'p-6'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">Dashboard BI</h1>
              <p className="text-gray-400 mt-1">Análise completa de dados de negócio</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTelaCheia(!telaCheia)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {telaCheia ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                <span>{telaCheia ? 'Sair' : 'Tela Cheia'}</span>
              </button>
              <button
                onClick={exportarDados}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
              <button
                onClick={() => setConfiguracoesAbertas(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </button>
              <button
                onClick={carregarDados}
                disabled={carregando}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${carregando ? 'animate-spin' : ''}`} />
                <span>{carregando ? 'Carregando...' : 'Atualizar'}</span>
              </button>
            </div>
          </div>

          {/* Controles */}
          <ControlesFiltro
            periodo={periodo}
            setPeriodo={setPeriodo}
            limite={limite}
            setLimite={setLimite}
            onAtualizarDados={carregarDados}
            carregando={carregando}
          />

          {/* Navegação por abas */}
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8">
              {abas.map((aba) => {
                const IconeAba = aba.icone;
                return (
                  <button
                    key={aba.id}
                    onClick={() => setAbaSelecionada(aba.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      abaSelecionada === aba.id
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <IconeAba className="h-4 w-4" />
                    <span>{aba.nome}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Conteúdo por aba */}        {abaSelecionada === 'geral' && (
          <div className="space-y-6">
            {/* Cards de estatísticas */}
            <div className={`grid grid-cols-1 gap-6 ${
              configuracoes.layoutColunas === 1 ? 'md:grid-cols-1' :
              configuracoes.layoutColunas === 2 ? 'md:grid-cols-2' :
              configuracoes.layoutColunas === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'
            }`}>
              <CardEstatistica
                titulo="Total de Clientes"
                valor={stats.totalClientes}
                icone={Users}
                cor="blue"
              />
              <CardEstatistica
                titulo="Total de Vendedores"
                valor={stats.totalVendedores}
                icone={Users}
                cor="green"
              />
              <CardEstatistica
                titulo="Total de Produtos"
                valor={stats.totalProdutos}
                icone={Package}
                cor="yellow"
              />
              <CardEstatistica
                titulo="Total de Pedidos"
                valor={stats.totalPedidos}
                icone={ShoppingCart}
                cor="purple"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CardEstatistica
                titulo="Valor Total de Vendas"
                valor={`R$ ${(stats.valorTotalVendas || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                icone={DollarSign}
                cor="indigo"
              />
              <CardEstatistica
                titulo="Total de Itens Vendidos"
                valor={stats.totalItens}
                icone={Package}
                cor="red"
              />
            </div>

            {/* Alertas de estoque */}
            {configuracoes.graficosVisiveis.alertasEstoque && <AlertaEstoque produtos={estoque} />}

            {/* Gráficos principais */}
            <div className={`grid gap-6 ${
              configuracoes.layoutColunas === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'
            }`}>
              {configuracoes.graficosVisiveis.vendasPeriodo && (
                <GraficoLinha
                  dados={formatarVendasPeriodo}
                  xKey="data"
                  yKeys={[
                    { key: 'pedidos', name: 'Pedidos' },
                    { key: 'valor', name: 'Valor (R$)' }
                  ]}
                  titulo="Vendas por Período"
                  altura={configuracoes.alturaGraficos}
                />
              )}
              {configuracoes.graficosVisiveis.distribuicaoCidades && (
                <GraficoPizza
                  dados={formatarCidades}
                  dataKey="clientes"
                  nameKey="cidade"
                  titulo="Distribuição de Clientes por Cidade"
                  altura={configuracoes.alturaGraficos}
                />
              )}
            </div>
          </div>
        )}        {abaSelecionada === 'vendas' && (
          <div className="space-y-6">
            <div className={`grid gap-6 ${
              configuracoes.layoutColunas === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'
            }`}>
              {configuracoes.graficosVisiveis.evolucaoMensal && (
                <GraficoArea
                  dados={formatarEvolucaoMensal}
                  xKey="mes"
                  yKeys={[
                    { key: 'receita', name: 'Receita (R$)' },
                    { key: 'pedidos', name: 'Pedidos' }
                  ]}
                  titulo="Evolução Mensal de Vendas"
                  altura={configuracoes.alturaGraficos}
                />
              )}
              {configuracoes.graficosVisiveis.topVendedores && (
                <GraficoBarra
                  dados={formatarTopVendedores}
                  xKey="nome"
                  yKeys={[
                    { key: 'receita', name: 'Receita (R$)' }
                  ]}
                  titulo="Top Vendedores por Receita"
                  altura={configuracoes.alturaGraficos}
                />
              )}
            </div>
            <TabelaDados
              dados={topVendedores}
              colunas={[
                { titulo: 'Vendedor', chave: 'nome' },
                { titulo: 'Email', chave: 'email' },
                { 
                  titulo: 'Total Pedidos', 
                  chave: 'total_pedidos',
                  render: (valor) => parseInt(valor) || 0
                },
                { 
                  titulo: 'Receita Total', 
                  chave: 'receita_total',
                  render: (valor) => `R$ ${(parseFloat(valor) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                }
              ]}
              titulo="Ranking de Vendedores"
            />
          </div>
        )}        {abaSelecionada === 'produtos' && (
          <div className="space-y-6">
            <div className={`grid gap-6 ${
              configuracoes.layoutColunas === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'
            }`}>
              {configuracoes.graficosVisiveis.topProdutos && (
                <GraficoBarra
                  dados={formatarTopProdutos}
                  xKey="nome"
                  yKeys={[
                    { key: 'vendidos', name: 'Quantidade Vendida' }
                  ]}
                  titulo="Produtos Mais Vendidos"
                  altura={configuracoes.alturaGraficos}
                  horizontal={true}
                />
              )}
              {configuracoes.graficosVisiveis.topProdutos && (
                <GraficoBarra
                  dados={formatarTopProdutos}
                  xKey="nome"
                  yKeys={[
                    { key: 'receita', name: 'Receita (R$)' }
                  ]}
                  titulo="Produtos por Receita"
                  altura={configuracoes.alturaGraficos}
                />
              )}
            </div>
            <TabelaDados
              dados={topProdutos}
              colunas={[
                { titulo: 'Produto', chave: 'nome' },
                { 
                  titulo: 'Preço', 
                  chave: 'preco',
                  render: (valor) => `R$ ${(parseFloat(valor) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                },
                { 
                  titulo: 'Quantidade Vendida', 
                  chave: 'total_vendido',
                  render: (valor) => parseInt(valor) || 0
                },
                { 
                  titulo: 'Receita Total', 
                  chave: 'receita_total',
                  render: (valor) => `R$ ${(parseFloat(valor) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                }
              ]}
              titulo="Ranking de Produtos"
            />
          </div>
        )}        {abaSelecionada === 'clientes' && (
          <div className="space-y-6">
            <div className={`grid gap-6 ${
              configuracoes.layoutColunas === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'
            }`}>
              {configuracoes.graficosVisiveis.distribuicaoCidades && (
                <GraficoPizza
                  dados={formatarCidades}
                  dataKey="clientes"
                  nameKey="cidade"
                  titulo="Distribuição de Clientes por Cidade"
                  altura={configuracoes.alturaGraficos}
                />
              )}
              {configuracoes.graficosVisiveis.analiseClientes && (
                <GraficoBarra
                  dados={clientes.slice(0, 10)}
                  xKey="nome"
                  yKeys={[
                    { key: 'valor_total_compras', name: 'Valor Total (R$)' }
                  ]}
                  titulo="Top 10 Clientes por Valor"
                  altura={configuracoes.alturaGraficos}
                  horizontal={true}
                />
              )}
            </div>
            {configuracoes.graficosVisiveis.analiseClientes && (
              <TabelaDados
                dados={clientes.slice(0, 20)}
                colunas={colunasClientes}
                titulo="Análise Detalhada de Clientes"
              />
            )}
          </div>
        )}

        {abaSelecionada === 'estoque' && (
          <div className="space-y-6">
            <AlertaEstoque produtos={estoque} />
            <TabelaDados
              dados={estoque}
              colunas={colunasEstoque}
              titulo="Produtos com Estoque Baixo"            />
          </div>
        )}
      </div>

      {/* Componente de Configurações */}
      <ConfiguracoesDashboard
        isOpen={configuracoesAbertas}
        onClose={() => setConfiguracoesAbertas(false)}
        configuracoes={configuracoes}
        onSalvar={salvarConfiguracoes}
      />
    </div>
  );
};

export default DashboardBI;
