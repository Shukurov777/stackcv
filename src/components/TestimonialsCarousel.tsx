"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { TESTIMONIALS } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

function usePerView() {
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setPerView(3);
      else if (window.innerWidth >= 768) setPerView(2);
      else setPerView(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return perView;
}

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <Card padding="md" className="h-full">
      <div className="mb-4 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-[var(--fg-muted)]">&ldquo;{t.text}&rdquo;</p>
      <div className="mt-5 flex items-center gap-3 border-t border-[var(--border)] pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={t.photo}
          alt={t.name}
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-[var(--border)] ring-offset-2 ring-offset-[var(--bg-elevated)]"
        />
        <div>
          <p className="text-sm font-semibold text-[var(--fg)]">{t.name}</p>
          <p className="text-xs text-[var(--fg-faint)]">{t.role}</p>
        </div>
      </div>
    </Card>
  );
}

export function TestimonialsCarousel() {
  const perView = usePerView();
  const maxIndex = Math.max(0, TESTIMONIALS.length - perView);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex);
  }, [index, maxIndex]);

  const goTo = useCallback(
    (next: number) => {
      if (next < 0) setIndex(maxIndex);
      else if (next > maxIndex) setIndex(0);
      else setIndex(next);
    },
    [maxIndex],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || maxIndex === 0) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, maxIndex, next]);

  const slidePercent = 100 / perView;
  const gapShare = ((perView - 1) * 24) / perView;

  return (
    <div
      className="relative mx-auto max-w-6xl px-2 sm:px-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-6"
          animate={{ x: `calc(-${index} * (${slidePercent}% + ${24 / perView}px))` }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="shrink-0"
              style={{ width: `calc(${slidePercent}% - ${gapShare}px)` }}
            >
              <TestimonialCard t={t} />
            </div>
          ))}
        </motion.div>
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Предыдущий отзыв"
        className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-2.5 text-[var(--fg-muted)] shadow-[var(--shadow-md)] transition hover:border-[var(--border-strong)] hover:text-[var(--fg)] sm:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Следующий отзыв"
        className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-2.5 text-[var(--fg-muted)] shadow-[var(--shadow-md)] transition hover:border-[var(--border-strong)] hover:text-[var(--fg)] sm:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="mt-6 flex items-center justify-center gap-3 sm:hidden">
        <button
          type="button"
          onClick={prev}
          aria-label="Предыдущий отзыв"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg-muted)]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Следующий отзыв"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg-muted)]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Слайд ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-6 bg-[var(--accent)]" : "w-2 bg-[var(--border-strong)] hover:bg-[var(--fg-faint)]",
            )}
          />
        ))}
      </div>
    </div>
  );
}
