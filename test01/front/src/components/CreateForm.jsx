import InputField from './InputField';
import SelectField from './SelectField';
import ActionButton from './ActionButton';

const CreateForm = ({ 
  title = "Criar Novo Item",
  fields = [],
  formData,
  onChange,
  onSubmit,
  relationshipFields = {},
  relationshipData = {},
  loadingRelationships = false,
  onProductSelect
}) => {
  const handleFieldChange = (fieldName, value) => {
    onChange({ ...formData, [fieldName]: value });
    
    // Se for um produto sendo selecionado, aplicar lógica especial
    if (fieldName === 'id_produto' && onProductSelect) {
      onProductSelect(value, false);
    }
  };

  const renderField = (field) => {
    const relationshipConfig = relationshipFields[field];
    const isRequired = ['nome', 'id_cliente', 'id_vendedor', 'id_pedido', 'id_produto', 'quantidade', 'preco_unitario'].includes(field);
    
    if (relationshipConfig) {
      return (
        <SelectField
          value={formData[field]}
          onChange={(value) => handleFieldChange(field, value)}
          placeholder={`Selecione ${field.replace('_', ' ')}`}
          options={relationshipData[field] || []}
          displayField={relationshipConfig.displayField}
          valueField={relationshipConfig.valueField}
          loading={loadingRelationships}
          required={isRequired}
        />
      );
    }
    
    if (field === 'data_pedido') {
      return (
        <input
          type="date"
          value={formData[field]}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200 outline-none text-gray-100 hover:border-gray-500"
        />
      );
    }
    
    if (field === 'observacoes') {
      return (
        <textarea
          value={formData[field] || ''}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          placeholder={`Insira ${field.replace('_', ' ')}`}
          rows="3"
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200 outline-none text-gray-100 placeholder-gray-400 resize-vertical hover:border-gray-500"
        />
      );
    }
    
    const inputType = ['preco_unitario', 'valor_total'].includes(field) ? 'number' : 
                     ['quantidade', 'estoque'].includes(field) ? 'number' : 'text';
    const inputProps = inputType === 'number' ? { step: '0.01', min: '0' } : {};
    
    return (
      <InputField
        type={inputType}
        value={formData[field]}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        placeholder={`Insira ${field.replace('_', ' ')}`}
        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200 outline-none text-gray-100 placeholder-gray-400 hover:border-gray-500"
        {...inputProps}
      />
    );
  };

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-6 mb-8 hover:shadow-lg transition-all duration-200">
      <h2 className="text-2xl font-semibold text-gray-100 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
          </svg>
        </div>
        {title}
      </h2>
      
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map(field => (
          <div key={field} className={`group ${field === 'observacoes' ? 'md:col-span-2 lg:col-span-3' : ''}`}>
            <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
              {field.replace('_', ' ')}
              {['nome', 'id_cliente', 'id_vendedor', 'id_pedido', 'id_produto', 'quantidade', 'preco_unitario'].includes(field) && 
                <span className="text-red-400 ml-1">*</span>
              }
            </label>
            {renderField(field)}
          </div>
        ))}
        
        <div className="md:col-span-2 lg:col-span-3">
          <ActionButton 
            type="submit"
            label="Criar Item" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors duration-200 font-medium"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
