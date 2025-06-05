import { useState, useEffect } from 'react';

const SelectField = ({ 
  value, 
  onChange, 
  placeholder, 
  options = [], 
  displayField = 'nome',
  valueField = 'id',
  className = '',
  loading = false,
  disabled = false,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const getDisplayValue = (option) => {
    if (typeof displayField === 'function') {
      return displayField(option);
    }
    return option[displayField];
  };
  const filteredOptions = options.filter(option => {
    const displayValue = getDisplayValue(option);
    if (!displayValue) return false;
    
    // Converter para string se não for
    const stringValue = typeof displayValue === 'string' ? displayValue : String(displayValue);
    return stringValue.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedOption = options.find(opt => opt[valueField] === value);

  const handleSelect = (option) => {
    onChange(option[valueField]);
    setIsOpen(false);
    setSearchTerm('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.select-container')) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className={`relative select-container ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className={`
          w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg 
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
          transition-colors duration-200 outline-none text-gray-100 
          hover:border-gray-500 text-left flex items-center justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${required && !value ? 'border-red-500/50' : ''}
        `}
      >        <span className={selectedOption ? 'text-gray-100' : 'text-gray-400'}>
          {loading ? 'Carregando...' : selectedOption ? getDisplayValue(selectedOption) : placeholder}
        </span>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>      {isOpen && (
        <div className="absolute z-[9999] w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-3 border-b border-gray-600">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-gray-400 text-center">
                Nenhuma opção encontrada
              </div>
            ) : (
              filteredOptions.map((option) => (                <button
                  key={option[valueField]}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-600 transition-colors duration-150 text-gray-100 border-b border-gray-600/50 last:border-b-0"
                >
                  <div className="font-medium">{getDisplayValue(option)}</div>
                  {option.categoria && (
                    <div className="text-sm text-gray-400">{option.categoria}</div>
                  )}
                  {option.cliente && (
                    <div className="text-sm text-gray-400">
                      Cliente: {option.cliente.nome} | Vendedor: {option.vendedor?.nome || 'N/A'}
                    </div>
                  )}
                  {option.preco_unitario && (
                    <div className="text-sm text-green-400">
                      R$ {parseFloat(option.preco_unitario).toFixed(2)}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectField;
