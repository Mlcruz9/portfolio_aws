import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
// react-github-calendar can be published as CJS/ESM depending on version/build.
// To avoid "Minified React error #130" (invalid element type), we resolve the export safely.
import * as GitHubCalendarPkg from "react-github-calendar";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  FileText,
  MapPin,
  Sparkles,
  Boxes,
  Cloud,
  ShieldCheck,
  Wrench,
  Image as ImageIcon,
} from "lucide-react";

type PillProps = { children: React.ReactNode };

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  target?: React.HTMLAttributeAnchorTarget;
};

type SectionProps = {
  id: string;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
};

type PreviewMediaProps = {
  image?: string;
  gif?: string;
  alt: string;
};

type IconButtonProps = {
  href: string;
  title: string;
  children: React.ReactNode;
};

type Project = {
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  stack: string[];
  links?: { demo?: string; repo?: string };
  tag?: string;
  image: string;
  previewGif?: string;
};

type ToolboxItem = {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  desc: string;
  pills: string[];
};

type ExperienceItem = {
  when: string;
  role: string;
  where: string;
  bullets: string[];
};

/**
 * Portfolio single-file React component
 * - Minimal, data-toned (blues + light grays)
 * - Subtle scroll background fluidity
 * - Project cards with preview image (ready for GIF/video-on-hover later)
 *
 * Requires: framer-motion, lucide-react, react-github-calendar
 */

const USERNAME = "Mlcruz9";
const PAGE_MAX_WIDTH = 1680;
const fromPublic = (path: string) => `/${path.replace(/^\/+/, "")}`;
const EMAIL_ADDRESS = "miguellacruz.data@gmail.com";

// Brand colors
const BRAND = {
  linkedin: "#0A66C2",
  github: "#181717",
};

const LINKS = {
  github: "https://github.com/Mlcruz9",
  linkedin: "https://www.linkedin.com/in/miguellacruz/",
  cv: fromPublic("cv/MiguelLaCruz_CV.pdf"),
};

const DEPLOYS = {
  clustering: "https://clusteringgenai.miguellacruz.es/",
  travelagent: "https://travelagent.miguellacruz.es/",
  erp: "https://messier-erp.com/",
  scribd:
    "https://es.scribd.com/document/614802024/Flujo-de-trabajo-para-el-control-de-calidad-adecuacion-y-preparacion-de-datos-de-registros-de-pozos-en-proyectos-de-caracterizacion-de-yacimientos-y",
};

// Replace `image` with real screenshots (and later `previewVideo` or `previewGif`)
const PROJECTS: Project[] = [
  {
    title: "Client Segmentation + GenAI",
    subtitle: "Unsupervised learning with a GenAI layer (deployed)",
    description:
      "Customer segmentation using clustering techniques and a GenAI layer to explain patterns, explore insights, and speed up analysis—bridging data science with business storytelling.",
    highlights: [
      "Clustering and evaluation",
      "Business-oriented UX",
      "Live web deployment + repository",
    ],
    stack: ["Python", "Clustering", "RAG/LLM", "Web App", "Docker"],
    links: {
      demo: DEPLOYS.clustering,
      repo: "https://github.com/Mlcruz9/BusinessClientSegmentationTesting",
    },
    tag: "DEPLOYED",
    image: fromPublic("img/image1.png"),
  },
  {
    title: "Travel Agent",
    subtitle: "LLM-powered application (deployed)",
    description:
      "LLM-based travel assistant built to plan trips and answer user queries interactively. Designed as a service with a simple interface and iterative prompt/tool design.",
    highlights: [
      "User → LLM → response flow",
      "Product mindset (latency & cost awareness)",
      "Live web deployment",
    ],
    stack: ["Python", "LLM", "Agents", "LangChain"],
    links: {
      demo: DEPLOYS.travelagent,
      repo: LINKS.github,
    },
    tag: "DEPLOYED",
    image: fromPublic("img/image2.png"),
  },
  {
    title: "Well Log Reconstruction",
    subtitle: "ML pipeline for missing data reconstruction",
    description:
      "Machine learning pipeline for reconstructing missing well log data using real, noisy datasets. Emphasizes data preparation, validation, and reproducibility.",
    highlights: [
      "Data quality and feature engineering",
      "Model training and evaluation",
      "Technical workflow documentation",
    ],
    stack: ["Python", "Machine Learning", "Pandas", "Scikit-learn"],
    links: {
      demo: DEPLOYS.scribd,
      repo: "https://github.com/Mlcruz9/Well-log-Reconstruction-using-machine-learning",
    },
    tag: "CASE STUDY",
    image: fromPublic("img/image3.png"),
  },
  {
    title: "MESSIER ERP",
    subtitle: "ERP web platform (deployed)",
    description:
      "ERP platform for operations and workflow management with a Django backend and React frontend. Focused on modular architecture, maintainability, and business process integration.",
    highlights: [
      "Django + React architecture",
      "Operational workflows and dashboards",
      "Production deployment",
    ],
    stack: ["Django", "React", "PostgreSQL", "Docker", "Nginx"],
    links: {
      demo: DEPLOYS.erp,
      repo: LINKS.github,
    },
    tag: "DEPLOYED",
    image: fromPublic("img/image4.png"),
  },
  {
    title: "Battleship Monte Carlo AI",
    subtitle: "Monte Carlo simulation and heuristics",
    description:
      "Battleship-playing agent based on Monte Carlo simulation and heuristic strategies to decide optimal shots. A concise example of probabilistic reasoning and algorithmic design.",
    highlights: [
      "Simulation and scoring",
      "Probability-based strategy",
      "Clean, extensible code",
    ],
    stack: ["Python", "Monte Carlo", "Algorithms"],
    links: {
      demo: "https://github.com/Mlcruz9/Battleship-IA",
      repo: "https://github.com/Mlcruz9/Battleship-IA",
    },
    tag: "ALGORITHMS",
    image: fromPublic("img/image5.png"),
  },
];

const TOOLBOX: ToolboxItem[] = [
  {
    icon: Cloud,
    title: "Cloud-native",
    desc: "AWS/Azure, service deployment, and resource management.",
    pills: ["AWS", "Azure", "Linux"],
  },
  {
    icon: Boxes,
    title: "Containers & Orchestration",
    desc: "Reproducible environments and pipeline orchestration.",
    pills: ["Docker", "Kubernetes"],
  },
  {
    icon: Wrench,
    title: "Data & Compute",
    desc: "Distributed processing and workload optimization.",
    pills: ["Spark", "Dask", "SQL"],
  },
  {
    icon: ShieldCheck,
    title: "Production mindset",
    desc: "APIs, testing, monitoring, and production best practices.",
    pills: ["FastAPI/Django", "CI/CD", "Monitoring"],
  },
];

const EXPERIENCE: ExperienceItem[] = [
  {
    when: "2024 — Present",
    role: "Data Scientist · Iberia Express",
    where: "Madrid (Hybrid)",
    bullets: [
      "Pricing optimization, forecasting, and process automation.",
      "Model deployment and monitoring in production environments.",
    ],
  },
  {
    when: "2024",
    role: "Cloud R&D · Universitat Rovira i Virgili (Cloud Lab)",
    where: "Catalonia",
    bullets: [
      "Research on Kubernetes resource optimization for data pipelines (Dask + AWS).",
    ],
  },
  {
    when: "2022 — 2024",
    role: "Lead Instructor (Data Science) · The Bridge",
    where: "Madrid (Presential)",
    bullets: [
      "Consulting, project mentoring, and training in programming and applied machine learning.",
    ],
  },
  {
    when: "2020 — 2022",
    role: "Data Scientist (Oil & Gas) · InterRock",
    where: "Lecherías (Presential)",
    bullets: [
      "Data Science for QC and enhancement of sensor data (cleaning, validation, feature extraction).",
    ],
  },
];

function clamp(n: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, n));
}

function Pill({ children }: PillProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid rgba(15,23,42,0.10)",
        background: "rgba(255,255,255,0.70)",
        fontSize: 12,
        color: "rgba(15,23,42,0.85)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function ButtonLink({ href, children, variant = "primary", target }: ButtonLinkProps) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 12,
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 700,
    border: "1px solid rgba(15,23,42,0.12)",
    transition: "transform 0.15s ease, background 0.15s ease",
  };
  const styles =
    variant === "primary"
      ? { ...base, color: "#0b1220", background: "rgba(255,255,255,0.92)" }
      : { ...base, color: "rgba(15,23,42,0.88)", background: "rgba(255,255,255,0.70)" };

  return (
    <a
      href={href}
      target={target ?? (href?.startsWith("#") ? "_self" : "_blank")}
      rel="noreferrer"
      style={styles}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.background =
          variant === "primary" ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.82)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.background =
          variant === "primary" ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)";
      }}
    >
      {children}
    </a>
  );
}

function Section({ id, title, eyebrow, children }: SectionProps) {
  return (
    <section id={id} style={{ padding: "56px 0" }}>
      <div style={{ marginBottom: 18 }}>
        {eyebrow ? (
          <div
            style={{
              fontSize: 12,
              letterSpacing: 0.18,
              textTransform: "uppercase",
              color: "rgba(15,23,42,0.55)",
              marginBottom: 8,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <h2
          style={{
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: -0.2,
            margin: 0,
            color: "rgba(15,23,42,0.92)",
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function PreviewMedia({ image, gif, alt }: PreviewMediaProps) {
  const [hovered, setHovered] = useState(false);
  const src = hovered && gif ? gif : image;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        marginTop: 14,
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid rgba(15,23,42,0.10)",
        background: "rgba(255,255,255,0.85)",
      }}
    >
      <div style={{ position: "relative", paddingTop: "56.25%" }}>
        {src ? (
          <motion.img
            key={src}
            src={src}
            alt={alt}
            initial={{ opacity: 0.0, scale: 1.01 }}
            animate={{ opacity: 1, scale: hovered ? 1.03 : 1.0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              color: "rgba(15,23,42,0.55)",
              fontSize: 13,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <ImageIcon size={16} /> Add screenshot / GIF
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          padding: "10px 12px",
          color: "rgba(15,23,42,0.65)",
          fontSize: 12,
          background: "rgba(255,255,255,0.75)",
        }}
      >
        <span>{gif ? "Hover: GIF" : "Hover: zoom"}</span>
        <span style={{ opacity: 0.9 }}>16:9</span>
      </div>
    </div>
  );
}

function IconButton({ href, title, children }: IconButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={title}
      style={{
        display: "inline-flex",
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(15,23,42,0.12)",
        background: "rgba(255,255,255,0.78)",
      }}
    >
      {children}
    </a>
  );
}

function EmailChip() {
  return (
    <span
      title={EMAIL_ADDRESS}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 700,
        border: "1px solid rgba(15,23,42,0.12)",
        color: "rgba(15,23,42,0.88)",
        background: "rgba(255,255,255,0.70)",
        cursor: "help",
      }}
    >
      <Mail size={16} color={BRAND.linkedin} /> Email
    </span>
  );
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      style={{
        borderRadius: 18,
        border: "1px solid rgba(15,23,42,0.12)",
        background: "rgba(255,255,255,0.78)",
        padding: 18,
        boxShadow: "0 12px 28px rgba(15,23,42,0.14)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 900,
                color: "rgba(15,23,42,0.92)",
                letterSpacing: -0.2,
              }}
            >
              {p.title}
            </h3>
            {p.tag ? (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: 0.4,
                  padding: "4px 8px",
                  borderRadius: 999,
                  border: "1px solid rgba(10,102,194,0.25)",
                  background: "rgba(10,102,194,0.08)",
                  color: "rgba(10,102,194,0.95)",
                }}
              >
                {p.tag}
              </span>
            ) : null}
          </div>
          <div style={{ color: "rgba(15,23,42,0.70)", fontSize: 13, marginTop: 6 }}>
            {p.subtitle}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          {p.links?.demo ? (
            <IconButton href={p.links.demo} title="Open demo">
              <ExternalLink size={16} color={BRAND.linkedin} />
            </IconButton>
          ) : null}
          {p.links?.repo ? (
            <IconButton href={p.links.repo} title="Open repo">
              <Github size={16} color={BRAND.github} />
            </IconButton>
          ) : null}
        </div>
      </div>

      <p
        style={{
          marginTop: 12,
          marginBottom: 14,
          color: "rgba(15,23,42,0.86)",
          fontSize: 13,
          lineHeight: 1.55,
        }}
      >
        {p.description}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        {p.stack?.map((s) => (
          <Pill key={s}>{s}</Pill>
        ))}
      </div>

      <div style={{ color: "rgba(15,23,42,0.78)", fontSize: 13 }}>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {p.highlights?.map((h) => (
            <li key={h} style={{ marginBottom: 6 }}>
              {h}
            </li>
          ))}
        </ul>
      </div>

      <PreviewMedia image={p.image} gif={p.previewGif} alt={`${p.title} preview`} />
    </motion.div>
  );
}

function TopNav({
  active,
  setActive,
}: {
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
}) {
  const items = [
    { id: "projects", label: "Projects" },
    { id: "toolbox", label: "MLOps Toolbox" },
    { id: "experience", label: "Experience" },
    { id: "activity", label: "Activity" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(10px)",
        background: "rgba(245,248,252,0.70)",
        borderBottom: "1px solid rgba(15,23,42,0.08)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: PAGE_MAX_WIDTH,
          margin: "0 auto",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <a
          href="#top"
          style={{
            display: "inline-flex",
            gap: 10,
            alignItems: "center",
            textDecoration: "none",
            color: "rgba(15,23,42,0.92)",
            fontWeight: 950,
            letterSpacing: -0.2,
          }}
        >
          <Sparkles size={16} color={BRAND.linkedin} />
          <span>miguel.dev</span>
        </a>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              onClick={() => setActive(it.id)}
              style={{
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 800,
                padding: "8px 10px",
                borderRadius: 999,
                border: "1px solid rgba(15,23,42,0.10)",
                background:
                  active === it.id ? "rgba(10,102,194,0.10)" : "rgba(255,255,255,0.62)",
                color: active === it.id ? "rgba(10,102,194,0.98)" : "rgba(15,23,42,0.78)",
              }}
            >
              {it.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function resolveGitHubCalendarComponent() {
  const anyPkg = GitHubCalendarPkg;
  const Comp =
    (anyPkg && (anyPkg.default || anyPkg.GitHubCalendar || anyPkg.Calendar || anyPkg)) || null;

  const isValid =
    typeof Comp === "function" ||
    (typeof Comp === "object" && Comp !== null && ("$$typeof" in Comp || "render" in Comp));

  return isValid ? Comp : null;
}

function GithubHeatmap({ username }: { username: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const Comp = useMemo(() => resolveGitHubCalendarComponent(), []);

  if (!mounted || !Comp || typeof username !== "string" || username.trim().length === 0) {
    return (
      <div style={{ marginTop: 14 }}>
        <div style={{ color: "rgba(15,23,42,0.70)", fontSize: 13 }}>
          Could not load the GitHub heatmap automatically.
        </div>
        <div style={{ marginTop: 8 }}>
          <ButtonLink href={LINKS.github} variant="secondary">
            Open GitHub <ExternalLink size={16} color={BRAND.linkedin} />
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 14, overflowX: "auto" }}>
      <Comp
        username={username}
        blockSize={12}
        blockMargin={4}
        fontSize={12}
        showWeekdayLabels
        // Data-toned blues
        theme={{
          light: ["#eef2f7", "#cfe3ff", "#8bbcff", "#3d86ff", "#0A66C2"],
          dark: ["#eef2f7", "#cfe3ff", "#8bbcff", "#3d86ff", "#0A66C2"],
        }}
        labels={{
          totalCount: "{{count}} contributions in the last year",
        }}
      />
    </div>
  );
}

function runDevSelfTests() {
  // Lightweight runtime checks (acts like basic test cases in dev).
  if (typeof window === "undefined") return;
  const isDev =
    (typeof process !== "undefined" && process?.env?.NODE_ENV !== "production") ||
    (typeof import.meta !== "undefined" && import.meta?.env?.DEV);
  if (!isDev) return;

  try {
    console.assert(typeof USERNAME === "string" && USERNAME.length > 0, "USERNAME must be a string");
    console.assert(Array.isArray(PROJECTS) && PROJECTS.length > 0, "PROJECTS must be a non-empty array");
    console.assert(
      PROJECTS.every((p) => typeof p.title === "string" && Array.isArray(p.highlights) && Array.isArray(p.stack)),
      "Each project must have title/highlights/stack"
    );
    console.assert(
      EXPERIENCE.every((e) => Array.isArray(e.bullets)),
      "EXPERIENCE.bullets must always be an array of strings"
    );
    console.assert(
      PROJECTS.every((p) => typeof p.image === "string" && p.image.length > 0),
      "Each project must include an image path"
    );
    console.assert(
      typeof LINKS.cv === "string" && LINKS.cv.startsWith("/cv/"),
      "LINKS.cv should point to a local /cv/... PDF"
    );
  } catch {
    // never crash the UI
  }
}

export default function PortfolioMiguel() {
  const [active, setActive] = useState("projects");
  const year = useMemo(() => new Date().getFullYear(), []);

  // Scroll-driven background “fluidity”
  const [bgPos, setBgPos] = useState(30);
  const [bgTint, setBgTint] = useState(0.92);

  useEffect(() => {
    runDevSelfTests();

    const onScroll = () => {
      const y = window.scrollY || 0;
      const h = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = clamp(y / h, 0, 1);

      // shift background vertically a bit (parallax)
      const pos = 30 + p * 28;
      // slightly change overlay tint while scrolling
      const tint = 0.94 - p * 0.12;

      setBgPos(pos);
      setBgTint(tint);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const backgroundStyle = useMemo(() => {
    // NOTE: bgPos is kept for compatibility (if you later re-add a background image).
    void bgPos;

    return {
      minHeight: "100vh",
      background:
        `linear-gradient(180deg, rgba(241,246,252,${bgTint}), rgba(235,242,248,${bgTint - 0.08})), ` +
        `radial-gradient(900px 520px at 15% 10%, rgba(10,102,194,0.18), rgba(10,102,194,0) 60%), ` +
        `radial-gradient(900px 520px at 85% 20%, rgba(61,134,255,0.12), rgba(61,134,255,0) 55%)`,
      color: "#0b1220",
      fontFamily:
        "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji",
    };
  }, [bgPos, bgTint]);

  return (
    <div id="top" style={backgroundStyle}>
      <TopNav active={active} setActive={setActive} />

      <main style={{ width: "100%", maxWidth: PAGE_MAX_WIDTH, margin: "0 auto", padding: "0 18px 64px" }}>
        {/* HERO */}
        <section style={{ padding: "54px 0 28px" }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{
              borderRadius: 22,
              border: "1px solid rgba(15,23,42,0.12)",
              background: "rgba(255,255,255,0.78)",
              boxShadow: "0 18px 60px rgba(15,23,42,0.18)",
              padding: 22,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: -1,
                pointerEvents: "none",
                background:
                  "radial-gradient(600px 200px at 30% 0%, rgba(10,102,194,0.18), rgba(10,102,194,0)), radial-gradient(500px 240px at 80% 10%, rgba(61,134,255,0.14), rgba(61,134,255,0))",
                maskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.35) 60%, rgba(0,0,0,0))",
              }}
            />

            <div style={{ position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 14,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <Pill>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <MapPin size={14} color={BRAND.linkedin} /> Madrid
                      </span>
                    </Pill>
                    <Pill>Data Scientist → MLOps</Pill>
                    <Pill>Cloud · Kubernetes · Docker</Pill>
                  </div>

                  <h1
                    style={{
                      margin: "14px 0 10px",
                      fontSize: 38,
                      lineHeight: 1.06,
                      letterSpacing: -0.8,
                      fontWeight: 950,
                      color: "rgba(15,23,42,0.96)",
                    }}
                  >
                    Miguel La Cruz
                  </h1>

                  <p
                    style={{
                      margin: 0,
                      maxWidth: 720,
                      color: "rgba(15,23,42,0.78)",
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    I build data products end-to-end: from experimentation to deployment. I’m especially
                    interested in productionizing models with reproducible pipelines, observability, and a
                    cloud-native mindset.
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <ButtonLink href="#projects">
                    <Sparkles size={16} color={BRAND.linkedin} /> View projects
                  </ButtonLink>
                  <ButtonLink href={LINKS.github} variant="secondary" target="_self">
                <Github size={16} color={BRAND.github} /> GitHub
                  </ButtonLink>
                  <ButtonLink href={LINKS.linkedin} variant="secondary" target="_self">
                    <Linkedin size={16} color={BRAND.linkedin} /> LinkedIn
                  </ButtonLink>
                </div>
              </div>

              <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Python", "SQL", "Spark/Dask", "Docker", "Kubernetes", "AWS/Azure", "FastAPI/Django"].map(
                  (s) => (
                    <Pill key={s}>{s}</Pill>
                  )
                )}
              </div>

              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <EmailChip />
                <ButtonLink href={LINKS.cv} variant="secondary">
                  <FileText size={16} color={BRAND.linkedin} /> Resume
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        </section>

        {/* PROJECTS */}
        <Section id="projects" eyebrow="Selected work" title="Projects">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 14,
            }}
          >
            {PROJECTS.map((p) => (
              <ProjectCard key={p.title} p={p} />
            ))}
          </div>

          <div style={{ marginTop: 14, color: "rgba(15,23,42,0.62)", fontSize: 12 }}>
            Replace <code>image</code> with real screenshots (and later add <code>previewGif</code> or
            <code>previewVideo</code> for hover previews).
          </div>
        </Section>

        {/* TOOLBOX */}
        <Section id="toolbox" eyebrow="What I use" title="MLOps toolbox">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 14,
            }}
          >
            {TOOLBOX.map((t) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={t.title}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  style={{
                    borderRadius: 18,
                    border: "1px solid rgba(15,23,42,0.12)",
                    background: "rgba(255,255,255,0.78)",
                    padding: 18,
                    boxShadow: "0 12px 28px rgba(15,23,42,0.10)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 14,
                        border: "1px solid rgba(15,23,42,0.12)",
                        background: "rgba(10,102,194,0.08)",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Icon size={18} color={BRAND.linkedin} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 900, letterSpacing: -0.2, color: "rgba(15,23,42,0.92)" }}>
                        {t.title}
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(15,23,42,0.70)", marginTop: 2 }}>
                        {t.desc}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {t.pills.map((p) => (
                      <Pill key={p}>{p}</Pill>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Section>

        {/* EXPERIENCE */}
        <Section id="experience" eyebrow="Where I’ve worked" title="Experience">
          <div style={{ display: "grid", gap: 12 }}>
            {EXPERIENCE.map((x) => (
              <motion.div
                key={x.role}
                whileHover={{ y: -1 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(15,23,42,0.12)",
                  background: "rgba(255,255,255,0.78)",
                  padding: 18,
                  boxShadow: "0 12px 28px rgba(15,23,42,0.10)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 950, letterSpacing: -0.2, color: "rgba(15,23,42,0.92)" }}>
                      {x.role}
                    </div>
                    <div style={{ marginTop: 4, color: "rgba(15,23,42,0.70)", fontSize: 13 }}>{x.where}</div>
                  </div>
                  <Pill>{x.when}</Pill>
                </div>
                <ul
                  style={{
                    margin: "12px 0 0",
                    paddingLeft: 18,
                    color: "rgba(15,23,42,0.82)",
                    fontSize: 13,
                  }}
                >
                  {x.bullets.map((b) => (
                    <li key={b} style={{ marginBottom: 6 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ACTIVITY */}
        <Section id="activity" eyebrow="Open source" title="GitHub activity">
          <div
            style={{
              borderRadius: 18,
              border: "1px solid rgba(15,23,42,0.12)",
              background: "rgba(255,255,255,0.78)",
              padding: 18,
              overflow: "hidden",
              boxShadow: "0 12px 28px rgba(15,23,42,0.10)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 14,
                    border: "1px solid rgba(15,23,42,0.12)",
                    background: "rgba(10,102,194,0.08)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Github size={18} color={BRAND.github} />
                </div>
                <div>
                  <div style={{ fontWeight: 950, letterSpacing: -0.2, color: "rgba(15,23,42,0.92)" }}>
                    @{USERNAME}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(15,23,42,0.70)", marginTop: 2 }}>
                    GitHub contribution heatmap (blue palette)
                  </div>
                </div>
              </div>

              <ButtonLink href={LINKS.github} variant="secondary">
                View profile <ExternalLink size={16} color={BRAND.linkedin} />
              </ButtonLink>
            </div>

            <GithubHeatmap username={USERNAME} />

            <div style={{ marginTop: 10, fontSize: 12, color: "rgba(15,23,42,0.62)" }}>
              Want the preview to swap to a GIF or silent video on hover? Just fill in <code>previewGif</code> or
              implement <code>previewVideo</code>.
            </div>
          </div>
        </Section>

        {/* CONTACT */}
        <Section id="contact" eyebrow="Let’s talk" title="Contact">
          <div
            style={{
              borderRadius: 18,
              border: "1px solid rgba(15,23,42,0.12)",
              background: "rgba(255,255,255,0.78)",
              padding: 18,
              display: "grid",
              gap: 12,
              boxShadow: "0 12px 28px rgba(15,23,42,0.10)",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <EmailChip />
              <ButtonLink href={LINKS.linkedin} variant="secondary">
                <Linkedin size={16} color={BRAND.linkedin} /> LinkedIn
              </ButtonLink>
              <ButtonLink href={LINKS.github} variant="secondary">
                <Github size={16} color={BRAND.github} /> GitHub
              </ButtonLink>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ color: "rgba(15,23,42,0.72)", fontSize: 12 }}>
                Available for Data Science / MLOps roles (Madrid or remote).
              </div>
              <div style={{ color: "rgba(15,23,42,0.50)", fontSize: 12 }}>
                © {year} Miguel La Cruz
              </div>
            </div>
          </div>
        </Section>
      </main>

      <footer style={{ padding: "20px 0 36px", color: "rgba(15,23,42,0.55)", fontSize: 12 }}>
        <div style={{ width: "100%", maxWidth: PAGE_MAX_WIDTH, margin: "0 auto", padding: "0 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <Sparkles size={14} color={BRAND.linkedin} />
              <span>Built with React</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <Pill>Minimal</Pill>
              <Pill>Blue/Gray</Pill>
              <Pill>Data vibe</Pill>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
