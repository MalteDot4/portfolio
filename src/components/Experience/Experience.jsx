import { useElementOnScreen } from "../../hooks/useElementOnScreen";
import ExperienceTabs from "../ExperienceTabs/ExperienceTabs";
import React from "react";

function Experience() {
  const [containerRef, containerVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  });
  return (
    <section id="experience" className="section__experience">
      <div className="flex-wrapper wrapper__fullwidth">
        <div ref={containerRef}>
          <h2
            className={`experience__headline ${
              containerVisible ? "animation__headline" : undefined
            }`}
          >
            Experience
          </h2>
        </div>
        <ExperienceTabs></ExperienceTabs>
      </div>
    </section>
  );
}

export default Experience;
