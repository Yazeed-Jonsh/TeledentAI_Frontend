/**
 * Theme Constants - Modern Teledentistry Design System
 * Reusable style strings for consistent styling across the application
 */

// Button Variants
export const BUTTON_VARIANTS = {
  primary: "group relative px-8 py-4 bg-white text-emerald-600 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 ease-out",
  secondary: "px-8 py-4 bg-emerald-600 text-white font-semibold text-lg rounded-full hover:bg-emerald-700 hover:scale-105 transition-all duration-300 ease-out shadow-lg hover:shadow-glow-emerald",
  outlined: "px-8 py-4 bg-transparent text-emerald-600 font-semibold text-lg rounded-full border-2 border-emerald-600 hover:bg-emerald-50 hover:scale-105 hover:shadow-premium transition-all duration-300 ease-out",
  ghost: "px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300 ease-out",
  small: "px-6 py-3 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 hover:scale-105 transition-all duration-300 ease-out shadow-md hover:shadow-lg",
  premium: "px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-full shadow-glow-emerald hover:shadow-glow-emerald-lg hover:scale-105 transition-all duration-300 ease-out",
};

// Card Variants
export const CARD_VARIANTS = {
  default: "group bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-slate-100 hover:shadow-card-hover hover:border-emerald-200 hover:scale-[1.02] transition-all duration-300 ease-out",
  elevated: "bg-white rounded-2xl p-6 md:p-8 shadow-premium-lg border border-slate-100 hover:shadow-card-hover hover:scale-[1.01] transition-all duration-300 ease-out",
  flat: "bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-100 hover:shadow-premium transition-all duration-300 ease-out",
  gradient: "relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-10 md:p-12 shadow-2xl hover:shadow-glow-emerald-lg hover:scale-[1.02] transition-all duration-300 ease-out",
  premium: "group bg-white rounded-2xl p-6 md:p-8 shadow-premium border border-slate-100 hover:shadow-card-hover hover:border-emerald-200 hover:scale-[1.02] transition-all duration-300 ease-out backdrop-blur-sm",
};

// Input Variants
export const INPUT_VARIANTS = {
  default: "w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all duration-200",
  large: "w-full px-6 py-4 text-lg rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all duration-200",
  error: "w-full px-4 py-3 rounded-xl border-2 border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all duration-200",
};

// Badge Variants
export const BADGE_VARIANTS = {
  default: "inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold text-sm rounded-full border border-emerald-200",
  animated: "inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white font-semibold text-sm shadow-lg hover:bg-white/30 hover:scale-105 transition-all duration-300",
  success: "inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 font-semibold text-sm rounded-full border border-green-200",
  warning: "inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 font-semibold text-sm rounded-full border border-yellow-200",
  error: "inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 font-semibold text-sm rounded-full border border-red-200",
};

// Typography Scale
export const TYPOGRAPHY = {
  h1: "text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight",
  h2: "text-4xl md:text-5xl font-extrabold tracking-tight",
  h3: "text-3xl md:text-4xl font-bold tracking-tight",
  h4: "text-xl md:text-2xl font-bold",
  h5: "text-lg font-bold",
  bodyLarge: "text-xl md:text-2xl leading-relaxed",
  body: "text-base md:text-lg leading-relaxed",
  bodySmall: "text-sm leading-relaxed",
  caption: "text-xs text-slate-500",
};

// Section Spacing
export const SECTION_SPACING = {
  hero: "py-20 md:py-32 lg:py-40",
  content: "py-16 md:py-24 lg:py-32",
  component: "py-12 md:py-16",
};

// Container Widths
export const CONTAINER_WIDTHS = {
  content: "max-w-7xl mx-auto px-6",
  text: "max-w-3xl mx-auto",
  form: "max-w-md mx-auto",
};

// Transitions
export const TRANSITIONS = {
  default: "transition-all duration-300",
  quick: "transition-all duration-200",
  slow: "transition-all duration-500",
};

// Hover Effects
export const HOVER_EFFECTS = {
  card: "hover:scale-[1.02] hover:shadow-card-hover",
  button: "hover:scale-105 hover:shadow-glow-emerald",
  icon: "group-hover:scale-110 transition-transform duration-300",
  iconGlow: "group-hover:scale-110 group-hover:animate-pulse-glow transition-all duration-300",
};

// Focus States
export const FOCUS_STATES = {
  default: "focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:ring-offset-2",
};


