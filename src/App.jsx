import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Copy,
  Database,
  Globe,
  Layers,
  Mail,
  Pin,
  Sparkles,
} from "lucide-react";

const PROJECTS = [
  {
    id: "data-mesh-lakehouse",
    title: "Verlässliches Lakehouse & Semantic Layer",
    category: "Data Engineering",
    summary:
      "Strukturierte Ingestion-, Transformations- und Qualitäts-Pipelines mit klaren Verträgen für Analytics und KI-Anwendungen.",
    stack: ["Python", "SQL", "dbt", "Lakehouse"],
    impact: "Nachvollziehbare Kennzahlen und stabile Datenbasis im Alltag",
  },
  {
    id: "rag-knowledge-assistant",
    title: "Fachbereichsnahes Retrieval & Agenten-Workflow",
    category: "AI Engineering",
    summary:
      "Kontextgestützte Suche und strukturierte Auswertung über interne Dokumente mit Quellenbezug, Guardrails und Evaluation.",
    stack: ["LLM", "RAG", "Embeddings", "Evaluation"],
    impact: "Schnellere Antworten mit überprüfbaren Belegen statt Blindflug",
  },
  {
    id: "realtime-anomaly-scoring",
    title: "Echtzeit-Scoring & Monitoring für Produktionsdaten",
    category: "Applied ML & Ops",
    summary:
      "Überwachung von Schema-Drift, Latenz und Modell-Signalen mit klaren Alerts für den produktiven Betrieb.",
    stack: ["Streaming", "Feature Store", "Monitoring", "APIs"],
    impact: "Früherkennung von Datenabweichungen vor Auswirkungen auf Nutzer",
  },
];

const STATIONS = [
  {
    role: "Data & AI Engineering",
    organization: "Ford-Werke GmbH",
    period: "Station · Automotive & Datenprodukte",
    description:
      "Aufbau und Weiterentwicklung datengetriebener Lösungen an der Schnittstelle von technischer Architektur, Datenqualität und fachlicher Anwendung.",
    tags: ["Datenpipelines", "Analytics", "KI-nahe Systeme"],
  },
  {
    role: "Data & Software / Analytics",
    organization: "ControlExpert GmbH",
    period: "Station · Digitale Prozesse & Daten",
    description:
      "Entwicklung verlässlicher Datenverarbeitung und softwarenaher Bausteine für nachvollziehbare, skalierbare Abläufe im Fachbereich.",
    tags: ["Datenprodukte", "Softwarenähe", "Prozessautomation"],
  },
];

function SilkMarbleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { antialias: true, alpha: true }) ||
      canvas.getContext("experimental-webgl");
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
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
        vec2 p = vec2(uv.x * aspect, uv.y) * 1.65;

        float t = u_time * 0.14;
        float n1 = fbm(p + vec2(t, -t * 0.7));
        float n2 = fbm(p + vec2(n1 * 1.35, -t * 0.5 + n1 * 0.8));
        float wave = smoothstep(0.15, 0.9, n2);

        vec3 baseLight = vec3(0.972, 0.976, 0.988);
        vec3 softCool = vec3(0.910, 0.928, 0.968);
        vec3 softWarm = vec3(0.956, 0.924, 0.964);

        vec3 col = mix(baseLight, softCool, wave * 0.65);
        col = mix(col, softWarm, smoothstep(0.45, 0.95, n1) * 0.28);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compileShader = (type, source) => {
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

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    let animationFrameId;
    const startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const targetWidth = Math.max(1, Math.floor(width * dpr));
      const targetHeight = Math.max(1, Math.floor(height * dpr));

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (now) => {
      resize();
      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, (now - startTime) / 1000);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = window.requestAnimationFrame(render);
    };

    animationFrameId = window.requestAnimationFrame(render);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-20 h-full w-full"
    />
  );
}

export default function App() {
  const [pinnedIds, setPinnedIds] = useState(["data-mesh-lakehouse"]);
  const [activeCategory, setActiveCategory] = useState("Alle");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const categories = [
    "Alle",
    "Data Engineering",
    "AI Engineering",
    "Applied ML & Ops",
  ];

  const togglePin = (id) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const visibleProjects =
    activeCategory === "Alle"
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === activeCategory);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("kontakt@maltereppke.de");
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      setCopiedEmail(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-clip text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
      <SilkMarbleCanvas />

      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a
            href="#"
            className="text-sm font-semibold tracking-tight text-neutral-950 transition hover:opacity-75"
          >
            Malte Reppke
          </a>

          <nav
            aria-label="Hauptnavigation"
            className="flex items-center gap-6 text-sm text-neutral-600"
          >
            <a href="#motivation" className="transition hover:text-neutral-950">
              Motivation
            </a>
            <a href="#projekte" className="transition hover:text-neutral-950">
              Projekte
            </a>
            <a href="#stationen" className="transition hover:text-neutral-950">
              Stationen
            </a>
            <a href="#kontakt" className="transition hover:text-neutral-950">
              Kontakt
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-10 h-[320px] w-[320px] bg-gradient-to-tr from-[#3023ae]/30 via-[#bc247f]/25 to-[#ff0099]/20 blur-3xl animate-hero-blob sm:h-[460px] sm:w-[460px]"
          />

          <div className="relative mx-auto max-w-6xl px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3.5 py-1.5 text-xs font-medium tracking-wider text-neutral-700 uppercase shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-neutral-900" />
              <span>Data &amp; AI Engineering</span>
            </div>

            <h1 className="mt-7 max-w-4xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-6xl sm:leading-[1.08]">
              Klare Datenprodukte.
              <br />
              Verlässliche Basis für KI.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
              Ich bin Malte Reppke und baue Datenpipelines, analytische Produkte
              und softwarenahe Lösungen, die im Alltag funktionieren –
              verständlich, wartbar und nah am Fachbereich.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <a
                href="#projekte"
                className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800"
              >
                <span>Einblick in meine Projekte</span>
                <ChevronRight className="h-4 w-4" />
              </a>

              <a
                href="#kontakt"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/85 px-5 py-3 text-sm font-medium text-neutral-900 backdrop-blur-md transition hover:bg-white"
              >
                <span>Kontakt aufnehmen</span>
              </a>
            </div>
          </div>
        </section>

        <section id="motivation" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 rounded-3xl border border-black/5 bg-white/80 p-8 shadow-sm backdrop-blur-xl md:grid-cols-12 md:p-12">
              <div className="md:col-span-5">
                <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                  Motivation
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                  Wirkung entsteht dort, wo Daten nutzbar werden.
                </h2>
              </div>

              <div className="space-y-4 text-base leading-relaxed text-neutral-600 md:col-span-7">
                <p>
                  Gute KI und belastbare Analysen scheitern selten an einem
                  fehlenden Modell, sondern an unklaren Schnittstellen, fragilen
                  Pipelines oder Lösungen, die am eigentlichen Arbeitsalltag
                  vorbeilaufen.
                </p>
                <p>
                  Mein Anspruch ist es, technische Tiefe mit pragmatischer
                  Produktorientierung zu verbinden: saubere Datenmodelle,
                  nachvollziehbare Systeme und Ergebnisse, denen Teams im Alltag
                  vertrauen können.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="projekte" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                  Auswahl
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                  Einblick in meine Projekte
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const active = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                        active
                          ? "bg-neutral-950 text-white"
                          : "border border-black/10 bg-white/80 text-neutral-700 hover:bg-white"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {visibleProjects.map((project) => {
                const isPinned = pinnedIds.includes(project.id);
                return (
                  <article
                    key={project.id}
                    className={`flex flex-col justify-between rounded-2xl border p-6 transition backdrop-blur-xl ${
                      isPinned
                        ? "border-neutral-950/20 bg-white/95 shadow-md ring-1 ring-neutral-950/10"
                        : "border-black/5 bg-white/80 shadow-sm hover:bg-white/90"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                          <Database className="h-3.5 w-3.5" />
                          {project.category}
                        </span>

                        <button
                          type="button"
                          onClick={() => togglePin(project.id)}
                          aria-pressed={isPinned}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${
                            isPinned
                              ? "bg-neutral-950 text-white"
                              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                          }`}
                        >
                          <Pin className="h-3 w-3" />
                          <span>Fixiert: {isPinned ? "An" : "Aus"}</span>
                        </button>
                      </div>

                      <h3 className="mt-4 text-lg font-semibold tracking-tight text-neutral-950">
                        {project.title}
                      </h3>

                      <p className="mt-2.5 text-sm leading-relaxed text-neutral-600">
                        {project.summary}
                      </p>

                      <p className="mt-4 rounded-xl bg-neutral-950/[0.03] px-3 py-2 text-xs font-medium text-neutral-700">
                        {project.impact}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-1.5 border-t border-black/5 pt-4">
                      {project.stack.map((item) => (
                        <span
                          key={item}
                          className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="stationen" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                Stationen
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                Erfahrung in komplexen Umgebungen.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {STATIONS.map((station) => (
                <div
                  key={station.organization}
                  className="rounded-2xl border border-black/5 bg-white/80 p-7 shadow-sm backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-neutral-500">
                        {station.period}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">
                        {station.organization}
                      </h3>
                      <p className="mt-0.5 text-sm font-medium text-neutral-700">
                        {station.role}
                      </p>
                    </div>
                    <Layers className="h-5 w-5 shrink-0 text-neutral-400" />
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                    {station.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {station.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-neutral-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="kontakt" className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-3xl border border-black/5 bg-white/85 p-8 shadow-sm backdrop-blur-xl sm:p-12">
              <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
                <div className="max-w-xl">
                  <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                    Kontakt
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
                    Lust auf Austausch zu Daten &amp; KI?
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
                    Für spannende Rollen, Datenprodukte oder den fachlichen
                    Austausch freue ich mich über eine Nachricht.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="mailto:kontakt@maltereppke.de"
                    className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                  >
                    <Mail className="h-4 w-4" />
                    <span>E-Mail schreiben</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>Kopiert</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Adresse kopieren</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
                  >
                    <Globe className="h-4 w-4" />
                    <span>LinkedIn</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 bg-white/60 py-8 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-xs text-neutral-500 sm:flex-row">
          <span>© {new Date().getFullYear()} Malte Reppke</span>
          <span>
            Data &amp; AI Engineering · Built with React &amp; Tailwind CSS
          </span>
        </div>
      </footer>
    </div>
  );
}
