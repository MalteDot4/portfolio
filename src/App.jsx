import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Database,
  Cpu,
  Layers,
  ArrowUpRight,
  ArrowDown,
  Check,
  Copy,
  Terminal,
  Cloud,
  Code2,
  GraduationCap,
  MapPin,
  Mail,
  Linkedin,
  Github,
  ChevronRight,
} from "lucide-react";

/**
 * Clamps a numeric value strictly into the [0, 1] interval.
 * @param {number} val
 * @returns {number}
 */
const clamp01 = (val) => Math.min(Math.max(val, 0), 1);

/**
 * Smooth cubic ease-out curve for natural editorial transitions.
 * @param {number} t
 * @returns {number}
 */
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * BrandWordmark
 * Clean typographic wordmarks with subtle geometric brand indicators for
 * Provinzial, Vodafone, and ControlExpert without generic UI icons.
 */
const BrandWordmark = ({ brand, inverted = false }) => {
  if (brand === "provinzial") {
    return (
      <span
        className={`inline-flex items-center gap-2 font-extrabold uppercase tracking-[0.06em] text-sm sm:text-base ${
          inverted ? "text-white" : "text-[#0B0B0C]"
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-[2px] bg-[#007A6E] inline-block shrink-0" />
        <span>PROVINZIAL</span>
      </span>
    );
  }

  if (brand === "vodafone") {
    return (
      <span
        className={`inline-flex items-center gap-2 font-extrabold tracking-[-0.035em] text-base sm:text-lg ${
          inverted ? "text-white" : "text-[#0B0B0C]"
        }`}
      >
        <span className="w-4 h-4 rounded-full border-[2.5px] border-[#E60000] inline-flex items-center justify-center shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E60000]" />
        </span>
        <span>vodafone</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 font-extrabold uppercase tracking-[0.04em] text-sm sm:text-base ${
        inverted ? "text-white" : "text-[#0B0B0C]"
      }`}
    >
      <span className="w-2.5 h-2.5 rotate-45 bg-[#0A66C2] inline-block shrink-0" />
      <span>
        CONTROL
        <span className={inverted ? "text-[#93C5FD]" : "text-[#0A66C2]"}>
          EXPERT
        </span>
      </span>
    </span>
  );
};

/**
 * WebGLSilkMarble
 * Full-bleed domain-warped WebGL silk-marble canvas with a clean CSS
 * radial fallback when WebGL is unavailable or disabled.
 */
const WebGLSilkMarble = ({ className = "", paused = false }) => {
  const canvasRef = useRef(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let frameId = null;
    let gl = null;

    try {
      gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    } catch {
      gl = null;
    }

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(parent.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(parent.clientHeight * dpr));
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    if (!gl) {
      setUseFallback(true);
      return () => window.removeEventListener("resize", handleResize);
    }

    const vertexShaderSrc = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSrc = `
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
        float amp = 0.5;
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 5; i++) {
          value += amp * noise(p);
          p = rot * p * 2.02 + vec2(1.7, 9.2);
          amp *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / max(u_resolution.xy, vec2(1.0));
        float aspect = u_resolution.x / max(u_resolution.y, 1.0);
        vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 1.65;

        float t = u_time * 0.22;

        vec2 q = vec2(
          fbm(p + 0.35 * vec2(cos(t * 0.8), sin(t * 0.6))),
          fbm(p + 0.35 * vec2(sin(t * 0.7), -cos(t * 0.9)) + vec2(5.2, 1.3))
        );

        vec2 r = vec2(
          fbm(p + 3.4 * q + vec2(1.7, 9.2) + 0.28 * t),
          fbm(p + 3.4 * q + vec2(8.3, 2.8) - 0.24 * t)
        );

        float f = fbm(p + 2.8 * r);

        vec3 colObsidian = vec3(0.024, 0.032, 0.072);
        vec3 colCobalt   = vec3(0.095, 0.245, 0.760);
        vec3 colSkyBlue  = vec3(0.365, 0.660, 0.990);
        vec3 colPlum     = vec3(0.320, 0.145, 0.490);
        vec3 colViolet   = vec3(0.580, 0.360, 0.760);
        vec3 colRose     = vec3(0.910, 0.730, 0.835);

        float sideBias = smoothstep(0.15, 0.85, uv.x + (r.x - 0.5) * 0.35);
        vec3 coolSide = mix(colCobalt, colSkyBlue, smoothstep(0.25, 0.82, f * 1.15 + q.y * 0.35));
        vec3 warmSide = mix(colPlum, colViolet, smoothstep(0.28, 0.85, f * 1.1 + r.y * 0.35));
        vec3 silkBase = mix(coolSide, warmSide, sideBias);

        float ridge = sin((f * 3.6 + r.x * 1.8) * 3.14159);
        float valley = smoothstep(-0.35, 0.65, ridge);
        vec3 color = mix(colObsidian, silkBase, valley);

        float crest = smoothstep(0.76, 0.98, ridge);
        color = mix(color, colRose, crest * 0.52);

        gl_FragColor = vec4(pow(max(color, 0.0), vec3(0.96)), 1.0);
      }
    `;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, vertexShaderSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentShaderSrc);
    if (!vs || !fs) {
      setUseFallback(true);
      return () => window.removeEventListener("resize", handleResize);
    }

    const program = gl.createProgram();
    if (!program) {
      setUseFallback(true);
      return () => window.removeEventListener("resize", handleResize);
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setUseFallback(true);
      return () => window.removeEventListener("resize", handleResize);
    }

    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const posAttrib = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

    const resUniform = gl.getUniformLocation(program, "u_resolution");
    const timeUniform = gl.getUniformLocation(program, "u_time");
    const t0 = performance.now();

    const drawOnce = (seconds) => {
      gl.uniform2f(resUniform, canvas.width, canvas.height);
      gl.uniform1f(timeUniform, seconds);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    if (paused) {
      drawOnce(1.35);
      return () => window.removeEventListener("resize", handleResize);
    }

    const renderLoop = (now) => {
      drawOnce((now - t0) * 0.001);
      frameId = window.requestAnimationFrame(renderLoop);
    };

    frameId = window.requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameId) window.cancelAnimationFrame(frameId);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(posBuffer);
    };
  }, [paused]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden pointer-events-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover ${useFallback ? "hidden" : "block"}`}
        aria-hidden="true"
      />
      {useFallback && (
        <div
          className="w-full h-full"
          style={{
            background:
              "radial-gradient(circle at 18% 45%, #5DA8FF 0%, #1D3FD1 32%, #060811 62%, #5B2C82 86%, #8C52B8 100%)",
          }}
        />
      )}
    </div>
  );
};

/**
 * Minimalist scroll-reveal wrapper that respects prefers-reduced-motion.
 */
const RevealBlock = ({
  children,
  delay = 0,
  className = "",
  reducedMotion = false,
}) => {
  const [visible, setVisible] = useState(Boolean(reducedMotion));
  const ref = useRef(null);

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
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -16px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: reducedMotion ? "0ms" : `${delay}ms` }}
      className={`${
        reducedMotion
          ? "opacity-100 translate-y-0"
          : `transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`
      } ${className}`}
    >
      {children}
    </div>
  );
};

const TIMELINE_PROJECTS = [
  {
    id: "provinzial-data-hub",
    indexTag: "[ 01 ]",
    brand: "provinzial",
    accentHex: "#007A6E",
    accentTextClass: "text-[#007A6E]",
    accentPillClass: "bg-[#007A6E]/10 text-[#007A6E] border-[#007A6E]/25",
    markerOffsetClass: "pt-2 sm:pt-4",
    title: "Customer Data Hub & Data Products",
    tagline:
      "PySpark · Azure Synapse · Kundenselektionen & KI-fähige Datenarchitektur",
    periodBracket: "[ Mai 2025 – Heute ]",
    role: "Data-Analyst Customer Data & AI Engineering",
    organization: "Provinzial Versicherung AG",
    summary:
      "Zentrale Datenprodukte und Kundenselektionen in PySpark und Azure Synapse als belastbare Grundlage für Analytik und KI-Systeme.",
    highlights: [
      "Entwicklung modularer Datenprodukte in PySpark & Azure Synapse",
      "Kundenselektionen für Direktmarketing & KI-fähige Datenarchitektur",
      "Agiles Data Engineering im cross-funktionalen Team",
    ],
    stack: "Python · PySpark · Azure Synapse · SQL · Data Products",
  },
  {
    id: "vodafone-pageforge",
    indexTag: "[ 02 ]",
    brand: "vodafone",
    accentHex: "#E60000",
    accentTextClass: "text-[#E60000]",
    accentPillClass: "bg-[#E60000]/10 text-[#E60000] border-[#E60000]/25",
    markerOffsetClass: "pt-8 sm:pt-12",
    title: "Firmenkundenportal & PageForge",
    tagline:
      "B2B-Vertrags-Microservices · PageForge für 200+ Sites · Node.js APIs & CI/CD",
    periodBracket: "[ Nov 2022 – Mär 2025 ]",
    role: "Backend / Data Integration Firmenkunden",
    organization: "Vodafone GmbH",
    summary:
      "Vertragsdaten-Microservices, PageForge für über 200 Business-Websites und automatisierte CI/CD-Pipelines im Firmenkundenumfeld.",
    highlights: [
      "B2B-Vertrags-Microservices & Datenintegration mit Node.js APIs",
      "PageForge für den Vodafone Blog & über 200 Business-Websites",
      "Automatisierte Git-CI/CD-Deployments & skalierbare Plattform-APIs",
    ],
    stack: "Node.js · React · Next.js · Docker · CI/CD · Microservices",
  },
  {
    id: "controlexpert-easyclaim",
    indexTag: "[ 03 ]",
    brand: "controlexpert",
    accentHex: "#0A66C2",
    accentTextClass: "text-[#0A66C2]",
    accentPillClass: "bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/25",
    markerOffsetClass: "pt-14 sm:pt-20",
    title: "EasyClaim InsurTech App",
    tagline:
      "Digitale Schadenaufnahme · React.js & .NET C# · Jest & Cypress · SQL & BI",
    periodBracket: "[ Jul 2019 – Aug 2022 ]",
    role: "Softwareentwickler & BI-Specialist Versicherungsprozesse",
    organization: "ControlExpert GmbH",
    summary:
      "Digitale Schadenaufnahme mit React.js und .NET C#, abgesichert durch Jest & Cypress sowie Data-Warehouse-, SQL-Reporting- und BI-Lösungen.",
    highlights: [
      "Digitale Schadenaufnahme mit React.js & .NET C#",
      "Automatisierte Tests mit Jest & Cypress im agilen Betrieb",
      "Data Warehouse, SQL-Reporting & BI-Kennzahlen für Versicherungsprozesse",
    ],
    stack: "React.js · .NET C# · Jest · Cypress · SQL · BI / Analytics",
  },
];

const CORE_SKILL_PILLS = [
  "Python",
  "PySpark",
  "Azure Synapse",
  "SQL",
  "React.js",
  ".NET C#",
  "Node.js",
  "CI/CD",
  "BI / Analytics",
];

const InteractiveProjectColumn = ({
  project,
  isPinned,
  isHovered,
  onToggleOpenClick,
  onTogglePin,
  onHoverChange,
  reducedMotion,
}) => {
  const isOpen = isPinned || isHovered;

  return (
    <div
      onClick={onToggleOpenClick}
      onMouseEnter={() => onHoverChange(project.id)}
      onMouseLeave={() => onHoverChange(null)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggleOpenClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-label={`${project.title} – Steckbrief öffnen oder schließen`}
      className={`group relative cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0B0C] border-t md:border-t-0 md:border-l last:md:border-r border-[#E4E4E7] flex flex-col justify-between px-5 sm:px-7 py-6 sm:py-7 min-h-[340px] sm:min-h-[390px] ${
        reducedMotion
          ? "bg-[#FFFFFF]"
          : `transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isOpen
                ? "bg-[#FAFAFA] shadow-[inset_0_2px_0_0_rgba(11,11,12,0.06)]"
                : "bg-[#FFFFFF] hover:bg-[#FAFAFA]"
            }`
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 pb-4">
          <span className="font-mono text-xs font-bold tracking-wider text-[#52525B]">
            {project.indexTag}
          </span>
          <BrandWordmark brand={project.brand} />
        </div>

        <div className={`relative ${project.markerOffsetClass}`}>
          <div className="flex items-center gap-2 mb-2.5">
            <span
              style={{ backgroundColor: project.accentHex }}
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                reducedMotion
                  ? ""
                  : `transition-transform duration-300 ${isOpen ? "scale-125" : "group-hover:scale-110"}`
              }`}
            />
            <div
              style={{ backgroundColor: project.accentHex }}
              className={`h-[2px] flex-1 rounded-full ${
                reducedMotion
                  ? ""
                  : `transition-all duration-300 ${isOpen ? "h-[3px] opacity-100" : "opacity-80 group-hover:opacity-100"}`
              }`}
            />
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-[25px] font-bold tracking-[-0.035em] text-[#0B0B0C] leading-[1.15]">
            {project.title}
          </h3>

          <p className="mt-2.5 text-xs sm:text-sm font-medium text-[#52525B] leading-relaxed">
            {project.tagline}
          </p>
        </div>

        <div
          className={`grid ${
            reducedMotion
              ? isOpen
                ? "grid-rows-[1fr] opacity-100 mt-5"
                : "grid-rows-[0fr] opacity-0 mt-0"
              : `transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100 mt-5"
                    : "grid-rows-[0fr] opacity-0 mt-0"
                }`
          }`}
        >
          <div className="overflow-hidden">
            <div className="rounded-2xl bg-[#F4F4F5] border border-[#E4E4E7] p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#52525B]">
                  Steckbrief · {project.organization}
                </span>

                <button
                  type="button"
                  role="switch"
                  aria-checked={isPinned}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(project.id);
                  }}
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-[#E4E4E7] hover:border-[#0B0B0C]/40 transition-colors cursor-pointer"
                  aria-label={`Steckbrief für ${project.organization} fixieren`}
                >
                  <span className="text-[11px] font-bold text-[#0B0B0C]">
                    Fixiert: {isPinned ? "An" : "Aus"}
                  </span>
                  <span
                    style={{
                      backgroundColor: isPinned ? project.accentHex : "#D4D4D8",
                    }}
                    className="relative inline-flex h-4 w-7 items-center rounded-full transition-colors duration-200 shrink-0"
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform duration-200 ${
                        isPinned ? "translate-x-3.5" : "translate-x-0.5"
                      }`}
                    />
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="text-xs sm:text-[13px] font-bold text-[#0B0B0C] leading-snug">
                  {project.role}
                </p>
                <span
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-bold shrink-0 ${project.accentPillClass}`}
                >
                  {isPinned ? "Fixiert" : "Vorschau"}
                </span>
              </div>

              <p className="text-xs text-[#52525B] leading-relaxed">
                {project.summary}
              </p>

              <ul className="space-y-1.5 text-xs text-[#0B0B0C] leading-snug">
                {project.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span
                      style={{ backgroundColor: project.accentHex }}
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="pt-2 border-t border-[#E4E4E7] text-[11px] font-semibold text-[#52525B]">
                <strong className="font-bold text-[#0B0B0C]">Stack:</strong>{" "}
                {project.stack}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-4 border-t border-[#E4E4E7]/80 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] sm:text-xs font-semibold text-[#52525B]">
          {project.periodBracket}
        </span>

        <span
          className={`inline-flex items-center gap-1 text-xs font-bold ${project.accentTextClass} ${
            reducedMotion
              ? ""
              : "transition-transform duration-300 group-hover:translate-x-0.5"
          }`}
        >
          <span>
            {isPinned ? "Fixiert" : isOpen ? "Schließen" : "Steckbrief"}
          </span>
          <ChevronRight
            className={`w-3.5 h-3.5 ${
              reducedMotion
                ? ""
                : `transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`
            }`}
          />
        </span>
      </div>
    </div>
  );
};

const SECTIONS_FLOW = [
  { id: "hero-stage", nextTitle: "01 / Einblick in meine Projekte" },
  { id: "work", nextTitle: "02 / Was mich motiviert" },
  { id: "motivation", nextTitle: "03 / Stationen & Tech Stack" },
  { id: "experience", nextTitle: "04 / Kontakt" },
  { id: "contact", nextTitle: "Nach oben ↑" },
];

export default function App() {
  const [splitProgress, setSplitProgress] = useState(0);
  const [pageProgress, setPageProgress] = useState(0);
  const [activeSecIdx, setActiveSecIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pinnedIds, setPinnedIds] = useState([]);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const heroStageRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    const onChange = (event) => setReducedMotion(event.matches);
    if (mq.addEventListener) {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  useEffect(() => {
    const linkId = "malte-reppke-editorial-font";
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const maxScroll = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1,
        );
        setPageProgress(clamp01(scrollY / maxScroll));

        if (heroStageRef.current) {
          const rect = heroStageRef.current.getBoundingClientRect();
          const travel = Math.max(rect.height - window.innerHeight, 1);
          setSplitProgress(clamp01(-rect.top / travel));
        }

        const probe = scrollY + window.innerHeight * 0.42;
        let currentIdx = 0;
        SECTIONS_FLOW.forEach((sec, idx) => {
          const el = document.getElementById(sec.id);
          if (el && el.offsetTop <= probe) {
            currentIdx = idx;
          }
        });
        setActiveSecIdx(currentIdx);
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const jumpToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  const handleNextPill = () => {
    if (activeSecIdx >= SECTIONS_FLOW.length - 1) {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    } else {
      jumpToSection(SECTIONS_FLOW[activeSecIdx + 1].id);
    }
  };

  const handleTogglePin = (projectId) => {
    setPinnedIds((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId],
    );
  };

  const handleProjectClick = (projectId) => {
    setPinnedIds((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId],
    );
  };

  const handleCopyEmail = () => {
    const email = "malte_reppke@web.de";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).catch(() => {});
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  };

  const progress = reducedMotion ? clamp01(splitProgress * 1.4) : splitProgress;
  const heroExit = easeOutCubic(clamp01(progress / 0.36));
  const heroOpacity = 1 - heroExit;
  const heroTranslateY = reducedMotion ? 0 : -heroExit * 36;

  const splitAmount = easeOutCubic(clamp01((progress - 0.08) / 0.76));
  const leftOffset = -splitAmount * 68;
  const rightOffset = splitAmount * 68;
  const curtainScale = reducedMotion ? 1 : 1 + splitAmount * 0.12;
  const curtainBlur = reducedMotion ? 0 : splitAmount * 16;
  const curtainOpacity = 1 - clamp01((progress - 0.42) / 0.52);

  const revealEase = easeOutCubic(clamp01((progress - 0.34) / 0.56));
  const revealedTitleOpacity = revealEase;
  const revealedTitleScale = reducedMotion ? 1 : 0.93 + revealEase * 0.07;
  const revealedTitleY = reducedMotion ? 0 : (1 - revealEase) * 28;

  const activeSectionObj = SECTIONS_FLOW[activeSecIdx] || SECTIONS_FLOW[0];

  return (
    <div
      style={{
        fontFamily:
          '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      }}
      className="min-h-screen w-full overflow-x-clip bg-[#FFFFFF] text-[#0B0B0C] selection:bg-[#0B0B0C] selection:text-white antialiased"
    >
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none">
        <div
          className="h-full bg-[#0B0B0C] transition-[width] duration-150 ease-out"
          style={{ width: `${pageProgress * 100}%` }}
        />
      </div>

      {/* 1. HERO SECTION */}
      <section
        id="hero-stage"
        ref={heroStageRef}
        className="relative h-[185vh] sm:h-[205vh] bg-[#FFFFFF]"
      >
        <div className="sticky top-0 h-[100dvh] min-h-[560px] w-full overflow-hidden bg-[#FFFFFF] flex flex-col justify-center">
          <div
            style={{
              opacity: revealedTitleOpacity,
              transform: `translate3d(0, ${revealedTitleY}px, 0) scale(${revealedTitleScale})`,
              pointerEvents: revealedTitleOpacity > 0.65 ? "auto" : "none",
            }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 sm:px-6 max-w-5xl mx-auto will-change-transform"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#52525B] mb-4">
              Einblick in meine Projekte
            </span>

            <h2 className="text-3xl sm:text-6xl md:text-[70px] font-bold tracking-[-0.045em] text-[#0B0B0C] leading-[1.05] max-w-4xl">
              Belastbare Datenprodukte und KI-Systeme für den Alltag.
            </h2>

            <p className="mt-5 sm:mt-6 text-sm sm:text-xl text-[#52525B] font-medium max-w-2xl leading-relaxed tracking-[-0.015em]">
              Von Customer-Data-Hubs und Microservices bis hin zu digitalen
              InsurTech-Lösungen – strukturiert, verlässlich und praxistauglich
              umgesetzt.
            </p>

            <div className="mt-7 sm:mt-8">
              <button
                type="button"
                onClick={() => jumpToSection("work")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B0B0C] text-white text-xs sm:text-sm font-bold hover:bg-[#18181B] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Zu den Projekten</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              style={{ pointerEvents: heroOpacity < 0.2 ? "none" : "auto" }}
              className="relative rounded-[26px] sm:rounded-[36px] min-h-[450px] sm:min-h-[540px] flex flex-col justify-between overflow-visible"
            >
              <div
                style={{
                  opacity: curtainOpacity,
                  filter: curtainBlur > 0.2 ? `blur(${curtainBlur}px)` : "none",
                }}
                className="absolute inset-0 rounded-[26px] sm:rounded-[36px] overflow-visible pointer-events-none will-change-transform"
              >
                <div
                  style={{
                    clipPath: "inset(0 49.8% 0 0 round 26px 0 0 26px)",
                    transform: `translate3d(${leftOffset}%, 0, 0) scale(${curtainScale})`,
                  }}
                  className="absolute inset-0 rounded-[26px] sm:rounded-[36px] overflow-hidden shadow-[0_24px_70px_-15px_rgba(11,11,12,0.32)] will-change-transform"
                >
                  <WebGLSilkMarble paused={reducedMotion} />
                  <div
                    style={{ opacity: splitAmount * 0.85 }}
                    className="absolute inset-y-0 right-0 w-24 sm:w-32 bg-gradient-to-l from-white via-white/70 to-transparent"
                  />
                </div>

                <div
                  style={{
                    clipPath: "inset(0 0 0 49.8% round 0 26px 26px 0)",
                    transform: `translate3d(${rightOffset}%, 0, 0) scale(${curtainScale})`,
                  }}
                  className="absolute inset-0 rounded-[26px] sm:rounded-[36px] overflow-hidden shadow-[0_24px_70px_-15px_rgba(11,11,12,0.32)] will-change-transform"
                >
                  <WebGLSilkMarble paused={reducedMotion} />
                  <div
                    style={{ opacity: splitAmount * 0.85 }}
                    className="absolute inset-y-0 left-0 w-24 sm:w-32 bg-gradient-to-r from-white via-white/70 to-transparent"
                  />
                </div>
              </div>

              <div
                style={{
                  opacity: heroOpacity,
                  transform: `translate3d(0, ${heroTranslateY}px, 0)`,
                }}
                className="relative z-20 flex-1 flex flex-col justify-between will-change-transform"
              >
                <div
                  style={{
                    background:
                      "radial-gradient(ellipse 74% 62% at 50% 50%, rgba(6, 8, 16, 0.86) 0%, rgba(6, 8, 16, 0.56) 60%, rgba(6, 8, 16, 0.18) 100%)",
                  }}
                  className="absolute inset-0 rounded-[26px] sm:rounded-[36px] pointer-events-none"
                />

                <header className="relative z-10 flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-7">
                  <button
                    type="button"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="text-xs sm:text-sm font-bold tracking-tight text-white/95 hover:text-white transition-colors cursor-pointer"
                  >
                    Malte Reppke
                  </button>

                  <nav
                    aria-label="Hauptnavigation"
                    className="flex items-center gap-4 sm:gap-7 px-4 sm:px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-white/85"
                  >
                    <button
                      type="button"
                      onClick={() => jumpToSection("work")}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Projekte
                    </button>
                    <button
                      type="button"
                      onClick={() => jumpToSection("motivation")}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Motivation
                    </button>
                    <button
                      type="button"
                      onClick={() => jumpToSection("experience")}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Stationen
                    </button>
                    <button
                      type="button"
                      onClick={() => jumpToSection("contact")}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Kontakt
                    </button>
                  </nav>
                </header>

                <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 sm:px-10 py-10">
                  <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/75 mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Data Engineering &amp; AI Engineering</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.045em] text-white leading-[1.03]">
                    Malte Reppke
                  </h1>

                  <p className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-lg text-white/85 font-medium leading-relaxed">
                    Data Engineering &amp; KI-Systeme bei der{" "}
                    <span className="border-b border-[#60A5FA] pb-0.5 text-white">
                      Provinzial
                    </span>
                    . Fokus auf verlässliche Datenprodukte, skalierbare
                    Pipelines und praxisnahes AI Engineering.
                  </p>

                  <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => jumpToSection("work")}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0B0B0C] text-xs sm:text-sm font-bold hover:bg-[#F4F4F5] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <span>Einblick in meine Projekte</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => jumpToSection("contact")}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-bold hover:bg-white/15 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <span>→ Kontakt</span>
                    </button>
                  </div>
                </div>

                <div className="relative z-10 pb-5 sm:pb-6 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">
                    Nach unten scrollen
                  </span>
                  <button
                    type="button"
                    onClick={() => jumpToSection("work")}
                    aria-label="Nach unten scrollen"
                    className="w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROJEKTE (HORIZONTAL TIMELINE COLUMNS) */}
      <section
        id="work"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <RevealBlock reducedMotion={reducedMotion}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#52525B]">
                01 / Projekte &amp; Wirkung
              </span>
              <h2 className="mt-2 text-3xl sm:text-5xl font-bold tracking-[-0.04em] text-[#0B0B0C]">
                Einblick in meine Projekte
              </h2>
            </div>

            {pinnedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setPinnedIds([])}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-[#F4F4F5] border border-[#E4E4E7] text-xs font-bold text-[#0B0B0C] hover:bg-[#E4E4E7]/70 transition-colors cursor-pointer"
              >
                Alle Fixierungen lösen ({pinnedIds.length})
              </button>
            )}
          </div>
        </RevealBlock>

        <RevealBlock delay={80} reducedMotion={reducedMotion}>
          <div className="grid grid-cols-1 md:grid-cols-3 rounded-3xl border border-[#E4E4E7] overflow-hidden bg-white shadow-sm">
            {TIMELINE_PROJECTS.map((project) => (
              <InteractiveProjectColumn
                key={project.id}
                project={project}
                isPinned={pinnedIds.includes(project.id)}
                isHovered={hoveredProjectId === project.id}
                onToggleOpenClick={() => handleProjectClick(project.id)}
                onTogglePin={handleTogglePin}
                onHoverChange={setHoveredProjectId}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </RevealBlock>
      </section>

      {/* 3. MOTIVATION */}
      <section
        id="motivation"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <RevealBlock reducedMotion={reducedMotion}>
          <div className="rounded-3xl border border-[#E4E4E7] bg-[#FAFAFA] p-7 sm:p-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#52525B]">
              02 / Motivation
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-[-0.035em] text-[#0B0B0C] max-w-3xl">
              Was mich antreibt: Daten, die Entscheidungen tragen.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#52525B] leading-relaxed max-w-3xl">
              Ich verbinde Data Engineering, Softwareentwicklung und
              analytisches Denken zu Systemen, die im Alltag zuverlässig laufen
              – von sauberen Spark- und Synapse-Pipelines über stabile APIs bis
              hin zu praxistauglichen KI-Workflows.
            </p>
          </div>
        </RevealBlock>
      </section>

      {/* 4. STATIONEN & TECH STACK */}
      <section
        id="experience"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <RevealBlock reducedMotion={reducedMotion}>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#52525B]">
            03 / Stationen &amp; Tech Stack
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-bold tracking-[-0.04em] text-[#0B0B0C]">
            Stationen &amp; Kernkompetenzen
          </h2>
        </RevealBlock>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <RevealBlock
            delay={60}
            reducedMotion={reducedMotion}
            className="lg:col-span-7"
          >
            <div className="rounded-3xl border border-[#E4E4E7] bg-white p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-[#E4E4E7] pb-5">
                <div>
                  <BrandWordmark brand="provinzial" />
                  <p className="mt-1.5 text-sm font-bold text-[#0B0B0C]">
                    Data-Analyst Customer Data &amp; AI Engineering · Provinzial
                    Versicherung AG
                  </p>
                  <p className="text-xs font-mono text-[#52525B] mt-0.5">
                    Mai 2025 – Heute
                  </p>
                </div>
                <Database className="w-5 h-5 text-[#52525B] shrink-0" />
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-[#E4E4E7] pb-5">
                <div>
                  <BrandWordmark brand="vodafone" />
                  <p className="mt-1.5 text-sm font-bold text-[#0B0B0C]">
                    Backend / Data Integration Firmenkunden · Vodafone GmbH
                  </p>
                  <p className="text-xs font-mono text-[#52525B] mt-0.5">
                    Nov 2022 – Mär 2025
                  </p>
                </div>
                <Cloud className="w-5 h-5 text-[#52525B] shrink-0" />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <BrandWordmark brand="controlexpert" />
                  <p className="mt-1.5 text-sm font-bold text-[#0B0B0C]">
                    Softwareentwickler &amp; BI-Specialist · ControlExpert GmbH
                  </p>
                  <p className="text-xs font-mono text-[#52525B] mt-0.5">
                    Jul 2019 – Aug 2022
                  </p>
                </div>
                <Cpu className="w-5 h-5 text-[#52525B] shrink-0" />
              </div>
            </div>
          </RevealBlock>

          <RevealBlock
            delay={120}
            reducedMotion={reducedMotion}
            className="lg:col-span-5"
          >
            <div className="h-full rounded-3xl border border-[#E4E4E7] bg-[#FAFAFA] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#52525B]">
                  <Terminal className="w-4 h-4" />
                  <span>Tech Stack</span>
                </div>
                <h3 className="mt-3 text-xl font-bold tracking-[-0.03em] text-[#0B0B0C]">
                  Werkzeuge für Daten, Backend &amp; UI
                </h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {CORE_SKILL_PILLS.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full bg-white border border-[#E4E4E7] text-xs font-bold text-[#0B0B0C]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-[#E4E4E7] flex items-center gap-2.5 text-xs text-[#52525B]">
                <GraduationCap className="w-4 h-4 shrink-0 text-[#0B0B0C]" />
                <span>
                  Fokus auf wartbare Architekturen, Tests &amp; verlässliche
                  Datenprodukte
                </span>
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* 5. KONTAKT */}
      <section
        id="contact"
        className="py-16 sm:py-24 pb-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <RevealBlock reducedMotion={reducedMotion}>
          <div className="rounded-3xl border border-[#E4E4E7] bg-[#0B0B0C] text-white p-7 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
                04 / Kontakt
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-[-0.035em]">
                Lust auf Austausch zu Data &amp; AI Engineering?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-white/75 leading-relaxed">
                Schreib mir gerne direkt per E-Mail oder vernetze dich mit mir.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-white/70">
                <MapPin className="w-3.5 h-3.5" />
                <span>Deutschland · Data &amp; AI Engineering</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:malte_reppke@web.de"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-[#0B0B0C] text-xs sm:text-sm font-bold hover:bg-[#F4F4F5] transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>E-Mail senden</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-bold hover:bg-white/15 transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copied ? "Kopiert!" : "malte_reppke@web.de"}</span>
              </button>

              <a
                href="https://github.com/MalteDot4"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-bold hover:bg-white/15 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-bold hover:bg-white/15 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </RevealBlock>
      </section>

      {/* FLOATING SECTION FLOW PILL */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={handleNextPill}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0B0B0C]/90 text-white text-xs font-bold backdrop-blur-md border border-white/15 shadow-lg hover:bg-[#0B0B0C] transition-all cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-white/75" />
          <span>{activeSectionObj.nextTitle}</span>
        </button>
      </div>
    </div>
  );
}
