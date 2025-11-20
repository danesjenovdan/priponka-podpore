import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  icon,
  ...props 
}) => {
  // Removed disabled:opacity-50 to handle colors manually
  const baseStyles = "inline-flex items-center justify-center px-5 py-3 rounded-xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed";
  
  const variants = {
    // Primary: Rose normally, Gray when disabled
    primary: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-lg hover:shadow-xl shadow-rose-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none",
    // Secondary: White normally, Grayish when disabled
    secondary: "bg-white text-rose-600 border-2 border-rose-100 hover:border-rose-200 hover:bg-rose-50 focus:ring-rose-400 shadow-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 disabled:shadow-none",
    // Outline: Gray/Border normally, Faded when disabled
    outline: "border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 focus:ring-gray-400 disabled:text-gray-400 disabled:border-gray-200"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};