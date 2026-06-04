"use client";

import type { ResumeData, GeneratedContent } from "@/types/resume";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";

interface ResumePreviewProps {
  data: ResumeData;
  generated?: GeneratedContent | null;
  id?: string;
  scale?: number;
}

export function ResumePreview({ data, generated, id, scale = 1 }: ResumePreviewProps) {
  const Template =
    data.template === "classic"
      ? ClassicTemplate
      : data.template === "minimal"
        ? MinimalTemplate
        : ModernTemplate;

  return (
    <div
      id={id}
      style={
        scale !== 1
          ? {
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              width: `${100 / scale}%`,
            }
          : undefined
      }
    >
      <Template data={data} generated={generated} />
    </div>
  );
}
