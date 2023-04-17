import React from "react";
import { useElementOnScreen } from "../../hooks/useElementOnScreen";
import ProjectAccordion from "../ProjectAccordion/ProjectAccordion";

function Projects() {
  const [containerRef, containerVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  });
  return (
    <section className="projects">
      <div ref={containerRef}>
        <h1
          className={`projects-headline ${
            containerVisible ? "animate-headline" : undefined
          }`}
        >
          Project insights
        </h1>
      </div>
      <ProjectAccordion></ProjectAccordion>
    </section>
  );
}

export default Projects;
