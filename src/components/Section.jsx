import React from "react";
import { SECTION_SPACING, CONTAINER_WIDTHS } from "../config/theme";

/**
 * Section Wrapper Component
 * Provides consistent spacing and container widths across pages
 */
export default function Section({
  children,
  spacing = "content", // hero, content, component
  width = "content", // content, text, form
  background = "transparent", // transparent, slate, white
  className = "",
  id = null,
  ...props
}) {
  const spacingStyles = SECTION_SPACING[spacing] || SECTION_SPACING.content;
  const widthStyles = CONTAINER_WIDTHS[width] || CONTAINER_WIDTHS.content;
  
  const bgStyles = {
    transparent: "bg-transparent",
    slate: "bg-slate-50",
    white: "bg-white",
  }[background] || "bg-transparent";

  return (
    <section
      id={id}
      className={`${spacingStyles} ${bgStyles} ${className}`}
      {...props}
    >
      <div className={widthStyles}>
        {children}
      </div>
    </section>
  );
}








