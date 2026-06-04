import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

function waitForImages(root: HTMLElement): Promise<void> {
  const images = root.querySelectorAll("img");
  return Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }),
    ),
  ).then(() => undefined);
}

/** Export resume DOM node to A4 PDF file (direct download, no popup). */
export async function exportResumeToPdf(
  source: HTMLElement,
  filename: string,
): Promise<void> {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("aria-hidden", "true");
  wrapper.style.cssText =
    "position:fixed;left:-10000px;top:0;z-index:-1;background:#fff;pointer-events:none;";

  const clone = source.cloneNode(true) as HTMLElement;
  clone.style.transform = "none";
  clone.style.margin = "0";
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    await waitForImages(clone);

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    const imgData = canvas.toDataURL("image/jpeg", 0.92);

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  } finally {
    document.body.removeChild(wrapper);
  }
}

export function resumePdfFilename(fullName: string): string {
  const base =
    fullName
      .trim()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-")
      .slice(0, 60) || "resume";
  return `${base}-stackcv.pdf`;
}
