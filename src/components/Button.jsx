import React from "react";
import { BUTTON_VARIANTS, TRANSITIONS } from "../config/theme";

/**
 * Modern Button Component
 * Supports multiple variants with consistent styling and animations
 */
export default function Button({
  children,
  variant = "secondary", // primary, secondary, outlined, ghost, small
  type = "button",
  disabled = false,
  onClick,
  className = "",
  icon = null,
  iconPosition = "left", // left or right
  fullWidth = false,
  ...props
}) {
  const baseStyles = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.secondary;
  
  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "cursor-pointer";
  
  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        group
        ${baseStyles}
        ${disabledStyles}
        ${widthStyles}
        inline-flex items-center justify-center gap-2
        ${TRANSITIONS.default}
        ${className}
      `}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="transition-transform duration-300 group-hover:scale-110">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="transition-transform duration-300 group-hover:scale-110">{icon}</span>
      )}
    </button>
  );
}





