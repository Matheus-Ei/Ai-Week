import CrudPage from '../components/CrudPage';
import ServicoPedido from '../services/ServicoPedido';

const PedidosNew = () => {
  const relationshipFields = {
    id_cliente: {
      service: ServicoPedido.obterClientesDisponiveis,
      displayField: 'nome',
      valueField: 'id'
    },
    id_vendedor: {
      service: ServicoPedido.obterVendedoresDisponiveis,
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
      key: 'cliente',
      label: 'Cliente',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <span className="text-white">{item.cliente?.nome || `ID: ${item.id_cliente}`}</span>
        </div>
      )
    },
    {
      key: 'vendedor',
      label: 'Vendedor',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          <span className="text-white">{item.vendedor?.nome || `ID: ${item.id_vendedor}`}</span>
        </div>
      )
    },
    {
      key: 'data_pedido',
      label: 'Data',
      render: (value) => (
        <div className="text-blue-400">
          {value ? new Date(value).toLocaleDateString('pt-BR') : 'Não informado'}
        </div>
      )
    },
    {
      key: 'valor_total',
      label: 'Valor Total',
      render: (value) => (
        <div className="text-green-400 font-bold text-lg">
          R$ {value ? parseFloat(value).toFixed(2) : '0.00'}
        </div>
      )
    },
    {
      key: 'observacoes',
      label: 'Observações',
      render: (value) => (
        <div className="text-gray-300 text-sm max-w-xs truncate">
          {value || 'Sem observações'}
        </div>
      )
    }
  ];

  return (
    <CrudPage
      title="Pedidos"
      service={{
        list: ServicoPedido.listarPedidos,
        create: ServicoPedido.criarPedido,
        update: ServicoPedido.atualizarPedido,
        delete: ServicoPedido.excluirPedido,
      }}
      fields={["id_cliente", "id_vendedor", "data_pedido", "valor_total", "observacoes"]}
      columns={columns}
      relationshipFields={relationshipFields}
      emptyMessage="Nenhum pedido encontrado"
      emptyDescription="Adicione um novo pedido usando o formulário acima"
    />
  );
};

export default PedidosNew;
