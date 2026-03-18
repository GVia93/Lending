import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Warehouse, Wheat, Container, Hammer, ArrowRight } from "lucide-react";

const ICONS = {
  Warehouse: Warehouse,
  Wheat: Wheat,
  Container: Container,
  Hammer: Hammer,
};

export default function ServicesSection({ services }) {
  if (!services.length) return null;

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#0A0A0A]" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <span className="text-orange-500 text-sm uppercase tracking-widest font-semibold">Наши услуги</span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            data-testid="services-heading"
          >
            ЧТО МЫ СТРОИМ
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="services-grid">
          {services.map((service, idx) => {
            const Icon = ICONS[service.icon] || Warehouse;
            const isLarge = idx === 0;

            return (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`bento-card group relative overflow-hidden border border-neutral-800 bg-[#171717] cursor-pointer ${
                    isLarge ? "md:col-span-2 lg:col-span-2 lg:row-span-2" : ""
                  }`}
                  data-testid={`service-card-${service.slug}`}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden ${isLarge ? "h-72 lg:h-full" : "h-48"}`}>
                    <img
                      src={service.image_url}
                      alt={`${service.name} - строительство в Москве и Московской области`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/60 to-transparent" />
                  </div>

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-orange-500" />
                      </div>
                      <span className="text-xs text-neutral-500 uppercase tracking-widest font-mono-tech">
                        от {(service.price_per_sqm).toLocaleString("ru-RU")} ₽/м²
                      </span>
                    </div>
                    <h3
                      className="text-xl lg:text-2xl font-bold text-white mb-2"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {service.name}
                    </h3>
                    <p className={`text-sm text-neutral-400 leading-relaxed ${isLarge ? "max-w-md" : "line-clamp-2"}`}>
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-orange-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Подробнее</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}