export interface Testimonial {
  name: string;
  role: string;
  text: string;
  photo: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Алексей К.",
    role: "Frontend Developer",
    text: "ИИ-оценка показала слабые места до отправки. Нашёл работу с первого отклика.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=faces",
  },
  {
    name: "Мария С.",
    role: "Product Manager",
    text: "Шаблон Classic выглядит как из топ-консалтинга. PDF идеально ложится на A4.",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=faces",
  },
  {
    name: "Дмитрий В.",
    role: "Data Analyst",
    text: "Minimal — лучший ATS-шаблон. Чистая структура, без лишнего.",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=faces",
  },
  {
    name: "Елена Р.",
    role: "UX/UI Designer",
    text: "Редактор оформления — находка: поменяла шрифт, цвет и фото за пару минут. Выглядит как от дизайнера.",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&fit=crop&crop=faces",
  },
  {
    name: "Никита О.",
    role: "Marketing Manager",
    text: "Загрузил готовый пример маркетолога, подправил под себя и скачал PDF. Весь процесс — 10 минут.",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=128&h=128&fit=crop&crop=faces",
  },
];
