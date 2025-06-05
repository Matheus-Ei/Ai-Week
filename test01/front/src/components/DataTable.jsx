import ActionButton from './ActionButton';

const DataTable = ({ 
  data, 
  columns, 
  onEdit, 
  onDelete, 
  loading = false,
  emptyMessage = "Nenhum registro encontrado",
  emptyDescription = "Adicione um novo registro usando o formulário acima"
}) => {
  if (loading) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md border border-gray-700/50">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-gray-300">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md border border-gray-700/50">
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700/50">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-300 mb-3">{emptyMessage}</h3>
          <p className="text-gray-500 text-lg">{emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md border border-gray-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700/50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {data.map((item, index) => (
              <tr 
                key={item.id || index} 
                className="hover:bg-gray-700/30 transition-colors duration-150"
              >
                {columns.map((column) => (
                  <td 
                    key={column.key} 
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                  >
                    {column.render 
                      ? column.render(item[column.key], item) 
                      : item[column.key] || 'N/A'
                    }
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <ActionButton 
                      onClick={() => onEdit(item.id, item)} 
                      label="Editar" 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded hover:from-amber-600 hover:to-orange-600 transition-colors duration-200 text-sm"
                    />
                    <ActionButton 
                      onClick={() => onDelete(item.id)} 
                      label="Excluir" 
                      className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-3 py-1 rounded hover:from-red-600 hover:to-rose-600 transition-colors duration-200 text-sm"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
