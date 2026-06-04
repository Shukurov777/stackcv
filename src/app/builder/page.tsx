import { Header } from "@/components/Header";
import { ResumeBuilder } from "@/components/ResumeBuilder";

export const metadata = {
  title: "Конструктор резюме",
};

export default function BuilderPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--bg)] pb-16">
        <ResumeBuilder />
      </main>
    </>
  );
}
