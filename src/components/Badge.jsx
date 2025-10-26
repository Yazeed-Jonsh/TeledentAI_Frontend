import React from "react";
import { BADGE_VARIANTS, TRANSITIONS } from "../config/theme";

/**
 * Modern Badge Component
 * Supports multiple variants for status indicators and labels
 */
export default function Badge({
  children,
  variant = "default", // default, animated, success, warning, error
  icon = null,
  className = "",
  onClick,
  ...props
}) {
  const baseStyles = BADGE_VARIANTS[variant] || BADGE_VARIANTS.default;
  
  const clickableStyles = onClick ? "cursor-pointer" : "";

  return (
    <span
      onClick={onClick}
      className={`
        ${baseStyles}
        ${clickableStyles}
        ${TRANSITIONS.default}
        ${className}
      `}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}








