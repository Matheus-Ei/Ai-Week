import CrudPage from '../components/CrudPage';
import ServicoVendedor from '../services/ServicoVendedor';

const VendedoresNew = () => {
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
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <span className="font-medium text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'regiao',
      label: 'Região',
      render: (value) => (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          </svg>
          <span className="text-gray-300">{value || 'Região não informada'}</span>
        </div>
      )
    }
  ];

  return (
    <CrudPage
      title="Vendedores"
      service={{
        list: ServicoVendedor.listarVendedores,
        create: ServicoVendedor.criarVendedor,
        update: ServicoVendedor.atualizarVendedor,
        delete: ServicoVendedor.excluirVendedor,
      }}
      fields={["nome", "regiao"]}
      columns={columns}
      emptyMessage="Nenhum vendedor encontrado"
      emptyDescription="Adicione um novo vendedor usando o formulário acima"
    />
  );
};

export default VendedoresNew;
