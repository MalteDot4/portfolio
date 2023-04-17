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
  return (
    <section className="techstack flex-wrapper">
      <h1 className="techstack-headline">
        Hey, there! I’m Malte - nice to meet you! I’m a developer & design
        affine person based in Düsseldorf, Germany. I focus primarily on
        development with the following technologies and languages.
      </h1>
      <div ref={containerRef} className="icon-wrapper">
        <div
          className={`techstack-icon ${
            containerVisible ? "animate-css" : undefined
          }`}
        >
          <Css fill="black"></Css>
        </div>
        <div
          className={`techstack-icon ${
            containerVisible ? "animate-atom" : undefined
          }`}
        >
          <Atom fill="black"></Atom>
        </div>
        <div
          className={`techstack-icon ${
            containerVisible ? "animate-typescript" : undefined
          }`}
        >
          <Typescript fill="black"></Typescript>
        </div>
      </div>
    </section>
  );
}

export default Techstack;
