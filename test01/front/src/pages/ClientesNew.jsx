import CrudPage from '../components/CrudPage';
import ServicoCliente from '../services/ServicoCliente';

const ClientesNew = () => {
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
      key: 'email',
      label: 'Email',
      render: (value) => (
        <div className="text-blue-400">{value || 'Não informado'}</div>
      )
    },
    {
      key: 'telefone',
      label: 'Telefone',
      render: (value) => (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          {value || 'Não informado'}
        </div>
      )
    },
    {
      key: 'cidade',
      label: 'Cidade',
      render: (value) => (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          {value || 'Não informado'}
        </div>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value) => (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m-6 3l6-3"></path>
          </svg>
          {value || 'Não informado'}
        </div>
      )
    }
  ];

  return (
    <CrudPage
      title="Clientes"
      service={{
        list: ServicoCliente.listarClientes,
        create: ServicoCliente.criarCliente,
        update: ServicoCliente.atualizarCliente,
        delete: ServicoCliente.excluirCliente,
      }}
      fields={["nome", "email", "telefone", "cidade", "estado"]}
      columns={columns}
      emptyMessage="Nenhum cliente encontrado"
      emptyDescription="Adicione um novo cliente usando o formulário acima"
    />
  );
};

export default ClientesNew;
