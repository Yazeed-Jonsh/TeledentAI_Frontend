import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../Context/LangContext";
import { Globe } from "lucide-react";

export default function Shell({ children }) {
  const { t, lang, setLang } = useI18n();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRTL = lang === "ar";
  
  // Navigation items
  const navItems = [
    { path: "/", label: t("nav.home") },
    { path: "/how", label: t("nav.how") },
    { path: "/capture", label: t("nav.capture") },
    { path: "/results", label: t("nav.results") },
    { path: "/about", label: t("nav.about") },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Modern Header with Glassmorphism */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group">
              <img 
                src="/Logo1-removebg-preview.png" 
                alt="TeleDentAI" 
                className="h-16 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-2 flex-1 justify-center">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    aria-current={location.pathname === item.path ? "page" : undefined}
                    className={`
                      px-4 py-2 rounded-lg font-medium text-base transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                      ${location.pathname === item.path 
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg font-bold" 
                        : "text-slate-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 hover:scale-105 hover:shadow-md"}
                    `}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Language Toggle - Desktop */}
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-md hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:border-emerald-300 hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex-shrink-0"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-slate-700">{t("langToggle")}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 border-t border-slate-200 mt-4 animate-slide-down">
              <ul className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={location.pathname === item.path ? "page" : undefined}
                      className={`
                        block px-4 py-3 rounded-lg font-medium transition-all duration-300
                        ${location.pathname === item.path
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg font-bold"
                          : "text-slate-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700"}
                      `}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  setLang(lang === "en" ? "ar" : "en");
                  setMobileMenuOpen(false);
                }}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:border-emerald-300 transition-all duration-300 font-medium text-slate-700"
                aria-label="Toggle language"
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>{t("langToggle")}</span>
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Modern Footer */}
      <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-extrabold text-emerald-400 mb-3">{t("brand")}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {t("hero.subtitle") || "Remote dental care, closer than ever"}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-3">{t("footer.quickLinks") || "Quick Links"}</h4>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-slate-300 hover:text-emerald-400 transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-3">{t("footer.contact") || "Contact"}</h4>
              <div className="flex flex-col gap-2 text-slate-300 text-sm">
                <p>{t("footer.support") || "yazeedjoneid@gmail.com"}</p>
                <p>{t("footer.phone") || "+966 50 032 3405"}</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>© {new Date().getFullYear()} {t("brand")}. {t("footer.rights") || "All rights reserved."}</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-emerald-400 transition-colors">
                {t("footer.privacy") || "Privacy Policy"}
              </Link>
              <Link to="/terms" className="hover:text-emerald-400 transition-colors">
                {t("footer.terms") || "Terms of Service"}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
