import React, { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Mail,
  ChevronRight,
  Pin,
  ArrowUpRight,
  Sparkles,
  Layers,
  Cpu,
} from "lucide-react";

function LinkedInIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19ZM8.34 10.67H5.67V18.33H8.34V10.67ZM7 6.5A1.58 1.58 0 1 0 7 9.66A1.58 1.58 0 0 0 7 6.5ZM18.33 13.86C18.33 11.58 17.11 10.42 15.16 10.42C13.66 10.42 12.92 11.24 12.54 11.83V10.67H9.96C10 11.4 9.96 18.33 9.96 18.33H12.54V14.05C12.54 13.82 12.56 13.59 12.63 13.43C12.82 12.96 13.25 12.47 13.98 12.47C14.92 12.47 15.3 13.18 15.3 14.23V18.33H17.97V13.86H18.33Z" />
    </svg>
  );
}

function GitHubIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
      />
    </svg>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

function SilkMarbleCanvas({ reducedMotion }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: true });
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 4; i++) {
          value += amplitude * noise(p);
          p *= 2.02;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / max(u_resolution.xy, vec2(1.0));
        float aspect = u_resolution.x / max(u_resolution.y, 1.0);
        vec2 p = vec2(uv.x * aspect, uv.y) * 2.1;

        float t = u_time * 0.14;
        float q = fbm(p + vec2(0.0, t));
        float r = fbm(p + 2.4 * q + vec2(1.7, 9.2) + 0.6 * t);
        float f = fbm(p + 2.2 * r + vec2(8.3, 2.8) - 0.35 * t);

        vec3 lightSilk = vec3(0.985, 0.986, 0.992);
        vec3 coolSilver = vec3(0.88, 0.90, 0.94);
        vec3 subtleSlate = vec3(0.76, 0.80, 0.87);

        vec3 col = mix(lightSilk, coolSilver, smoothstep(0.2, 0.75, r));
        col = mix(col, subtleSlate, smoothstep(0.35, 0.9, f) * 0.45);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    let animationFrameId;
    const startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    };

    const render = (now) => {
      resize();
      const elapsed = reducedMotion ? 1.8 : (now - startTime) / 1000;
      gl.uniform1f(timeLocation, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    resize();
    animationFrameId = requestAnimationFrame(render);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
    />
  );
}

function ScrollReveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: reducedMotion ? "0ms" : `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  );
}

const PROJECTS = [
  {
    id: "provinzial",
    index: "[ 01 ]",
    period: "[ Mai 2025 – Heute ]",
    company: "Provinzial Versicherung AG",
    role: "Data-Analyst Customer Data & AI Engineering",
    title: "Customer Data Hub & Data Products",
    subtitle:
      "Zentrale Datenprodukte, Kundenselektionen und KI-fähige Pipelines in Azure Synapse.",
    accent: "#007A6E",
    badgeStyle: {
      backgroundColor: "#E8F5F3",
      color: "#005A50",
      borderColor: "#B7DFD9",
    },
    highlights: [
      "Entwicklung modularer Datenprodukte mit PySpark in Azure Synapse",
      "Aufbau belastbarer Kundenselektionen für Direktmarketing & KI-Use-Cases",
      "Weiterentwicklung der agilen Arbeitsorganisation im Data-Team",
    ],
    stack: ["Python", "PySpark", "Azure Synapse", "SQL", "Data Products"],
  },
  {
    id: "vodafone",
    index: "[ 02 ]",
    period: "[ Nov 2022 – Mär 2025 ]",
    company: "Vodafone GmbH",
    role: "Software- & Portal-Engineer",
    title: "Firmenkundenportal & PageForge",
    subtitle:
      "B2B-Webportal und PageForge für über 200 Webseiten inklusive Node.js-APIs und CI/CD.",
    accent: "#E60000",
    badgeStyle: {
      backgroundColor: "#FDECEC",
      color: "#B80000",
      borderColor: "#F6C2C2",
    },
    highlights: [
      "Weiterentwicklung des Firmenkundenportals und PageForge für 200+ Sites",
      "Entwicklung skalierbarer Node.js-APIs und Microservices",
      "Automatisierte Deployments und Qualitätssicherung über CI/CD-Pipelines",
    ],
    stack: ["Node.js", "APIs", "Web Portals", "Microservices", "CI/CD"],
  },
  {
    id: "controlexpert",
    index: "[ 03 ]",
    period: "[ Okt 2016 – Aug 2022 ]",
    company: "ControlExpert GmbH",
    role: "Softwareentwickler & BI-Specialist",
    title: "Digitale Schadenaufnahme & Data Warehouse",
    subtitle:
      "Webanwendung für digitale Schadenprozesse mit React.js & .NET C# sowie SQL-Reporting & Tableau.",
    accent: "#0A66C2",
    badgeStyle: {
      backgroundColor: "#EBF3FC",
      color: "#084C91",
      borderColor: "#C3DDF7",
    },
    highlights: [
      "Webanwendung zur digitalen Schadenaufnahme mit React.js und .NET C#",
      "End-to-End-Tests und Qualitätssicherung mit Jest & Cypress",
      "Aufbau eines Data Warehouse, SQL-Reportings und Tableau-Dashboards",
    ],
    stack: ["React.js", ".NET C#", "SQL", "Data Warehouse", "Tableau"],
  },
];

const STATIONS = [
  {
    company: "Provinzial Versicherung AG",
    badgeText: "Provinzial",
    role: "Data-Analyst Customer Data & AI Engineering",
    period: "[ Mai 2025 – Heute ]",
    accent: "#007A6E",
    bullets: [
      "Zentrale Datenprodukte und Kundenselektionen als Grundlage für Analytik und KI-Systeme.",
      "PySpark-Pipelines in Azure Synapse sowie Mitgestaltung agiler Teamprozesse.",
    ],
  },
  {
    company: "Vodafone GmbH",
    badgeText: "Vodafone",
    role: "Software- & Portal-Engineer",
    period: "[ Nov 2022 – Mär 2025 ]",
    accent: "#E60000",
    bullets: [
      "Firmenkundenportal und PageForge für über 200 Sites mit Node.js-APIs.",
      "Microservice-Architekturen und verlässliche CI/CD-Workflows im Produktivbetrieb.",
    ],
  },
  {
    company: "Ford-Werke GmbH",
    badgeText: "Ford",
    role: "SAP-BI Automobilhersteller",
    period: "[ Sep 2022 – Nov 2022 ]",
    accent: "#1D4ED8",
    bullets: [
      "Einsatz von Python zur Datenanalyse für die Qualitätssicherung, Einblicke in die SAP-Systemlandschaft und Workflow-Automatisierung mit Power Automate.",
    ],
  },
  {
    company: "ControlExpert GmbH",
    badgeText: "ControlExpert",
    role: "Softwareentwickler & BI-Specialist Versicherungsprozesse",
    period: "[ Okt 2016 – Aug 2022 ]",
    accent: "#0A66C2",
    bullets: [
      "Webapplikation zur digitalen Schadenaufnahme mit React.js und .NET C# sowie Qualitätssicherung mit Jest & Cypress.",
      "Entwicklung eines Data Warehouse, effizientes SQL-Reporting und KPI-Visualisierung in Tableau.",
    ],
  },
];

const CAPABILITIES = [
  {
    title: "Data Engineering & Lakehouse",
    description:
      "Strukturierte, nachvollziehbare Datenpipelines und Datenprodukte für verlässliche Auswertungen.",
    items: ["Python", "PySpark", "Azure Synapse", "SQL", "Data Warehouse"],
  },
  {
    title: "AI-Ready Foundations",
    description:
      "Saubere Kundenselektionen, semantische Schnittstellen und reproduzierbare Datengrundlagen für KI.",
    items: [
      "Feature- & Selektionslogik",
      "Data Quality",
      "Analytics Readiness",
    ],
  },
  {
    title: "Web, APIs & Delivery",
    description:
      "Pragmatische Full-Stack- und Automatisierungspraxis von der Oberfläche bis zur CI/CD-Pipeline.",
    items: ["React.js", "Node.js", ".NET C#", "Tableau", "CI/CD & Git"],
  },
];

export default function App() {
  const reducedMotion = usePrefersReducedMotion();
  const heroRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredId, setHoveredId] = useState(null);
  const [focusedId, setFocusedId] = useState(null);
  const [pinnedIds, setPinnedIds] = useState({});

  useEffect(() => {
    if (reducedMotion) {
      setScrollProgress(0);
      return;
    }

    const handleScroll = () => {
      const heroEl = heroRef.current;
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      const total = Math.max(rect.height, 1);
      const scrolled = Math.min(Math.max(-rect.top / total, 0), 1);
      setScrollProgress(scrolled);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reducedMotion]);

  const togglePin = (id, e) => {
    if (e) e.stopPropagation();
    setPinnedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isExpanded = (id) => {
    return Boolean(pinnedIds[id]) || hoveredId === id || focusedId === id;
  };

  const splitOffset = reducedMotion ? 0 : scrollProgress * 64;
  const heroOpacity = reducedMotion
    ? 1
    : Math.max(1 - scrollProgress * 0.85, 0.15);

  return (
    <div className="min-h-screen bg-white text-[#111318] antialiased selection:bg-[#111318] selection:text-white">
      {/* Minimal Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-neutral-200/70">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between text-sm">
          <a
            href="#top"
            className="font-medium tracking-tight text-neutral-900 hover:opacity-75 transition-opacity"
          >
            Malte Reppke
          </a>
          <nav
            aria-label="Hauptnavigation"
            className="flex items-center gap-6 text-neutral-600"
          >
            <a
              href="#motivation"
              className="hover:text-neutral-950 transition-colors"
            >
              Motivation
            </a>
            <a
              href="#projekte"
              className="hover:text-neutral-950 transition-colors"
            >
              Projekte
            </a>
            <a
              href="#stationen"
              className="hover:text-neutral-950 transition-colors"
            >
              Stationen
            </a>
            <a
              href="#kontakt"
              className="hover:text-neutral-950 transition-colors"
            >
              Kontakt
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section with WebGL Silk Marble & Scroll Split */}
      <section
        id="top"
        ref={heroRef}
        className="relative overflow-hidden border-b border-neutral-200/80 min-h-[76vh] flex items-center"
      >
        <SilkMarbleCanvas reducedMotion={reducedMotion} />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/55 to-white pointer-events-none"
        />

        <div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-6xl mx-auto w-full px-6 py-20 md:py-28"
        >
          <div className="max-w-3xl">
            <div
              style={{
                transform: `translate3d(0, ${-splitOffset * 0.45}px, 0)`,
              }}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-600 bg-white/75 backdrop-blur-sm border border-neutral-200/80 rounded-full px-3.5 py-1.5 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
              <span>Data &amp; AI Engineering</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.03em] text-neutral-950 leading-[1.06] mb-6">
              <span
                style={{
                  transform: `translate3d(${-splitOffset * 0.35}px, 0, 0)`,
                }}
                className="block transition-transform duration-150 ease-out"
              >
                Klare Datenprodukte.
              </span>
              <span
                style={{
                  transform: `translate3d(${splitOffset * 0.35}px, 0, 0)`,
                }}
                className="block text-neutral-700 transition-transform duration-150 ease-out"
              >
                Verlässliche Basis für KI.
              </span>
            </h1>

            <p
              style={{
                transform: `translate3d(0, ${splitOffset * 0.25}px, 0)`,
              }}
              className="text-base sm:text-lg text-neutral-700 leading-relaxed max-w-2xl mb-8"
            >
              Ich bin Malte Reppke und baue Datenpipelines, analytische Produkte
              und softwarenahe Lösungen, die im Alltag funktionieren –
              verständlich, wartbar und nah am Fachbereich.
            </p>

            <div
              style={{
                transform: `translate3d(0, ${splitOffset * 0.2}px, 0)`,
              }}
              className="flex flex-wrap items-center gap-3.5"
            >
              <a
                href="#projekte"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-950 text-white px-5 py-2.5 text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                <span>Einblick in meine Projekte</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="#kontakt"
                className="inline-flex items-center gap-2 rounded-full bg-white/85 backdrop-blur-sm border border-neutral-300 text-neutral-900 px-5 py-2.5 text-sm font-medium hover:bg-white transition-colors"
              >
                <span>Kontakt aufnehmen</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Motivation Section */}
      <section
        id="motivation"
        className="py-20 md:py-24 border-b border-neutral-200/70"
      >
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-3xl">
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-3">
                [ Was mich motiviert ]
              </p>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.02em] text-neutral-950 mb-5">
                Komplexität reduzieren, damit Entscheidungen und Modelle
                greifen.
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
                Gute Daten- und KI-Lösungen entstehen selten im luftleeren Raum.
                Mich treibt es an, verteilte Datenquellen, fachliche
                Anforderungen und technische Umsetzung so zusammenzuführen, dass
                Teams sauber darauf aufbauen können – ohne unnötigen Ballast,
                aber mit klarer Struktur.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Projects Section (Horizontal Timeline on Desktop, Stacked on Mobile) */}
      <section
        id="projekte"
        className="py-20 md:py-24 border-b border-neutral-200/70"
      >
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">
                  [ Ausgewählte Stationen ]
                </p>
                <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.02em] text-neutral-950">
                  Einblick in meine Projekte
                </h2>
              </div>
              <p className="text-sm text-neutral-500 max-w-md">
                Fahre über eine Kachel, fokussiere sie oder klicke hinein – im
                Steckbrief lässt sich die Ansicht über den Schalter dauerhaft
                fixieren.
              </p>
            </div>
          </ScrollReveal>

          <div className="relative">
            {/* Horizontal timeline connector line on desktop */}
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-5 left-0 right-0 h-px bg-neutral-200"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {PROJECTS.map((project, idx) => {
                const expanded = isExpanded(project.id);
                const pinned = Boolean(pinnedIds[project.id]);

                return (
                  <ScrollReveal key={project.id} delay={idx * 90}>
                    <article
                      tabIndex={0}
                      onMouseEnter={() => setHoveredId(project.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onFocus={() => setFocusedId(project.id)}
                      onBlur={() => setFocusedId(null)}
                      onClick={() => {
                        if (!pinned) {
                          setPinnedIds((prev) => ({
                            ...prev,
                            [project.id]: true,
                          }));
                        }
                      }}
                      style={{
                        borderTopColor: project.accent,
                        borderTopWidth: "3px",
                      }}
                      className={`group relative rounded-2xl border border-neutral-200/90 bg-white p-6 transition-all duration-300 ease-out outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ${
                        expanded
                          ? "shadow-lg -translate-y-1 border-neutral-300"
                          : "hover:-translate-y-0.5 hover:shadow-sm"
                      }`}
                    >
                      {/* Timeline Node & Index */}
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div className="inline-flex items-center gap-2.5">
                          <span
                            style={{ backgroundColor: project.accent }}
                            className="w-2.5 h-2.5 rounded-full ring-4 ring-white"
                          />
                          <span className="font-mono text-xs text-neutral-500">
                            {project.index}
                          </span>
                        </div>

                        <span
                          style={project.badgeStyle}
                          className="text-xs font-medium px-2.5 py-0.5 rounded-full border"
                        >
                          {project.company}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold tracking-tight text-neutral-950 mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-neutral-600 leading-relaxed mb-5">
                        {project.subtitle}
                      </p>

                      {/* Expandable Steckbrief */}
                      <div
                        className={`grid transition-all duration-300 ease-out ${
                          expanded
                            ? "grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-neutral-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div>
                              <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                                Steckbrief
                              </p>
                              <p className="text-xs font-medium text-neutral-800">
                                {project.role}
                              </p>
                            </div>

                            {/* Darkmode-style Fixiert On/Off Switch */}
                            <button
                              type="button"
                              role="switch"
                              aria-checked={pinned}
                              aria-label={`Steckbrief ${project.company} fixieren`}
                              onClick={(e) => togglePin(project.id, e)}
                              className="inline-flex items-center gap-2 text-xs font-medium text-neutral-700 hover:text-neutral-950 select-none"
                            >
                              <span>Fixiert: {pinned ? "An" : "Aus"}</span>
                              <span
                                style={{
                                  backgroundColor: pinned
                                    ? project.accent
                                    : "#D4D4D8",
                                }}
                                className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200"
                              >
                                <span
                                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                                    pinned ? "translate-x-4.5" : "translate-x-1"
                                  }`}
                                />
                              </span>
                            </button>
                          </div>

                          <ul className="space-y-2 text-xs text-neutral-600 mb-4">
                            {project.highlights.map((item) => (
                              <li key={item} className="flex items-start gap-2">
                                <span
                                  style={{ color: project.accent }}
                                  className="mt-0.5 font-semibold"
                                >
                                  •
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="flex flex-wrap gap-1.5">
                            {project.stack.map((tech) => (
                              <span
                                key={tech}
                                className="text-[11px] font-mono bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer Year & Status */}
                      <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                        <span>{project.period}</span>
                        <span className="inline-flex items-center gap-1 text-neutral-700">
                          {pinned ? (
                            <>
                              <Pin
                                className="w-3.5 h-3.5"
                                style={{ color: project.accent }}
                              />
                              <span>Fixiert</span>
                            </>
                          ) : (
                            <span>Steckbrief</span>
                          )}
                        </span>
                      </div>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Career Stations Section */}
      <section
        id="stationen"
        className="py-20 md:py-24 border-b border-neutral-200/70"
      >
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">
                [ Werdegang ]
              </p>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.02em] text-neutral-950">
                Stationen in Daten, BI und Softwareentwicklung
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {STATIONS.map((station, idx) => (
              <ScrollReveal key={station.company} delay={idx * 75}>
                <div className="group rounded-2xl border border-neutral-200/90 bg-white p-6 transition-all duration-300 hover:border-neutral-300 hover:shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        style={{
                          borderColor: station.accent,
                          color: station.accent,
                        }}
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-neutral-50"
                      >
                        {station.badgeText}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {station.company}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-neutral-500">
                      {station.period}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-neutral-950 mb-2.5 group-hover:translate-x-0.5 transition-transform duration-200">
                    {station.role}
                  </h3>

                  <ul className="space-y-1.5 text-sm text-neutral-600">
                    {station.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5">
                        <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities / Tech Stack Section */}
      <section className="py-20 md:py-24 border-b border-neutral-200/70 bg-neutral-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">
                [ Arbeitsweise &amp; Stack ]
              </p>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.02em] text-neutral-950">
                Werkzeuge für belastbare Ergebnisse
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CAPABILITIES.map((cap, idx) => {
              const Icon = idx === 0 ? Layers : idx === 1 ? Cpu : ArrowUpRight;
              return (
                <ScrollReveal key={cap.title} delay={idx * 85}>
                  <div className="h-full rounded-2xl border border-neutral-200/90 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">
                    <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center mb-4">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-950 mb-2">
                      {cap.title}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                      {cap.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {cap.items.map((item) => (
                        <span
                          key={item}
                          className="text-xs font-mono px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontakt" className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="rounded-3xl border border-neutral-200 bg-neutral-50/70 p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">
                  [ Kontakt ]
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-neutral-950 mb-3">
                  Lust auf Austausch zu Data &amp; AI Engineering?
                </h2>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-4">
                  Ich freue mich über Nachrichten zu spannenden Datenprodukten,
                  KI-nahen Architekturen und gemeinsamen Ideen.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-neutral-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Rheinland / NRW · Deutschland</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                <a
                  href="mailto:malte.reppke@outlook.de"
                  className="inline-flex items-center justify-between gap-4 rounded-xl bg-neutral-950 text-white px-4 py-3 text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Mail className="w-4 h-4" />
                    <span>E-Mail schreiben</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 opacity-75" />
                </a>

                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-between gap-4 rounded-xl bg-white border border-neutral-300 text-neutral-900 px-4 py-3 text-sm font-medium hover:bg-neutral-100 transition-colors"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <LinkedInIcon className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-neutral-500" />
                </a>

                <a
                  href="https://github.com/maltedot4"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-between gap-4 rounded-xl bg-white border border-neutral-300 text-neutral-900 px-4 py-3 text-sm font-medium hover:bg-neutral-100 transition-colors"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <GitHubIcon className="w-4 h-4" />
                    <span>GitHub</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-neutral-500" />
                </a>
              </div>
            </div>
          </ScrollReveal>

          <footer className="mt-12 pt-6 border-t border-neutral-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <span>© {new Date().getFullYear()} Malte Reppke</span>
            <span>Data &amp; AI Engineering Portfolio</span>
          </footer>
        </div>
      </section>
    </div>
  );
}
