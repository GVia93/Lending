import { motion } from "framer-motion";
import { Shield, Clock, Ruler, Headphones, BadgeCheck, Truck } from "lucide-react";

const ADVANTAGES = [
  {
    icon: Shield,
    title: "Гарантия 5 лет",
    description: "На все виды конструкций и монтажных работ предоставляем расширенную гарантию",
  },
  {
    icon: Clock,
    title: "Точно в срок",
    description: "Фиксируем сроки в договоре. За 15 лет ни одного просроченного проекта",
  },
  {
    icon: Ruler,
    title: "Собственное проектирование",
    description: "Штатные инженеры разработают проект с учётом всех требований и нагрузок",
  },
  {
    icon: Headphones,
    title: "Поддержка 24/7",
    description: "Персональный менеджер на связи на всех этапах строительства",
  },
  {
    icon: BadgeCheck,
    title: "Сертифицированные материалы",
    description: "Используем только проверенные материалы от надёжных поставщиков",
  },
  {
    icon: Truck,
    title: "Работаем по всей России",
    description: "Собственный автопарк и логистика для доставки на любой объект",
  },
];

export default function AdvantagesSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#0F172A]" data-testid="advantages-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-orange-500 text-sm uppercase tracking-widest font-semibold">Преимущества</span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            data-testid="advantages-heading"
          >
            ПОЧЕМУ ВЫБИРАЮТ НАС
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="advantages-grid">
          {ADVANTAGES.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group p-6 lg:p-8 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-300"
                data-testid={`advantage-card-${idx}`}
              >
                <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 group-hover:bg-orange-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3
                  className="text-lg font-bold text-white mb-2"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {adv.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {adv.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}