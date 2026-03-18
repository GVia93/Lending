import { motion } from "framer-motion";
import { ArrowDown, Calculator } from "lucide-react";
import { Button } from "./ui/button";

export default function HeroSection() {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section data-testid="hero-section" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
          alt="Строительство промышленных объектов, ангаров и зернохранилищ в Москве и Московской области"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-0 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-orange-500/30 rounded-full mb-8">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-sm text-orange-400 uppercase tracking-wider font-medium">
                Более 15 лет на рынке
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            data-testid="hero-heading"
          >
            СТРОИТЕЛЬСТВО
            <br />
            <span className="text-orange-500">АНГАРОВ</span> И
            <br />
            ЗЕРНОХРАНИЛИЩ
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-base lg:text-lg text-neutral-400 max-w-xl mb-10 leading-relaxed"
          >
            Проектируем и строим промышленные объекты под ключ.
            Ангары, зернохранилища, гаражи и демонтаж — точно в срок и по фиксированной цене.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              data-testid="hero-calculate-btn"
              onClick={() => scrollTo("#calculator")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-base px-8 py-6 rounded-none"
              size="lg"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать стоимость
            </Button>
            <Button
              data-testid="hero-portfolio-btn"
              onClick={() => scrollTo("#portfolio")}
              variant="outline"
              className="border-neutral-600 text-white hover:bg-white/5 font-semibold text-base px-8 py-6 rounded-none"
              size="lg"
            >
              Наши проекты
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="flex gap-10 mt-16 pt-8 border-t border-neutral-700/50"
          >
            {[
              { value: "250+", label: "Объектов построено" },
              { value: "15", label: "Лет опыта" },
              { value: "98%", label: "Клиентов довольны" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-mono-tech" data-testid={`hero-stat-${stat.value}`}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-neutral-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-xs text-neutral-500 uppercase tracking-widest">Прокрутите вниз</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDown className="w-5 h-5 text-neutral-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}