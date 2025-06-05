const ActionButton = ({ onClick, label, className = "", variant = "primary", disabled = false, ...props }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'danger':
        return "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white";
      case 'warning':
        return "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white";
      case 'success':
        return "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white";
      case 'secondary':
        return "bg-gray-600 hover:bg-gray-700 text-white border border-gray-500";
      default:
        return "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white";
    }
  };
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = getVariantClasses();
  const finalClasses = className || `${baseClasses} ${variantClasses}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={finalClasses}
      {...props}
    >
      {label}
    </button>
  );
};

export default ActionButton;