import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
import { jsPDF } from "jspdf";
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
  GraduationCap,
  MapPin,
  Mail,
  GitBranch,
  Globe,
  ChevronRight,
  ChevronDown,
  Pin,
  FileDown,
  Sun,
  Moon,
  X,
} from "lucide-react";
import avatarLogo from "./assets/Logo.png";

const clamp01 = (val) => Math.min(Math.max(val, 0), 1);

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const SUBTLE_FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#F5F5F7"/><circle cx="32" cy="32" r="24" fill="#FFFFFF" stroke="#E4E4E7" stroke-width="2"/><text x="32" y="38.5" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="20" font-weight="700" letter-spacing="-0.04em" fill="#0B0B0C">MR</text><circle cx="46" cy="18" r="3.2" fill="#2563EB"/></svg>`;

const BRAND_URLS = {
  provinzial: "https://www.provinzial.com",
  vodafone: "https://www.vodafone.de",
  controlexpert: "https://www.controlexpert.com",
};

const PROVINZIAL_STATIONS = [
  {
    title: "Data Engineer & AI Engineer · IT-DWH",
    period: "Ab 01.06.2026",
    bullets: [
      "Entwicklung und Betrieb skalierbarer Datenprodukte, Pipelines und Datenarchitekturen im IT-DWH als Fundament für Analytik und KI-Anwendungen",
      "AI Engineering mit OpenCode sowie Etablierung von Agentic-Development-Workflows zur beschleunigten, qualitätsgesicherten Entwicklung im Projekt",
      "Berufsbegleitend ab 01.09.2026 M. Sc. KI und Business Analytics an der FOM",
    ],
  },
  {
    title: "Data-Analyst Customer Data & Analytics",
    period: "01.05.2025 – 30.05.2026",
    bullets: [
      "Stark PySpark-getriebene Entwicklung von Datenprodukten auf Azure Synapse – unter anderem Entwicklung eines Selektionsframeworks für Kundenselektionen",
      "Rund sechs Monate (bis zum 01.04.2026) als Interim-PO für das Data-Team zur Steuerung und Priorisierung von Anforderungen",
    ],
  },
];

const CONTROLEXPERT_FEATURED_STATION = {
  title: "Softwareentwickler Versicherungsbranche",
  period: "Jul 2019 – Aug 2022",
  bullets: [
    "Entwicklung Webapplikation zur digitalen Schadenaufnahme (React.js im Frontend & .NET C# im Backend)",
    "Agile nach Kanban & Design Thinking Ansätzen, Codequalität mit Jest & Cypress",
    "Bis Februar 2021 Tätigkeit Teilzeit neben Studium, danach in Vollzeit",
  ],
};

const CONTROLEXPERT_MORE_STATIONS = [
  {
    title: "BI-Specialist Versicherungsprozesse",
    period: "Okt 2017 – Jun 2019 · Teilzeit",
    bullets: [
      "Erfolgreiche Entwicklung eines Data Warehouse",
      "Effizientes SQL Reporting & Visualisierung in Tableau, Stakeholder-Beratung zu relevanten KPIs",
    ],
  },
  {
    title: "Business-Analyst Versicherungsprozesse",
    period: "Okt 2016 – Sep 2017",
    bullets: [
      "Projektarbeit Digitalisierung für Versicherungsprozesse & Prozessautomatisierung mit IBM BPM",
      "Product Management interne Kalkulationsanwendung im Scrum Prozess",
    ],
  },
  {
    title: "Data-Specialist Automobil",
    period: "Jul 2012 – Sep 2016",
    bullets: [
      "Erhebung, Abfrage & Pflege von Herstellerdaten",
      "Intensive Arbeit mit MS-Office & relationalen Datenbanken",
    ],
  },
];

const CORE_SKILL_PILLS = [
  {
    label: "Python",
    enLabel: "Python",
    role: "Data & ETL Scripting",
    projects:
      "Datenaufbereitung, Automatisierung & Spark-Pipelines bei Provinzial (IT-DWH & Customer Data).",
  },
  {
    label: "PySpark / Spark",
    enLabel: "PySpark / Apache Spark",
    role: "Verteilte Datenverarbeitung",
    projects:
      "Aufbau von Datenprodukten und Selektionsframework für Kundenselektionen auf großen Datenbeständen bei Provinzial.",
  },
  {
    label: "Azure & Synapse",
    enLabel: "Azure & Synapse Analytics",
    role: "Cloud Data Plattform",
    projects:
      "Datenprodukte, Pipelines und IT-DWH-Architektur im Azure-Synapse-Umfeld bei Provinzial.",
  },
  {
    label: "SQL",
    enLabel: "SQL & Data Modeling",
    role: "Abfragen & Modellierung",
    projects:
      "Data-Warehouse-Aufbau, KPI-Reporting und relationale Datenabfragen bei ControlExpert & Provinzial.",
  },
  {
    label: "React.js & Next.js",
    enLabel: "React.js & Next.js",
    role: "Web & UI Engineering",
    projects:
      "Digitale Schadenaufnahme (EasyClaim) bei ControlExpert sowie Business-Websites & Blog bei Vodafone.",
  },
  {
    label: ".NET C#",
    enLabel: ".NET / C#",
    role: "Backend-Services",
    projects:
      "Backend-Logik und Services für die digitale Schadenaufnahme bei ControlExpert.",
  },
  {
    label: "Node.js",
    enLabel: "Node.js",
    role: "API & Microservices",
    projects:
      "Microservices für Vertragsdaten und Firmenkunden-Integration bei Vodafone.",
  },
  {
    label: "Jest, Vitest & Cypress",
    enLabel: "Jest, Vitest & Cypress",
    role: "Qualitätssicherung & Tests",
    projects:
      "Unit- und End-to-End-Tests zur Absicherung der Codequalität im agilen Umfeld bei ControlExpert.",
  },
  {
    label: "Git, Docker & CI/CD",
    enLabel: "Git, Docker & CI/CD",
    role: "Delivery & Automatisierung",
    projects:
      "Containerisierung sowie Ausbau der CI/CD-Automatisierung in Git-Pipelines bei Vodafone.",
  },
  {
    label: "Tableau & Power-BI",
    enLabel: "Tableau & Power BI",
    role: "BI & Visualisierung",
    projects:
      "KPI-Visualisierung und Stakeholder-Reporting auf Basis von Data-Warehouse-Daten.",
  },
];

const CV_POSITIONS = [
  {
    id: "provinzial-data-ai",
    track: "data-ai",
    de: {
      company: "Provinzial Versicherung AG",
      period: "Ab 01.06.2026",
      role: "Data Engineer & AI Engineer · IT-DWH",
      summary:
        "Aufbau und Betrieb skalierbarer Datenprodukte, Pipelines und Datenarchitekturen im IT-DWH für Analytik und KI-Anwendungen sowie AI Engineering mit OpenCode und Agentic-Development-Workflows zur beschleunigten, qualitätsgesicherten Entwicklung im Projekt.",
    },
    en: {
      company: "Provinzial Versicherung AG",
      period: "Since Jun 2026",
      role: "Data Engineer & AI Engineer · Enterprise DWH",
      summary:
        "Architected and operated scalable data products, pipelines, and DWH foundations supporting analytics and applied AI workloads, driving AI engineering with OpenCode and agentic development workflows for reliable delivery.",
    },
  },
  {
    id: "provinzial-customer-data",
    track: "data-ai",
    de: {
      company: "Provinzial Versicherung AG",
      period: "01.05.2025 – 30.05.2026",
      role: "Data-Analyst Customer Data & Analytics",
      summary:
        "Entwicklung PySpark-basierter Datenprodukte auf Azure Synapse inklusive eines Selektionsframeworks für Kundenselektionen sowie ca. sechs Monate (bis 01.04.2026) als Interim Product Owner für das Data-Team zur Steuerung und Priorisierung von Anforderungen.",
    },
    en: {
      company: "Provinzial Versicherung AG",
      period: "May 2025 – May 2026",
      role: "Data Analyst · Customer Data & Analytics",
      summary:
        "Built PySpark data products on Azure Synapse including a customer selection framework, while serving as Interim Product Owner for the data team for roughly six months (until Apr 2026) to align priorities and stakeholders.",
    },
  },
  {
    id: "vodafone-integration",
    track: "fullstack-data",
    de: {
      company: "Vodafone GmbH",
      period: "Nov 2022 – Mär 2025",
      role: "Backend / Data Integration Firmenkunden",
      summary:
        "Entwicklung und Datenintegration für das Firmenkundenportal, den Blog sowie über 200 Business-Websites, inklusive Microservices für Vertragsdaten in Node.js und Ausbau der CI/CD-Automatisierung in Git-Pipelines.",
    },
    en: {
      company: "Vodafone GmbH",
      period: "Nov 2022 – Mar 2025",
      role: "Backend & Data Integration Engineer · Enterprise B2B",
      summary:
        "Developed and integrated data flows for the enterprise customer portal, blog, and 200+ business web properties, implementing Node.js contract-data microservices and strengthening CI/CD automation across Git pipelines.",
    },
  },
  {
    id: "controlexpert-dev",
    track: "fullstack-data",
    de: {
      company: "ControlExpert GmbH",
      period: "Jul 2019 – Aug 2022",
      role: "Softwareentwickler Versicherungsbranche",
      summary:
        "Entwicklung einer Webapplikation zur digitalen Schadenaufnahme mit React.js im Frontend und .NET C# im Backend im agilen Kanban- und Design-Thinking-Umfeld mit automatisierten Tests in Jest und Cypress.",
    },
    en: {
      company: "ControlExpert GmbH",
      period: "Jul 2019 – Aug 2022",
      role: "Software Engineer · Insurance & Claims",
      summary:
        "Built a digital claims-intake web application with React.js on the frontend and .NET C# on the backend, collaborating in Kanban and Design Thinking workflows backed by automated Jest and Cypress tests.",
    },
  },
  {
    id: "controlexpert-bi-data",
    track: "data-ai",
    de: {
      company: "ControlExpert GmbH",
      period: "Jul 2012 – Jun 2019",
      role: "BI-Specialist · Business-Analyst · Data-Specialist",
      summary:
        "Aufbau eines Data Warehouse mit SQL-Reporting und KPI-Visualisierung in Tableau sowie Prozessautomatisierung mit IBM BPM, Product Management einer Kalkulationsanwendung in Scrum und Herstellerdatenpflege.",
    },
    en: {
      company: "ControlExpert GmbH",
      period: "Jul 2012 – Jun 2019",
      role: "BI Specialist · Business Analyst · Data Specialist",
      summary:
        "Developed a data warehouse with SQL reporting and Tableau KPI dashboards, alongside IBM BPM process automation, Scrum product management for a calculation application, and automotive data curation.",
    },
  },
];

/* TEMPLATE-EXACT DIRECT PDF GENERATOR (JSPDF, NO PRINT DIALOG) */
const downloadCvPdfDirect = ({
  isEn,
  isDarkPdf,
  summaryText,
  displaySkills,
  filteredPositions,
  trimmedNote,
  fileName,
}) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginX = 18;
  const contentW = pageW - marginX * 2;

  const palette = isDarkPdf
    ? {
        bg: [13, 15, 20],
        name: [248, 250, 252],
        subtitle: [147, 197, 253],
        meta: [148, 163, 184],
        heading: [196, 181, 253],
        role: [110, 231, 183],
        body: [216, 222, 233],
        muted: [148, 163, 184],
        rule: [56, 65, 92],
        accentBar: [99, 102, 241],
      }
    : {
        bg: [255, 255, 255],
        name: [24, 24, 27],
        subtitle: [39, 39, 42],
        meta: [113, 113, 122],
        heading: [39, 39, 42],
        role: [39, 39, 42],
        body: [82, 82, 91],
        muted: [113, 113, 122],
        rule: [212, 212, 216],
        accentBar: null,
      };

  const paintPageBackground = () => {
    doc.setFillColor(...palette.bg);
    doc.rect(0, 0, pageW, pageH, "F");
    if (isDarkPdf && palette.accentBar) {
      doc.setFillColor(...palette.accentBar);
      doc.rect(0, 0, pageW, 2.2, "F");
    }
  };

  paintPageBackground();

  let y = 21;

  const ensureSpace = (neededMm) => {
    if (y + neededMm > pageH - 18) {
      doc.addPage();
      paintPageBackground();
      y = 21;
    }
  };

  const drawHorizontalRule = (afterGap = 6.5) => {
    doc.setDrawColor(...palette.rule);
    doc.setLineWidth(0.35);
    doc.line(marginX, y, pageW - marginX, y);
    y += afterGap;
  };

  const drawSectionLabel = (label) => {
    ensureSpace(13);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.8);
    doc.setCharSpace(0.4);
    doc.setTextColor(...palette.heading);
    doc.text(label.toUpperCase(), marginX, y);
    doc.setCharSpace(0);
    y += 5.2;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...palette.name);
  doc.text("Malte Reppke", marginX, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...palette.subtitle);
  doc.text("Data Engineer & AI Engineer", marginX, y);
  y += 4.6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.4);
  doc.setTextColor(...palette.meta);
  doc.text(
    `malte_reppke@web.de · github.com/malte-reppke · ${
      isEn ? "Hilden, Germany" : "Hilden, Deutschland"
    }`,
    marginX,
    y,
  );
  y += 6.5;
  drawHorizontalRule(7);

  drawSectionLabel(isEn ? "Executive Profile" : "Profil");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.2);
  doc.setTextColor(...palette.body);
  const profileLines = doc.splitTextToSize(summaryText || "", contentW);
  ensureSpace(profileLines.length * 4.4 + 9);
  doc.text(profileLines, marginX, y, { lineHeightFactor: 1.35 });
  y += profileLines.length * 4.5 + 5.5;
  drawHorizontalRule(7);

  drawSectionLabel(isEn ? "Core Competencies" : "Kernkompetenzen");
  const skillsList = displaySkills.length > 0 ? displaySkills : ["-"];
  const colCount = 3;
  const colWidth = contentW / colCount;
  const rowCount = Math.ceil(skillsList.length / colCount);
  ensureSpace(rowCount * 5.2 + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...palette.body);

  for (let r = 0; r < rowCount; r += 1) {
    for (let c = 0; c < colCount; c += 1) {
      const skill = skillsList[r * colCount + c];
      if (!skill) continue;
      const x = marginX + c * colWidth;
      const rowY = y + r * 5.2;
      doc.text(String(skill), x, rowY);
    }
  }
  y += rowCount * 5.2 + 5;
  drawHorizontalRule(7);

  drawSectionLabel(isEn ? "Professional Experience" : "Berufserfahrung");

  if (filteredPositions.length === 0) {
    ensureSpace(8);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...palette.muted);
    doc.text(
      isEn ? "No positions selected." : "Keine Stationen ausgewählt.",
      marginX,
      y,
    );
    y += 7;
  } else {
    filteredPositions.forEach((pos, idx) => {
      const descLines = doc.splitTextToSize(pos.summary || "", contentW);
      const estHeight = 11 + descLines.length * 4.4 + 4;
      ensureSpace(estHeight);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.8);
      doc.setTextColor(...palette.name);
      doc.text(pos.company || "", marginX, y);

      if (pos.period) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.4);
        doc.setTextColor(...palette.role);
        doc.text(pos.period, pageW - marginX, y, { align: "right" });
      }
      y += 4.4;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.9);
      doc.setTextColor(...palette.role);
      doc.text(pos.role || "", marginX, y);
      y += 4.6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...palette.body);
      doc.text(descLines, marginX, y, { lineHeightFactor: 1.35 });
      y +=
        descLines.length * 4.35 +
        (idx < filteredPositions.length - 1 ? 4.5 : 2);
    });
  }

  y += 2;
  drawHorizontalRule(7.5);

  const hasNote = Boolean(trimmedNote);
  ensureSpace(hasNote ? 32 : 24);

  const eduLines = [
    {
      title: isEn
        ? "M.Sc. Artificial Intelligence & Business Analytics"
        : "M. Sc. KI und Business Analytics",
      meta: isEn
        ? "FOM University · Part-time from Sep 2026"
        : "FOM · Berufsbegleitend ab 01.09.2026",
    },
    {
      title: isEn
        ? "B.Sc. Business Information Systems (1.9)"
        : "B. Sc. Wirtschaftsinformatik (1,9)",
      meta: isEn
        ? "FOM Düsseldorf · Focus on Data & BI"
        : "FOM Düsseldorf · Fokus Daten & BI",
    },
  ];

  const drawEducationBlock = (x, topY, width) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.8);
    doc.setCharSpace(0.4);
    doc.setTextColor(...palette.heading);
    doc.text((isEn ? "Education" : "Studium").toUpperCase(), x, topY);
    doc.setCharSpace(0);

    let cy = topY + 5.5;
    eduLines.forEach((edu, idx) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.2);
      doc.setTextColor(...palette.name);
      const tLines = doc.splitTextToSize(edu.title, width);
      doc.text(tLines, x, cy);
      cy += tLines.length * 4.1;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.3);
      doc.setTextColor(...palette.muted);
      const mLines = doc.splitTextToSize(edu.meta, width);
      doc.text(mLines, x, cy);
      cy += mLines.length * 4.1 + (idx === 0 ? 2.2 : 0);
    });
    return cy;
  };

  if (hasNote) {
    const gap = 8;
    const halfW = (contentW - gap) / 2;
    const dividerX = marginX + halfW + gap / 2;
    const rightX = marginX + halfW + gap;
    const bottomTopY = y;

    const ly = drawEducationBlock(marginX, bottomTopY, halfW);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.8);
    doc.setCharSpace(0.4);
    doc.setTextColor(...palette.heading);
    doc.text(
      (isEn ? "Personal CV Notes" : "Persönliche Notizen zum CV").toUpperCase(),
      rightX,
      bottomTopY,
    );
    doc.setCharSpace(0);

    const ryStart = bottomTopY + 5.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.9);
    doc.setTextColor(...palette.body);
    const noteLines = doc.splitTextToSize(trimmedNote, halfW);
    doc.text(noteLines, rightX, ryStart, { lineHeightFactor: 1.35 });
    const ry = ryStart + noteLines.length * 4.1;

    const bottomMaxY = Math.max(ly + 2, ry + 2);
    doc.setDrawColor(...palette.rule);
    doc.setLineWidth(0.35);
    doc.line(dividerX, bottomTopY - 1, dividerX, bottomMaxY);
  } else {
    drawEducationBlock(marginX, y, contentW);
  }

  doc.save(`${fileName}.pdf`);
};

/* HERO AVATAR: ONLY SPEAKS ONCE ON LOAD, CLOSES AFTER A FEW SECONDS, SINGLE FOCUS PULSE */
const HeroAvatarSpeechMark = ({
  size = 42,
  className = "",
  reducedMotion = false,
}) => {
  const [hovered, setHovered] = useState(false);
  const [introActive, setIntroActive] = useState(false);
  const [focusPulseActive, setFocusPulseActive] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const greetingText = "Hi! Es freut mich dich kennenzulernen.";

  useEffect(() => {
    if (reducedMotion) return;

    const pulseStart = window.setTimeout(() => {
      setFocusPulseActive(true);
    }, 250);

    const pulseEnd = window.setTimeout(() => {
      setFocusPulseActive(false);
    }, 2200);

    const bubbleStart = window.setTimeout(() => {
      setIntroActive(true);
    }, 550);

    const bubbleEnd = window.setTimeout(() => {
      setIntroActive(false);
    }, 4500);

    return () => {
      window.clearTimeout(pulseStart);
      window.clearTimeout(pulseEnd);
      window.clearTimeout(bubbleStart);
      window.clearTimeout(bubbleEnd);
    };
  }, [reducedMotion]);

  const bubbleVisible = hovered || introActive;

  useEffect(() => {
    if (!bubbleVisible) {
      setTypedCount(0);
      return;
    }

    if (reducedMotion) {
      setTypedCount(greetingText.length);
      return;
    }

    setTypedCount(0);
    let idx = 0;
    const interval = window.setInterval(() => {
      idx += 1;
      setTypedCount(idx);
      if (idx >= greetingText.length) {
        window.clearInterval(interval);
      }
    }, 34);

    return () => window.clearInterval(interval);
  }, [bubbleVisible, reducedMotion]);

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => {
        setIntroActive(false);
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => {
        setIntroActive(false);
        setHovered(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setHovered(false);
        }
      }}
    >
      <style>{`
        @keyframes mrWaveHand {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(18deg); }
          40% { transform: rotate(-12deg); }
          60% { transform: rotate(16deg); }
          80% { transform: rotate(-8deg); }
        }
        @keyframes mrSpeakPulse {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-1.5px) scale(1.02); }
        }
        @keyframes mrOnceFocusPing {
          0% { transform: scale(1); opacity: 0.85; }
          100% { transform: scale(1.42); opacity: 0; }
        }
      `}</style>

      {focusPulseActive && !reducedMotion && (
        <span
          aria-hidden="true"
          style={{
            animation:
              "mrOnceFocusPing 1.4s cubic-bezier(0.22, 1, 0.36, 1) 1 forwards",
          }}
          className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[#93C5FD]"
        />
      )}

      <button
        type="button"
        onClick={() => {
          setIntroActive(false);
          setHovered((prev) => !prev);
        }}
        aria-label="Malte Reppke Avatar Begrüßung"
        style={{ width: size, height: size }}
        className={`relative inline-flex items-center justify-center rounded-full bg-[#F5F5F7] border border-white/30 shadow-md overflow-hidden shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
          reducedMotion
            ? ""
            : `transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                bubbleVisible ? "scale-105" : "hover:scale-105"
              }`
        }`}
      >
        <img
          src={avatarLogo}
          alt="Malte Reppke Avatar"
          className="w-full h-full object-cover object-top"
        />
      </button>

      <div
        role="status"
        aria-live="polite"
        className={`${
          bubbleVisible ? "pointer-events-auto" : "pointer-events-none"
        } absolute left-full ml-3 top-1/2 -translate-y-1/2 z-30 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl rounded-bl-xs bg-white text-[#0B0B0C] shadow-[0_12px_28px_-6px_rgba(0,0,0,0.38)] border border-black/10 w-[235px] sm:w-[270px] ${
          reducedMotion
            ? bubbleVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-1 hidden"
            : `transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                bubbleVisible
                  ? "opacity-100 translate-x-0 scale-100"
                  : "opacity-0 -translate-x-2 scale-95"
              }`
        }`}
      >
        <span
          aria-hidden="true"
          style={
            !reducedMotion && bubbleVisible
              ? {
                  animation: "mrWaveHand 1.15s ease-in-out infinite",
                  transformOrigin: "75% 75%",
                }
              : undefined
          }
          className="inline-block text-sm leading-none select-none shrink-0"
        >
          👋
        </span>

        <span
          style={
            !reducedMotion && bubbleVisible && typedCount > 0
              ? { animation: "mrSpeakPulse 0.95s ease-in-out infinite" }
              : undefined
          }
          className="inline-flex flex-wrap items-center text-xs font-bold tracking-tight text-[#0B0B0C] leading-snug"
        >
          <span>{greetingText.slice(0, typedCount)}</span>
          {bubbleVisible &&
            !reducedMotion &&
            typedCount < greetingText.length && (
              <span className="ml-0.5 inline-block w-[1.5px] h-3.5 bg-[#2563EB] animate-pulse" />
            )}
        </span>

        <span
          aria-hidden="true"
          className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-white border-l border-b border-black/10"
        />
      </div>
    </div>
  );
};

/* CV SECTION AVATAR WITH HOVER SPEECH BUBBLE TO OPEN CV EXPORT */
const CvSectionAvatarTrigger = ({ onOpen, reducedMotion = false }) => {
  const [hovered, setHovered] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const bubbleText = "Wenn du magst, kannst du den CV exportieren?";

  useEffect(() => {
    if (!hovered) {
      setTypedCount(0);
      return;
    }

    if (reducedMotion) {
      setTypedCount(bubbleText.length);
      return;
    }

    setTypedCount(0);
    let idx = 0;
    const timer = window.setInterval(() => {
      idx += 1;
      setTypedCount(idx);
      if (idx >= bubbleText.length) {
        window.clearInterval(timer);
      }
    }, 26);

    return () => window.clearInterval(timer);
  }, [hovered, reducedMotion]);

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setHovered(false);
        }
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label="CV-Customizing und PDF-Export öffnen"
        className="relative inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-white border border-[#E4E4E7] hover:border-[#0B0B0C] shadow-xs transition-all cursor-pointer group"
      >
        <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F5F5F7] overflow-hidden border border-[#E4E4E7] group-hover:scale-105 transition-transform">
          <img
            src={avatarLogo}
            alt="Malte Reppke Avatar CV"
            className="w-full h-full object-cover object-top"
          />
        </span>
        <span className="text-xs font-bold text-[#0B0B0C] inline-flex items-center gap-1.5">
          <FileDown className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>CV als PDF</span>
        </span>
      </button>

      <div
        role="tooltip"
        className={`pointer-events-none absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-2.5 z-30 w-[235px] sm:w-[255px] px-3.5 py-2.5 rounded-2xl rounded-br-xs sm:rounded-bl-xs bg-[#0B0B0C] text-white shadow-[0_12px_28px_-6px_rgba(11,11,12,0.32)] border border-white/15 ${
          reducedMotion
            ? hovered
              ? "opacity-100"
              : "opacity-0 hidden"
            : `transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                hovered
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-1.5 scale-95"
              }`
        }`}
      >
        <p className="text-xs font-semibold leading-snug text-white">
          <span>{bubbleText.slice(0, typedCount)}</span>
          {hovered && !reducedMotion && typedCount < bubbleText.length && (
            <span className="ml-0.5 inline-block w-[1.5px] h-3.5 bg-[#93C5FD] align-middle animate-pulse" />
          )}
        </p>
        <span
          aria-hidden="true"
          className="hidden sm:block absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-2.5 h-2.5 rotate-45 bg-[#0B0B0C] border-r border-b border-white/15"
        />
      </div>
    </div>
  );
};

/* CV CUSTOMIZER & DIRECT PDF DOWNLOAD (DE / EN, LIGHT / DARK, TEMPLATE-EXACT LAYOUT) */
const CvCustomizerModal = ({ open, onClose, initialFocus = "all" }) => {
  const [lang, setLang] = useState("de");
  const [pdfTheme, setPdfTheme] = useState("light");
  const [focusMode, setFocusMode] = useState(initialFocus);
  const [selectedPositionIds, setSelectedPositionIds] = useState(() =>
    CV_POSITIONS.map((p) => p.id),
  );
  const [selectedSkillLabels, setSelectedSkillLabels] = useState(() =>
    CORE_SKILL_PILLS.slice(0, 9).map((s) => s.label),
  );
  const [personalNote, setPersonalNote] = useState("");
  const [downloadStatus, setDownloadStatus] = useState("");

  useEffect(() => {
    setFocusMode(initialFocus);
  }, [initialFocus]);

  const isEn = lang === "en";
  const isDarkPdf = pdfTheme === "dark";

  const togglePosition = (id) => {
    setSelectedPositionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
    setDownloadStatus("");
  };

  const toggleSkill = (label) => {
    setSelectedSkillLabels((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
    setDownloadStatus("");
  };

  const displaySkills = useMemo(() => {
    return selectedSkillLabels.map((label) => {
      const found = CORE_SKILL_PILLS.find((s) => s.label === label);
      if (!found) return label;
      return isEn ? found.enLabel : found.label;
    });
  }, [selectedSkillLabels, isEn]);

  const filteredPositions = useMemo(() => {
    return CV_POSITIONS.filter((pos) => {
      if (!selectedPositionIds.includes(pos.id)) return false;
      if (focusMode === "data-ai")
        return pos.track === "data-ai" || pos.id.startsWith("provinzial");
      if (focusMode === "fullstack-data") {
        return (
          pos.track === "fullstack-data" || pos.id === "provinzial-data-ai"
        );
      }
      return true;
    }).map((pos) => {
      const localized = isEn ? pos.en : pos.de;
      return {
        id: pos.id,
        company: localized.company,
        period: localized.period,
        role: localized.role,
        summary: localized.summary,
      };
    });
  }, [selectedPositionIds, focusMode, isEn]);

  const summaryText = useMemo(() => {
    if (isEn) {
      if (focusMode === "data-ai") {
        return "Data and AI Engineer focused on scalable data platforms, PySpark and Azure Synapse pipelines, enterprise DWH architectures, and agentic engineering workflows, backed by strong BI and analytical foundations.";
      }
      if (focusMode === "fullstack-data") {
        return "Software and Data Engineer bridging data integration, distributed microservices (Node.js, .NET / C#), and web applications (React.js, Next.js) with disciplined testing and CI/CD automation.";
      }
      return "Data and AI Engineer with a background across software engineering, business intelligence, and enterprise data integration. Focused on reliable data products, maintainable pipelines, and practical AI systems.";
    }

    if (focusMode === "data-ai") {
      return "Data & AI Engineer mit Schwerpunkt auf skalierbaren Datenprodukten, PySpark- und Azure-Synapse-Pipelines, IT-DWH-Architekturen sowie agentischen Entwicklungs-Workflows, ergänzt durch fundierte BI- und Analytik-Erfahrung.";
    }
    if (focusMode === "fullstack-data") {
      return "Ingenieur an der Schnittstelle von Datenintegration, Microservices (Node.js, .NET C#) und Webanwendungen (React.js, Next.js) mit klarem Fokus auf Testabdeckung und CI/CD-Automatisierung.";
    }
    return "Data & AI Engineer mit Hintergrund in Softwareentwicklung, Business Intelligence und Datenintegration. Fokus auf verlässliche Datenprodukte, belastbare Pipelines und praxistaugliche KI-Systeme.";
  }, [focusMode, isEn]);

  const trimmedNote = personalNote.trim();
  const hasNote = Boolean(trimmedNote);
  const suggestedFileName = `Malte_Reppke_CV_${isEn ? "EN" : "DE"}_${isDarkPdf ? "Dark" : "Light"}`;

  const handleDirectPdfDownload = () => {
    downloadCvPdfDirect({
      isEn,
      isDarkPdf,
      summaryText,
      displaySkills,
      filteredPositions,
      trimmedNote,
      fileName: suggestedFileName,
    });
    setDownloadStatus(
      isEn
        ? `Downloaded ${suggestedFileName}.pdf`
        : `${suggestedFileName}.pdf heruntergeladen`,
    );
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="CV anpassen und als PDF herunterladen"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto"
    >
      <div className="w-full max-w-6xl rounded-[28px] bg-[#F4F5F9] border border-[#E4E4E7] shadow-2xl overflow-hidden my-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-4 bg-white border-b border-[#E4E4E7]">
          <div className="flex items-center gap-3">
            <img
              src={avatarLogo}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover object-top border border-[#E4E4E7]"
            />
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-[#52525B]">
                {isEn
                  ? "CV Customizer & PDF Export"
                  : "CV-Customizing & PDF-Export"}
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#0B0B0C]">
                {isEn
                  ? "Select language, sections, skills & notes and download directly as PDF"
                  : "Sprache, Stationen, Skills & Notiz wählen und direkt als PDF herunterladen"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {downloadStatus && (
              <span
                role="status"
                aria-label={downloadStatus}
                title={downloadStatus}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 shrink-0"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
              </span>
            )}

            <button
              type="button"
              onClick={handleDirectPdfDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B0B0C] hover:bg-[#18181B] text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>
                {isEn ? "Download PDF" : "PDF downloaden"} ({isEn ? "EN" : "DE"}{" "}
                · {isDarkPdf ? "Dark" : "Light"})
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="CV-Ansicht schließen"
              className="w-9 h-9 rounded-full border border-[#E4E4E7] bg-white hover:bg-[#F4F4F5] flex items-center justify-center text-[#0B0B0C] transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 sm:p-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl bg-white border border-[#E4E4E7] p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#52525B] mb-2">
                    {isEn ? "Language" : "Sprache"}
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setLang("de");
                        setDownloadStatus("");
                      }}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        !isEn
                          ? "bg-[#0B0B0C] text-white border-[#0B0B0C]"
                          : "bg-[#F8FAFC] text-[#0B0B0C] border-[#E4E4E7] hover:bg-[#F1F5F9]"
                      }`}
                    >
                      Deutsch
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLang("en");
                        setDownloadStatus("");
                      }}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isEn
                          ? "bg-[#0B0B0C] text-white border-[#0B0B0C]"
                          : "bg-[#F8FAFC] text-[#0B0B0C] border-[#E4E4E7] hover:bg-[#F1F5F9]"
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#52525B] mb-2">
                    {isEn ? "PDF Theme" : "PDF-Modus"}
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setPdfTheme("light");
                        setDownloadStatus("");
                      }}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        !isDarkPdf
                          ? "bg-[#0B0B0C] text-white border-[#0B0B0C]"
                          : "bg-[#F8FAFC] text-[#0B0B0C] border-[#E4E4E7] hover:bg-[#F1F5F9]"
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span>Light</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPdfTheme("dark");
                        setDownloadStatus("");
                      }}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isDarkPdf
                          ? "bg-[#0B0B0C] text-white border-[#0B0B0C]"
                          : "bg-[#F8FAFC] text-[#0B0B0C] border-[#E4E4E7] hover:bg-[#F1F5F9]"
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Dark</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#52525B] mb-1.5">
                  {isEn ? "Focus" : "Fokus"}
                </label>
                <select
                  value={focusMode}
                  onChange={(e) => {
                    setFocusMode(e.target.value);
                    setDownloadStatus("");
                  }}
                  className="w-full rounded-xl border border-[#E4E4E7] bg-[#F8FAFC] px-2.5 py-2 text-xs font-bold text-[#0B0B0C]"
                >
                  <option value="all">
                    {isEn ? "All (Full Profile)" : "Alles (Gesamtprofil)"}
                  </option>
                  <option value="data-ai">
                    {isEn ? "Data & AI Engineering" : "Data & AI Engineering"}
                  </option>
                  <option value="fullstack-data">
                    {isEn
                      ? "Integration & Fullstack"
                      : "Integration & Fullstack"}
                  </option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="mr-personal-note"
                    className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#52525B]"
                  >
                    {isEn
                      ? "Personal CV Notes (optional)"
                      : "Persönliche Notizen zum CV (optional)"}
                  </label>
                  {personalNote && (
                    <button
                      type="button"
                      onClick={() => {
                        setPersonalNote("");
                        setDownloadStatus("");
                      }}
                      className="text-[11px] font-semibold text-[#52525B] hover:text-[#0B0B0C] cursor-pointer"
                    >
                      {isEn ? "Clear" : "Leeren"}
                    </button>
                  )}
                </div>
                <textarea
                  id="mr-personal-note"
                  rows={2}
                  value={personalNote}
                  onChange={(e) => {
                    setPersonalNote(e.target.value);
                    setDownloadStatus("");
                  }}
                  placeholder={
                    isEn
                      ? "e.g. Recruiting: Focus on Data & AI Engineering, open for conversation…"
                      : "z. B. Recruiting: Fokus auf Data & AI Engineering, offen für Austausch…"
                  }
                  className="w-full rounded-xl border border-[#E4E4E7] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0B0B0C] placeholder:text-[#71717A] resize-y"
                />
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-[#E4E4E7] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#52525B]">
                  {isEn
                    ? "Experience Entries"
                    : "Stationen ein- / ausschließen"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPositionIds((prev) =>
                      prev.length === CV_POSITIONS.length
                        ? []
                        : CV_POSITIONS.map((p) => p.id),
                    );
                    setDownloadStatus("");
                  }}
                  className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer"
                >
                  {selectedPositionIds.length === CV_POSITIONS.length
                    ? isEn
                      ? "None"
                      : "Keine"
                    : isEn
                      ? "All"
                      : "Alle"}
                </button>
              </div>

              <div className="space-y-1.5">
                {CV_POSITIONS.map((pos) => {
                  const checked = selectedPositionIds.includes(pos.id);
                  const loc = isEn ? pos.en : pos.de;
                  return (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => togglePosition(pos.id)}
                      className={`w-full flex items-start justify-between gap-2.5 p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        checked
                          ? "bg-[#F8FAFC] border-[#CBD5E1] text-[#0B0B0C]"
                          : "bg-white border-[#F1F5F9] text-[#71717A] opacity-65"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold leading-snug">
                          {loc.role}
                        </p>
                        <p className="text-[11px] text-[#52525B]">
                          {loc.company} · {loc.period}
                        </p>
                      </div>
                      <span
                        className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                          checked
                            ? "bg-[#0B0B0C] border-[#0B0B0C] text-white"
                            : "border-[#CBD5E1] bg-white"
                        }`}
                      >
                        {checked && <Check className="w-3 h-3" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-[#E4E4E7] p-4 space-y-2.5">
              <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#52525B]">
                {isEn ? "Core Competencies in CV" : "Kernkompetenzen im CV"}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CORE_SKILL_PILLS.map((skill) => {
                  const active = selectedSkillLabels.includes(skill.label);
                  const pillLabel = isEn ? skill.enLabel : skill.label;
                  return (
                    <button
                      key={skill.label}
                      type="button"
                      onClick={() => toggleSkill(skill.label)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                        active
                          ? "bg-[#0B0B0C] text-white border-[#0B0B0C]"
                          : "bg-[#F8FAFC] text-[#52525B] border-[#E4E4E7] hover:text-[#0B0B0C]"
                      }`}
                    >
                      {pillLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div
              className={`rounded-2xl border p-7 sm:p-10 shadow-sm transition-colors duration-300 ${
                isDarkPdf
                  ? "bg-[#0D0F14] border-indigo-400/25 text-[#F8FAFC]"
                  : "bg-white border-[#E4E4E7] text-[#18181B]"
              }`}
            >
              <div
                className={`pb-5 border-b ${
                  isDarkPdf ? "border-slate-700/80" : "border-[#D4D4D8]"
                }`}
              >
                <h2 className="text-3xl sm:text-[34px] font-bold tracking-[-0.035em] leading-tight">
                  Malte Reppke
                </h2>
                <p
                  className={`mt-1.5 text-xs sm:text-sm font-bold ${
                    isDarkPdf ? "text-[#93C5FD]" : "text-[#27272A]"
                  }`}
                >
                  Data Engineer &amp; AI Engineer
                </p>
                <p
                  className={`mt-1 text-[11px] sm:text-xs ${
                    isDarkPdf ? "text-slate-400" : "text-[#71717A]"
                  }`}
                >
                  malte_reppke@web.de · github.com/malte-reppke ·{" "}
                  {isEn ? "Hilden, Germany" : "Hilden, Deutschland"}
                </p>
              </div>

              <div
                className={`py-5 border-b ${
                  isDarkPdf ? "border-slate-700/80" : "border-[#D4D4D8]"
                }`}
              >
                <h3
                  className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
                    isDarkPdf ? "text-[#C4B5FD]" : "text-[#27272A]"
                  }`}
                >
                  {isEn ? "Executive Profile" : "Profil"}
                </h3>
                <p
                  className={`mt-2 text-xs sm:text-[13px] leading-relaxed ${
                    isDarkPdf ? "text-slate-200" : "text-[#52525B]"
                  }`}
                >
                  {summaryText}
                </p>
              </div>

              <div
                className={`py-5 border-b ${
                  isDarkPdf ? "border-slate-700/80" : "border-[#D4D4D8]"
                }`}
              >
                <h3
                  className={`text-[11px] font-bold uppercase tracking-[0.16em] mb-3 ${
                    isDarkPdf ? "text-[#C4B5FD]" : "text-[#27272A]"
                  }`}
                >
                  {isEn ? "Core Competencies" : "Kernkompetenzen"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-2 text-xs">
                  {displaySkills.map((item) => (
                    <span
                      key={item}
                      className={`truncate ${
                        isDarkPdf ? "text-slate-200" : "text-[#52525B]"
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className={`py-5 border-b ${
                  isDarkPdf ? "border-slate-700/80" : "border-[#D4D4D8]"
                }`}
              >
                <h3
                  className={`text-[11px] font-bold uppercase tracking-[0.16em] mb-3.5 ${
                    isDarkPdf ? "text-[#C4B5FD]" : "text-[#27272A]"
                  }`}
                >
                  {isEn ? "Professional Experience" : "Berufserfahrung"}
                </h3>

                {filteredPositions.length === 0 ? (
                  <p
                    className={`text-xs italic ${
                      isDarkPdf ? "text-slate-400" : "text-[#71717A]"
                    }`}
                  >
                    {isEn
                      ? "No positions selected – enable entries on the left."
                      : "Keine Station ausgewählt – bitte links Stationen aktivieren."}
                  </p>
                ) : (
                  <div className="space-y-4.5">
                    {filteredPositions.map((pos) => (
                      <div key={pos.id}>
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-xs sm:text-sm font-bold">
                            {pos.company}
                          </p>
                          <span
                            className={`text-[11px] font-bold ${
                              isDarkPdf ? "text-[#6EE7B7]" : "text-[#52525B]"
                            }`}
                          >
                            {pos.period}
                          </span>
                        </div>
                        <p
                          className={`text-xs font-bold mt-0.5 ${
                            isDarkPdf ? "text-[#6EE7B7]" : "text-[#27272A]"
                          }`}
                        >
                          {pos.role}
                        </p>
                        <p
                          className={`mt-1.5 text-xs leading-relaxed ${
                            isDarkPdf ? "text-slate-200" : "text-[#52525B]"
                          }`}
                        >
                          {pos.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                className={`pt-5 ${
                  hasNote ? "grid grid-cols-1 sm:grid-cols-2 gap-6" : ""
                }`}
              >
                <div
                  className={
                    hasNote
                      ? `sm:pr-6 sm:border-r ${
                          isDarkPdf
                            ? "sm:border-slate-700/80"
                            : "sm:border-[#D4D4D8]"
                        }`
                      : ""
                  }
                >
                  <h3
                    className={`text-[11px] font-bold uppercase tracking-[0.16em] mb-3 ${
                      isDarkPdf ? "text-[#C4B5FD]" : "text-[#27272A]"
                    }`}
                  >
                    {isEn ? "Education" : "Studium"}
                  </h3>
                  <div
                    className={`space-y-3 text-xs ${
                      !hasNote
                        ? "grid grid-cols-1 sm:grid-cols-2 gap-6 space-y-0"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="font-bold">
                        {isEn
                          ? "M.Sc. Artificial Intelligence & Business Analytics"
                          : "M. Sc. KI und Business Analytics"}
                      </p>
                      <p
                        className={`text-[11px] mt-0.5 ${
                          isDarkPdf ? "text-slate-400" : "text-[#71717A]"
                        }`}
                      >
                        {isEn
                          ? "FOM University · Part-time from Sep 2026"
                          : "FOM · Berufsbegleitend ab 01.09.2026"}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold">
                        {isEn
                          ? "B.Sc. Business Information Systems (1.9)"
                          : "B. Sc. Wirtschaftsinformatik (1,9)"}
                      </p>
                      <p
                        className={`text-[11px] mt-0.5 ${
                          isDarkPdf ? "text-slate-400" : "text-[#71717A]"
                        }`}
                      >
                        {isEn
                          ? "FOM Düsseldorf · Focus on Data & BI"
                          : "FOM Düsseldorf · Fokus Daten & BI"}
                      </p>
                    </div>
                  </div>
                </div>

                {hasNote && (
                  <div>
                    <h3
                      className={`text-[11px] font-bold uppercase tracking-[0.16em] mb-3 ${
                        isDarkPdf ? "text-[#C4B5FD]" : "text-[#27272A]"
                      }`}
                    >
                      {isEn
                        ? "Personal CV Notes"
                        : "Persönliche Notizen zum CV"}
                    </h3>
                    <p
                      className={`text-xs leading-relaxed ${
                        isDarkPdf ? "text-slate-200" : "text-[#52525B]"
                      }`}
                    >
                      {trimmedNote}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BrandWordmark = ({
  brand,
  inverted = false,
  href = null,
  stopPropagation = false,
}) => {
  const linkHref = href ?? BRAND_URLS[brand] ?? null;
  const colorClass = inverted ? "text-white" : "text-[#0B0B0C]";
  const hoverClass = linkHref
    ? inverted
      ? "hover:opacity-85 transition-opacity"
      : "hover:opacity-75 transition-opacity"
    : "";

  let content = null;

  if (brand === "provinzial") {
    content = (
      <span
        className={`inline-flex items-center gap-2 font-extrabold uppercase tracking-[0.06em] text-sm sm:text-base ${colorClass} ${hoverClass}`}
      >
        <span className="w-2.5 h-2.5 rounded-[2px] bg-[#007A6E] inline-block shrink-0" />
        <span>PROVINZIAL</span>
      </span>
    );
  } else if (brand === "vodafone") {
    content = (
      <span
        className={`inline-flex items-center gap-2 font-extrabold tracking-[-0.035em] text-base sm:text-lg ${colorClass} ${hoverClass}`}
      >
        <span className="w-4 h-4 rounded-full border-[2.5px] border-[#E60000] inline-flex items-center justify-center shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E60000]" />
        </span>
        <span>vodafone</span>
      </span>
    );
  } else {
    content = (
      <span
        className={`inline-flex items-center gap-2 font-extrabold uppercase tracking-[0.04em] text-sm sm:text-base ${colorClass} ${hoverClass}`}
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
  }

  if (!linkHref) return content;

  return (
    <a
      href={linkHref}
      target="_blank"
      rel="noreferrer"
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
      className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0B0C] rounded-md"
    >
      {content}
    </a>
  );
};

const SkillPillItem = ({
  item,
  idx,
  chained,
  isOpen,
  onToggle,
  onOpen,
  onClose,
  reducedMotion,
}) => {
  const label = typeof item === "string" ? item : item.label;
  const role = typeof item === "string" ? "Tech Stack" : item.role;
  const projects = typeof item === "string" ? "" : item.projects;
  const delayMs = reducedMotion ? 0 : idx * 55;

  const pillRef = useRef(null);
  const bubbleRef = useRef(null);
  const [shiftX, setShiftX] = useState(0);
  const [arrowPercent, setArrowPercent] = useState(50);

  useLayoutEffect(() => {
    if (!isOpen || typeof window === "undefined") {
      setShiftX(0);
      setArrowPercent(50);
      return;
    }

    const updatePlacement = () => {
      const pillEl = pillRef.current;
      const bubbleEl = bubbleRef.current;
      if (!pillEl || !bubbleEl) return;

      const margin = 12;
      const viewportW = window.innerWidth;
      const pillRect = pillEl.getBoundingClientRect();
      const bubbleW = bubbleEl.offsetWidth || 260;
      const pillCenterX = pillRect.left + pillRect.width / 2;

      const idealLeft = pillCenterX - bubbleW / 2;
      const clampedLeft = Math.min(
        Math.max(idealLeft, margin),
        Math.max(margin, viewportW - bubbleW - margin),
      );

      const dx = clampedLeft - idealLeft;
      setShiftX(dx);

      const arrowPx = Math.min(
        Math.max(pillCenterX - clampedLeft, 18),
        Math.max(18, bubbleW - 18),
      );
      setArrowPercent((arrowPx / bubbleW) * 100);
    };

    updatePlacement();
    window.addEventListener("resize", updatePlacement);
    return () => window.removeEventListener("resize", updatePlacement);
  }, [isOpen]);

  return (
    <div
      ref={pillRef}
      style={{
        transitionDelay: `${delayMs}ms`,
        transform:
          reducedMotion || chained
            ? "translate3d(0, 0, 0)"
            : "translate3d(-12px, 6px, 0)",
      }}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={onClose}
      className={`relative inline-flex ${isOpen ? "z-30" : "z-10"} ${
        reducedMotion
          ? "opacity-100"
          : `transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
              chained ? "opacity-100" : "opacity-0"
            }`
      }`}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={`px-3 py-1.5 rounded-full bg-white border text-xs font-bold shadow-2xs select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9333EA] ${
          isOpen
            ? "text-[#7E22CE] border-[#C084FC] bg-[#FAF5FF] -translate-y-0.5 shadow-sm"
            : "text-[#0B0B0C] border-[#E4E4E7] hover:text-[#7E22CE] hover:border-[#C084FC] hover:bg-[#FAF5FF] hover:-translate-y-0.5 hover:shadow-xs"
        } ${
          reducedMotion
            ? ""
            : "transition-[color,background-color,border-color,transform,box-shadow] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]"
        }`}
      >
        {label}
      </button>

      <div
        ref={bubbleRef}
        role="tooltip"
        style={{
          transform: reducedMotion
            ? `translate3d(calc(-50% + ${shiftX}px), 0, 0)`
            : isOpen
              ? `translate3d(calc(-50% + ${shiftX}px), 0, 0) scale(1)`
              : `translate3d(calc(-50% + ${shiftX}px), 6px, 0) scale(0.95)`,
        }}
        className={`pointer-events-none absolute left-1/2 bottom-full mb-2.5 w-[min(17rem,calc(100vw-2.5rem))] sm:w-72 rounded-2xl rounded-bl-xs bg-white text-[#0B0B0C] border border-[#E4E4E7] shadow-[0_14px_32px_-8px_rgba(11,11,12,0.22)] p-3.5 text-left ${
          reducedMotion
            ? isOpen
              ? "opacity-100"
              : "opacity-0 hidden"
            : `transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7E22CE]">
            {role}
          </span>
          <span className="text-[10px] font-mono font-semibold text-[#71717A] shrink-0">
            {label}
          </span>
        </div>

        {projects && (
          <p className="mt-1.5 text-xs text-[#27272A] leading-relaxed font-medium">
            {projects}
          </p>
        )}

        <span
          aria-hidden="true"
          style={{ left: `${arrowPercent}%` }}
          className="absolute -translate-x-1/2 -bottom-1.5 w-2.5 h-2.5 rotate-45 bg-white border-r border-b border-[#E4E4E7]"
        />
      </div>
    </div>
  );
};

const SkillChainList = ({ skills, reducedMotion = false }) => {
  const [chained, setChained] = useState(Boolean(reducedMotion));
  const [activeSkillLabel, setActiveSkillLabel] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) {
      setChained(true);
      return;
    }

    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setChained(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setChained(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -16px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className="mt-5 flex flex-wrap gap-2">
      {skills.map((item, idx) => {
        const label = typeof item === "string" ? item : item.label;
        return (
          <SkillPillItem
            key={label}
            item={item}
            idx={idx}
            chained={chained}
            isOpen={activeSkillLabel === label}
            onOpen={() => setActiveSkillLabel(label)}
            onClose={() =>
              setActiveSkillLabel((prev) => (prev === label ? null : prev))
            }
            onToggle={() =>
              setActiveSkillLabel((prev) => (prev === label ? null : label))
            }
            reducedMotion={reducedMotion}
          />
        );
      })}
    </div>
  );
};

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

const SubtleMotivationGradient = ({ sectionRef, reducedMotion = false }) => {
  const [scrollFlow, setScrollFlow] = useState(0.5);

  useEffect(() => {
    if (reducedMotion) {
      setScrollFlow(0.5);
      return;
    }

    let rafId = null;

    const updateFlow = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        const sec = sectionRef?.current;
        if (sec) {
          const rect = sec.getBoundingClientRect();
          const vh = window.innerHeight || 1;
          const total = rect.height + vh;
          setScrollFlow(clamp01((vh - rect.top) / Math.max(total, 1)));
        }
        rafId = null;
      });
    };

    window.addEventListener("scroll", updateFlow, { passive: true });
    window.addEventListener("resize", updateFlow);
    updateFlow();

    return () => {
      window.removeEventListener("scroll", updateFlow);
      window.removeEventListener("resize", updateFlow);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [sectionRef, reducedMotion]);

  const offsetA = (scrollFlow - 0.5) * 34;
  const offsetB = (scrollFlow - 0.5) * -30;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0"
    >
      <div
        style={{
          background:
            "linear-gradient(180deg, #F4F5F9 0%, #F1F2F7 52%, #F3F3F8 100%)",
        }}
        className="absolute inset-0"
      />

      <div
        style={{
          transform: `translate3d(${offsetA}px, ${offsetA * 0.45}px, 0)`,
          background:
            "radial-gradient(ellipse 65% 55% at 18% 24%, rgba(37, 99, 235, 0.055) 0%, rgba(96, 165, 250, 0.025) 58%, transparent 80%)",
        }}
        className="absolute -inset-20 transition-transform duration-500 ease-out will-change-transform"
      />

      <div
        style={{
          transform: `translate3d(${offsetB}px, ${offsetB * 0.4}px, 0)`,
          background:
            "radial-gradient(ellipse 65% 55% at 84% 76%, rgba(124, 58, 237, 0.05) 0%, rgba(244, 114, 182, 0.022) 58%, transparent 82%)",
        }}
        className="absolute -inset-20 transition-transform duration-500 ease-out will-change-transform"
      />
    </div>
  );
};

const AppleLiquidCard = ({ children, variant = "dark", className = "" }) => {
  const isDark = variant === "dark";

  return (
    <div
      style={{
        boxShadow: isDark
          ? "0 22px 48px -18px rgba(11, 11, 12, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.16)"
          : "0 18px 38px -16px rgba(15, 23, 42, 0.12), 0 2px 6px -1px rgba(15, 23, 42, 0.04), inset 0 1.5px 0 rgba(255, 255, 255, 1)",
      }}
      className={`group relative overflow-hidden rounded-[28px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 ${
        isDark
          ? "bg-[#0B0B0C] border border-white/12 text-white hover:border-white/22"
          : "bg-white/95 backdrop-blur-2xl border border-white/90 text-[#0B0B0C] hover:bg-white hover:border-white"
      } ${className}`}
    >
      <div
        aria-hidden="true"
        style={{
          background: isDark
            ? "linear-gradient(90deg, transparent 0%, rgba(147, 197, 253, 0.28) 38%, rgba(216, 180, 254, 0.22) 72%, transparent 100%)"
            : "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 1) 50%, transparent 100%)",
        }}
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px]"
      />

      <div
        aria-hidden="true"
        style={{
          background: isDark
            ? "radial-gradient(circle at 88% 14%, rgba(59, 130, 246, 0.14) 0%, transparent 58%)"
            : "radial-gradient(circle at 88% 12%, rgba(255, 255, 255, 0.9) 0%, transparent 65%)",
        }}
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-100 opacity-85"
      />

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

const ContactMailWaveField = ({
  sectionRef,
  email = "malte_reppke@web.de",
  reducedMotion = false,
}) => {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: -999, y: -999, active: false });
  const pickedRef = useRef(null);
  const scrollReadyRef = useRef(reducedMotion ? 1 : 0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [pickedHint, setPickedHint] = useState(null);
  const [isFieldReady, setIsFieldReady] = useState(Boolean(reducedMotion));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateTouch = () => {
      const coarse = window.matchMedia
        ? window.matchMedia("(pointer: coarse)").matches
        : false;
      const small = window.innerWidth < 768;
      setIsTouchDevice(coarse || small);
    };
    updateTouch();
    window.addEventListener("resize", updateTouch);
    return () => window.removeEventListener("resize", updateTouch);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      scrollReadyRef.current = 1;
      setIsFieldReady(true);
      return;
    }

    let rafId = null;

    const updateScrollReady = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        const sec = sectionRef?.current;
        if (sec) {
          const rect = sec.getBoundingClientRect();
          const vh = window.innerHeight || 1;
          const raw =
            (vh - rect.top) / (vh * 0.85 + Math.max(rect.height * 0.35, 120));
          const eased = easeOutCubic(clamp01(raw));
          scrollReadyRef.current = eased;
          const nowReady = eased >= 0.92;
          setIsFieldReady((prev) => (prev === nowReady ? prev : nowReady));
        }
        rafId = null;
      });
    };

    window.addEventListener("scroll", updateScrollReady, { passive: true });
    window.addEventListener("resize", updateScrollReady);
    updateScrollReady();

    return () => {
      window.removeEventListener("scroll", updateScrollReady);
      window.removeEventListener("resize", updateScrollReady);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [sectionRef, reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId = null;
    let width = 0;
    let height = 0;

    const createArtifacts = () => {
      const count = isTouchDevice ? 14 : 26;
      return Array.from({ length: count }, (_, idx) => ({
        id: idx,
        nx: ((idx * 37) % 88) / 100 + 0.06,
        ny: ((idx * 53) % 76) / 100 + 0.12,
        vx: ((idx % 5) - 2) * 0.000075 || 0.000045,
        phase: idx * 0.72,
        stagger: (idx % 9) * 0.055,
        scale: 0.78 + (idx % 4) * 0.14,
        kind: idx % 3 === 0 ? "at" : "mail",
        x: 0,
        y: 0,
      }));
    };

    let artifacts = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = Math.max(1, parent.clientWidth);
      height = Math.max(1, parent.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (artifacts.length === 0) {
        artifacts = createArtifacts();
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const drawEnvelope = (x, y, s, alpha, highlight) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s * (highlight ? 1.24 : 1), s * (highlight ? 1.24 : 1));
      ctx.strokeStyle = highlight
        ? `rgba(255, 255, 255, ${Math.min(0.96, alpha + 0.45)})`
        : `rgba(226, 232, 240, ${alpha})`;
      ctx.lineWidth = highlight ? 1.5 : 1.15;
      ctx.lineJoin = "round";

      const w = 12;
      const h = 8.5;
      ctx.strokeRect(-w / 2, -h / 2, w, h);

      ctx.beginPath();
      ctx.moveTo(-w / 2, -h / 2);
      ctx.lineTo(0, 0.8);
      ctx.lineTo(w / 2, -h / 2);
      ctx.stroke();

      if (highlight) {
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(186, 230, 253, 0.45)";
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawAtSign = (x, y, s, alpha, highlight) => {
      ctx.save();
      ctx.translate(x, y);
      const r = 4.2 * s * (highlight ? 1.22 : 1);
      ctx.strokeStyle = highlight
        ? `rgba(240, 249, 255, ${Math.min(0.96, alpha + 0.45)})`
        : `rgba(203, 213, 225, ${alpha})`;
      ctx.lineWidth = highlight ? 1.45 : 1.15;

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.58, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 1.65);
      ctx.stroke();
      ctx.restore();
    };

    const renderFrame = (nowMs) => {
      const t = reducedMotion ? 1.2 : nowMs * 0.001;
      const readyGlobal = scrollReadyRef.current;
      ctx.clearRect(0, 0, width, height);

      const waveCount = 4;
      for (let wIdx = 0; wIdx < waveCount; wIdx++) {
        const waveLocal = easeOutCubic(
          clamp01((readyGlobal - wIdx * 0.08) / 0.72),
        );
        const shiftFromTopLeftX = (1 - waveLocal) * -140;
        const shiftFromTopLeftY = (1 - waveLocal) * -65;

        ctx.save();
        ctx.translate(shiftFromTopLeftX, shiftFromTopLeftY);
        ctx.beginPath();
        const baseY = height * (0.28 + wIdx * 0.16);
        for (let x = -160; x <= width + 160; x += 14) {
          const waveOffset =
            Math.sin(x * 0.0075 + t * (0.65 + wIdx * 0.12) + wIdx * 1.4) *
              (11 + wIdx * 3) +
            Math.cos(x * 0.014 - t * 0.45) * 4;
          const y = baseY + waveOffset;
          if (x === -160) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(203, 213, 225, ${
          (0.085 + wIdx * 0.02) * (0.35 + waveLocal * 0.65)
        })`;
        ctx.lineWidth = 1.05;
        ctx.stroke();
        ctx.restore();
      }

      let closest = null;
      let minDist = 64;

      artifacts.forEach((item) => {
        if (!reducedMotion && readyGlobal > 0.15) {
          item.nx += item.vx * (0.35 + readyGlobal * 0.65);
          if (item.nx > 0.95) item.nx = 0.05;
          if (item.nx < 0.05) item.nx = 0.95;
        }

        const itemProgress = easeOutCubic(
          clamp01(
            (readyGlobal - item.stagger) / Math.max(1 - item.stagger, 0.25),
          ),
        );

        const targetX = item.nx * width;
        const targetY =
          item.ny * height +
          Math.sin(t * 0.85 + item.phase) * (3 + itemProgress * 6);

        const startX = targetX - (135 + (item.id % 4) * 28);
        const startY = targetY - (85 + (item.id % 3) * 24);

        item.x = startX + (targetX - startX) * itemProgress;
        item.y = startY + (targetY - startY) * itemProgress;

        const canInteract = !isTouchDevice && readyGlobal >= 0.9;
        let dx = 0;
        let dy = 0;
        let dist = 999;

        if (canInteract && pointerRef.current.active) {
          dx = item.x - pointerRef.current.x;
          dy = item.y - pointerRef.current.y;
          dist = Math.hypot(dx, dy);
          if (dist < minDist) {
            minDist = dist;
            closest = item;
          }
        }

        const repel =
          canInteract && pointerRef.current.active && dist < 85 && dist > 0.01
            ? ((85 - dist) / 85) * 10
            : 0;
        const drawX = item.x + (dist > 0.01 ? (dx / dist) * repel : 0);
        const drawY = item.y + (dist > 0.01 ? (dy / dist) * repel : 0);

        const isPicked = canInteract && closest && closest.id === item.id;
        const visibilityFactor = 0.24 + itemProgress * 0.76;
        const baseAlpha =
          (isTouchDevice ? 0.26 : 0.34 + (item.id % 3) * 0.055) *
          visibilityFactor;

        if (item.kind === "at") {
          drawAtSign(
            drawX,
            drawY,
            item.scale * (0.82 + itemProgress * 0.18),
            baseAlpha,
            isPicked,
          );
        } else {
          drawEnvelope(
            drawX,
            drawY,
            item.scale * (0.82 + itemProgress * 0.18),
            baseAlpha,
            isPicked,
          );
        }

        ctx.beginPath();
        ctx.arc(drawX + 16, drawY - 6, isPicked ? 2.2 : 1.35, 0, Math.PI * 2);
        ctx.fillStyle = isPicked
          ? "rgba(255, 255, 255, 0.92)"
          : `rgba(226, 232, 240, ${0.42 * visibilityFactor})`;
        ctx.fill();
      });

      if (!isTouchDevice && readyGlobal >= 0.9) {
        pickedRef.current = closest;
        setPickedHint((prev) => {
          if (!closest) return null;
          const next = {
            x: Math.min(Math.max(closest.x, 96), width - 96),
            y: Math.max(closest.y - 22, 26),
            label: `E-Mail senden · ${email}`,
          };
          if (
            prev &&
            prev.label === next.label &&
            Math.abs(prev.x - next.x) < 1 &&
            Math.abs(prev.y - next.y) < 1
          ) {
            return prev;
          }
          return next;
        });
      } else {
        pickedRef.current = null;
        setPickedHint(null);
      }

      if (!reducedMotion) {
        frameId = window.requestAnimationFrame(renderFrame);
      }
    };

    renderFrame(performance.now());

    return () => {
      window.removeEventListener("resize", resize);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [email, isTouchDevice, reducedMotion]);

  const handlePointerMove = (e) => {
    if (isTouchDevice || !isFieldReady) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handlePointerLeave = () => {
    pointerRef.current.active = false;
    pickedRef.current = null;
    setPickedHint(null);
  };

  const handleCanvasClick = () => {
    if (isTouchDevice || !isFieldReady) return;
    if (pickedRef.current) {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onClick={handleCanvasClick}
      className={`absolute inset-0 z-0 overflow-hidden rounded-3xl transition-opacity duration-500 ${
        isFieldReady ? "opacity-100" : "opacity-85"
      } ${
        !isTouchDevice && isFieldReady && pickedHint
          ? "cursor-pointer"
          : "pointer-events-none"
      }`}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`w-full h-full block transition-[filter] duration-500 ${
          isFieldReady ? "blur-0" : "blur-[0.8px]"
        }`}
      />

      {!isTouchDevice && isFieldReady && pickedHint && (
        <div
          style={{
            left: `${pickedHint.x}px`,
            top: `${pickedHint.y}px`,
          }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0B0B0C] text-[11px] font-bold shadow-lg whitespace-nowrap"
        >
          <Mail className="w-3 h-3 text-[#0B0B0C]" />
          <span>{pickedHint.label}</span>
        </div>
      )}
    </div>
  );
};

const TextReveal = ({
  children,
  delay = 0,
  yOffset = 14,
  className = "",
  reducedMotion = false,
}) => {
  const [shown, setShown] = useState(Boolean(reducedMotion));
  const ref = useRef(null);

  useEffect(() => {
    if (reducedMotion) {
      setShown(true);
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -18px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: reducedMotion ? "0ms" : `${delay}ms`,
        transform:
          reducedMotion || shown
            ? "translate3d(0, 0, 0)"
            : `translate3d(0, ${yOffset}px, 0)`,
      }}
      className={`${
        reducedMotion
          ? "opacity-100"
          : `transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
              shown ? "opacity-100" : "opacity-0"
            }`
      } ${className}`}
    >
      {children}
    </div>
  );
};

const MotivationSlideIn = ({
  children,
  from = "bottom",
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
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const initialTransform =
    from === "left"
      ? "translate3d(-32px, 8px, 0) scale(0.99)"
      : from === "right"
        ? "translate3d(32px, 8px, 0) scale(0.99)"
        : "translate3d(0, 26px, 0) scale(0.99)";

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: reducedMotion ? "0ms" : `${delay}ms`,
        transform:
          reducedMotion || visible
            ? "translate3d(0, 0, 0) scale(1)"
            : initialTransform,
      }}
      className={`${
        reducedMotion
          ? "opacity-100"
          : `transition-[transform,opacity] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
              visible ? "opacity-100" : "opacity-0"
            }`
      } ${className}`}
    >
      {children}
    </div>
  );
};

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

const HeadlineFlow = ({
  kicker,
  title,
  as: Tag = "h2",
  titleClassName = "mt-2 text-3xl sm:text-5xl font-bold tracking-[-0.04em] text-[#0B0B0C]",
  reducedMotion = false,
}) => {
  const [shown, setShown] = useState(Boolean(reducedMotion));
  const ref = useRef(null);

  useEffect(() => {
    if (reducedMotion) {
      setShown(true);
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -24px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div ref={ref}>
      {kicker && (
        <div className="overflow-hidden">
          <span
            style={{ transitionDelay: reducedMotion ? "0ms" : "40ms" }}
            className={`block text-[11px] font-bold uppercase tracking-[0.2em] text-[#52525B] ${
              reducedMotion
                ? "opacity-100 translate-y-0"
                : `transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    shown
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-3"
                  }`
            }`}
          >
            {kicker}
          </span>
        </div>
      )}

      {title && (
        <div className="overflow-hidden pb-1">
          <Tag
            style={{ transitionDelay: reducedMotion ? "0ms" : "130ms" }}
            className={`${titleClassName} ${
              reducedMotion
                ? "opacity-100 translate-y-0"
                : `transition-[transform,opacity] duration-[850ms] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform ${
                    shown
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-7"
                  }`
            }`}
          >
            {title}
          </Tag>
        </div>
      )}
    </div>
  );
};

const ContactFlow = ({ children, reducedMotion = false }) => {
  const [shown, setShown] = useState(Boolean(reducedMotion));
  const ref = useRef(null);

  useEffect(() => {
    if (reducedMotion) {
      setShown(true);
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -20px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: reducedMotion ? "0ms" : "90ms" }}
      className={
        reducedMotion
          ? "opacity-100 translate-y-0 scale-100"
          : `transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform ${
              shown
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-5 scale-[0.992]"
            }`
      }
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
    markerOffsetClass: "pt-2 sm:pt-4",
    title: "Customer Data Hub, IT-DWH & Agentic AI",
    tagline:
      "PySpark · Azure Synapse · IT-DWH · Selektionsframework · OpenCode & Agentic Workflows",
    periodBracket: "[ > 1 Jahr Erfahrung ]",
    role: "Data & AI Engineer (IT-DWH, ab 01.06.2026) · Data-Analyst Customer Data & Analytics (01.05.2025 – 30.05.2026)",
    organization: "Provinzial Versicherung AG",
    summary:
      "Zentrale Datenprodukte, ein PySpark-Selektionsframework und IT-DWH-Pipelines auf Azure Synapse – erweitert um AI Engineering mit OpenCode und Agentic-Development-Workflows.",
    highlights: [
      "AI Engineering mit OpenCode & Einführung von Core Agentic-Development-Workflows im IT-DWH-Projekt (ab 01.06.2026)",
      "Entwicklung skalierbarer Datenprodukte, Pipelines und Datenarchitekturen im IT-DWH für Analytik und KI-Systeme",
      "Stark PySpark-getriebene Datenprodukt-Entwicklung auf Azure Synapse inkl. eigenem Selektionsframework für Kundenselektionen (01.05.2025 – 30.05.2026)",
      "Ca. 6 Monate als Interim-PO (bis 01.04.2026) für das Data-Team",
    ],
    stack:
      "Python · PySpark · Azure Synapse · OpenCode · Agentic Workflows · IT-DWH · SQL",
  },
  {
    id: "vodafone-pageforge",
    indexTag: "[ 02 ]",
    brand: "vodafone",
    accentHex: "#E60000",
    accentTextClass: "text-[#E60000]",
    markerOffsetClass: "pt-8 sm:pt-12",
    title: "Firmenkundenportal & PageForge",
    tagline:
      "B2B-Vertrags-Microservices · PageForge für 200+ Sites · Node.js APIs & CI/CD",
    periodBracket: "[ > 2 Jahre Erfahrung ]",
    role: "Backend / Data Integration Firmenkunden",
    organization: "Vodafone GmbH",
    summary:
      "Entwicklung und Datenintegration für das Vodafone Firmenkundenportal, PageForge für über 200 Business-Websites sowie Microservices und CI/CD.",
    highlights: [
      "Entwicklung & Datenintegration für das Vodafone Firmenkundenportal",
      "Entwicklung des Vodafone Blogs sowie über 200 Business-Websites",
      "Implementierung von Microservices für Vertragsdaten mit Node.js",
      "Anhebung der Automatisierung CI/CD in der Git-Pipeline",
    ],
    stack: "Node.js · React.js · Next.js · Docker · CI/CD · Microservices",
  },
  {
    id: "controlexpert-easyclaim",
    indexTag: "[ 03 ]",
    brand: "controlexpert",
    accentHex: "#0A66C2",
    accentTextClass: "text-[#0A66C2]",
    markerOffsetClass: "pt-14 sm:pt-20",
    title: "EasyClaim & Daten-/BI-Plattform",
    tagline:
      "Digitale Schadenaufnahme · React.js & .NET C# · Data Warehouse · Tableau & BI",
    periodBracket: "[ > 10 Jahre Erfahrung ]",
    role: "Softwareentwickler · BI-Specialist · Business-Analyst · Data-Specialist",
    organization: "ControlExpert GmbH",
    summary:
      "Webapplikation zur digitalen Schadenaufnahme, Data-Warehouse-Aufbau, SQL-Reporting sowie Prozess- und Datenlösungen im Versicherungs- und Automobilumfeld.",
    highlights: [
      "Webapplikation zur digitalen Schadenaufnahme mit React.js im Frontend & .NET C# im Backend",
      "Absicherung der Codequalität mit Jest & Cypress im Kanban- und Design-Thinking-Umfeld",
      "Entwicklung eines Data Warehouse mit SQL-Reporting & Visualisierung in Tableau",
      "Digitalisierung & Prozessautomatisierung mit IBM BPM sowie interne Kalkulationsanwendung in Scrum",
      "Erhebung, Abfrage & Pflege von Herstellerdaten in relationalen Datenbanken",
    ],
    stack:
      "React.js · .NET C# · Jest · Cypress · SQL · Tableau · IBM BPM · Data Warehouse",
  },
];

const InteractiveProjectColumn = ({
  project,
  isPinned,
  isHovered,
  isMobileView,
  onToggleClick,
  onTogglePin,
  onHoverChange,
  reducedMotion,
}) => {
  const isExpanded = isPinned || (!isMobileView && isHovered);

  return (
    <div
      onClick={onToggleClick}
      onMouseEnter={() => onHoverChange(project.id)}
      onMouseLeave={() => onHoverChange(null)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggleClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`${project.title} – Steckbrief öffnen oder anpinnen`}
      className={`group relative cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0B0C] border-t md:border-t-0 md:border-l last:md:border-r border-[#E4E4E7] flex flex-col justify-between px-5 sm:px-7 py-6 sm:py-7 min-h-[340px] sm:min-h-[390px] ${
        reducedMotion
          ? "bg-[#FFFFFF]"
          : `transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isExpanded
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
          <BrandWordmark brand={project.brand} stopPropagation />
        </div>

        <div className={`relative ${project.markerOffsetClass}`}>
          <div className="flex items-center gap-2 mb-2.5">
            <span
              style={{ backgroundColor: project.accentHex }}
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                reducedMotion
                  ? ""
                  : `transition-transform duration-300 ${
                      isExpanded ? "scale-125" : "group-hover:scale-110"
                    }`
              }`}
            />
            <div
              style={{ backgroundColor: project.accentHex }}
              className={`h-[2px] flex-1 rounded-full ${
                reducedMotion
                  ? ""
                  : `transition-all duration-300 ${
                      isExpanded
                        ? "h-[3px] opacity-100"
                        : "opacity-80 group-hover:opacity-100"
                    }`
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
              ? isExpanded
                ? "grid-rows-[1fr] opacity-100 mt-5"
                : "grid-rows-[0fr] opacity-0 mt-0"
              : `transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isExpanded
                    ? "grid-rows-[1fr] opacity-100 mt-5"
                    : "grid-rows-[0fr] opacity-0 mt-0"
                }`
          }`}
        >
          <div className="overflow-hidden">
            <div className="rounded-2xl bg-[#F4F4F5] border border-[#E4E4E7] p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#52525B]">
                  Steckbrief · {project.organization}
                </span>

                <button
                  type="button"
                  aria-pressed={isPinned}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(project.id);
                  }}
                  style={{
                    borderColor: isPinned ? project.accentHex : "#D4D4D8",
                    color: isPinned ? "#FFFFFF" : "#52525B",
                  }}
                  className={`relative overflow-hidden inline-flex items-center justify-center w-8 h-8 rounded-full border bg-white shadow-xs cursor-pointer ${
                    reducedMotion
                      ? ""
                      : "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-90 hover:scale-105"
                  }`}
                  aria-label={`Steckbrief für ${project.organization} anpinnen`}
                  title={isPinned ? "Steckbrief lösen" : "Steckbrief anpinnen"}
                >
                  <span
                    style={{ backgroundColor: project.accentHex }}
                    className={`absolute inset-0 rounded-full ${
                      reducedMotion
                        ? isPinned
                          ? "scale-100 opacity-100"
                          : "scale-0 opacity-0"
                        : `transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isPinned
                              ? "scale-100 opacity-100"
                              : "scale-0 opacity-0"
                          }`
                    }`}
                  />
                  <Pin
                    className={`relative z-10 w-3.5 h-3.5 ${
                      reducedMotion
                        ? isPinned
                          ? "-rotate-45 fill-current"
                          : "rotate-0"
                        : `transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isPinned
                              ? "-rotate-45 scale-110 fill-current"
                              : "rotate-0 scale-100"
                          }`
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs sm:text-[13px] font-bold text-[#0B0B0C] leading-snug">
                {project.role}
              </p>

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
          className={`inline-flex items-center gap-1.5 text-xs font-bold ${
            project.accentTextClass
          } ${
            reducedMotion
              ? ""
              : "transition-transform duration-300 group-hover:translate-x-0.5"
          }`}
        >
          {isPinned && (
            <Pin
              aria-label="Angepinnt"
              className="w-3 h-3 -rotate-45 fill-current shrink-0"
            />
          )}
          <span>Steckbrief</span>
          <ChevronRight
            className={`w-3.5 h-3.5 ${
              reducedMotion
                ? ""
                : `transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`
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
  const [isMobileView, setIsMobileView] = useState(false);
  const [pinnedIds, setPinnedIds] = useState([]);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const [controlExpertExpanded, setControlExpertExpanded] = useState(false);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const heroStageRef = useRef(null);
  const motivationSectionRef = useRef(null);
  const contactSectionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateMobileFlag = () => {
      const coarse = window.matchMedia
        ? window.matchMedia("(pointer: coarse)").matches
        : false;
      const small = window.innerWidth < 768;
      setIsMobileView(coarse || small);
    };
    updateMobileFlag();
    window.addEventListener("resize", updateMobileFlag);
    return () => window.removeEventListener("resize", updateMobileFlag);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    let iconLink = document.querySelector('link[rel="icon"]');
    if (!iconLink) {
      iconLink = document.createElement("link");
      iconLink.rel = "icon";
      document.head.appendChild(iconLink);
    }
    iconLink.type = "image/svg+xml";
    iconLink.href = `data:image/svg+xml,${encodeURIComponent(SUBTLE_FAVICON_SVG)}`;
  }, []);

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

  const navItems = [
    { id: "work", label: "Projekte" },
    { id: "motivation", label: "Motivation" },
    { id: "experience", label: "Stationen" },
    { id: "contact", label: "Kontakt" },
  ];

  return (
    <div
      style={{
        fontFamily:
          '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      }}
      className="min-h-screen w-full overflow-x-clip bg-[#FFFFFF] text-[#0B0B0C] selection:bg-[#0B0B0C] selection:text-white antialiased"
    >
      <CvCustomizerModal
        open={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
      />

      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none">
        <div
          className="h-full bg-[#0B0B0C] transition-[width] duration-150 ease-out"
          style={{ width: `${pageProgress * 100}%` }}
        />
      </div>

      {/* 1. TOP HERO SECTION WITH WEBGL SILK-MARBLE & SCROLL-SPLIT DISSOLVE */}
      <section
        id="hero-stage"
        ref={heroStageRef}
        className="relative h-[210vh] sm:h-[215vh] bg-[#FFFFFF]"
      >
        <div className="sticky top-0 h-[100dvh] min-h-[680px] sm:min-h-[620px] w-full overflow-hidden bg-[#FFFFFF] flex flex-col justify-center">
          <div
            style={{
              opacity: revealedTitleOpacity,
              transform: `translate3d(0, ${revealedTitleY}px, 0) scale(${revealedTitleScale})`,
              pointerEvents: revealedTitleOpacity > 0.65 ? "auto" : "none",
            }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 sm:px-8 max-w-5xl mx-auto will-change-transform"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#52525B] mb-5">
              Einblick in meine Projekte
            </span>

            <h2 className="text-3xl sm:text-6xl md:text-[72px] font-bold tracking-[-0.045em] text-[#0B0B0C] leading-[1.06] max-w-4xl">
              Belastbare Datenprodukte und KI-Systeme für den Alltag.
            </h2>

            <p className="mt-6 sm:mt-7 text-sm sm:text-xl text-[#52525B] font-medium max-w-2xl leading-relaxed tracking-[-0.015em]">
              Von Customer-Data-Hubs und Microservices bis hin zu digitalen
              InsurTech-Lösungen – strukturiert, verlässlich und praxistauglich
              umgesetzt.
            </p>

            <div className="mt-8 sm:mt-10">
              <button
                type="button"
                onClick={() => jumpToSection("work")}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0B0B0C] text-white text-xs sm:text-sm font-bold hover:bg-[#18181B] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Zu den Projekten</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              style={{ pointerEvents: heroOpacity < 0.2 ? "none" : "auto" }}
              className="relative rounded-[28px] sm:rounded-[40px] min-h-[610px] sm:min-h-[650px] flex flex-col justify-between overflow-visible"
            >
              <div
                style={{
                  opacity: curtainOpacity,
                  filter: curtainBlur > 0.2 ? `blur(${curtainBlur}px)` : "none",
                }}
                className="absolute inset-0 rounded-[28px] sm:rounded-[40px] overflow-visible pointer-events-none will-change-transform"
              >
                <div
                  style={{
                    clipPath: "inset(0 49.8% 0 0 round 28px 0 0 28px)",
                    transform: `translate3d(${leftOffset}%, 0, 0) scale(${curtainScale})`,
                  }}
                  className="absolute inset-0 rounded-[28px] sm:rounded-[40px] overflow-hidden shadow-[0_24px_70px_-15px_rgba(11,11,12,0.32)] will-change-transform"
                >
                  <WebGLSilkMarble paused={reducedMotion} />
                  <div
                    style={{ opacity: splitAmount * 0.85 }}
                    className="absolute inset-y-0 right-0 w-24 sm:w-32 bg-gradient-to-l from-white via-white/70 to-transparent"
                  />
                </div>

                <div
                  style={{
                    clipPath: "inset(0 0 0 49.8% round 0 28px 28px 0)",
                    transform: `translate3d(${rightOffset}%, 0, 0) scale(${curtainScale})`,
                  }}
                  className="absolute inset-0 rounded-[28px] sm:rounded-[40px] overflow-hidden shadow-[0_24px_70px_-15px_rgba(11,11,12,0.32)] will-change-transform"
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
                  className="absolute inset-0 rounded-[28px] sm:rounded-[40px] pointer-events-none"
                />

                <header className="relative z-10 flex items-center justify-center sm:justify-between px-5 sm:px-9 pt-7 sm:pt-8">
                  <HeroAvatarSpeechMark
                    size={42}
                    reducedMotion={reducedMotion}
                    className="hidden sm:inline-flex"
                  />

                  <nav
                    aria-label="Hauptnavigation"
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-white/80"
                  >
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => jumpToSection(item.id)}
                        className="px-3 sm:px-3.5 py-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)] hover:-translate-y-[0.5px] active:scale-95 transition-all duration-200 cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </header>

                <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 sm:px-14 py-16 sm:py-16">
                  <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/75 mb-6 sm:mb-5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Data Engineering &amp; AI Engineering</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.045em] text-white leading-[1.06]">
                    Malte Reppke
                  </h1>

                  <p className="mt-7 sm:mt-7 max-w-2xl text-sm sm:text-lg md:text-[19px] text-white/85 font-medium leading-[1.72] sm:leading-[1.68]">
                    Data Engineering &amp; KI-Systeme bei der{" "}
                    <span className="border-b border-[#60A5FA] pb-0.5 text-white">
                      Provinzial
                    </span>
                    . Fokus auf verlässliche Datenprodukte, skalierbare
                    Pipelines und praxisnahes AI Engineering.
                  </p>

                  <div className="mt-10 sm:mt-10">
                    <button
                      type="button"
                      onClick={() => jumpToSection("work")}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#0B0B0C] text-xs sm:text-sm font-bold hover:bg-[#F4F4F5] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <span>Einblick in meine Projekte</span>
                    </button>
                  </div>
                </div>

                <div className="relative z-10 pb-7 sm:pb-8 flex flex-col items-center gap-2.5 sm:gap-2">
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

      {/* 2. PROJEKTE */}
      <section id="work" className="bg-[#FFFFFF] py-20 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <HeadlineFlow
              kicker="01 / Projekte & Wirkung"
              title="Einblick in meine Projekte"
              as="h2"
              reducedMotion={reducedMotion}
            />

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

          <RevealBlock delay={80} reducedMotion={reducedMotion}>
            <div className="grid grid-cols-1 md:grid-cols-3 rounded-3xl border border-[#E4E4E7] overflow-hidden bg-white shadow-sm">
              {TIMELINE_PROJECTS.map((project) => (
                <InteractiveProjectColumn
                  key={project.id}
                  project={project}
                  isPinned={pinnedIds.includes(project.id)}
                  isHovered={hoveredProjectId === project.id}
                  isMobileView={isMobileView}
                  onToggleClick={() => handleProjectClick(project.id)}
                  onTogglePin={handleTogglePin}
                  onHoverChange={setHoveredProjectId}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* 3. MOTIVATION */}
      <section
        id="motivation"
        ref={motivationSectionRef}
        className="relative bg-[#F4F5F9] py-16 sm:py-24 overflow-hidden"
      >
        <SubtleMotivationGradient
          sectionRef={motivationSectionRef}
          reducedMotion={reducedMotion}
        />

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="mb-8">
            <HeadlineFlow
              kicker="02 / Motivation"
              reducedMotion={reducedMotion}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <MotivationSlideIn
              from="left"
              delay={60}
              reducedMotion={reducedMotion}
              className="lg:col-span-6"
            >
              <AppleLiquidCard variant="dark" className="h-full">
                <div className="h-full p-7 sm:p-9 flex flex-col justify-between">
                  <div>
                    <TextReveal delay={110} reducedMotion={reducedMotion}>
                      <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-7">
                        <Cpu className="w-5 h-5 text-white" />
                      </div>
                    </TextReveal>

                    <TextReveal
                      delay={170}
                      yOffset={10}
                      reducedMotion={reducedMotion}
                    >
                      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">
                        Datenprodukte &amp; AI Engineering
                      </span>
                    </TextReveal>

                    <TextReveal
                      delay={230}
                      yOffset={16}
                      reducedMotion={reducedMotion}
                    >
                      <h2 className="mt-3 text-2xl sm:text-4xl font-bold tracking-[-0.035em] leading-[1.12] text-white">
                        Verlässliche Datenprodukte &amp; praxisnahe KI-Systeme
                      </h2>
                    </TextReveal>

                    <TextReveal
                      delay={300}
                      yOffset={14}
                      reducedMotion={reducedMotion}
                    >
                      <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed">
                        Mich motiviert es, aus komplexen Datenlandschaften
                        verlässliche Datenprodukte, skalierbare Pipelines und
                        praxistaugliche KI-Systeme zu bauen, die Fachbereiche
                        und automatisierte Prozesse im Alltag messbar stärken.
                      </p>
                    </TextReveal>
                  </div>

                  <TextReveal
                    delay={360}
                    yOffset={10}
                    reducedMotion={reducedMotion}
                  >
                    <div className="mt-8 pt-6 border-t border-white/12 text-xs sm:text-sm font-medium text-white/75">
                      PySpark · Azure Synapse · Datenprodukte · AI Engineering
                    </div>
                  </TextReveal>
                </div>
              </AppleLiquidCard>
            </MotivationSlideIn>

            <MotivationSlideIn
              from="right"
              delay={140}
              reducedMotion={reducedMotion}
              className="lg:col-span-6"
            >
              <AppleLiquidCard variant="liquid" className="h-full">
                <div className="h-full p-7 sm:p-9 flex flex-col justify-between">
                  <div>
                    <TextReveal delay={180} reducedMotion={reducedMotion}>
                      <div className="w-11 h-11 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-7">
                        <Database className="w-5 h-5 text-[#0B0B0C]" />
                      </div>
                    </TextReveal>

                    <TextReveal
                      delay={240}
                      yOffset={10}
                      reducedMotion={reducedMotion}
                    >
                      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#52525B]">
                        Skalierbare Pipelines
                      </span>
                    </TextReveal>

                    <TextReveal
                      delay={300}
                      yOffset={16}
                      reducedMotion={reducedMotion}
                    >
                      <h3 className="mt-3 text-2xl sm:text-3xl font-bold tracking-[-0.035em] leading-[1.15] text-[#0B0B0C]">
                        Saubere Struktur statt Fragilität
                      </h3>
                    </TextReveal>

                    <TextReveal
                      delay={360}
                      yOffset={14}
                      reducedMotion={reducedMotion}
                    >
                      <p className="mt-4 text-sm sm:text-base text-[#52525B] leading-relaxed">
                        Gute Systeme sind nachvollziehbar, testbar und
                        automatisiert. Klare Schnittstellen und reproduzierbare
                        Pipelines schaffen Vertrauen – von der Kundenselektion
                        bis zur KI-fähigen Aufbereitung.
                      </p>
                    </TextReveal>
                  </div>

                  <TextReveal
                    delay={420}
                    yOffset={10}
                    reducedMotion={reducedMotion}
                  >
                    <div className="mt-8 pt-6 border-t border-[#ECEEF2] text-xs sm:text-sm font-medium text-[#52525B]">
                      Reproduzierbarkeit · Qualität · Automatisierung
                    </div>
                  </TextReveal>
                </div>
              </AppleLiquidCard>
            </MotivationSlideIn>

            <MotivationSlideIn
              from="bottom"
              delay={200}
              reducedMotion={reducedMotion}
              className="lg:col-span-12"
            >
              <AppleLiquidCard variant="liquid">
                <div className="p-7 sm:p-9 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="max-w-3xl">
                    <TextReveal delay={240} reducedMotion={reducedMotion}>
                      <div className="w-11 h-11 rounded-2xl bg-[#0B0B0C] text-white flex items-center justify-center mb-5">
                        <Layers className="w-5 h-5" />
                      </div>
                    </TextReveal>

                    <TextReveal
                      delay={290}
                      yOffset={10}
                      reducedMotion={reducedMotion}
                    >
                      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#52525B]">
                        End-to-End-Perspektive
                      </span>
                    </TextReveal>

                    <TextReveal
                      delay={340}
                      yOffset={16}
                      reducedMotion={reducedMotion}
                    >
                      <h3 className="mt-2 text-2xl sm:text-3xl font-bold tracking-[-0.035em] leading-[1.15] text-[#0B0B0C]">
                        Von Datenpipelines &amp; Modellen bis in produktive
                        AI-Systeme
                      </h3>
                    </TextReveal>

                    <TextReveal
                      delay={390}
                      yOffset={14}
                      reducedMotion={reducedMotion}
                    >
                      <p className="mt-3 text-sm sm:text-base text-[#52525B] leading-relaxed">
                        Der Bogen von kuratierten Datenprodukten, Data
                        Engineering und Services bis hin zu produktiven
                        AI-Anwendungen und analytischen Workflows sorgt dafür,
                        dass KI-Lösungen verlässlich, nachvollziehbar und im
                        Alltag wirksam laufen.
                      </p>
                    </TextReveal>
                  </div>

                  <TextReveal
                    delay={430}
                    yOffset={10}
                    reducedMotion={reducedMotion}
                  >
                    <div className="text-xs sm:text-sm font-semibold text-[#52525B] lg:text-right shrink-0">
                      Data Products · AI Systems · Pipelines · Analytics
                    </div>
                  </TextReveal>
                </div>
              </AppleLiquidCard>
            </MotivationSlideIn>
          </div>
        </div>
      </section>

      {/* 4. STATIONEN & TECH STACK */}
      <section id="experience" className="bg-[#FBFBFD] py-16 sm:py-24">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <HeadlineFlow
              kicker="03 / Stationen & Tech Stack"
              title="Stationen & Kernkompetenzen"
              as="h2"
              reducedMotion={reducedMotion}
            />

            <div className="self-start sm:self-auto">
              <CvSectionAvatarTrigger
                onOpen={() => setCvModalOpen(true)}
                reducedMotion={reducedMotion}
              />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <RevealBlock
              delay={60}
              reducedMotion={reducedMotion}
              className="lg:col-span-7"
            >
              <div className="rounded-3xl border border-[#E4E4E7] bg-white p-6 sm:p-8 space-y-6">
                <div className="border-b border-[#E4E4E7] pb-5">
                  <div className="w-full">
                    <BrandWordmark brand="provinzial" />
                    <p className="mt-1.5 text-sm font-bold text-[#0B0B0C]">
                      Provinzial Versicherung AG · Stationen im Überblick
                    </p>
                    <p className="text-xs font-mono text-[#52525B] mt-0.5">
                      01.05.2025 – heute
                    </p>

                    <div className="mt-4 space-y-3.5">
                      {PROVINZIAL_STATIONS.map((item) => (
                        <div key={item.title} className="space-y-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="text-xs sm:text-[13px] font-bold text-[#0B0B0C]">
                              {item.title}
                            </p>
                            <span className="text-[11px] font-mono text-[#52525B]">
                              {item.period}
                            </span>
                          </div>
                          <ul className="pl-4 space-y-1 text-xs text-[#52525B]">
                            {item.bullets.map((bullet) => (
                              <li key={bullet} className="list-disc">
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-b border-[#E4E4E7] pb-5">
                  <div>
                    <BrandWordmark brand="vodafone" />
                    <p className="mt-1.5 text-sm font-bold text-[#0B0B0C]">
                      Backend / Data Integration Firmenkunden · Vodafone GmbH
                    </p>
                    <p className="text-xs font-mono text-[#52525B] mt-0.5">
                      Nov 2022 bis Mär 2025
                    </p>
                  </div>
                </div>

                <div>
                  <div className="w-full">
                    <BrandWordmark brand="controlexpert" />
                    <p className="mt-1.5 text-sm font-bold text-[#0B0B0C]">
                      ControlExpert GmbH · Stationen im Überblick
                    </p>
                    <p className="text-xs font-mono text-[#52525B] mt-0.5">
                      Jul 2012 – Aug 2022
                    </p>

                    <div className="mt-4 space-y-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-xs sm:text-[13px] font-bold text-[#0B0B0C]">
                          {CONTROLEXPERT_FEATURED_STATION.title}
                        </p>
                        <span className="text-[11px] font-mono text-[#52525B]">
                          {CONTROLEXPERT_FEATURED_STATION.period}
                        </span>
                      </div>
                      <ul className="pl-4 space-y-1 text-xs text-[#52525B]">
                        {CONTROLEXPERT_FEATURED_STATION.bullets.map(
                          (bullet) => (
                            <li key={bullet} className="list-disc">
                              {bullet}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        aria-expanded={controlExpertExpanded}
                        onClick={() =>
                          setControlExpertExpanded((prev) => !prev)
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A66C2] hover:text-[#084E96] transition-colors cursor-pointer"
                      >
                        <span>
                          {controlExpertExpanded
                            ? "Frühere Stationen ausblenden"
                            : `Frühere Stationen einblenden (${CONTROLEXPERT_MORE_STATIONS.length})`}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 ${
                            reducedMotion
                              ? ""
                              : `transition-transform duration-300 ${
                                  controlExpertExpanded ? "rotate-180" : ""
                                }`
                          }`}
                        />
                      </button>

                      <div
                        className={`grid ${
                          reducedMotion
                            ? controlExpertExpanded
                              ? "grid-rows-[1fr] opacity-100 mt-3.5"
                              : "grid-rows-[0fr] opacity-0 mt-0"
                            : `transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                controlExpertExpanded
                                  ? "grid-rows-[1fr] opacity-100 mt-3.5"
                                  : "grid-rows-[0fr] opacity-0 mt-0"
                              }`
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="space-y-3.5 pt-1 border-t border-[#E4E4E7]/80">
                            {CONTROLEXPERT_MORE_STATIONS.map((item) => (
                              <div key={item.title} className="space-y-1">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                  <p className="text-xs sm:text-[13px] font-bold text-[#0B0B0C]">
                                    {item.title}
                                  </p>
                                  <span className="text-[11px] font-mono text-[#52525B]">
                                    {item.period}
                                  </span>
                                </div>
                                <ul className="pl-4 space-y-1 text-xs text-[#52525B]">
                                  {item.bullets.map((bullet) => (
                                    <li key={bullet} className="list-disc">
                                      {bullet}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealBlock>

            <RevealBlock
              delay={120}
              reducedMotion={reducedMotion}
              className="lg:col-span-5"
            >
              <div className="h-full rounded-3xl border border-[#E4E4E7] bg-[#F5F5F7]/75 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#52525B]">
                    <Terminal className="w-4 h-4" />
                    <span>Tech Stack</span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold tracking-[-0.03em] text-[#0B0B0C]">
                    Werkzeuge für Daten, Backend &amp; UI
                  </h3>
                  <SkillChainList
                    skills={CORE_SKILL_PILLS}
                    reducedMotion={reducedMotion}
                  />
                </div>

                <div className="mt-8 pt-5 border-t border-[#E4E4E7] space-y-2.5 text-xs text-[#52525B]">
                  <div className="flex items-start gap-2.5">
                    <GraduationCap className="w-4 h-4 shrink-0 text-[#0B0B0C] mt-0.5" />
                    <span>
                      <strong className="font-bold text-[#0B0B0C]">
                        M. Sc. KI und Business Analytics
                      </strong>{" "}
                      (FOM, nebenberuflich ab 01.09.2026)
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <GraduationCap className="w-4 h-4 shrink-0 text-[#0B0B0C] mt-0.5" />
                    <span>
                      <strong className="font-bold text-[#0B0B0C]">
                        B. Sc. Wirtschaftsinformatik
                      </strong>{" "}
                      (FOM Düsseldorf, 1,9) · Fokus auf Datenprodukte &amp; BI
                    </span>
                  </div>
                </div>
              </div>
            </RevealBlock>
          </div>
        </div>
      </section>

      {/* 5. KONTAKT */}
      <section
        ref={contactSectionRef}
        id="contact"
        className="bg-[#FFFFFF] py-20 sm:py-24 pb-32 sm:pb-28"
      >
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <ContactFlow reducedMotion={reducedMotion}>
            <div className="relative overflow-hidden rounded-3xl border border-[#E4E4E7] bg-[#0B0B0C] text-white min-h-[420px] sm:min-h-0 px-6 py-9 sm:p-12 flex flex-col justify-between md:flex-row md:items-center gap-9 sm:gap-8">
              <ContactMailWaveField
                sectionRef={contactSectionRef}
                email="malte_reppke@web.de"
                reducedMotion={reducedMotion}
              />

              <div className="relative z-10 max-w-xl">
                <HeadlineFlow
                  kicker="04 / Kontakt"
                  title="Lust auf Austausch zu Data & AI Engineering?"
                  as="h2"
                  titleClassName="mt-2.5 sm:mt-2 text-3xl sm:text-4xl font-bold tracking-[-0.035em] leading-[1.12] text-white"
                  reducedMotion={reducedMotion}
                />
                <p className="mt-4 sm:mt-3 text-sm sm:text-base text-white/75 leading-relaxed">
                  Schreib mir gerne direkt per E-Mail oder vernetze dich mit
                  mir.
                </p>
                <div className="mt-5 sm:mt-4 inline-flex items-center gap-2 text-xs font-mono text-white/70">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>Hilden / Deutschland · Data &amp; AI Engineering</span>
                </div>
              </div>

              <div className="relative z-10 flex flex-wrap items-center gap-3.5 sm:gap-3 pt-1 sm:pt-0">
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
                  href="https://github.com/malte-reppke"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-bold hover:bg-white/15 transition-colors"
                >
                  <GitBranch className="w-4 h-4" />
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://www.linkedin.com/in/malte-reppke"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-bold hover:bg-white/15 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </ContactFlow>
        </div>
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
