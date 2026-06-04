"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ResumePreview } from "@/components/ResumePreview";
import type { ResumeData } from "@/types/resume";
import { cn } from "@/lib/utils";

/** A4 page size at 96dpi (210×297 mm) */
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

interface ResumePreviewFrameProps {
  data: ResumeData;
  className?: string;
  overlay?: ReactNode;
}

/** Fits a full A4 resume preview into any container — centered, no squashed strips. */
export function ResumePreviewFrame({ data, className, overlay }: ResumePreviewFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.32);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const fit = () => {
      const pad = 12;
      const scaleW = (node.clientWidth - pad) / A4_WIDTH;
      const scaleH = (node.clientHeight - pad) / A4_HEIGHT;
      setScale(Math.min(scaleW, scaleH, 1));
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900",
        className,
      )}
    >
      <div className="absolute inset-0 flex items-start justify-center pt-2">
        <div
          className="shrink-0"
          style={{
            width: A4_WIDTH,
            height: A4_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          <ResumePreview data={data} />
        </div>
      </div>
      {overlay}
    </div>
  );
}
