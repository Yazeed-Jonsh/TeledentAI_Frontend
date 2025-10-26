import React from "react";
import { CARD_VARIANTS, TRANSITIONS } from "../config/theme";

/**
 * Modern Card Component
 * Supports multiple variants with consistent styling and hover effects
 */
export default function Card({
  children,
  variant = "default", // default, elevated, flat, gradient
  className = "",
  hover = true,
  onClick,
  icon = null,
  title = null,
  description = null,
  ...props
}) {
  const baseStyles = CARD_VARIANTS[variant] || CARD_VARIANTS.default;
  
  const clickableStyles = onClick ? "cursor-pointer" : "";

  return (
    <div
      onClick={onClick}
      className={`
        ${baseStyles}
        ${clickableStyles}
        ${TRANSITIONS.default}
        ${className}
      `}
      {...props}
    >
      {icon && (
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-3xl group-hover:shadow-glow-emerald transition-all duration-300">
          {icon}
        </div>
      )}
      
      {title && (
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      )}
      
      {description && (
        <p className="text-slate-600 leading-relaxed mb-4">{description}</p>
      )}
      
      {children}
    </div>
  );
}





