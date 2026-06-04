import type { ResumeExample, ResumeData } from "@/types/resume";
import { getDefaultDesign } from "@/lib/design-tokens";

function ex(
  id: string,
  profession: string,
  title: string,
  description: string,
  template: ResumeData["template"],
  data: Omit<ResumeData, "template" | "design"> & { design?: Partial<ResumeData["design"]> },
): ResumeExample {
  return {
    id,
    profession,
    title,
    description,
    template,
    data: {
      ...data,
      template,
      design: { ...getDefaultDesign(), ...data.design },
    } as ResumeData,
  };
}

export const RESUME_EXAMPLES: ResumeExample[] = [
  ex(
    "frontend-dev",
    "Frontend Developer",
    "Иван Петров — Frontend",
    "IT-специалист с опытом в React и TypeScript. Шаблон Modern.",
    "modern",
    {
      contact: {
        fullName: "Иван Петров",
        email: "ivan.petrov@mail.ru",
        phone: "+7 (999) 123-45-67",
        city: "Москва",
        linkedin: "linkedin.com/in/ivanpetrov",
        telegram: "@ivan_dev",
        website: "ivanpetrov.dev",
      },
      summary:
        "Frontend-разработчик с 5+ годами опыта. Специализируюсь на React, TypeScript и высоконагруженных SPA. Выстраивал архитектуру с нуля, сокращал время загрузки на 40% и внедрял design system в командах до 12 человек.",
      experience: [
        {
          id: "exp-1",
          company: "Яндекс",
          position: "Senior Frontend Developer",
          startDate: "Мар 2022",
          endDate: "",
          isCurrent: true,
          description:
            "Разработал модуль аналитики с 500K+ DAU\nОптимизировал Core Web Vitals: LCP с 3.2s до 1.8s\nВнедрил Storybook и сократил время code review на 25%\nМенторил 3 junior-разработчиков",
        },
        {
          id: "exp-2",
          company: "Тинькофф",
          position: "Frontend Developer",
          startDate: "Июн 2019",
          endDate: "Фев 2022",
          isCurrent: false,
          description:
            "Разработал личный кабинет для 2M+ пользователей\nПеревёл legacy-код на TypeScript (15K строк)\nИнтегрировал платёжные виджеты и снизил ошибки на 30%",
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "МГУ им. Ломоносова",
          degree: "Бакалавр",
          field: "Прикладная математика и информатика",
          startDate: "2015",
          endDate: "2019",
        },
      ],
      skills: "React, TypeScript, Next.js, Redux, Node.js, GraphQL, Git, Figma, Agile, REST API, Webpack, Jest",
      languages: [
        { id: "lang-1", language: "Русский", level: "Родной" },
        { id: "lang-2", language: "Английский", level: "B2" },
      ],
      design: { accentColor: "blue", fontFamily: "inter", photoPosition: "sidebar" },
    },
  ),
  ex(
    "product-manager",
    "Product Manager",
    "Мария Соколова — PM",
    "Продакт-менеджер с опытом в fintech. Шаблон Classic.",
    "classic",
    {
      contact: {
        fullName: "Мария Соколова",
        email: "maria.sokolova@gmail.com",
        phone: "+7 (916) 555-12-34",
        city: "Москва",
        linkedin: "linkedin.com/in/mariasokolova",
        telegram: "@maria_pm",
        website: "",
      },
      summary:
        "Product Manager с 6-летним опытом в fintech и e-commerce. Запускала продукты от идеи до 1M+ пользователей. Фокус на data-driven решениях, A/B-тестировании и cross-functional командах.",
      experience: [
        {
          id: "exp-1",
          company: "Сбер",
          position: "Senior Product Manager",
          startDate: "Янв 2021",
          endDate: "",
          isCurrent: true,
          description:
            "Запустила мобильный продукт с MAU 800K за 8 месяцев\nУвеличила retention на 18% через персонализацию\nУправляла roadmap команды из 15 человек\nПровела 40+ customer development интервью",
        },
        {
          id: "exp-2",
          company: "Ozon",
          position: "Product Manager",
          startDate: "Сен 2018",
          endDate: "Дек 2020",
          isCurrent: false,
          description:
            "Оптимизировала checkout: конверсия +12%\nЗапустила программу лояльности (1.2M участников)\nВнедрила OKR-фреймворк в продуктовую команду",
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "ВШЭ",
          degree: "Магистр",
          field: "Управление бизнесом",
          startDate: "2016",
          endDate: "2018",
        },
      ],
      skills: "Product Strategy, Roadmap, A/B Testing, SQL, Amplitude, Jira, Figma, Agile, Scrum, Customer Development",
      languages: [
        { id: "lang-1", language: "Русский", level: "Родной" },
        { id: "lang-2", language: "Английский", level: "C1" },
      ],
      design: { accentColor: "slate", fontFamily: "georgia", photoPosition: "header" },
    },
  ),
  ex(
    "marketing",
    "Marketing Manager",
    "Алексей Козлов — Marketing",
    "Digital-маркетолог с опытом performance. Шаблон Modern.",
    "modern",
    {
      contact: {
        fullName: "Алексей Козлов",
        email: "alex.kozlov@yandex.ru",
        phone: "+7 (903) 777-88-99",
        city: "Санкт-Петербург",
        linkedin: "linkedin.com/in/alexkozlov",
        telegram: "",
        website: "kozlov-marketing.ru",
      },
      summary:
        "Digital-маркетолог с 4+ годами в performance и brand marketing. Управлял бюджетами до 15M ₽/мес, снижал CAC на 35% и масштабировал кампании в VK, Яндекс и Google.",
      experience: [
        {
          id: "exp-1",
          company: "Avito",
          position: "Marketing Manager",
          startDate: "Апр 2021",
          endDate: "",
          isCurrent: true,
          description:
            "Масштабировал performance-кампании: ROI +45%\nЗапустил контент-стратегию: органический трафик +60%\nУправлял бюджетом 10M ₽/мес\nВнедрил сквозную аналитику через GA4 + CRM",
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "СПбГУ",
          degree: "Бакалавр",
          field: "Реклама и связи с общественностью",
          startDate: "2014",
          endDate: "2018",
        },
      ],
      skills: "Performance Marketing, SMM, Google Ads, Яндекс.Директ, VK Ads, Analytics, SEO, Copywriting, CRM",
      languages: [
        { id: "lang-1", language: "Русский", level: "Родной" },
        { id: "lang-2", language: "Английский", level: "B2" },
      ],
      design: { accentColor: "violet", fontFamily: "roboto" },
    },
  ),
  ex(
    "data-analyst",
    "Data Analyst",
    "Дмитрий Волков — Analyst",
    "Аналитик данных в e-commerce. Шаблон Minimal.",
    "minimal",
    {
      contact: {
        fullName: "Дмитрий Волков",
        email: "d.volkov@mail.ru",
        phone: "+7 (925) 000-11-22",
        city: "Москва",
        linkedin: "linkedin.com/in/dvolkov",
        telegram: "@dvolkov_data",
        website: "",
      },
      summary:
        "Data Analyst с экспертизой в SQL, Python и BI-инструментах. Строил дашборды для C-level, автоматизировал отчётность и находил инсайты, которые принесли +8% к выручке.",
      experience: [
        {
          id: "exp-1",
          company: "Wildberries",
          position: "Senior Data Analyst",
          startDate: "Июл 2020",
          endDate: "",
          isCurrent: true,
          description:
            "Построил 20+ дашбордов в Tableau для операционного блока\nАвтоматизировал weekly-отчёты: экономия 15 ч/нед\nВыявил паттерны churn: retention +5% после изменений\nA/B-тестирование pricing: выручка +3.2%",
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "МФТИ",
          degree: "Магистр",
          field: "Прикладная математика",
          startDate: "2016",
          endDate: "2020",
        },
      ],
      skills: "SQL, Python, Pandas, Tableau, Power BI, Excel, Statistics, A/B Testing, PostgreSQL, Git",
      languages: [
        { id: "lang-1", language: "Русский", level: "Родной" },
        { id: "lang-2", language: "Английский", level: "B2" },
      ],
      design: { accentColor: "emerald", fontFamily: "inter", photoPosition: "none", showPhoto: false },
    },
  ),
  ex(
    "designer",
    "UX/UI Designer",
    "Анна Морозова — Designer",
    "UX/UI дизайнер с портфолио в fintech. Шаблон Modern.",
    "modern",
    {
      contact: {
        fullName: "Анна Морозова",
        email: "anna.morozova@design.ru",
        phone: "+7 (903) 444-55-66",
        city: "Москва",
        linkedin: "linkedin.com/in/annamorozova",
        telegram: "@anna_ui",
        website: "behance.net/annamorozova",
      },
      summary:
        "UX/UI Designer с 4 годами опыта в fintech и mobile apps. Проектирую интерфейсы от research до handoff. Улучшала conversion rate на 25% через redesign ключевых flows.",
      experience: [
        {
          id: "exp-1",
          company: "Тинькофф",
          position: "Senior UX/UI Designer",
          startDate: "Май 2021",
          endDate: "",
          isCurrent: true,
          description:
            "Redesign мобильного onboarding: conversion +22%\nСоздала design system (80+ компонентов)\nПровела 25 usability-тестов\nКурировала 2 junior-дизайнеров",
        },
        {
          id: "exp-2",
          company: "Skyeng",
          position: "UI Designer",
          startDate: "Авг 2019",
          endDate: "Апр 2021",
          isCurrent: false,
          description:
            "Дизайн LMS-платформы для 100K+ студентов\nA/B-тест landing pages: CR +15%\nПрототипирование в Figma, handoff в Zeplin",
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "British Higher School of Art & Design",
          degree: "Бакалавр",
          field: "Графический дизайн",
          startDate: "2015",
          endDate: "2019",
        },
      ],
      skills: "Figma, Sketch, Prototyping, User Research, Design Systems, HTML/CSS, Usability Testing, Wireframing",
      languages: [
        { id: "lang-1", language: "Русский", level: "Родной" },
        { id: "lang-2", language: "Английский", level: "C1" },
      ],
      design: { accentColor: "rose", fontFamily: "playfair", photoPosition: "sidebar" },
    },
  ),
  ex(
    "accountant",
    "Бухгалтер",
    "Елена Николаева — Accountant",
    "Главный бухгалтер среднего бизнеса. Шаблон Classic.",
    "classic",
    {
      contact: {
        fullName: "Елена Николаева",
        email: "e.nikolaeva@company.ru",
        phone: "+7 (495) 123-45-67",
        city: "Москва",
        linkedin: "",
        telegram: "",
        website: "",
      },
      summary:
        "Главный бухгалтер с 10-летним стажем. Ведение бухгалтерского и налогового учёта, подготовка отчётности, опыт работы с ОСНО и УСН. Контролировала учёт компании с оборотом 500M+ ₽/год.",
      experience: [
        {
          id: "exp-1",
          company: "ООО «СтройИнвест»",
          position: "Главный бухгалтер",
          startDate: "Янв 2018",
          endDate: "",
          isCurrent: true,
          description:
            "Полное ведение учёта компании (50+ сотрудников)\nСдача отчётности без штрафов 6 лет подряд\nАвтоматизация учёта в 1С:ERP\nОптимизация налоговой нагрузки на 8%",
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "РЭУ им. Плеhanova",
          degree: "Бакалавр",
          field: "Бухгалтерский учёт и аудит",
          startDate: "2008",
          endDate: "2012",
        },
      ],
      skills: "1С:Бухгалтерия, 1С:ERP, Excel, Налоговый учёт, ОСНО, УСН, Первичная документация, Отчётность",
      languages: [{ id: "lang-1", language: "Русский", level: "Родной" }],
      design: { accentColor: "slate", fontFamily: "georgia", photoPosition: "header" },
    },
  ),
];

export function getExampleById(id: string): ResumeExample | undefined {
  return RESUME_EXAMPLES.find((e) => e.id === id);
}

/** Deep clone example for loading into builder */
export function cloneExampleData(example: ResumeExample): ResumeData {
  return JSON.parse(JSON.stringify(example.data)) as ResumeData;
}
