import React from 'react';
import { 
  TrendingUp, TrendingDown, Users, ShoppingCart, 
  Package, DollarSign, AlertTriangle, Star 
} from 'lucide-react';

// Componente para card de estatística
export const CardEstatistica = ({ titulo, valor, icone: Icone, cor = 'blue', tendencia = null, descricao = null }) => {
  const cores = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{titulo}</p>
          <p className="text-2xl font-bold text-gray-100 mt-1">
            {typeof valor === 'number' ? valor.toLocaleString('pt-BR') : valor}
          </p>
          {descricao && (
            <p className="text-gray-500 text-xs mt-1">{descricao}</p>
          )}
        </div>
        <div className={`${cores[cor]} p-3 rounded-full`}>
          <Icone className="h-6 w-6 text-white" />
        </div>
      </div>
      {tendencia && (
        <div className="mt-4 flex items-center">
          {tendencia.tipo === 'up' ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm ${tendencia.tipo === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {tendencia.valor}%
          </span>
          <span className="text-gray-500 text-sm ml-1">vs. período anterior</span>
        </div>
      )}
    </div>
  );
};

// Componente para seletor de período
export const SeletorPeriodo = ({ periodo, onChange }) => {
  const opcoes = [
    { valor: 7, label: 'Últimos 7 dias' },
    { valor: 30, label: 'Últimos 30 dias' },
    { valor: 90, label: 'Últimos 3 meses' },
    { valor: 365, label: 'Último ano' }
  ];

  return (
    <div className="flex items-center space-x-2">
      <label className="text-gray-300 text-sm font-medium">Período:</label>
      <select
        value={periodo}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
      >
        {opcoes.map(opcao => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Componente para seletor de limite de resultados
export const SeletorLimite = ({ limite, onChange }) => {
  const opcoes = [5, 10, 15, 20, 25];

  return (
    <div className="flex items-center space-x-2">
      <label className="text-gray-300 text-sm font-medium">Mostrar:</label>
      <select
        value={limite}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
      >
        {opcoes.map(opcao => (
          <option key={opcao} value={opcao}>
            {opcao} resultados
          </option>
        ))}
      </select>
    </div>
  );
};

// Componente para tabela de dados
export const TabelaDados = ({ dados, colunas, titulo }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-100">{titulo}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              {colunas.map((coluna, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  {coluna.titulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {dados.map((item, index) => (
              <tr key={index} className="hover:bg-gray-700">
                {colunas.map((coluna, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {coluna.render ? coluna.render(item[coluna.chave], item) : item[coluna.chave]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente para alerta de estoque baixo
export const AlertaEstoque = ({ produtos }) => {
  if (!produtos || produtos.length === 0) {
    return (
      <div className="bg-green-800 p-4 rounded-lg shadow-lg border border-green-700">
        <div className="flex items-center">
          <Star className="h-5 w-5 text-green-400 mr-2" />
          <p className="text-green-100 font-medium">Todos os produtos estão com estoque adequado!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-800 p-4 rounded-lg shadow-lg border border-red-700">
      <div className="flex items-center mb-3">
        <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
        <p className="text-red-100 font-medium">Produtos com estoque baixo</p>
      </div>
      <div className="space-y-2">
        {produtos.slice(0, 5).map((produto, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-red-200">{produto.nome}</span>
            <span className="text-red-300 font-medium">{produto.estoque} unidades</span>
          </div>
        ))}
        {produtos.length > 5 && (
          <p className="text-red-300 text-xs">... e mais {produtos.length - 5} produtos</p>
        )}
      </div>
    </div>
  );
};

// Componente para controles de filtro
export const ControlesFiltro = ({ 
  periodo, 
  setPeriodo, 
  limite, 
  setLimite, 
  onAtualizarDados,
  carregando = false 
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <SeletorPeriodo periodo={periodo} onChange={setPeriodo} />
          <SeletorLimite limite={limite} onChange={setLimite} />
        </div>
        <button
          onClick={onAtualizarDados}
          disabled={carregando}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {carregando ? 'Atualizando...' : 'Atualizar Dados'}
        </button>
      </div>
    </div>
  );
};
