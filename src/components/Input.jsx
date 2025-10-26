import React from "react";
import { INPUT_VARIANTS, TRANSITIONS } from "../config/theme";

/**
 * Modern Input Component
 * Supports form fields with consistent styling and validation states
 */
export default function Input({
  label = null,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error = null,
  helperText = null,
  required = false,
  disabled = false,
  variant = "default", // default, large, error
  className = "",
  icon = null,
  ...props
}) {
  const baseStyles = error 
    ? INPUT_VARIANTS.error 
    : INPUT_VARIANTS[variant] || INPUT_VARIANTS.default;
  
  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed bg-slate-100"
    : "";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            ${baseStyles}
            ${disabledStyles}
            ${icon ? "pl-12" : ""}
            ${TRANSITIONS.default}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
}








