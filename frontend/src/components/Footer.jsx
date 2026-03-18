import { Phone, Mail, MapPin } from "lucide-react";

const FOOTER_LINKS = [
  { label: "Услуги", href: "#services" },
  { label: "Калькулятор", href: "#calculator" },
  { label: "Портфолио", href: "#portfolio" },
  { label: "Отзывы", href: "#testimonials" },
  { label: "Контакты", href: "#contact" },
];

export default function Footer() {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-neutral-800 pt-16 pb-8" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://customer-assets.emergentagent.com/job_construct-pro-162/artifacts/ksv4c33l_photo_2026-03-17_22-03-07.jpg"
                alt="М-СТРОЙ"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                М-СТРОЙ
              </span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Проектирование и строительство промышленных объектов под ключ. Более 15 лет опыта и 250+ реализованных проектов.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="text-sm font-bold text-white uppercase tracking-wider mb-4"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Навигация
            </h4>
            <nav className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="block text-sm text-neutral-500 hover:text-orange-500 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4
              className="text-sm font-bold text-white uppercase tracking-wider mb-4"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Услуги
            </h4>
            <div className="space-y-2 text-sm text-neutral-500">
              <div>Строительство ангаров</div>
              <div>Зернохранилища</div>
              <div>Промышленные гаражи</div>
              <div>Демонтаж сооружений</div>
            </div>
          </div>

          {/* Contacts */}
          <div>
            <h4
              className="text-sm font-bold text-white uppercase tracking-wider mb-4"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Контакты
            </h4>
            <div className="space-y-3">
              <a href="tel:+78001234567" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-orange-500 transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="font-mono-tech">8 (800) 123-45-67</span>
              </a>
              <a href="mailto:info@m-stroy.ru" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-orange-500 transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />
                info@m-stroy.ru
              </a>
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                г. Москва, ул. Строителей, д. 15
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} М-СТРОЙ. Все права защищены.
          </p>
          <p className="text-xs text-neutral-600">
            Строительство ангаров, зернохранилищ, гаражей | Демонтаж
          </p>
        </div>
      </div>
    </footer>
  );
}