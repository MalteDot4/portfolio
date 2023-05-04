import React from "react";
import Atom from "../../icons/Atom";
import Css from "../../icons/Css";
import Typescript from "../../icons/Typescript";
import { useElementOnScreen } from "../../hooks/useElementOnScreen";

function Techstack() {
  const [containerRef, containerVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  });

  const logoFillColor = "#000";

  return (
    <section id="techstack" className="section__techstack">
      <div className="flex-wrapper wrapper__fullwidth">
        <h2>
          Hey, there! I’m Malte - nice to meet you! I’m a developer & design
          affine person based in Düsseldorf, Germany. I focus primarily on
          development with the following technologies and languages.
        </h2>
        <div ref={containerRef} className="icon-wrapper">
          <div
            className={`techstack__icon ${
              containerVisible ? "techstack__animation--css" : undefined
            }`}
          >
            <Css fill={logoFillColor}></Css>
          </div>
          <div
            className={`techstack__icon ${
              containerVisible ? "techstack__animation--atom" : undefined
            }`}
          >
            <Atom fill={logoFillColor}></Atom>
          </div>
          <div
            className={`techstack__icon ${
              containerVisible ? "techstack__animation--typescript" : undefined
            }`}
          >
            <Typescript fill={logoFillColor}></Typescript>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Techstack;
