import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";

export default function TestimonialsSection({ testimonials }) {
  if (!testimonials.length) return null;

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-[#171717]" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-orange-500 text-sm uppercase tracking-widest font-semibold">Отзывы</span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            data-testid="testimonials-heading"
          >
            ЧТО ГОВОРЯТ КЛИЕНТЫ
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto px-12">
          <Carousel
            opts={{ align: "start", loop: true }}
            data-testid="testimonials-carousel"
          >
            <CarouselContent>
              {testimonials.map((t) => (
                <CarouselItem key={t.id} className="md:basis-1/2 lg:basis-1/2">
                  <div
                    className="h-full p-6 lg:p-8 border border-neutral-700 bg-[#0A0A0A] relative"
                    data-testid={`testimonial-card-${t.id}`}
                  >
                    <Quote className="w-8 h-8 text-orange-500/20 absolute top-6 right-6" />
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < t.rating ? "text-orange-500 fill-orange-500" : "text-neutral-700"}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-neutral-300 leading-relaxed mb-6 italic">
                      "{t.text}"
                    </p>
                    <div className="mt-auto border-t border-neutral-800 pt-4">
                      <div className="font-bold text-white text-sm">{t.name}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {t.role}, {t.company}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-neutral-800 border-neutral-700 text-white hover:bg-orange-500 hover:border-orange-500" />
            <CarouselNext className="bg-neutral-800 border-neutral-700 text-white hover:bg-orange-500 hover:border-orange-500" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}