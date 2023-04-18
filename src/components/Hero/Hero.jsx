import React, { useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import { gsap } from "gsap";

function Hero() {
  useEffect(() => {
    gsap.fromTo(".hero-gif", { y: "-60px" }, { y: "0px", duration: 1 });

    gsap.fromTo(
      ".hero-name",
      { x: "-150px", opacity: 0 },
      { x: "0px", opacity: 1, duration: 6 }
    );
  }, []);

  return (
    <div className="hero flex-wrapper">
      <h1 className="hero-gif">MR</h1>
      <div className="flex-wrapper">
        <span className="hero-name">Creative</span>
        <TypeAnimation
          sequence={[1000, "Malte Reppke", 1500, "Frontend Developer"]}
          wrapper="span"
          cursor={true}
          className="hero-position"
        />
      </div>
    </div>
  );
}

export default Hero;
