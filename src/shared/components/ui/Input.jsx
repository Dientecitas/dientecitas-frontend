import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  register,
  name,
  required = false,
  ...props 
}) => {
  const inputClasses = `
    mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${error ? 'border-red-300' : 'border-gray-300'}
    ${className}
  `;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        className={inputClasses}
        {...(register ? register(name) : {})}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;