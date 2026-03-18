import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "./ui/button";

const NAV_LINKS = [
  { label: "Услуги", href: "#services" },
  { label: "Калькулятор", href: "#calculator" },
  { label: "Портфолио", href: "#portfolio" },
  { label: "Отзывы", href: "#testimonials" },
  { label: "Контакты", href: "#contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      data-testid="header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-neutral-800" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3" data-testid="header-logo">
            <img
              src="https://customer-assets.emergentagent.com/job_construct-pro-162/artifacts/ksv4c33l_photo_2026-03-17_22-03-07.jpg"
              alt="М-СТРОЙ"
              className="h-10 w-10 lg:h-12 lg:w-12 rounded-full object-cover"
            />
            <span className="text-xl lg:text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              М-СТРОЙ
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" data-testid="desktop-nav">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm text-neutral-400 hover:text-white transition-colors duration-200 uppercase tracking-wider font-medium"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA + Mobile */}
          <div className="flex items-center gap-3">
            <a href="tel:+78001234567" className="hidden sm:flex items-center gap-2 text-sm text-neutral-400 hover:text-orange-500 transition-colors">
              <Phone className="w-4 h-4" />
              <span className="font-mono-tech">8 (800) 123-45-67</span>
            </a>
            <Button
              data-testid="header-cta-button"
              onClick={() => scrollTo("#calculator")}
              className="hidden sm:inline-flex bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5"
            >
              Рассчитать
            </Button>
            <button
              data-testid="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0A0A0A]/98 backdrop-blur-lg border-t border-neutral-800" data-testid="mobile-menu">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-left py-3 text-neutral-300 hover:text-orange-500 transition-colors text-base uppercase tracking-wider border-b border-neutral-800/50 last:border-0"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => scrollTo("#calculator")}
              className="mt-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold w-full"
            >
              Рассчитать стоимость
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}