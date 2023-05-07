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
    <section id="projects" className="projects">
      <div className="flex-wrapper wrapper__fullwidth">
        <div
          ref={containerRef}
          className="flex-wrapper wrapper__fullwidth headline-wrapper"
        >
          <h2
            className={`projects__headline ${
              containerVisible ? "animation__headline" : undefined
            }`}
          >
            Project insights
          </h2>
        </div>
        <ProjectAccordion></ProjectAccordion>
      </div>
    </section>
  );
}

export default Projects;
