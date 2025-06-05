import InputField from './InputField';
import SelectField from './SelectField';
import ActionButton from './ActionButton';

const EditModal = ({ 
  isOpen,
  onClose,
  title = "Editar Item",
  fields = [],
  formData,
  onChange,
  onSave,
  relationshipFields = {},
  relationshipData = {},
  loadingRelationships = false,
  onProductSelect
}) => {
  if (!isOpen) return null;

  const handleFieldChange = (fieldName, value) => {
    onChange({ ...formData, [fieldName]: value });
    
    // Se for um produto sendo selecionado, aplicar lógica especial
    if (fieldName === 'id_produto' && onProductSelect) {
      onProductSelect(value, true);
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
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors duration-200 outline-none text-gray-100 hover:border-gray-500"
        />
      );
    }
    
    if (field === 'observacoes') {
      return (
        <textarea
          value={formData[field] || ''}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          placeholder={`Editar ${field.replace('_', ' ')}`}
          rows="3"
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors duration-200 outline-none text-gray-100 placeholder-gray-400 resize-vertical hover:border-gray-500"
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
        placeholder={`Editar ${field.replace('_', ' ')}`}
        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors duration-200 outline-none text-gray-100 placeholder-gray-400 hover:border-gray-500"
        {...inputProps}
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              {title}
            </h2>
            
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg flex items-center justify-center transition-colors duration-200 border border-gray-600/50 hover:border-gray-500"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {fields.map(field => (
              <div key={field} className={`group ${field === 'observacoes' ? 'md:col-span-2 lg:col-span-3' : ''}`}>
                <label className="block text-sm font-medium text-gray-300 mb-3 capitalize tracking-wide">
                  {field.replace('_', ' ')}
                  {['nome', 'id_cliente', 'id_vendedor', 'id_pedido', 'id_produto', 'quantidade', 'preco_unitario'].includes(field) && 
                    <span className="text-red-400 ml-1">*</span>
                  }
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
          
          <div className="flex gap-4 justify-end pt-4 border-t border-gray-700/50">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-600/50 hover:border-gray-500 transition-colors duration-200 font-medium"
            >
              Cancelar
            </button>
            <ActionButton 
              onClick={onSave} 
              label="Salvar Alterações" 
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors duration-200 font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
