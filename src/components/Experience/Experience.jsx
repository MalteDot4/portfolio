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
    <section className="experience">
      <div ref={containerRef}>
        <h1
          className={`experience-headline ${
            containerVisible ? "animate-headline" : undefined
          }`}
        >
          Work experience
        </h1>
      </div>
      <div>
        <ExperienceTabs></ExperienceTabs>
      </div>
    </section>
  );
}

export default Experience;
