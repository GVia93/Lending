import { useState } from "react";
import { motion } from "framer-motion";
import { Expand, MapPin, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

const CATEGORY_LABELS = {
  hangars: "Ангары",
  "grain-storage": "Зернохранилища",
  garages: "Гаражи",
  demolition: "Демонтаж",
};

export default function PortfolioSection({ portfolio, hideFilters = false }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState("all");

  if (!portfolio.length) return null;

  const filtered = filter === "all" ? portfolio : portfolio.filter((p) => p.category === filter);
  const categories = ["all", ...new Set(portfolio.map((p) => p.category))];

  return (
    <section id="portfolio" className="py-20 lg:py-28 bg-[#0A0A0A]" data-testid="portfolio-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!hideFilters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <span className="text-orange-500 text-sm uppercase tracking-widest font-semibold">Портфолио</span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              data-testid="portfolio-heading"
            >
              НАШИ ПРОЕКТЫ
            </h2>
          </motion.div>
        )}

        {/* Filter tabs */}
        {!hideFilters && (
          <div className="flex flex-wrap gap-2 mb-8" data-testid="portfolio-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                data-testid={`portfolio-filter-${cat}`}
                className={`px-4 py-2 text-sm uppercase tracking-wider font-medium transition-all duration-200 border ${
                  filter === cat
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500"
                }`}
              >
                {cat === "all" ? "Все" : CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>
        )}

        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="portfolio-grid">
          {filtered.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              onClick={() => setSelectedItem(item)}
              className="group relative overflow-hidden cursor-pointer border border-neutral-800 bg-[#171717]"
              data-testid={`portfolio-item-${item.id}`}
            >
              <div className="relative h-56 lg:h-64 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                  <Expand className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <div className="p-4">
                <span className="text-xs text-orange-500 uppercase tracking-wider font-medium">
                  {CATEGORY_LABELS[item.category] || item.category}
                </span>
                <h3 className="text-base font-bold text-white mt-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {item.title}
                </h3>
                <div className="flex gap-4 mt-2 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {item.area}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.duration}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dialog for full view */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="sm:max-w-2xl bg-[#171717] border-neutral-800 p-0 overflow-hidden" data-testid="portfolio-dialog">
          {selectedItem && (
            <>
              <img
                src={selectedItem.image_url}
                alt={selectedItem.title}
                className="w-full h-64 sm:h-80 object-cover"
              />
              <div className="p-6">
                <DialogHeader>
                  <span className="text-xs text-orange-500 uppercase tracking-wider font-medium">
                    {CATEGORY_LABELS[selectedItem.category]}
                  </span>
                  <DialogTitle
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {selectedItem.title}
                  </DialogTitle>
                  <DialogDescription className="text-neutral-400">
                    {selectedItem.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-6 mt-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    Площадь: {selectedItem.area}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <Clock className="w-4 h-4 text-orange-500" />
                    Срок: {selectedItem.duration}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}