const InputField = ({ value, onChange, placeholder, type = "text", className = "", ...props }) => {
  const getInputType = () => {
    if (placeholder?.toLowerCase().includes('email')) return 'email';
    if (placeholder?.toLowerCase().includes('telefone')) return 'tel';
    if (placeholder?.toLowerCase().includes('data')) return 'date';
    if (placeholder?.toLowerCase().includes('preco') || placeholder?.toLowerCase().includes('valor')) return 'number';
    if (placeholder?.toLowerCase().includes('quantidade') || placeholder?.toLowerCase().includes('estoque')) return 'number';
    return type;
  };

  const inputType = getInputType();
  
  const baseClasses = "border p-2 rounded w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";
  
  return (
    <input
      type={inputType}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className || baseClasses}
      step={inputType === 'number' ? '0.01' : undefined}
      {...props}
    />
  );
};

export default InputField;