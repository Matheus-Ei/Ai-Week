import CrudPage from '../components/CrudPage';
import ServicoItemPedido from '../services/ServicoItemPedido';

const ItensPedidoNew = () => {  const relationshipFields = {
    id_pedido: {
      service: ServicoItemPedido.obterPedidosDisponiveis,
      displayField: (item) => `Pedido #${item.id}`,
      valueField: 'id'
    },
    id_produto: {
      service: ServicoItemPedido.obterProdutosDisponiveis,
      displayField: 'nome',
      valueField: 'id'
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => (
        <div className="font-medium text-white">#{value}</div>
      )
    },
    {
      key: 'pedido',
      label: 'Pedido',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span className="text-blue-400">Pedido #{item.id_pedido}</span>
        </div>
      )
    },
    {
      key: 'produto',
      label: 'Produto',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
          <span className="text-white">{item.produto?.nome || `ID: ${item.id_produto}`}</span>
        </div>
      )
    },
    {
      key: 'quantidade',
      label: 'Quantidade',
      render: (value) => (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2m-5 6h4"></path>
          </svg>
          <span className="text-yellow-400 font-medium">{value}</span>
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
      key: 'total',
      label: 'Total do Item',
      render: (value, item) => (
        <div className="text-green-400 font-bold text-lg">
          R$ {item.quantidade && item.preco_unitario ? 
            (parseFloat(item.quantidade) * parseFloat(item.preco_unitario)).toFixed(2) : 
            '0.00'
          }
        </div>
      )
    }
  ];

  return (
    <CrudPage
      title="Itens de Pedido"
      service={{
        list: ServicoItemPedido.listarItensPedido,
        create: ServicoItemPedido.criarItemPedido,
        update: ServicoItemPedido.atualizarItemPedido,
        delete: ServicoItemPedido.excluirItemPedido,
      }}
      fields={["id_pedido", "id_produto", "quantidade", "preco_unitario"]}
      columns={columns}
      relationshipFields={relationshipFields}
      emptyMessage="Nenhum item de pedido encontrado"
      emptyDescription="Adicione um novo item de pedido usando o formulário acima"
    />
  );
};

export default ItensPedidoNew;
