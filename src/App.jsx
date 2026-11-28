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
  ChevronDown,
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
  provinzial: "https://www.provinzial.de/suedwest/",
  vodafone: "https://www.vodafone.de/business",
  controlexpert: "https://www.controlexpert.com",
};

const BRAND_THEME = {
  provinzial: {
    color: "#007A6E",
  },
  vodafone: {
    color: "#E60000",
  },
  controlexpert: {
    color: "#3B8A98",
  },
};

const COMPANY_GROUPS = [
  {
    id: "provinzial",
    brand: "provinzial",
    company: "Provinzial Versicherung AG",
    industry: "Versicherung",
    period: "01.05.2025 – heute",
    roles: [
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
    ],
  },
  {
    id: "vodafone",
    brand: "vodafone",
    company: "Vodafone GmbH",
    industry: "Telekommunikation",
    period: "Nov 2022 – Mär 2025",
    roles: [
      {
        title: "Backend / Data Integration Firmenkunden",
        period: "Nov 2022 – Mär 2025",
        bullets: [
          "Entwicklung und Datenintegration für das Vodafone Firmenkundenportal sowie den Blog und über 200 Business-Websites",
          "Aufbau von Node.js-Microservices für Vertragsdaten und Ausbau der CI/CD-Automatisierung in Git-Pipelines",
        ],
      },
    ],
  },
  {
    id: "controlexpert",
    brand: "controlexpert",
    company: "ControlExpert GmbH",
    industry: "InsurTech & Automotive",
    period: "Jul 2012 – Aug 2022",
    roles: [
      {
        title: "Softwareentwickler Versicherungsbranche",
        period: "Jul 2019 – Aug 2022",
        bullets: [
          "Entwicklung Webapplikation zur digitalen Schadenaufnahme (React.js im Frontend & .NET C# im Backend)",
          "Agile nach Kanban & Design Thinking Ansätzen, Codequalität mit Jest & Cypress",
          "Bis Februar 2021 Tätigkeit Teilzeit neben Studium, danach in Vollzeit",
        ],
      },
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

/* DIRECT PDF GENERATOR (JSPDF) */
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
        subtitle: [226, 232, 240],
        meta: [148, 163, 184],
        heading: [203, 213, 225],
        role: [226, 232, 240],
        body: [216, 222, 233],
        muted: [148, 163, 184],
        rule: [56, 65, 92],
        accentBar: [148, 163, 184],
      }
    : {
        bg: [255, 255, 255],
        name: [24, 24, 27],
        subtitle: [39, 39, 42],
        meta: [113, 113, 122],
        heading: [82, 82, 91],
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
        doc.setTextColor(...palette.muted);
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

/* COLLAPSIBLE SUBTEXT BLOCK */
const CollapsibleSubtext = ({ open, children, className = "" }) => (
  <div
    className={`grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
    } ${className}`}
  >
    <div className="overflow-hidden min-h-0">{children}</div>
  </div>
);

/* HERO AVATAR */
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

    const pulseStart = window.setTimeout(() => setFocusPulseActive(true), 250);
    const pulseEnd = window.setTimeout(() => setFocusPulseActive(false), 2200);
    const bubbleStart = window.setTimeout(() => setIntroActive(true), 550);
    const bubbleEnd = window.setTimeout(() => setIntroActive(false), 4500);

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
          className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/70"
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
              <span className="ml-0.5 inline-block w-[1.5px] h-3.5 bg-[#0B0B0C] animate-pulse" />
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

/* CV SECTION AVATAR WITH HOVER SPEECH BUBBLE (MUTED EDITORIAL TINT) */
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
        className="relative inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-[#F2F4F9] hover:bg-[#E9ECF4] border border-[#D4DAE8] hover:border-[#94A3B8] text-[#1E2538] shadow-2xs transition-all duration-250 cursor-pointer group"
      >
        <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-white overflow-hidden border border-[#CBD5E1] group-hover:scale-105 transition-transform">
          <img
            src={avatarLogo}
            alt="Malte Reppke Avatar CV"
            className="w-full h-full object-cover object-top"
          />
        </span>
        <span className="text-xs sm:text-[13px] font-bold tracking-[-0.01em] text-[#1E2538] inline-flex items-center gap-1.5">
          <FileDown className="w-3.5 h-3.5 text-[#475569] group-hover:text-[#1E2538] transition-colors" />
          <span>CV als PDF</span>
        </span>
      </button>

      <div
        role="tooltip"
        className={`pointer-events-none absolute left-0 sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-2.5 z-30 w-[235px] sm:w-[255px] max-w-[calc(100vw-2rem)] px-3.5 py-2.5 rounded-2xl rounded-bl-xs bg-[#161922] text-white shadow-[0_12px_28px_-6px_rgba(11,11,12,0.32)] border border-white/15 ${
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
            <span className="ml-0.5 inline-block w-[1.5px] h-3.5 bg-white align-middle animate-pulse" />
          )}
        </p>
        <span
          aria-hidden="true"
          className="hidden sm:block absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-2.5 h-2.5 rotate-45 bg-[#161922] border-r border-b border-white/15"
        />
      </div>
    </div>
  );
};

/* MAC PREVIEW WINDOW FOR CV CUSTOMIZER */
const CvMacPdfPreviewWindow = ({ isDarkPdf, isEn, children }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between gap-2 px-1">
      <div className="inline-flex items-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full bg-[#0B0B0C] text-white text-[10px] font-bold uppercase tracking-[0.14em]">
          PDF Preview
        </span>
        <span className="text-xs font-semibold text-[#71717A]">
          {isEn
            ? "Live preview of the exported PDF document"
            : "Live-Vorschau des exportierten PDF-Dokuments"}
        </span>
      </div>
      <span className="text-[11px] font-mono text-[#71717A] hidden sm:inline">
        A4 · {isDarkPdf ? "Dark PDF" : "Light PDF"}
      </span>
    </div>

    <div className="rounded-2xl bg-[#18181B] p-2 sm:p-2.5 shadow-[0_16px_38px_-14px_rgba(11,11,12,0.25)] border border-[#27272A]">
      <div className="rounded-[12px] overflow-hidden">
        <div className="h-6 px-3 bg-[#F4F4F5] border-b border-[#E4E4E7] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono text-[#3F3F46] truncate">
            <span className="px-1.5 py-[1px] rounded bg-[#E4E4E7] text-[#0B0B0C] text-[9px] font-bold uppercase">
              PDF PREVIEW
            </span>
            <span>
              {isEn
                ? "Malte_Reppke_CV_Preview.pdf"
                : "Malte_Reppke_CV_Vorschau.pdf"}
            </span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] hidden sm:inline">
            Vorschau
          </span>
        </div>

        <div
          className={`max-h-[300px] sm:max-h-[560px] lg:max-h-[640px] overflow-y-auto p-5 sm:p-8 transition-colors duration-300 ${
            isDarkPdf
              ? "bg-[#0D0F14] text-[#F8FAFC]"
              : "bg-white text-[#18181B]"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  </div>
);

/* CV CUSTOMIZER */
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

  const [profileSubtextOpen, setProfileSubtextOpen] = useState(false);
  const [expandedRoleIds, setExpandedRoleIds] = useState(() => ({}));

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

  const toggleRoleSubtext = (id) => {
    setExpandedRoleIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allRolesExpanded =
    CV_POSITIONS.length > 0 &&
    CV_POSITIONS.every((p) => Boolean(expandedRoleIds[p.id]));

  const toggleAllRolesSubtext = () => {
    if (allRolesExpanded) {
      setExpandedRoleIds({});
    } else {
      const next = {};
      CV_POSITIONS.forEach((p) => {
        next[p.id] = true;
      });
      setExpandedRoleIds(next);
    }
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
    >
      <div className="w-full max-w-6xl rounded-[28px] bg-[#FBFBFD] border border-[#E4E4E7] shadow-2xl overflow-hidden my-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-7 py-4 bg-white border-b border-[#E4E4E7]">
          <div className="flex items-center gap-3">
            <img
              src={avatarLogo}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover object-top border border-[#E4E4E7]"
            />
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-[#71717A]">
                {isEn
                  ? "CV Customizing & PDF Export"
                  : "CV-Customizing & PDF-Export"}
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#0B0B0C]">
                {isEn
                  ? "Select language, theme, focus, roles & skills and export directly as PDF"
                  : "Sprache, Modus, Fokus, Stationen, Skills & Notiz wählen und direkt als PDF exportieren"}
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B0B0C] hover:bg-[#27272A] text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
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
                  <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#71717A] mb-2">
                    {isEn ? "Language" : "Sprache"}
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setLang("de");
                        setDownloadStatus("");
                      }}
                      className={`py-2 px-2.5 rounded-xl border text-xs sm:text-[13px] font-bold transition-colors cursor-pointer ${
                        !isEn
                          ? "bg-[#0B0B0C] text-white border-[#0B0B0C]"
                          : "bg-[#FAFAFA] text-[#0B0B0C] border-[#E4E4E7] hover:bg-[#F4F4F5]"
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
                      className={`py-2 px-2.5 rounded-xl border text-xs sm:text-[13px] font-bold transition-colors cursor-pointer ${
                        isEn
                          ? "bg-[#0B0B0C] text-white border-[#0B0B0C]"
                          : "bg-[#FAFAFA] text-[#0B0B0C] border-[#E4E4E7] hover:bg-[#F4F4F5]"
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#71717A] mb-2">
                    {isEn ? "PDF Theme" : "PDF-Modus"}
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setPdfTheme("light");
                        setDownloadStatus("");
                      }}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs sm:text-[13px] font-bold transition-colors cursor-pointer ${
                        !isDarkPdf
                          ? "bg-[#0B0B0C] text-white border-[#0B0B0C]"
                          : "bg-[#FAFAFA] text-[#0B0B0C] border-[#E4E4E7] hover:bg-[#F4F4F5]"
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
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs sm:text-[13px] font-bold transition-colors cursor-pointer ${
                        isDarkPdf
                          ? "bg-[#0B0B0C] text-white border-[#0B0B0C]"
                          : "bg-[#FAFAFA] text-[#0B0B0C] border-[#E4E4E7] hover:bg-[#F4F4F5]"
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Dark</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#71717A] mb-1.5">
                  {isEn ? "Focus" : "Fokus"}
                </label>
                <select
                  value={focusMode}
                  onChange={(e) => {
                    setFocusMode(e.target.value);
                    setDownloadStatus("");
                  }}
                  className="w-full rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] px-3 py-2 text-xs sm:text-[13px] font-bold text-[#0B0B0C]"
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
                    className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#71717A]"
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
                      className="text-xs font-semibold text-[#71717A] hover:text-[#0B0B0C] cursor-pointer"
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
                  className="w-full rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] px-3 py-2 text-xs sm:text-[13px] text-[#0B0B0C] placeholder:text-[#71717A] resize-y"
                />
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-[#E4E4E7] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#71717A]">
                  {isEn
                    ? "Include / Exclude Experience"
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
                  className="text-xs font-bold text-[#52525B] hover:text-[#0B0B0C] hover:underline cursor-pointer"
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
                    <label
                      key={pos.id}
                      className={`flex items-start justify-between gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                        checked
                          ? "bg-[#FAFAFA] border-[#E4E4E7] text-[#0B0B0C]"
                          : "bg-white border-[#F4F4F5] text-[#71717A] opacity-70"
                      }`}
                    >
                      <div>
                        <p className="text-xs sm:text-[13px] font-bold leading-snug">
                          {loc.role}
                        </p>
                        <p className="text-xs text-[#71717A] mt-0.5">
                          {loc.company} · {loc.period}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePosition(pos.id)}
                        className="mt-1 w-4 h-4 accent-[#0B0B0C] cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-[#E4E4E7] p-4 space-y-2.5">
              <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#71717A]">
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
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                        active
                          ? "bg-[#0B0B0C] text-white border-[#0B0B0C]"
                          : "bg-[#FAFAFA] text-[#71717A] border-[#E4E4E7] hover:text-[#0B0B0C]"
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
            <CvMacPdfPreviewWindow isDarkPdf={isDarkPdf} isEn={isEn}>
              <div
                className={`pb-4 border-b ${
                  isDarkPdf ? "border-slate-700/80" : "border-[#D4D4D8]"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                      isDarkPdf ? "text-slate-400" : "text-[#71717A]"
                    }`}
                  >
                    {isEn ? "PDF Document Preview" : "PDF-Dokumentvorschau"}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-[34px] font-bold tracking-[-0.035em] leading-tight">
                  Malte Reppke
                </h2>
                <p
                  className={`mt-1 text-xs sm:text-sm font-bold ${
                    isDarkPdf ? "text-slate-200" : "text-[#3F3F46]"
                  }`}
                >
                  Data Engineer &amp; AI Engineer
                </p>
                <p
                  className={`mt-1 text-xs ${
                    isDarkPdf ? "text-slate-400" : "text-[#71717A]"
                  }`}
                >
                  malte_reppke@web.de · github.com/malte-reppke ·{" "}
                  {isEn ? "Hilden, Germany" : "Hilden, Deutschland"}
                </p>
              </div>

              <div
                className={`py-4 border-b ${
                  isDarkPdf ? "border-slate-700/80" : "border-[#D4D4D8]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setProfileSubtextOpen((prev) => !prev)}
                  aria-expanded={profileSubtextOpen}
                  className="w-full flex items-center justify-between gap-2 text-left cursor-pointer group"
                >
                  <h3
                    className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
                      isDarkPdf ? "text-slate-300" : "text-[#71717A]"
                    }`}
                  >
                    {isEn ? "Executive Profile" : "Profil"}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold opacity-75 group-hover:opacity-100">
                    <span>
                      {profileSubtextOpen
                        ? isEn
                          ? "Hide"
                          : "Einklappen"
                        : isEn
                          ? "Expand"
                          : "Ausklappen"}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        profileSubtextOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>

                <CollapsibleSubtext open={profileSubtextOpen}>
                  <p
                    className={`pt-2 text-xs sm:text-sm leading-relaxed ${
                      isDarkPdf ? "text-slate-200" : "text-[#52525B]"
                    }`}
                  >
                    {summaryText}
                  </p>
                </CollapsibleSubtext>
              </div>

              <div
                className={`py-4 border-b ${
                  isDarkPdf ? "border-slate-700/80" : "border-[#D4D4D8]"
                }`}
              >
                <h3
                  className={`text-[11px] font-bold uppercase tracking-[0.16em] mb-2.5 ${
                    isDarkPdf ? "text-slate-300" : "text-[#71717A]"
                  }`}
                >
                  {isEn ? "Core Competencies" : "Kernkompetenzen"}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
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
                className={`py-4 border-b ${
                  isDarkPdf ? "border-slate-700/80" : "border-[#D4D4D8]"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3
                    className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
                      isDarkPdf ? "text-slate-300" : "text-[#71717A]"
                    }`}
                  >
                    {isEn ? "Professional Experience" : "Berufserfahrung"}
                  </h3>
                  <button
                    type="button"
                    onClick={toggleAllRolesSubtext}
                    className="text-xs font-semibold opacity-75 hover:opacity-100 cursor-pointer"
                  >
                    {allRolesExpanded
                      ? isEn
                        ? "Collapse all"
                        : "Alle einklappen"
                      : isEn
                        ? "Expand all"
                        : "Alle ausklappen"}
                  </button>
                </div>

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
                  <div className="divide-y divide-current/10">
                    {filteredPositions.map((pos) => {
                      const isSubOpen = Boolean(expandedRoleIds[pos.id]);
                      return (
                        <div
                          key={pos.id}
                          className="py-2.5 first:pt-0 last:pb-0"
                        >
                          <button
                            type="button"
                            onClick={() => toggleRoleSubtext(pos.id)}
                            aria-expanded={isSubOpen}
                            className="w-full text-left flex items-start justify-between gap-2 cursor-pointer group"
                          >
                            <div>
                              <p className="text-xs sm:text-sm font-bold">
                                {pos.company}
                              </p>
                              <p
                                className={`text-xs font-bold mt-0.5 ${
                                  isDarkPdf
                                    ? "text-slate-300"
                                    : "text-[#3F3F46]"
                                }`}
                              >
                                {pos.role}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className={`text-xs font-bold ${
                                  isDarkPdf
                                    ? "text-slate-400"
                                    : "text-[#71717A]"
                                }`}
                              >
                                {pos.period}
                              </span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                                  isSubOpen ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </button>

                          <CollapsibleSubtext open={isSubOpen}>
                            <p
                              className={`pt-1.5 text-xs leading-relaxed ${
                                isDarkPdf ? "text-slate-200" : "text-[#52525B]"
                              }`}
                            >
                              {pos.summary}
                            </p>
                          </CollapsibleSubtext>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div
                className={`pt-4 ${
                  hasNote ? "grid grid-cols-1 sm:grid-cols-2 gap-5" : ""
                }`}
              >
                <div>
                  <h3
                    className={`text-[11px] font-bold uppercase tracking-[0.16em] mb-2 ${
                      isDarkPdf ? "text-slate-300" : "text-[#71717A]"
                    }`}
                  >
                    {isEn ? "Education" : "Studium"}
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="font-bold">
                        {isEn
                          ? "M.Sc. Artificial Intelligence & Business Analytics"
                          : "M. Sc. KI und Business Analytics"}
                      </p>
                      <p
                        className={`text-[11px] ${
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
                        className={`text-[11px] ${
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
                      className={`text-[11px] font-bold uppercase tracking-[0.16em] mb-2 ${
                        isDarkPdf ? "text-slate-300" : "text-[#71717A]"
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
            </CvMacPdfPreviewWindow>
          </div>
        </div>
      </div>
    </div>
  );
};

/* BRAND WORDMARK */
const BrandWordmark = ({
  brand,
  inverted = false,
  href = null,
  stopPropagation = false,
}) => {
  const linkHref = href === false ? null : (href ?? BRAND_URLS[brand] ?? null);
  const colorClass = inverted ? "text-white" : "text-[#0B0B0C]";
  const hoverClass = linkHref
    ? inverted
      ? "hover:opacity-80 transition-opacity"
      : "hover:opacity-70 transition-opacity"
    : "";

  let content = null;

  if (brand === "provinzial") {
    content = (
      <span
        className={`inline-flex items-center gap-2 font-extrabold uppercase tracking-[0.06em] text-sm sm:text-base ${colorClass} ${hoverClass}`}
      >
        <span
          style={{ backgroundColor: BRAND_THEME.provinzial.color }}
          className="w-2.5 h-2.5 rounded-[2px] inline-block shrink-0"
        />
        <span>PROVINZIAL</span>
      </span>
    );
  } else if (brand === "vodafone") {
    content = (
      <span
        className={`inline-flex items-center gap-2 font-extrabold tracking-[-0.035em] text-base sm:text-lg ${colorClass} ${hoverClass}`}
      >
        <span
          style={{ borderColor: BRAND_THEME.vodafone.color }}
          className="w-4 h-4 rounded-full border-[2.5px] inline-flex items-center justify-center shrink-0"
        >
          <span
            style={{ backgroundColor: BRAND_THEME.vodafone.color }}
            className="w-1.5 h-1.5 rounded-full"
          />
        </span>
        <span>vodafone</span>
      </span>
    );
  } else {
    content = (
      <span
        className={`inline-flex items-center gap-2 font-extrabold uppercase tracking-[0.04em] text-sm sm:text-base ${colorClass} ${hoverClass}`}
      >
        <span
          style={{ backgroundColor: BRAND_THEME.controlexpert.color }}
          className="w-2.5 h-2.5 rotate-45 inline-block shrink-0"
        />
        <span>
          CONTROL
          <span
            style={{
              color: inverted ? "#E2E8F0" : BRAND_THEME.controlexpert.color,
            }}
          >
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

/* REALISTIC WEB & PRODUCT SCREENS IN MAC MONITOR */
const MacProjectMonitor = ({
  brand,
  previewImage,
  previewAlt,
  previewUrl,
  large = false,
  variant = "primary",
}) => {
  const brandStyle = BRAND_THEME[brand] || BRAND_THEME.provinzial;

  const renderScreenPreview = () => {
    if (previewImage) {
      return (
        <img
          src={previewImage}
          alt={previewAlt}
          className="w-full h-full object-cover object-top block"
        />
      );
    }

    /* 1. PROVINZIAL (Südwest / Customer Data & IT-DWH) */
    if (brand === "provinzial") {
      if (variant === "secondary-a") {
        return (
          <div className="w-full h-full bg-[#F7FAFA] flex flex-col justify-between text-[#0F172A] text-left select-none overflow-hidden">
            <div className="px-3.5 py-2 bg-white border-b border-[#E2ECEB] flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[8.5px] font-extrabold tracking-wider text-[#007A6E]">
                <span className="w-2 h-2 rounded-[2px] bg-[#007A6E]" />
                PROVINZIAL · SÜDWEST
              </span>
              <span className="text-[7px] font-semibold text-[#64748B]">
                Privatkunden · Service
              </span>
            </div>

            <div className="p-3.5 grid grid-cols-12 gap-2.5 items-center my-auto">
              <div className="col-span-7 space-y-1.5">
                <span className="inline-block px-2 py-0.5 rounded bg-[#007A6E] text-white text-[7px] font-bold uppercase tracking-wider">
                  Schutz &amp; Vorsorge
                </span>
                <p className="text-[11px] font-bold text-[#0F172A] leading-tight">
                  Immer da, immer nah – digital &amp; persönlich.
                </p>
                <p className="text-[7.5px] text-[#475569]">
                  Kundenkampagnen &amp; Qualtrics-Feedback im Südwest-Portal.
                </p>
              </div>
              <div className="col-span-5 rounded-xl bg-gradient-to-br from-[#007A6E] to-[#00574E] text-white p-2.5 space-y-1.5 shadow-xs">
                <p className="text-[7px] uppercase tracking-wider text-white/75 font-bold">
                  Qualtrics NPS
                </p>
                <p className="text-sm font-extrabold">78 %</p>
                <div className="h-1 rounded-full bg-white/25 overflow-hidden">
                  <div className="h-full w-[78%] bg-white rounded-full" />
                </div>
              </div>
            </div>

            <div className="px-3.5 py-1.5 bg-[#007A6E]/10 text-[7px] font-semibold text-[#007A6E] flex justify-between">
              <span>provinzial.de/suedwest</span>
              <span>Kundenportal</span>
            </div>
          </div>
        );
      }

      if (variant === "secondary-b") {
        return (
          <div className="w-full h-full bg-[#091514] text-white flex flex-col justify-between text-left select-none overflow-hidden">
            <div className="px-3.5 py-2 border-b border-white/10 flex items-center justify-between">
              <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-emerald-300">
                IT-DWH · Azure Synapse &amp; OpenCode
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[7px] font-mono">
                PROD
              </span>
            </div>

            <div className="p-3.5 my-auto space-y-2">
              <div className="rounded-lg bg-black/50 border border-white/10 p-2.5 font-mono text-[7.5px] leading-relaxed">
                <p className="text-emerald-400">
                  $ opencode pipeline --verify selection-hub
                </p>
                <p className="text-white/85 mt-0.5">
                  ✓ PySpark partitions &amp; schema checks passed
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[7.5px]">
                <div className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1.5">
                  <span className="text-white/60 block">Engine</span>
                  <span className="font-bold text-white">
                    PySpark / Synapse
                  </span>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1.5">
                  <span className="text-white/60 block">Workflow</span>
                  <span className="font-bold text-emerald-300">Agentic CI</span>
                </div>
              </div>
            </div>

            <div className="px-3.5 py-1.5 bg-white/5 text-[7px] text-white/60 flex justify-between">
              <span>Provinzial IT-DWH</span>
              <span>Data &amp; AI Engineering</span>
            </div>
          </div>
        );
      }

      return (
        <div className="w-full h-full bg-[#F5F9F8] flex flex-col justify-between text-left select-none overflow-hidden">
          <div className="px-3.5 sm:px-4 py-2 bg-white border-b border-[#DCEAE8] flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-extrabold tracking-[0.1em] uppercase text-[#007A6E]">
              <span className="w-2 h-2 rounded-[2px] bg-[#007A6E]" />
              PROVINZIAL{" "}
              <span className="font-semibold text-[#64748B]">SÜDWEST</span>
            </span>
            <div className="flex items-center gap-2 text-[7.5px] font-semibold text-[#475569]">
              <span className="hidden sm:inline">Versicherungen</span>
              <span className="px-2 py-0.5 rounded-full bg-[#007A6E] text-white font-bold">
                Mein Portal
              </span>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 grid grid-cols-12 gap-3 items-center my-auto">
            <div className="col-span-7 space-y-1.5">
              <span className="inline-block px-2 py-0.5 rounded bg-[#007A6E]/12 text-[#007A6E] text-[7.5px] font-bold uppercase tracking-wider">
                Customer Data Hub · IT-DWH
              </span>
              <p className="text-xs sm:text-[15px] font-extrabold text-[#0F172A] leading-[1.18] tracking-tight">
                Datenprodukte &amp; Kundenselektion auf Azure Synapse.
              </p>
              <p className="text-[8px] sm:text-[9px] text-[#475569] leading-snug">
                PySpark-Pipelines, Qualtrics-Kampagnen &amp; OpenCode
                AI-Workflows.
              </p>
              <div className="pt-1 flex items-center gap-1.5">
                <span className="inline-block px-2.5 py-1 rounded-full bg-[#007A6E] text-white text-[7.5px] font-bold">
                  Selektionsframework
                </span>
                <span className="inline-block px-2 py-1 rounded-full bg-white border border-[#CBD5E1] text-[#0F172A] text-[7.5px] font-bold">
                  PySpark
                </span>
              </div>
            </div>

            <div className="col-span-5 rounded-2xl bg-gradient-to-br from-[#007A6E] via-[#00665C] to-[#004D45] text-white p-3 space-y-2 shadow-sm">
              <div className="rounded-lg bg-white/12 backdrop-blur-xs px-2.5 py-1.5">
                <p className="text-[6.5px] uppercase tracking-wider text-white/75 font-bold">
                  Plattform
                </p>
                <p className="text-[10px] font-extrabold text-white">
                  Azure Synapse
                </p>
              </div>
              <div className="rounded-lg bg-white text-[#0F172A] px-2.5 py-1.5">
                <p className="text-[6.5px] uppercase tracking-wider text-[#007A6E] font-bold">
                  AI Engineering
                </p>
                <p className="text-[9.5px] font-extrabold">OpenCode · IT-DWH</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    /* 2. VODAFONE BUSINESS */
    if (brand === "vodafone") {
      if (variant === "secondary-a") {
        return (
          <div className="w-full h-full bg-[#1C0404] text-white flex flex-col justify-between text-left select-none overflow-hidden">
            <div className="px-3.5 py-2 border-b border-white/10 flex items-center justify-between text-[7.5px] font-bold">
              <span className="text-[#FF3B30] uppercase tracking-[0.14em]">
                Vertragsdaten · Node.js
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#E60000] text-white font-mono">
                99.98%
              </span>
            </div>
            <div className="p-3.5 my-auto space-y-2">
              <p className="text-[10.5px] font-bold text-white leading-snug">
                Echtzeit-API für Firmenkunden-Verträge
              </p>
              <div className="rounded-xl bg-white/8 border border-white/12 p-2.5 space-y-1 text-[7.5px]">
                <div className="flex justify-between">
                  <span className="text-white/75">Contract Microservice</span>
                  <span className="font-bold text-emerald-400">200 OK</span>
                </div>
                <div className="flex justify-between text-white/65">
                  <span>Git CI/CD Release</span>
                  <span>Automatisiert</span>
                </div>
              </div>
            </div>
            <div className="px-3.5 py-1.5 bg-black/40 text-[7px] text-white/60 flex justify-between">
              <span>vodafone.de/business</span>
              <span>API Gateway</span>
            </div>
          </div>
        );
      }

      if (variant === "secondary-b") {
        return (
          <div className="w-full h-full bg-[#240606] text-white flex flex-col justify-between text-left select-none overflow-hidden">
            <div className="px-3.5 py-2 border-b border-white/10 flex items-center justify-between">
              <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/85">
                PageForge · B2B CMS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#E60000] text-white text-[7px] font-bold">
                200+ Sites
              </span>
            </div>
            <div className="p-3.5 my-auto space-y-2">
              <div className="rounded-xl bg-white text-[#0F172A] p-2.5 shadow-xs">
                <p className="text-[9.5px] font-extrabold text-[#0F172A]">
                  Business-Websites &amp; Tech-Blog
                </p>
                <p className="text-[7.5px] text-[#475569] mt-0.5">
                  Skalierbare Landingpages &amp; Datenanbindung für
                  Geschäftskunden
                </p>
              </div>
            </div>
            <div className="px-3.5 py-1.5 bg-black/40 text-[7px] text-white/70 flex justify-between">
              <span>Firmenkundenportal</span>
              <span>Vodafone Business</span>
            </div>
          </div>
        );
      }

      return (
        <div
          style={{
            background:
              "radial-gradient(circle at 80% 35%, #5C0A0A 0%, #260404 55%, #140202 100%)",
          }}
          className="w-full h-full p-3.5 sm:p-4 flex flex-col justify-between text-left select-none text-white"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-[11px] font-extrabold tracking-tight text-white">
              <span className="w-3 h-3 rounded-full border-[2px] border-[#E60000] inline-flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-[#E60000]" />
              </span>
              vodafone{" "}
              <span className="text-white/65 font-medium">business</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-[7.5px] font-bold">
              200+ Sites
            </span>
          </div>

          <div className="grid grid-cols-12 gap-2.5 items-center my-auto">
            <div className="col-span-7 space-y-1.5">
              <span className="inline-block px-2 py-0.5 rounded bg-[#E60000] text-white text-[7px] font-extrabold uppercase tracking-wider">
                Firmenkunden-Tarife
              </span>
              <p className="text-xs sm:text-[15px] font-extrabold text-white leading-[1.16] tracking-tight">
                Red Business Prime &amp; Glasfaser für Unternehmen.
              </p>
              <p className="text-[7.5px] sm:text-[8.5px] text-white/75 leading-snug">
                Echtzeit-Vertragsdaten &amp; PageForge Landingpages.
              </p>
              <div className="pt-1">
                <span className="inline-block px-2.5 py-1 rounded-full bg-white text-[#0B0B0C] text-[7.5px] font-extrabold">
                  Tarife vergleichen
                </span>
              </div>
            </div>

            <div className="col-span-5 rounded-2xl bg-white/8 border border-white/12 p-2 space-y-1.5">
              <div className="rounded-xl bg-white/10 px-2.5 py-1.5">
                <p className="text-[6.5px] uppercase text-white/65 font-bold">
                  5G &amp; Daten
                </p>
                <p className="text-[10px] font-extrabold text-white">
                  Unlimited
                </p>
              </div>
              <div className="rounded-xl bg-[#E60000] px-2.5 py-1.5">
                <p className="text-[6.5px] uppercase text-white/85 font-bold">
                  API Status
                </p>
                <p className="text-[9.5px] font-extrabold text-white">
                  Node.js · 99.98%
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    /* 3. CONTROLEXPERT EASYCLAIM */
    if (variant === "secondary-a") {
      return (
        <div className="w-full h-full bg-[#4B96A3] text-white flex flex-col justify-between text-left select-none overflow-hidden">
          <div className="px-3.5 py-2 flex items-center justify-between">
            <span className="text-[8.5px] font-bold tracking-tight">
              Control<span className="font-extrabold">Expert</span>
            </span>
            <span className="text-[6.5px] font-extrabold uppercase tracking-wider text-[#0B0B0C]">
              HIGHLIGHTS · PRODUKTE
            </span>
          </div>
          <div className="px-3.5 my-auto text-center space-y-1">
            <p className="text-base sm:text-lg font-black tracking-tight uppercase leading-none">
              EASYCLAIM
            </p>
            <p className="text-[7px] font-extrabold uppercase tracking-wider text-white/95">
              Die smarte Art der Schadenabwicklung
            </p>
          </div>
          <div className="px-3.5 py-1.5 bg-black/15 text-[7px] font-semibold flex justify-between">
            <span>React.js · .NET C#</span>
            <span>Jest &amp; Cypress</span>
          </div>
        </div>
      );
    }

    if (variant === "secondary-b") {
      return (
        <div className="w-full h-full bg-[#F3F8F9] p-3.5 flex flex-col justify-between text-[#0F172A] text-left select-none">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#3B8A98]">
              Data Warehouse &amp; Tableau BI
            </span>
            <span className="text-[7px] font-mono text-[#3B8A98] font-bold">
              SQL · KPI
            </span>
          </div>
          <div className="my-auto flex items-end gap-1.5 h-12 px-1 pt-2">
            <div className="flex-1 bg-[#3B8A98]/35 h-[48%] rounded-t" />
            <div className="flex-1 bg-[#3B8A98]/60 h-[72%] rounded-t" />
            <div className="flex-1 bg-[#3B8A98]/85 h-[88%] rounded-t" />
            <div className="flex-1 bg-[#3B8A98] h-[100%] rounded-t" />
          </div>
          <p className="text-[7.5px] font-semibold text-[#334155]">
            Schaden-KPIs, SQL Reporting &amp; IBM BPM Prozessautomatisierung
          </p>
        </div>
      );
    }

    return (
      <div
        style={{
          background:
            "radial-gradient(circle at 65% 55%, #58A2AF 0%, #448D9A 60%, #397D8A 100%)",
        }}
        className="w-full h-full p-3.5 sm:p-4 flex flex-col justify-between text-left select-none text-white relative overflow-hidden"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 320 160"
          className="pointer-events-none absolute inset-0 w-full h-full opacity-25"
        >
          <g stroke="#0F2930" strokeWidth="0.8" fill="none">
            <line x1="20" y1="25" x2="115" y2="75" />
            <line x1="115" y1="75" x2="215" y2="45" />
            <line x1="215" y1="45" x2="295" y2="110" />
            <line x1="115" y1="75" x2="155" y2="145" />
            <line x1="155" y1="145" x2="295" y2="110" />
            <line x1="40" y1="130" x2="115" y2="75" />
          </g>
          <g fill="#0F2930">
            <circle cx="20" cy="25" r="2" />
            <circle cx="115" cy="75" r="2.5" />
            <circle cx="215" cy="45" r="2" />
            <circle cx="295" cy="110" r="2.5" />
            <circle cx="155" cy="145" r="2" />
            <circle cx="40" cy="130" r="2" />
          </g>
        </svg>

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-[11px] sm:text-[13px] font-semibold tracking-tight text-white leading-none">
              Control<span className="font-extrabold">Expert</span>
            </p>
            <p className="text-[6px] text-white/85 font-medium mt-0.5">
              a solvd group company
            </p>
          </div>

          <div className="flex items-center gap-2 text-[6.5px] sm:text-[7px] font-extrabold uppercase tracking-wider text-[#0B0B0C]">
            <span>HIGHLIGHTS</span>
            <span>PRODUKTE</span>
            <span className="hidden sm:inline">KARRIERE</span>
          </div>
        </div>

        <div className="relative z-10 my-auto text-center px-2 pt-2">
          <p className="text-xl sm:text-[26px] font-black tracking-[-0.02em] text-white uppercase leading-none drop-shadow-2xs">
            EASYCLAIM
          </p>
          <p className="mt-1.5 text-[7.5px] sm:text-[9px] font-extrabold uppercase tracking-[0.06em] text-white">
            Die smarte Art der Schadenabwicklung
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[7px] font-bold text-white/90">
          <span>React.js · .NET C#</span>
          <span>DWH · Tableau BI</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div
        style={{ borderColor: `${brandStyle.color}40` }}
        className={`rounded-2xl bg-[#18181B] ${
          large ? "p-2 sm:p-2.5" : "p-[5px]"
        } shadow-[0_14px_30px_-12px_rgba(11,11,12,0.22)] border`}
      >
        <div className="rounded-[10px] overflow-hidden bg-white">
          <div
            className={`${
              large ? "h-5 px-3" : "h-4 px-2"
            } bg-[#F4F4F5] border-b border-[#E4E4E7] flex items-center justify-between gap-1.5`}
          >
            <div className="flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            </div>
            <span
              className={`px-2 py-[1px] rounded bg-white border border-[#E4E4E7] ${
                large
                  ? "text-[7.5px] max-w-[235px]"
                  : "text-[6.5px] max-w-[165px]"
              } font-mono text-[#52525B] truncate`}
            >
              {previewUrl}
            </span>
            <span className="w-4 shrink-0" />
          </div>

          <div
            className={`${
              large ? "aspect-[16/8.6]" : "aspect-[16/9.4]"
            } w-full overflow-hidden`}
          >
            {renderScreenPreview()}
          </div>
        </div>
      </div>

      <div
        className={`mx-auto ${
          large ? "w-14 h-2" : "w-10 h-1.5"
        } bg-gradient-to-b from-[#D4D4D8] to-[#E4E4E7] rounded-b-xs`}
      />
      <div
        className={`mx-auto ${
          large ? "w-24 h-1" : "w-16 h-[3px]"
        } bg-[#D4D4D8] rounded-full`}
      />
    </div>
  );
};

/* SKILL PILL / TILE ITEM (WITH SUBTLE HERO-INSPIRED VIOLET HOVER ACCENT) */
const SkillPillItem = ({
  item,
  idx,
  chained,
  projectWaveActive = false,
  isOpen,
  onToggle,
  onOpen,
  onClose,
  reducedMotion,
  tileGrid = false,
  accentColor = null,
}) => {
  const label = typeof item === "string" ? item : item.label;
  const role = typeof item === "string" ? "Tech Stack" : item.role;
  const projects = typeof item === "string" ? "" : item.projects;
  const delayMs = reducedMotion ? 0 : idx * 45;
  const waveDelayMs = reducedMotion ? 0 : idx * 38;

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

  const baseTransform =
    reducedMotion || chained
      ? projectWaveActive && !isOpen
        ? "translate3d(0, -3px, 0) scale(1.02)"
        : "translate3d(0, 0, 0)"
      : "translate3d(-10px, 6px, 0)";

  const hasCustomAccent = Boolean(accentColor);

  return (
    <div
      ref={pillRef}
      style={{
        transitionDelay: `${projectWaveActive ? waveDelayMs : delayMs}ms`,
        transform: baseTransform,
      }}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={onClose}
      className={`relative ${tileGrid ? "flex" : "inline-flex"} ${
        isOpen ? "z-30" : "z-10"
      } ${
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
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        style={
          hasCustomAccent
            ? isOpen
              ? { backgroundColor: accentColor, borderColor: accentColor }
              : projectWaveActive
                ? { borderColor: accentColor }
                : undefined
            : isOpen && tileGrid
              ? {
                  backgroundImage:
                    "linear-gradient(135deg, #0B0B0C 0%, #1E1638 62%, #4C2A85 100%)",
                  borderColor: "#7C3AED",
                }
              : undefined
        }
        className={`${
          tileGrid
            ? "w-full min-h-[54px] px-3.5 py-2.5 rounded-2xl flex flex-col items-start justify-center text-left"
            : "px-3.5 py-1.5 rounded-full inline-flex items-center"
        } border text-xs sm:text-[13px] font-bold tracking-tight select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] ${
          isOpen
            ? "bg-[#0B0B0C] text-white border-[#7C3AED] -translate-y-0.5 shadow-[0_12px_26px_-10px_rgba(124,58,237,0.38)]"
            : projectWaveActive
              ? "text-[#0B0B0C] bg-white shadow-xs"
              : tileGrid
                ? "text-[#0B0B0C] border-[#E4E4E7] bg-white hover:border-[#8B5CF6]/55 hover:bg-[#FAF7FF] hover:-translate-y-0.5 shadow-2xs"
                : "text-[#0B0B0C] border-[#E4E4E7] bg-white hover:border-[#8B5CF6]/55 hover:bg-[#FAF7FF] hover:-translate-y-0.5 shadow-2xs"
        } ${
          reducedMotion
            ? ""
            : "transition-[color,background-color,border-color,transform,box-shadow] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]"
        }`}
      >
        <span className="leading-snug">{label}</span>
        {tileGrid && (
          <span
            className={`mt-0.5 text-[10px] font-semibold tracking-wide ${
              isOpen ? "text-[#E9D5FF]" : "text-[#71717A]"
            }`}
          >
            {role}
          </span>
        )}
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
        className={`pointer-events-none absolute left-1/2 bottom-full mb-2.5 w-[min(17rem,calc(100vw-2.5rem))] sm:w-72 rounded-2xl rounded-bl-xs bg-white text-[#0B0B0C] border ${
          hasCustomAccent ? "border-[#E4E4E7]" : "border-[#DDD6FE]"
        } shadow-[0_16px_34px_-10px_rgba(91,44,130,0.22)] p-3.5 text-left ${
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
          <span
            style={accentColor ? { color: accentColor } : undefined}
            className={`text-[11px] font-bold uppercase tracking-[0.12em] ${
              accentColor ? "" : "text-[#6D28D9]"
            }`}
          >
            {role}
          </span>
          <span className="text-[10px] font-mono font-semibold text-[#71717A] shrink-0">
            {label}
          </span>
        </div>

        {projects && (
          <p className="mt-1.5 text-xs sm:text-[13px] text-[#27272A] leading-relaxed font-medium">
            {projects}
          </p>
        )}

        <span
          aria-hidden="true"
          style={{ left: `${arrowPercent}%` }}
          className={`absolute -translate-x-1/2 -bottom-1.5 w-2.5 h-2.5 rotate-45 bg-white border-r border-b ${
            hasCustomAccent ? "border-[#E4E4E7]" : "border-[#DDD6FE]"
          }`}
        />
      </div>
    </div>
  );
};

const SkillChainList = ({
  skills,
  projectWaveActive = false,
  reducedMotion = false,
  centered = false,
  tileGrid = false,
  accentColor = null,
}) => {
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
    <div
      ref={containerRef}
      className={
        tileGrid
          ? "grid grid-cols-1 sm:grid-cols-2 gap-2.5"
          : `flex flex-wrap gap-2 ${centered ? "justify-center" : ""}`
      }
    >
      {skills.map((item, idx) => {
        const label = typeof item === "string" ? item : item.label;
        return (
          <SkillPillItem
            key={label}
            item={item}
            idx={idx}
            chained={chained}
            projectWaveActive={projectWaveActive}
            isOpen={activeSkillLabel === label}
            onOpen={() => setActiveSkillLabel(label)}
            onClose={() =>
              setActiveSkillLabel((prev) => (prev === label ? null : prev))
            }
            onToggle={() =>
              setActiveSkillLabel((prev) => (prev === label ? null : label))
            }
            reducedMotion={reducedMotion}
            tileGrid={tileGrid}
            accentColor={accentColor}
          />
        );
      })}
    </div>
  );
};

/* MODERN COLLAPSIBLE COMPANY CARD FOR CV SECTION */
const CollapsibleCompanyCard = ({
  group,
  isOpen,
  onToggle,
  reducedMotion = false,
}) => {
  const theme = BRAND_THEME[group.brand] || BRAND_THEME.provinzial;

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 ${
        isOpen
          ? "bg-white border-[#C7CCD4] shadow-sm"
          : "bg-[#FAFAFA] border-[#E4E4E7] hover:border-[#C7CCD4] hover:bg-white"
      }`}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="w-full px-5 sm:px-7 py-5 sm:py-6 flex items-center justify-between gap-4 text-left cursor-pointer group"
      >
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <BrandWordmark brand={group.brand} href={false} />
            <span
              style={{
                color: theme.color,
                backgroundColor: `${theme.color}12`,
                borderColor: `${theme.color}28`,
              }}
              className="px-2.5 py-0.5 rounded-full border text-xs font-bold"
            >
              {group.industry}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[#71717A] font-medium">
            <span className="font-mono font-semibold text-[#52525B]">
              {group.period}
            </span>
            <span>·</span>
            <span>
              {group.roles.length}{" "}
              {group.roles.length === 1 ? "Position" : "Positionen"}
            </span>
          </div>
        </div>

        <span
          className={`w-9 h-9 rounded-full border border-[#E4E4E7] bg-white group-hover:border-[#0B0B0C] flex items-center justify-center text-[#0B0B0C] shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      <div
        className={`grid ${
          reducedMotion
            ? isOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
            : "transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] " +
              (isOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0")
        }`}
      >
        <div className="overflow-hidden min-h-0">
          <div className="px-5 sm:px-7 pb-6 sm:pb-7 pt-2 border-t border-[#ECEEF2] space-y-4">
            {group.roles.map((roleItem) => (
              <div
                key={roleItem.title}
                className="rounded-2xl bg-[#FBFBFD] border border-[#ECEEF2] p-4 sm:p-5 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
                  <h3 className="text-sm sm:text-base font-bold tracking-[-0.02em] text-[#0B0B0C]">
                    {roleItem.title}
                  </h3>
                  <span className="text-xs font-mono font-semibold text-[#71717A] shrink-0">
                    {roleItem.period}
                  </span>
                </div>

                <ul className="pl-4 space-y-1.5 text-xs sm:text-[13.5px] text-[#52525B] leading-relaxed">
                  {roleItem.bullets.map((bullet) => (
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

/* BLUE-MARBLE NODE-MESH */
const HeroAlignedMeshParallax = ({
  sectionRef,
  reducedMotion = false,
  isMobileView = false,
}) => {
  const canvasRef = useRef(null);
  const scrollProgressRef = useRef(0.5);

  useEffect(() => {
    if (reducedMotion) {
      scrollProgressRef.current = 0.5;
      return;
    }

    let rafId = null;

    const updateScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        const sec = sectionRef?.current;
        if (sec) {
          const rect = sec.getBoundingClientRect();
          const vh = window.innerHeight || 1;
          const total = rect.height + vh;
          scrollProgressRef.current = clamp01(
            (vh - rect.top) / Math.max(total, 1),
          );
        }
        rafId = null;
      });
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    updateScroll();

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
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

    const nodes = [
      {
        nx: -0.02,
        ny: 0.04,
        depth: 0.85,
        phase: 0.3,
        r: 5.0,
        tint: "ice",
        alphaSpeed: 0.9,
      },
      {
        nx: 0.16,
        ny: 0.14,
        depth: 1.15,
        phase: 1.2,
        r: 6.0,
        tint: "cobalt",
        alphaSpeed: 1.2,
      },
      {
        nx: 0.33,
        ny: 0.05,
        depth: 0.75,
        phase: 2.1,
        r: 4.5,
        tint: "slateBlue",
        alphaSpeed: 0.8,
      },
      {
        nx: 0.5,
        ny: 0.13,
        depth: 1.1,
        phase: 2.9,
        r: 5.8,
        tint: "periwinkle",
        alphaSpeed: 1.1,
      },
      {
        nx: 0.68,
        ny: 0.06,
        depth: 0.9,
        phase: 3.7,
        r: 4.8,
        tint: "ice",
        alphaSpeed: 0.95,
      },
      {
        nx: 0.85,
        ny: 0.14,
        depth: 1.2,
        phase: 4.4,
        r: 6.2,
        tint: "midnight",
        alphaSpeed: 1.2,
      },
      {
        nx: 1.02,
        ny: 0.05,
        depth: 0.8,
        phase: 5.1,
        r: 5.0,
        tint: "cobalt",
        alphaSpeed: 0.85,
      },

      {
        nx: -0.03,
        ny: 0.34,
        depth: 1.15,
        phase: 0.8,
        r: 5.6,
        tint: "cobalt",
        alphaSpeed: 1.15,
      },
      {
        nx: 0.18,
        ny: 0.44,
        depth: 0.82,
        phase: 1.6,
        r: 4.7,
        tint: "periwinkle",
        alphaSpeed: 0.8,
      },
      {
        nx: 0.38,
        ny: 0.33,
        depth: 1.12,
        phase: 2.4,
        r: 6.0,
        tint: "ice",
        alphaSpeed: 1.3,
      },
      {
        nx: 0.58,
        ny: 0.46,
        depth: 0.92,
        phase: 3.2,
        r: 5.0,
        tint: "slateBlue",
        alphaSpeed: 0.9,
      },
      {
        nx: 0.78,
        ny: 0.35,
        depth: 1.18,
        phase: 4.0,
        r: 6.0,
        tint: "cobalt",
        alphaSpeed: 1.1,
      },
      {
        nx: 1.03,
        ny: 0.43,
        depth: 1.08,
        phase: 5.4,
        r: 5.2,
        tint: "midnight",
        alphaSpeed: 0.8,
      },

      {
        nx: -0.02,
        ny: 0.66,
        depth: 0.95,
        phase: 1.0,
        r: 5.0,
        tint: "periwinkle",
        alphaSpeed: 1.1,
      },
      {
        nx: 0.19,
        ny: 0.76,
        depth: 1.18,
        phase: 1.9,
        r: 6.0,
        tint: "midnight",
        alphaSpeed: 0.9,
      },
      {
        nx: 0.4,
        ny: 0.65,
        depth: 0.8,
        phase: 2.7,
        r: 4.6,
        tint: "cobalt",
        alphaSpeed: 1.2,
      },
      {
        nx: 0.61,
        ny: 0.77,
        depth: 1.1,
        phase: 3.5,
        r: 5.8,
        tint: "ice",
        alphaSpeed: 1.0,
      },
      {
        nx: 0.82,
        ny: 0.67,
        depth: 0.86,
        phase: 4.3,
        r: 5.0,
        tint: "slateBlue",
        alphaSpeed: 1.25,
      },
      {
        nx: 1.02,
        ny: 0.75,
        depth: 0.85,
        phase: 5.7,
        r: 4.8,
        tint: "periwinkle",
        alphaSpeed: 1.15,
      },

      {
        nx: 0.08,
        ny: 0.96,
        depth: 1.05,
        phase: 1.4,
        r: 5.0,
        tint: "cobalt",
        alphaSpeed: 1.05,
      },
      {
        nx: 0.32,
        ny: 0.95,
        depth: 0.82,
        phase: 2.2,
        r: 4.5,
        tint: "ice",
        alphaSpeed: 1.2,
      },
      {
        nx: 0.56,
        ny: 0.96,
        depth: 1.08,
        phase: 3.0,
        r: 5.3,
        tint: "slateBlue",
        alphaSpeed: 0.85,
      },
      {
        nx: 0.8,
        ny: 0.95,
        depth: 0.88,
        phase: 3.8,
        r: 4.9,
        tint: "periwinkle",
        alphaSpeed: 1.15,
      },
      {
        nx: 0.98,
        ny: 0.94,
        depth: 1.02,
        phase: 4.6,
        r: 4.7,
        tint: "cobalt",
        alphaSpeed: 1.0,
      },
    ];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = Math.max(1, parent.clientWidth);
      height = Math.max(1, parent.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const getPalette = (tint) => {
      if (tint === "cobalt") {
        return {
          core: "rgba(29, 78, 216, 0.90)",
          glow: "rgba(37, 99, 235, 0.30)",
          line: "rgba(29, 78, 216, 0.58)",
          halo: "rgba(59, 130, 246, 0.18)",
        };
      }
      if (tint === "ice") {
        return {
          core: "rgba(2, 132, 199, 0.90)",
          glow: "rgba(125, 211, 252, 0.34)",
          line: "rgba(14, 165, 233, 0.54)",
          halo: "rgba(186, 230, 253, 0.20)",
        };
      }
      if (tint === "midnight") {
        return {
          core: "rgba(15, 23, 42, 0.90)",
          glow: "rgba(30, 58, 138, 0.26)",
          line: "rgba(30, 58, 138, 0.54)",
          halo: "rgba(59, 130, 246, 0.14)",
        };
      }
      if (tint === "periwinkle") {
        return {
          core: "rgba(79, 70, 229, 0.86)",
          glow: "rgba(165, 180, 252, 0.32)",
          line: "rgba(99, 102, 241, 0.54)",
          halo: "rgba(199, 210, 254, 0.18)",
        };
      }
      return {
        core: "rgba(30, 64, 175, 0.88)",
        glow: "rgba(147, 197, 253, 0.30)",
        line: "rgba(59, 130, 246, 0.54)",
        halo: "rgba(147, 197, 253, 0.16)",
      };
    };

    const drawFrame = (nowMs) => {
      const t = reducedMotion ? 1.0 : nowMs * 0.001;
      const p = scrollProgressRef.current - 0.5;
      ctx.clearRect(0, 0, width, height);

      const linkThreshold = Math.min(340, Math.max(210, width * 0.3));
      const motionScale = isMobileView ? 0.75 : 1;

      const pts = nodes.map((n) => {
        const parallaxY = reducedMotion ? 0 : -p * 44 * n.depth * motionScale;
        const parallaxX = reducedMotion
          ? 0
          : p * 24 * (n.depth - 0.82) * motionScale;
        const driftX = reducedMotion
          ? 0
          : Math.sin(t * (0.5 + n.alphaSpeed * 0.16) + n.phase) *
            16 *
            motionScale;
        const driftY = reducedMotion
          ? 0
          : Math.cos(t * (0.45 + n.alphaSpeed * 0.14) + n.phase * 1.25) *
            12 *
            motionScale;
        const pulse = reducedMotion
          ? 1
          : 0.86 + 0.24 * Math.sin(t * (1.05 + n.alphaSpeed * 0.4) + n.phase);
        const nodeAlpha = reducedMotion
          ? 0.85
          : 0.52 +
            0.44 *
              (0.5 + 0.5 * Math.sin(t * (0.8 + n.alphaSpeed * 0.5) + n.phase));

        const rawX = n.nx * width + parallaxX + driftX;
        const rawY = n.ny * height + parallaxY + driftY;

        return {
          x: Math.min(Math.max(rawX, -24), width + 24),
          y: Math.min(Math.max(rawY, -24), height + 24),
          r: isMobileView ? n.r * 0.92 : n.r,
          pulse,
          nodeAlpha,
          phase: n.phase,
          tint: n.tint,
        };
      });

      for (let i = 0; i < pts.length; i += 1) {
        for (let j = i + 1; j < pts.length; j += 1) {
          const dx = pts[j].x - pts[i].x;
          const dy = pts[j].y - pts[i].y;
          const dist = Math.hypot(dx, dy);

          if (dist < linkThreshold) {
            const proximity = Math.pow(1 - dist / linkThreshold, 0.72);
            const edgeWave = reducedMotion
              ? 0.8
              : 0.3 +
                0.7 *
                  (0.5 +
                    0.5 *
                      Math.sin(
                        t * (0.7 + ((i + j) % 4) * 0.2) +
                          (pts[i].phase + pts[j].phase) * 0.5,
                      ));

            const combinedAlpha = Math.min(
              0.92,
              (0.16 + proximity * 0.72) * edgeWave,
            );
            const palA = getPalette(pts[i].tint);
            const palB = getPalette(pts[j].tint);

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = palA.halo;
            ctx.globalAlpha = combinedAlpha * 0.65;
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.restore();

            const grad = ctx.createLinearGradient(
              pts[i].x,
              pts[i].y,
              pts[j].x,
              pts[j].y,
            );
            grad.addColorStop(0, palA.line);
            grad.addColorStop(1, palB.line);

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = grad;
            ctx.globalAlpha = combinedAlpha;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      pts.forEach((pt) => {
        const pal = getPalette(pt.tint);
        const outerR = pt.r * 3.4 * pt.pulse;

        ctx.save();
        ctx.globalAlpha = pt.nodeAlpha;

        const glowGrad = ctx.createRadialGradient(
          pt.x,
          pt.y,
          0.5,
          pt.x,
          pt.y,
          outerR,
        );
        glowGrad.addColorStop(0, pal.glow);
        glowGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, outerR, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r * (0.94 + 0.12 * pt.pulse), 0, Math.PI * 2);
        ctx.fillStyle = pal.core;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(1.7, pt.r * 0.42), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
        ctx.fill();

        ctx.restore();
      });

      if (!reducedMotion) {
        frameId = window.requestAnimationFrame(drawFrame);
      }
    };

    drawFrame(performance.now());

    return () => {
      window.removeEventListener("resize", resize);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [reducedMotion, isMobileView]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-3 -inset-y-5 sm:-inset-x-4 sm:-inset-y-6 overflow-hidden select-none z-0"
    >
      <div
        style={{
          background:
            "linear-gradient(165deg, #EEF3FA 0%, #E7EEF8 52%, #ECEEF8 100%)",
        }}
        className="absolute inset-0"
      />
      <div
        style={{
          background:
            "radial-gradient(ellipse 84% 72% at 15% 20%, rgba(37, 99, 235, 0.15) 0%, rgba(125, 211, 252, 0.08) 58%, transparent 88%)",
        }}
        className="absolute inset-0"
      />
      <div
        style={{
          background:
            "radial-gradient(ellipse 82% 70% at 86% 78%, rgba(30, 58, 138, 0.13) 0%, rgba(165, 180, 252, 0.09) 60%, transparent 88%)",
        }}
        className="absolute inset-0"
      />
      <canvas ref={canvasRef} className="relative z-10 w-full h-full block" />
      <div
        style={{
          background:
            "linear-gradient(to bottom, #FFFFFF 0%, rgba(255, 255, 255, 0.48) 55%, rgba(255, 255, 255, 0) 100%)",
        }}
        className="pointer-events-none absolute inset-x-0 top-0 h-10 sm:h-16 z-20"
      />
      <div
        style={{
          background:
            "linear-gradient(to top, #FBFBFD 0%, rgba(251, 251, 253, 0.48) 55%, rgba(251, 251, 253, 0) 100%)",
        }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 sm:h-16 z-20"
      />
    </div>
  );
};

const AppleLiquidCard = ({
  children,
  variant = "dark",
  className = "",
  isMobileView = false,
}) => {
  const cardRef = useRef(null);
  const [inViewMobile, setInViewMobile] = useState(false);
  const isDark = variant === "dark";

  useEffect(() => {
    if (!isMobileView || isDark) {
      setInViewMobile(false);
      return;
    }

    const node = cardRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInViewMobile(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInViewMobile(entry.isIntersecting);
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isMobileView, isDark]);

  const mobileWhiteActive = !isDark && isMobileView && inViewMobile;

  return (
    <div
      ref={cardRef}
      style={{
        boxShadow: isDark
          ? "0 22px 48px -18px rgba(11, 11, 12, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.18)"
          : mobileWhiteActive
            ? "0 20px 42px -16px rgba(15, 23, 42, 0.14), 0 2px 6px -1px rgba(15, 23, 42, 0.05), inset 0 1.5px 0 rgba(255, 255, 255, 1)"
            : "0 18px 38px -16px rgba(15, 23, 42, 0.12), 0 2px 6px -1px rgba(15, 23, 42, 0.04), inset 0 1.5px 0 rgba(255, 255, 255, 1)",
      }}
      className={`group relative overflow-hidden rounded-[28px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 ${
        isDark
          ? "bg-[#0B0B0C] border border-white/14 text-white hover:border-white/24"
          : mobileWhiteActive
            ? "bg-white border border-white text-[#0B0B0C]"
            : "bg-white/92 backdrop-blur-xl border border-white/90 text-[#0B0B0C] hover:bg-white hover:border-white"
      } ${className}`}
    >
      <div
        aria-hidden="true"
        style={{
          background: isDark
            ? "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.28) 50%, transparent 100%)"
            : mobileWhiteActive
              ? "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 1) 50%, transparent 100%)"
              : "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.85) 50%, transparent 100%)",
        }}
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] transition-opacity duration-700"
      />

      <div
        aria-hidden="true"
        style={{
          background: isDark
            ? "radial-gradient(circle at 88% 14%, rgba(255, 255, 255, 0.09) 0%, transparent 55%)"
            : mobileWhiteActive
              ? "radial-gradient(circle at 88% 12%, rgba(255, 255, 255, 0.95) 0%, transparent 65%)"
              : "radial-gradient(circle at 88% 12%, rgba(255, 255, 255, 0.72) 0%, transparent 65%)",
        }}
        className="pointer-events-none absolute inset-0 transition-opacity duration-700 group-hover:opacity-100 opacity-85"
      />

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

/* SUBTLE FLYING EMAILS & PHONES (NO LINES) */
const ContactMailWaveField = ({
  sectionRef,
  email = "malte_reppke@web.de",
  reducedMotion = false,
  pullProgress = 1,
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

    const eased = easeOutCubic(clamp01(pullProgress));
    scrollReadyRef.current = eased;
    setIsFieldReady(eased >= 0.42);
  }, [pullProgress, reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId = null;
    let width = 0;
    let height = 0;

    const createArtifacts = () => {
      const count = isTouchDevice ? 16 : 30;
      return Array.from({ length: count }, (_, idx) => ({
        id: idx,
        nx: ((idx * 37) % 90) / 100 + 0.05,
        ny: ((idx * 53) % 84) / 100 + 0.08,
        vx: ((idx % 5) - 2) * 0.00009 || 0.00006,
        phase: idx * 0.72,
        stagger: (idx % 10) * 0.045,
        scale: 0.9 + (idx % 3) * 0.14,
        kind: idx % 2 === 0 ? "mail" : "phone",
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
      ctx.scale(s * (highlight ? 1.2 : 1), s * (highlight ? 1.2 : 1));
      ctx.strokeStyle = highlight
        ? "rgba(255, 255, 255, 0.92)"
        : `rgba(255, 255, 255, ${Math.min(0.45, alpha)})`;
      ctx.lineWidth = highlight ? 1.5 : 1.15;
      ctx.lineJoin = "round";

      const w = 14;
      const h = 9.5;
      ctx.strokeRect(-w / 2, -h / 2, w, h);

      ctx.beginPath();
      ctx.moveTo(-w / 2, -h / 2);
      ctx.lineTo(0, 1);
      ctx.lineTo(w / 2, -h / 2);
      ctx.stroke();

      ctx.restore();
    };

    const drawSmartphone = (x, y, s, alpha, highlight) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.12);
      ctx.scale(s * (highlight ? 1.2 : 1), s * (highlight ? 1.2 : 1));
      ctx.strokeStyle = highlight
        ? "rgba(255, 255, 255, 0.92)"
        : `rgba(255, 255, 255, ${Math.min(0.42, alpha)})`;
      ctx.lineWidth = highlight ? 1.5 : 1.15;
      ctx.lineJoin = "round";

      const w = 9.5;
      const h = 16;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-2, -h / 2 + 2.2);
      ctx.lineTo(2, -h / 2 + 2.2);
      ctx.moveTo(-2.2, h / 2 - 2.2);
      ctx.lineTo(2.2, h / 2 - 2.2);
      ctx.stroke();

      ctx.restore();
    };

    const renderFrame = (nowMs) => {
      const t = reducedMotion ? 1.2 : nowMs * 0.001;
      const readyGlobal = scrollReadyRef.current;
      ctx.clearRect(0, 0, width, height);

      let closest = null;
      let minDist = 64;

      artifacts.forEach((item) => {
        if (!reducedMotion && readyGlobal > 0.1) {
          item.nx += item.vx * (0.4 + readyGlobal * 0.7);
          if (item.nx > 0.96) item.nx = 0.04;
          if (item.nx < 0.04) item.nx = 0.96;
        }

        const itemProgress = easeOutCubic(
          clamp01(
            (readyGlobal - item.stagger) / Math.max(1 - item.stagger, 0.25),
          ),
        );

        const targetX = item.nx * width;
        const targetY =
          item.ny * height +
          Math.sin(t * 0.85 + item.phase) * (5 + itemProgress * 7);

        const startX = targetX - (130 + (item.id % 4) * 26);
        const startY = targetY + (85 + (item.id % 3) * 20);

        item.x = startX + (targetX - startX) * itemProgress;
        item.y = startY + (targetY - startY) * itemProgress;

        const canInteract = !isTouchDevice && readyGlobal >= 0.55;
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
          canInteract && pointerRef.current.active && dist < 80 && dist > 0.01
            ? ((80 - dist) / 80) * 10
            : 0;
        const drawX = item.x + (dist > 0.01 ? (dx / dist) * repel : 0);
        const drawY = item.y + (dist > 0.01 ? (dy / dist) * repel : 0);

        const isPicked = canInteract && closest && closest.id === item.id;
        const visibilityFactor = 0.35 + itemProgress * 0.65;
        const baseAlpha = (isTouchDevice ? 0.22 : 0.28) * visibilityFactor;

        if (item.kind === "phone") {
          drawSmartphone(drawX, drawY, item.scale, baseAlpha, isPicked);
        } else {
          drawEnvelope(drawX, drawY, item.scale, baseAlpha, isPicked);
        }
      });

      if (!isTouchDevice && readyGlobal >= 0.55) {
        pickedRef.current = closest;
        setPickedHint((prev) => {
          if (!closest) return null;
          const next = {
            x: Math.min(Math.max(closest.x, 100), width - 100),
            y: Math.max(closest.y - 20, 28),
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
  }, [email, isTouchDevice, reducedMotion, sectionRef]);

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
      className={`absolute inset-0 z-0 overflow-hidden transition-opacity duration-500 ${
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
        className="w-full h-full block"
      />

      {!isTouchDevice && isFieldReady && pickedHint && (
        <div
          style={{
            left: `${pickedHint.x}px`,
            top: `${pickedHint.y}px`,
          }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full z-20 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#0B0B0C] text-xs font-bold shadow-lg whitespace-nowrap"
        >
          <Mail className="w-3.5 h-3.5 text-[#0B0B0C]" />
          <span>{pickedHint.label}</span>
        </div>
      )}
    </div>
  );
};

/* FULLSCREEN PULL CONTACT SECTION – HYSTERESIS LOCK & MODERN DISPLAY FONT */
const FullscreenPullContactSection = ({
  contactSectionRef,
  email = "malte_reppke@web.de",
  copied = false,
  onCopyEmail,
  reducedMotion = false,
  isMobileView = false,
}) => {
  const [pullProgress, setPullProgress] = useState(reducedMotion ? 1 : 0);
  const [lockedFull, setLockedFull] = useState(Boolean(reducedMotion));

  useEffect(() => {
    if (reducedMotion) {
      setPullProgress(1);
      setLockedFull(true);
      return;
    }

    let rafId = null;

    const updatePull = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        const el = contactSectionRef?.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const vh = window.innerHeight || 1;
          const totalTravel = Math.max(el.offsetHeight - vh * 0.72, vh * 0.85);
          const scrolledInto = vh * 0.92 - rect.top;
          const linear = clamp01(scrolledInto / totalTravel);
          const smootherStep = linear * linear * (3 - 2 * linear);
          const quantized = Math.round(smootherStep * 1000) / 1000;

          setPullProgress((prev) =>
            Math.abs(prev - quantized) >= 0.002 ? quantized : prev,
          );
          setLockedFull((prev) => {
            if (!prev && quantized >= 0.88) return true;
            if (prev && quantized <= 0.78) return false;
            return prev;
          });
        }
        rafId = null;
      });
    };

    window.addEventListener("scroll", updatePull, { passive: true });
    window.addEventListener("resize", updatePull);
    updatePull();

    return () => {
      window.removeEventListener("scroll", updatePull);
      window.removeEventListener("resize", updatePull);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [contactSectionRef, reducedMotion]);

  const effectiveProgress = lockedFull ? 1 : pullProgress;
  const pullVh = lockedFull
    ? 100
    : Math.max(14, Math.round(effectiveProgress * 100));
  const radiusPx = lockedFull ? 0 : Math.round((1 - effectiveProgress) * 44);
  const sideInsetPx = lockedFull ? 0 : Math.round((1 - effectiveProgress) * 44);
  const titleProgress = lockedFull
    ? 1
    : clamp01((effectiveProgress - 0.14) / 0.78);
  const letterSpacingEm = (-0.025 - titleProgress * 0.03).toFixed(3);

  const mobileCenteredEnd = isMobileView && lockedFull;
  const desktopActionsProgress = lockedFull
    ? 1
    : clamp01((effectiveProgress - 0.42) / 0.58);

  return (
    <section
      ref={contactSectionRef}
      id="contact"
      className="relative bg-[#FFFFFF] min-h-[162vh] pt-4 sm:pt-12 pb-0 overflow-x-clip flex flex-col justify-end"
    >
      <div className="sticky bottom-0 w-full">
        <div
          style={{
            marginLeft: `${sideInsetPx}px`,
            marginRight: `${sideInsetPx}px`,
            minHeight: reducedMotion || lockedFull ? "100dvh" : `${pullVh}dvh`,
            borderRadius: `${radiusPx}px ${radiusPx}px 0px 0px`,
            opacity:
              reducedMotion || lockedFull
                ? 1
                : clamp01(0.2 + effectiveProgress * 0.8),
            boxShadow: `0 -28px 90px -24px rgba(11, 11, 12, ${(0.18 + effectiveProgress * 0.36).toFixed(2)})`,
          }}
          className={`relative w-auto overflow-hidden bg-[#0B0B0C] text-white flex flex-col px-4 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-20 sm:pb-16 ${
            mobileCenteredEnd ? "justify-center" : "justify-between"
          }`}
        >
          <div
            aria-hidden="true"
            style={{
              opacity: 0.25 + effectiveProgress * 0.65,
              transform: `scale(${0.6 + effectiveProgress * 0.55})`,
              background:
                "radial-gradient(ellipse 65% 50% at 50% 48%, rgba(59, 130, 246, 0.22) 0%, rgba(124, 58, 237, 0.10) 45%, transparent 75%)",
            }}
            className="pointer-events-none absolute inset-0 z-0"
          />

          <ContactMailWaveField
            sectionRef={contactSectionRef}
            email={email}
            reducedMotion={reducedMotion}
            pullProgress={effectiveProgress}
          />

          <div
            style={{
              opacity: lockedFull
                ? 1
                : clamp01((effectiveProgress - 0.22) / 0.55),
              transform: `translate3d(0, ${(1 - (lockedFull ? 1 : clamp01((effectiveProgress - 0.22) / 0.55))) * -12}px, 0)`,
            }}
            className={`relative z-10 flex items-center justify-end shrink-0 ${
              mobileCenteredEnd ? "mb-6" : ""
            }`}
          >
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-white/75">
              <MapPin className="w-4 h-4 shrink-0 text-white/70" />
              <span>Hilden / Deutschland · Data &amp; AI Engineering</span>
            </div>
          </div>

          <div
            className={`relative z-10 flex flex-col items-center text-center w-full ${
              mobileCenteredEnd ? "my-4 py-4" : "my-auto py-6 sm:py-8"
            }`}
          >
            <div
              style={{
                opacity: clamp01(titleProgress * 1.2),
                transform: `scale(${0.38 + titleProgress * 0.62}) translate3d(0, ${(1 - titleProgress) * 44}px, 0)`,
              }}
              className="w-full select-none will-change-transform"
            >
              <h2
                style={{ letterSpacing: `${letterSpacingEm}em` }}
                className="block font-extrabold uppercase leading-[0.78] text-[#FFFFFF] text-[clamp(4.4rem,21vw,21rem)]"
              >
                KONTAKT
              </h2>
            </div>

            <div
              style={
                isMobileView
                  ? undefined
                  : {
                      opacity: desktopActionsProgress,
                      transform: `translate3d(0, ${(1 - desktopActionsProgress) * 28}px, 0) scale(${
                        0.94 + desktopActionsProgress * 0.06
                      })`,
                    }
              }
              className={`mt-10 sm:mt-14 flex flex-wrap items-center justify-center gap-3.5 will-change-transform ${
                isMobileView
                  ? reducedMotion
                    ? "opacity-100"
                    : `transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        lockedFull
                          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                          : "opacity-0 translate-y-5 scale-95 pointer-events-none"
                      }`
                  : ""
              }`}
            >
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#0B0B0C] text-xs sm:text-sm font-bold hover:bg-[#F4F4F5] transition-colors shadow-sm"
              >
                <Mail className="w-4 h-4" />
                <span>E-Mail senden</span>
              </a>

              <button
                type="button"
                onClick={onCopyEmail}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs sm:text-sm font-bold hover:bg-white/15 transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copied ? "Kopiert!" : email}</span>
              </button>

              <a
                href="https://github.com/malte-reppke"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs sm:text-sm font-bold hover:bg-white/15 transition-colors"
              >
                <GitBranch className="w-4 h-4" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.linkedin.com/in/malte-reppke"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs sm:text-sm font-bold hover:bg-white/15 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {!mobileCenteredEnd && <div className="relative z-10 h-2 shrink-0" />}
        </div>
      </div>
    </section>
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
  align = "left",
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
    <div ref={ref} className={align === "center" ? "text-center" : ""}>
      {kicker && (
        <div className="overflow-hidden">
          <span
            style={{ transitionDelay: reducedMotion ? "0ms" : "40ms" }}
            className={`block text-[11px] font-bold uppercase tracking-[0.2em] text-[#71717A] ${
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

const TIMELINE_PROJECTS = [
  {
    id: "provinzial-data-hub",
    brand: "provinzial",
    shortLabel: "PROVINZIAL",
    title: "Customer Data Hub & IT-DWH",
    roleBadge: "Data & AI Engineer",
    durationLabel: "seit Mai 2025",
    organization: "Provinzial Versicherung AG",
    previewUrl: "provinzial.de/suedwest/",
    previewImage: null,
    previewAlt: "Provinzial Südwest & Customer Data Hub",
    focusSummary:
      "Aufbau skalierbarer PySpark-Datenprodukte und eines Selektionsframeworks auf Azure Synapse sowie Agentic-Development-Workflows im IT-DWH.",
    skills: [
      CORE_SKILL_PILLS[1],
      CORE_SKILL_PILLS[2],
      CORE_SKILL_PILLS[0],
      CORE_SKILL_PILLS[3],
    ],
    secondaryPanels: [
      {
        title: "Provinzial Südwest & Qualtrics",
        previewUrl: "provinzial.de/suedwest/",
        variant: "secondary-a",
      },
      {
        title: "IT-DWH & OpenCode",
        previewUrl: "dwh.provinzial.de/opencode",
        variant: "secondary-b",
      },
    ],
  },
  {
    id: "vodafone-pageforge",
    brand: "vodafone",
    shortLabel: "VODAFONE",
    title: "Firmenkundenportal & PageForge",
    roleBadge: "Backend & Data Integration",
    durationLabel: "> 2 Jahre",
    organization: "Vodafone GmbH",
    previewUrl: "vodafone.de/business",
    previewImage: null,
    previewAlt: "Vodafone Business Landingpage & Firmenkundenportal",
    focusSummary:
      "Datenintegration, Node.js-Vertrags-Microservices und CI/CD-Automatisierung für das Firmenkundenportal sowie über 200 Business-Websites.",
    skills: [
      CORE_SKILL_PILLS[6],
      CORE_SKILL_PILLS[4],
      CORE_SKILL_PILLS[8],
      CORE_SKILL_PILLS[0],
    ],
    secondaryPanels: [
      {
        title: "Node.js Microservices",
        previewUrl: "api.vodafone.de/contracts",
        variant: "secondary-a",
      },
      {
        title: "PageForge · 200+ Sites",
        previewUrl: "pageforge.vodafone.de",
        variant: "secondary-b",
      },
    ],
  },
  {
    id: "controlexpert-easyclaim",
    brand: "controlexpert",
    shortLabel: "CONTROLEXPERT",
    title: "EasyClaim & BI-Plattform",
    roleBadge: "Software & BI Engineering",
    durationLabel: "> 10 Jahre",
    organization: "ControlExpert GmbH",
    previewUrl: "easyclaim.controlexpert.com",
    previewImage: null,
    previewAlt: "ControlExpert EasyClaim digitale Schadenaufnahme",
    focusSummary:
      "Entwicklung der digitalen Schadenaufnahme EasyClaim (React.js & .NET C#) sowie Aufbau von Data-Warehouse- und Tableau-Reporting-Lösungen.",
    skills: [
      CORE_SKILL_PILLS[4],
      CORE_SKILL_PILLS[5],
      CORE_SKILL_PILLS[3],
      CORE_SKILL_PILLS[9],
    ],
    secondaryPanels: [
      {
        title: "EasyClaim Schadenaufnahme",
        previewUrl: "app.easyclaim.controlexpert.com",
        variant: "secondary-a",
      },
      {
        title: "Data Warehouse & Tableau BI",
        previewUrl: "bi.controlexpert.com/kpis",
        variant: "secondary-b",
      },
    ],
  },
];

/* PROJECT DETAIL MODAL */
const ProjectDetailModal = ({ project, onClose, reducedMotion = false }) => {
  const [hoveredPillGroup, setHoveredPillGroup] = useState(false);

  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const theme = BRAND_THEME[project.brand] || BRAND_THEME.provinzial;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} – Projektdetails`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-8 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ borderColor: `${theme.color}45` }}
        className="relative w-full max-w-4xl rounded-[32px] bg-white border-2 shadow-2xl p-6 sm:p-10 my-auto space-y-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Projekt-Ansicht schließen"
          className="absolute top-5 right-5 sm:top-7 sm:right-7 w-10 h-10 rounded-full bg-[#F4F4F5] hover:bg-[#E4E4E7] flex items-center justify-center text-[#0B0B0C] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center max-w-2xl mx-auto pt-2 space-y-2.5">
          <div
            style={{ color: theme.color }}
            className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]"
          >
            <span>{project.shortLabel}</span>
            <span>·</span>
            <span>{project.durationLabel}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-[-0.04em] text-[#0B0B0C] leading-tight">
            {project.title}
          </h2>

          <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
            {project.focusSummary}
          </p>
        </div>

        <div
          onMouseEnter={() => setHoveredPillGroup(true)}
          onMouseLeave={() => setHoveredPillGroup(false)}
          className="flex justify-center"
        >
          <SkillChainList
            skills={project.skills}
            projectWaveActive={hoveredPillGroup}
            reducedMotion={reducedMotion}
            centered
            accentColor={theme.color}
          />
        </div>

        <div className="space-y-5">
          <MacProjectMonitor
            brand={project.brand}
            previewImage={project.previewImage}
            previewAlt={project.previewAlt}
            previewUrl={project.previewUrl}
            large
            variant="primary"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {project.secondaryPanels.map((panel) => (
              <div
                key={panel.title}
                style={{ borderColor: `${theme.color}30` }}
                className="rounded-2xl bg-[#FBFBFD] border p-4 space-y-3"
              >
                <MacProjectMonitor
                  brand={project.brand}
                  previewImage={null}
                  previewAlt={panel.title}
                  previewUrl={panel.previewUrl}
                  variant={panel.variant}
                />
                <p className="text-xs font-bold text-[#0B0B0C] text-center">
                  {panel.title}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={BRAND_URLS[project.brand]}
              target="_blank"
              rel="noreferrer"
              style={{ backgroundColor: theme.color }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-xs sm:text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <span>{project.organization}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

/* PROJECT CAROUSEL – MOBILE PEEKING NEIGHBOR CARDS + INDICATOR DOTS (NO EXTRA BUTTONS) */
const ProjectsViewportCarousel = ({
  projects,
  activeIndex,
  onSelectIndex,
  onOpenProject,
  reducedMotion = false,
  isMobileView = false,
}) => {
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    dragging: false,
    moved: false,
  });
  const total = projects.length;

  const goPrev = () => {
    onSelectIndex((activeIndex - 1 + total) % total);
  };

  const goNext = () => {
    onSelectIndex((activeIndex + 1) % total);
  };

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      dragging: true,
      moved: false,
    };
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
      dragRef.current.moved = true;
      setDragDeltaX(Math.max(-140, Math.min(140, dx)));
    }
  };

  const handlePointerUp = () => {
    if (!dragRef.current.dragging) return;
    const dx = dragDeltaX;
    dragRef.current.dragging = false;
    setDragDeltaX(0);

    if (Math.abs(dx) > 40) {
      if (dx < 0) goNext();
      else goPrev();
    }
  };

  const getRelativeOffset = (index) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const activeProject = projects[activeIndex] || projects[0];
  const activeTheme =
    BRAND_THEME[activeProject.brand] || BRAND_THEME.provinzial;

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: "pan-y" }}
      className="relative overflow-hidden py-4 sm:py-8 select-none"
    >
      <div className="relative flex items-center justify-center min-h-[385px] sm:min-h-[435px]">
        {projects.map((project, idx) => {
          const offset = getRelativeOffset(idx);
          const isCenter = offset === 0;
          const isSide = Math.abs(offset) === 1;
          const theme = BRAND_THEME[project.brand] || BRAND_THEME.provinzial;

          const baseTranslatePercent = isCenter
            ? 0
            : isMobileView
              ? offset * 92
              : offset * 114;
          const rotateDeg = isCenter
            ? dragDeltaX * 0.025
            : isMobileView
              ? offset * 5
              : offset * 6;
          const translateY = isCenter ? 0 : isMobileView ? 14 : 18;
          const scale = isCenter ? 1 : isMobileView ? 0.87 : 0.88;
          const opacity = isCenter
            ? 1
            : isSide
              ? isMobileView
                ? 0.8
                : 0.86
              : 0;
          const zIndex = isCenter ? 20 : isSide ? 10 : 0;

          return (
            <div
              key={project.id}
              className={`flex flex-col items-center ${
                isCenter
                  ? "relative w-[72%] sm:w-[54%] md:w-[43%] lg:w-[37%] max-w-[440px]"
                  : "absolute w-[72%] sm:w-[54%] md:w-[43%] lg:w-[37%] max-w-[440px]"
              } ${
                reducedMotion
                  ? ""
                  : "transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
              }`}
              style={{
                transform: `translate3d(calc(${baseTranslatePercent}% + ${dragDeltaX * 0.48}px), ${translateY}px, 0) rotate(${rotateDeg}deg) scale(${scale})`,
                opacity,
                zIndex,
                pointerEvents: Math.abs(offset) <= 1 ? "auto" : "none",
              }}
            >
              <div
                onClick={() => {
                  if (dragRef.current.moved) {
                    dragRef.current.moved = false;
                    return;
                  }
                  if (isCenter) {
                    onOpenProject(project);
                  } else {
                    onSelectIndex(idx);
                  }
                }}
                role="button"
                tabIndex={isCenter ? 0 : -1}
                onKeyDown={(e) => {
                  if (isCenter && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onOpenProject(project);
                  }
                }}
                aria-label={
                  isCenter
                    ? `${project.title} – Projektdetails öffnen`
                    : `${project.title} in den Fokus holen`
                }
                style={{
                  backgroundColor: `${theme.color}08`,
                  borderColor: isCenter
                    ? `${theme.color}55`
                    : `${theme.color}28`,
                }}
                className={`w-full rounded-[32px] border p-5 sm:p-8 flex flex-col justify-between gap-5 sm:gap-6 cursor-pointer ${
                  isCenter
                    ? "shadow-[0_24px_54px_-22px_rgba(11,11,12,0.16)]"
                    : "shadow-2xs hover:opacity-95"
                } transition-all duration-300`}
              >
                <div className="flex items-center justify-between gap-2">
                  <BrandWordmark brand={project.brand} href={false} />
                  <span
                    style={{ color: theme.color }}
                    className="text-xs font-bold"
                  >
                    {project.durationLabel}
                  </span>
                </div>

                <div>
                  <span
                    style={{ color: theme.color }}
                    className="block text-[11px] font-bold uppercase tracking-[0.16em]"
                  >
                    {project.roleBadge}
                  </span>
                  <h3 className="mt-1.5 text-lg sm:text-xl font-bold tracking-[-0.03em] text-[#0B0B0C] leading-snug">
                    {project.title}
                  </h3>
                </div>

                <div className="pt-1 pb-2">
                  <MacProjectMonitor
                    brand={project.brand}
                    previewImage={project.previewImage}
                    previewAlt={project.previewAlt}
                    previewUrl={project.previewUrl}
                    variant="primary"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isCenter) onOpenProject(project);
                  else onSelectIndex(idx);
                }}
                style={
                  isCenter
                    ? { backgroundColor: theme.color }
                    : { color: theme.color, borderColor: `${theme.color}35` }
                }
                className={`mt-5 sm:mt-6 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.14em] transition-all cursor-pointer ${
                  isCenter
                    ? "text-white shadow-xs hover:opacity-90"
                    : "bg-white border hover:bg-[#FAFAFA]"
                }`}
              >
                {project.shortLabel}
              </button>
            </div>
          );
        })}
      </div>

      {/* SUBTLE CAROUSEL POSITION DOTS (PURE VISUAL AFFORDANCE) */}
      <div
        aria-hidden="true"
        className="mt-4 sm:mt-5 flex items-center justify-center gap-1.5"
      >
        {projects.map((proj, idx) => {
          const active = idx === activeIndex;
          return (
            <span
              key={proj.id}
              style={
                active ? { backgroundColor: activeTheme.color } : undefined
              }
              className={`h-1.5 rounded-full transition-all duration-300 ${
                active ? "w-6" : "w-1.5 bg-[#D4D4D8]"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

const SECTIONS_FLOW = [
  { id: "hero-stage", nextTitle: "Belastbare Datenprodukte & KI-Systeme" },
  { id: "work", nextTitle: "Was mich motiviert" },
  { id: "motivation", nextTitle: "Stationen & Kernkompetenzen" },
  { id: "experience", nextTitle: "Kontakt" },
  { id: "contact", nextTitle: "Nach oben ↑" },
];

export default function App() {
  const [splitProgress, setSplitProgress] = useState(0);
  const [pageProgress, setPageProgress] = useState(0);
  const [activeSecIdx, setActiveSecIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeCarouselIdx, setActiveCarouselIdx] = useState(0);
  const [selectedModalProject, setSelectedModalProject] = useState(null);
  const [openCompanyIds, setOpenCompanyIds] = useState(() => ({}));
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const heroStageRef = useRef(null);
  const motivationSectionRef = useRef(null);
  const contactSectionRef = useRef(null);

  const toggleCompanyCard = (companyId) => {
    setOpenCompanyIds((prev) => ({ ...prev, [companyId]: !prev[companyId] }));
  };

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
    if (id === "contact") {
      const bottomY = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      window.scrollTo({
        top: bottomY,
        behavior: reducedMotion ? "auto" : "smooth",
      });
      return;
    }

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

  const anchorVisible = reducedMotion || activeSecIdx > 0 || revealEase >= 0.45;

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

      <ProjectDetailModal
        project={selectedModalProject}
        onClose={() => setSelectedModalProject(null)}
        reducedMotion={reducedMotion}
      />

      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none">
        <div
          className="h-full bg-[#0B0B0C] transition-[width] duration-150 ease-out"
          style={{ width: `${pageProgress * 100}%` }}
        />
      </div>

      {/* 1. TOP HERO SECTION */}
      <section
        id="hero-stage"
        ref={heroStageRef}
        className="relative h-[215vh] sm:h-[225vh] bg-[#FFFFFF]"
      >
        <div className="sticky top-0 h-[100dvh] min-h-[680px] lg:min-h-[760px] w-full overflow-hidden bg-[#FFFFFF] flex flex-col justify-center">
          <div
            style={{
              opacity: revealedTitleOpacity,
              transform: `translate3d(0, ${revealedTitleY}px, 0) scale(${revealedTitleScale})`,
            }}
            className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 max-w-5xl mx-auto will-change-transform"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#71717A] mb-3">
              EINBLICK IN MEINE PROJEKTE
            </span>

            <h2 className="text-3xl sm:text-6xl md:text-[68px] font-bold tracking-[-0.045em] text-[#0B0B0C] leading-[1.05]">
              Belastbare Datenprodukte und KI-Systeme für den Alltag.
            </h2>

            <p className="mt-5 max-w-2xl text-sm sm:text-lg text-[#52525B] font-medium leading-relaxed">
              Von Customer-Data-Hubs und Microservices bis hin zu digitalen
              InsurTech-Lösungen – strukturiert, verlässlich und praxistauglich
              umgesetzt.
            </p>

            <div className="mt-7">
              <span className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#0B0B0C] text-white text-xs sm:text-sm font-bold shadow-sm">
                <span>Zu den Projekten</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          <div className="relative z-20 w-full max-w-6xl lg:max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div
              style={{ pointerEvents: heroOpacity < 0.2 ? "none" : "auto" }}
              className="relative rounded-[28px] sm:rounded-[40px] min-h-[610px] sm:min-h-[670px] lg:min-h-[750px] xl:min-h-[790px] flex flex-col justify-between overflow-visible"
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

                <header className="relative z-10 flex items-center justify-center sm:justify-between px-5 sm:px-9 lg:px-11 pt-7 sm:pt-8 lg:pt-9">
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

                <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 sm:px-14 lg:px-20 py-16 sm:py-20 lg:py-24">
                  <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/70 mb-6 sm:mb-6">
                    <Sparkles className="w-3.5 h-3.5 text-white/75" />
                    <span>Data Engineering &amp; AI Engineering</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[82px] font-bold tracking-[-0.045em] text-white leading-[1.05]">
                    Malte Reppke
                  </h1>

                  <p className="mt-7 sm:mt-8 max-w-2xl lg:max-w-3xl text-sm sm:text-lg md:text-[19px] lg:text-[21px] text-white/85 font-medium leading-[1.72] sm:leading-[1.68]">
                    Data Engineering &amp; KI-Systeme bei der{" "}
                    <span
                      style={{
                        borderBottomColor: BRAND_THEME.provinzial.color,
                      }}
                      className="border-b-2 pb-0.5 text-white font-semibold"
                    >
                      Provinzial
                    </span>
                    . Fokus auf verlässliche Datenprodukte, skalierbare
                    Pipelines und praxisnahes AI Engineering.
                  </p>

                  <div className="mt-10 sm:mt-12">
                    <button
                      type="button"
                      onClick={() => jumpToSection("work")}
                      className="inline-flex items-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white text-[#0B0B0C] text-xs sm:text-sm font-bold hover:bg-[#F4F4F5] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
                    >
                      <span>Meine Projekte</span>
                    </button>
                  </div>
                </div>

                <div className="relative z-10 pb-7 sm:pb-8 lg:pb-9 flex flex-col items-center gap-2.5 sm:gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">
                    Nach unten scrollen
                  </span>
                  <button
                    type="button"
                    onClick={() => jumpToSection("work")}
                    aria-label="Nach unten scrollen"
                    className="w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/75 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED WORK CAROUSEL */}
      <section id="work" className="bg-[#FFFFFF] pt-14 pb-16 sm:py-28 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-10">
          <HeadlineFlow
            kicker="Projekte & Wirkung"
            title="Einblick in meine Projekte"
            as="h2"
            reducedMotion={reducedMotion}
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <RevealBlock delay={80} reducedMotion={reducedMotion}>
            <ProjectsViewportCarousel
              projects={TIMELINE_PROJECTS}
              activeIndex={activeCarouselIdx}
              onSelectIndex={setActiveCarouselIdx}
              onOpenProject={(proj) => setSelectedModalProject(proj)}
              reducedMotion={reducedMotion}
              isMobileView={isMobileView}
            />
          </RevealBlock>
        </div>
      </section>

      {/* 3. MOTIVATION */}
      <section
        id="motivation"
        ref={motivationSectionRef}
        className="relative bg-[#E7EEF8] py-14 sm:py-28 lg:py-32 overflow-x-clip"
      >
        <HeroAlignedMeshParallax
          sectionRef={motivationSectionRef}
          reducedMotion={reducedMotion}
          isMobileView={isMobileView}
        />

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="mb-7 sm:mb-10">
            <HeadlineFlow kicker="Motivation" reducedMotion={reducedMotion} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
            <MotivationSlideIn
              from="left"
              delay={60}
              reducedMotion={reducedMotion}
              className="lg:col-span-6"
            >
              <AppleLiquidCard
                variant="dark"
                isMobileView={isMobileView}
                className="h-full"
              >
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
                      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
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
              <AppleLiquidCard
                variant="liquid"
                isMobileView={isMobileView}
                className="h-full"
              >
                <div className="h-full p-7 sm:p-9 flex flex-col justify-between">
                  <div>
                    <TextReveal delay={180} reducedMotion={reducedMotion}>
                      <div className="w-11 h-11 rounded-2xl bg-[#F4F4F5] border border-[#E4E4E7] flex items-center justify-center mb-7">
                        <Database className="w-5 h-5 text-[#0B0B0C]" />
                      </div>
                    </TextReveal>

                    <TextReveal
                      delay={240}
                      yOffset={10}
                      reducedMotion={reducedMotion}
                    >
                      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#71717A]">
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
              <AppleLiquidCard variant="liquid" isMobileView={isMobileView}>
                <div className="p-7 sm:p-9 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="max-w-3xl">
                    <TextReveal delay={240} reducedMotion={reducedMotion}>
                      <div className="w-11 h-11 rounded-2xl bg-[#F4F4F5] border border-[#E4E4E7] flex items-center justify-center mb-5">
                        <Layers className="w-5 h-5 text-[#0B0B0C]" />
                      </div>
                    </TextReveal>

                    <TextReveal
                      delay={290}
                      yOffset={10}
                      reducedMotion={reducedMotion}
                    >
                      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#71717A]">
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
      <section
        id="experience"
        className="bg-[#FBFBFD] pt-14 pb-16 sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-28"
      >
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <HeadlineFlow
              kicker="Tech Stack"
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

          <div className="mt-9 sm:mt-11 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-start">
            <RevealBlock
              delay={60}
              reducedMotion={reducedMotion}
              className="lg:col-span-7"
            >
              <div className="rounded-[28px] border border-[#E4E4E7] bg-white p-6 sm:p-8 shadow-2xs space-y-5">
                {COMPANY_GROUPS.map((group) => (
                  <CollapsibleCompanyCard
                    key={group.id}
                    group={group}
                    isOpen={Boolean(openCompanyIds[group.id])}
                    onToggle={() => toggleCompanyCard(group.id)}
                    reducedMotion={reducedMotion}
                  />
                ))}
              </div>
            </RevealBlock>

            {/* LIGHT BLUISH TECH STACK AREA WITH SUBTLE VIOLET HOVER ACCENT */}
            <RevealBlock
              delay={120}
              reducedMotion={reducedMotion}
              className="lg:col-span-5"
            >
              <div className="rounded-[28px] border border-[#DBE6F6] bg-[#EFF4FC] p-6 sm:p-8 shadow-2xs space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#71717A]">
                    <Terminal className="w-4 h-4 text-[#0B0B0C]" />
                    <span>Werkzeugkasten</span>
                  </div>
                  <SkillChainList
                    skills={CORE_SKILL_PILLS}
                    reducedMotion={reducedMotion}
                    tileGrid
                  />
                </div>

                <div className="pt-7 border-t border-[#D8E3F4] space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#71717A]">
                    <GraduationCap className="w-4 h-4 text-[#0B0B0C]" />
                    <span>Studium &amp; Akademischer Hintergrund</span>
                  </div>

                  <div className="space-y-3 text-xs sm:text-[13px] text-[#52525B]">
                    <div className="rounded-2xl bg-white border border-[#E4E4E7] p-4 space-y-1">
                      <p className="text-xs sm:text-sm font-bold text-[#0B0B0C]">
                        M. Sc. KI und Business Analytics
                      </p>
                      <p className="text-xs font-mono text-[#71717A]">
                        FOM · Berufsbegleitend ab 01.09.2026
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white border border-[#E4E4E7] p-4 space-y-1">
                      <p className="text-xs sm:text-sm font-bold text-[#0B0B0C]">
                        B. Sc. Wirtschaftsinformatik (1,9)
                      </p>
                      <p className="text-xs font-mono text-[#71717A]">
                        FOM Düsseldorf · Fokus auf Datenprodukte &amp; BI
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealBlock>
          </div>
        </div>
      </section>

      {/* 5. FULLSCREEN PULL CONTACT AREA */}
      <FullscreenPullContactSection
        contactSectionRef={contactSectionRef}
        email="malte_reppke@web.de"
        copied={copied}
        onCopyEmail={handleCopyEmail}
        reducedMotion={reducedMotion}
        isMobileView={isMobileView}
      />

      {/* FLOATING SECTION FLOW PILL – STARTS AFTER HERO AT INTRO TEXT */}
      <div
        className={`fixed bottom-5 right-5 z-40 ${
          reducedMotion
            ? anchorVisible
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
            : `transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                anchorVisible
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-3 pointer-events-none"
              }`
        }`}
      >
        <button
          type="button"
          onClick={handleNextPill}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0B0B0C]/90 text-white text-xs font-bold backdrop-blur-md border border-white/15 shadow-lg hover:bg-[#0B0B0C] transition-colors cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-white/75" />
          <span>{activeSectionObj.nextTitle}</span>
        </button>
      </div>
    </div>
  );
}
