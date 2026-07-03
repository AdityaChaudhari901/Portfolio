import type { TablerIcon } from "@tabler/icons-react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX
} from "@tabler/icons-react";
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Cloud,
  Code2,
  Database,
  Globe,
  GraduationCap,
  Mail,
  ShieldCheck,
  Sparkles,
  TerminalSquare
} from "lucide-react";

type PortfolioIcon = LucideIcon | TablerIcon;

export interface ContactLink {
  label: string;
  href: string;
  icon?: PortfolioIcon;
}

export interface Experience {
  company: string;
  role: string;
  location: string;
  period: string;
  summary: string;
  bullets: string[];
  tags: string[];
}

export interface Project {
  title: string;
  subtitle: string;
  description: string;
  impact: string;
  stack: string[];
  accent: "signal" | "ember" | "coral";
  image?: {
    src: string;
    alt: string;
  };
  links: ContactLink[];
}

export interface SkillGroup {
  title: string;
  icon: LucideIcon;
  skills: string[];
}

export const profile = {
  name: "Aditya Chaudhari",
  role: "Full-Stack Software Engineer",
  specialty: "AI agents, React Native, and production web systems",
  location: "Pune, India",
  email: "AdityaChaudhari9022@gmail.com",
  resumeHref: "/Aditya_Chaudhari_Resume.pdf",
  summary:
    "Full-stack software engineer with 1.5+ years shipping web and React Native applications end-to-end. I build React, Next.js, FastAPI, Node.js, and LLM-powered systems with strong product ownership from requirements through deployment.",
  currentFocus:
    "Currently building customer-facing AI shopping assistants, React Native chat-SDK integrations, and production LangChain/LangGraph workflows at Fynd."
};

export const contactLinks: ContactLink[] = [
  {
    label: "Email",
    href: "mailto:AdityaChaudhari9022@gmail.com",
    icon: Mail
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/aditya-chaudhari-ai/",
    icon: IconBrandLinkedin
  },
  {
    label: "GitHub",
    href: "https://github.com/AdityaChaudhari901",
    icon: IconBrandGithub
  },
  {
    label: "X",
    href: "https://x.com/AdityaXCodess",
    icon: IconBrandX
  }
];

export const experiences: Experience[] = [
  {
    company: "Fynd (Shopsense Retail Technologies)",
    role: "Software Development Engineer Intern",
    location: "Mumbai, India",
    period: "Jan 2026 - Present",
    summary:
      "Shipping AI shopping, chat-SDK, and agentic workflow systems across web, React Native, and containerized backend infrastructure.",
    bullets: [
      "Built a customer-facing AI shopping assistant with React, chat-SDK frontend, identity-aware caching, thread management, iframe embedding, Docker, and nginx.",
      "Engineered React Native chat-SDK integration with hosted WebView and custom native UI modes, plus Jest coverage for attachment and chat-hook contracts.",
      "Designed production LLM-powered LangChain and LangGraph workflows with intent detection, cross-session state, and fallback handling."
    ],
    tags: ["React", "React Native", "LangGraph", "Docker", "nginx"]
  },
  {
    company: "Swan TechPro Private Limited",
    role: "AI/ML Engineer Intern",
    location: "Pune, India",
    period: "Jul 2025 - Dec 2025",
    summary:
      "Built healthcare RAG and multi-agent document pipelines for diagnostic support, clinical classification, and structured report generation.",
    bullets: [
      "Built a healthcare diagnostic RAG platform ingesting sonography reports, generating embeddings, and producing AI-assisted diagnostic insights.",
      "Engineered LangGraph multi-agent document scanning and classification workflows, reducing manual data extraction by 50%.",
      "Exposed preprocessing, embedding, inference, and evaluation outputs through Python REST APIs and SQL database integrations."
    ],
    tags: ["Python", "RAG", "Vector DB", "LangGraph", "REST APIs"]
  },
  {
    company: "Adzvortex Solutions LLP",
    role: "Full-Stack Web Developer Intern",
    location: "Pune, India (Remote)",
    period: "Jun 2024 - Aug 2024",
    summary:
      "Contributed to shipped web projects with React frontends, Node.js APIs, pull-request workflows, and defect resolution.",
    bullets: [
      "Contributed end-to-end to 3+ projects using Node.js REST APIs and React frontends.",
      "Resolved 20+ defects and managed 50+ Git commits through feature branches and pull-request reviews."
    ],
    tags: ["React", "Node.js", "REST APIs", "GitHub", "Agile"]
  }
];

export const projects: Project[] = [
  {
    title: "SENSAI",
    subtitle: "Generative AI Career Platform",
    description:
      "A full-stack AI career platform with account-backed workflows, background jobs, and Gemini-driven content generation.",
    impact:
      "Served 100+ active users with Prisma-backed PostgreSQL, Inngest jobs, and LLM-generated career guidance.",
    stack: ["Next.js", "Node.js", "Prisma", "PostgreSQL", "Gemini", "Inngest"],
    accent: "signal",
    image: {
      src: "/projects/sensai-banner.jpeg",
      alt: "SENSAI career platform homepage preview"
    },
    links: [
      {
        label: "GitHub",
        href: "https://github.com/AdityaChaudhari901",
        icon: Code2
      }
    ]
  },
  {
    title: "BLOGSTOP",
    subtitle: "Content Management System",
    description:
      "A production-ready CMS with admin workflows, secure REST APIs, image uploads, and MongoDB Atlas subscription management.",
    impact:
      "Managed content workflows and email subscriptions for 200+ subscribers with a Next.js dashboard and Node.js APIs.",
    stack: ["Next.js", "Node.js", "REST APIs", "MongoDB Atlas", "Admin UI"],
    accent: "ember",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/AdityaChaudhari901",
        icon: Code2
      }
    ]
  },
  {
    title: "Sourcebound",
    subtitle: "Citation-grounded RAG platform",
    description:
      "A KnowledgeOps RAG system that streams cited answers, self-grades retrieval, rewrites weak queries, verifies grounding, and keeps tenant data isolated.",
    impact:
      "Runs a corrective LangGraph pipeline with FastAPI, Qdrant, PostgreSQL, Redis/Celery ingestion, Langfuse traces, and evaluation-gated answer quality.",
    stack: ["Next.js", "FastAPI", "LangGraph", "Qdrant", "PostgreSQL", "Langfuse"],
    accent: "coral",
    image: {
      src: "/projects/sourcebound.png",
      alt: "Sourcebound landing page showing a citation-grounded retrieval graph"
    },
    links: [
      {
        label: "Live Demo",
        href: "https://sourcebound.vercel.app/"
      },
      {
        label: "GitHub",
        href: "https://github.com/AdityaChaudhari901/Sourcebound",
        icon: Code2
      }
    ]
  },
  {
    title: "PriceMatrix",
    subtitle: "E-commerce price tracker",
    description:
      "A price-drop tracker for e-commerce pages with quick product capture, user accounts, target prices, and alert-focused workflows.",
    impact:
      "Tracks dynamic storefront prices and supports smart price-drop alerts with a Next.js, Supabase, Firecrawl, Resend, and Recharts stack.",
    stack: ["Next.js", "Supabase", "Firecrawl", "Resend", "Recharts", "Tailwind CSS"],
    accent: "signal",
    image: {
      src: "/projects/price-drop.png",
      alt: "PriceMatrix landing page showing a product URL tracker for price drops"
    },
    links: [
      {
        label: "Live Demo",
        href: "https://pricematrix.vercel.app/"
      },
      {
        label: "GitHub",
        href: "https://github.com/AdityaChaudhari901/PriceMatrix",
        icon: Code2
      }
    ]
  }
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Programming Languages",
    icon: Code2,
    skills: ["Python", "JavaScript","Typescript"]
  },
  {
    title: "AI/ML Technologies",
    icon: Bot,
    skills: [
      "LangGraph",
      "LangChain",
      "RAG Architecture",
      "Prompt Engineering",
      "AI Agents",
      "Multi-Agent Systems",
      "MCP"
    ]
  },
  {
    title: "Web Development",
    icon: Globe,
    skills: ["React.js", "React Native", "Next.js", "Node.js", "FastAPI","Tailwind CSS","Shadcn UI"]
  },
  {
    title: "Databases",
    icon: Database,
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Prisma", "ChromaDB","NeonDB"]
  },
  {
    title: "DevOps & Cloud",
    icon: Cloud,
    skills: ["Azure", "Docker", "Git", "GitHub", "CI/CD", "nginx", "Serverless"]
  },
  {
    title: "Soft Skills",
    icon: Sparkles,
    skills: ["Problem Solving", "Collaboration", "Fast Learning"]
  }
];

export const education = {
  school: "DY Patil International University",
  degree: "Bachelor of Technology in Computer Science and Engineering",
  period: "2021 - 2025",
  location: "Pune, Maharashtra",
  icon: GraduationCap
};

export const certifications = [
  { label: "ServiceNow Certified Application Developer", icon: ShieldCheck },
  { label: "ServiceNow Certified System Administrator", icon: ShieldCheck },
  { label: "NPTEL Internet of Things and Cloud Computing", icon: TerminalSquare }
];
