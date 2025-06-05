import CrudPage from '../components/CrudPage';
import ServicoProduto from '../services/ServicoProduto';

const ProdutosNew = () => {
  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => `#${value}`
    },
    {
      key: 'nome',
      label: 'Nome',
      render: (value) => (
        <div className="font-medium text-white">{value}</div>
      )
    },
    {
      key: 'categoria',
      label: 'Categoria',
      render: (value) => (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m0-18h2a2 2 0 012 2v11a2 2 0 01-2 2H9m0-18v18"></path>
          </svg>
          {value || 'Não definida'}
        </div>
      )
    },
    {
      key: 'preco_unitario',
      label: 'Preço Unitário',
      render: (value) => (
        <div className="text-green-400 font-medium">
          R$ {value ? parseFloat(value).toFixed(2) : '0.00'}
        </div>
      )
    },
    {
      key: 'estoque',
      label: 'Estoque',
      render: (value) => (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2m-5 6h4"></path>
          </svg>
          <span className={value > 0 ? 'text-green-400' : 'text-red-400'}>
            {value || 0} unidades
          </span>
        </div>
      )
    }
  ];

  return (
    <CrudPage
      title="Produtos"
      service={{
        list: ServicoProduto.listarProdutos,
        create: ServicoProduto.criarProduto,
        update: ServicoProduto.atualizarProduto,
        delete: ServicoProduto.excluirProduto,
      }}
      fields={["nome", "categoria", "preco_unitario", "estoque"]}
      columns={columns}
      emptyMessage="Nenhum produto encontrado"
      emptyDescription="Adicione um novo produto usando o formulário acima"
    />
  );
};

export default ProdutosNew;
