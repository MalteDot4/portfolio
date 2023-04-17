import React, { useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import { gsap } from "gsap";

function Hero() {
  useEffect(() => {
    gsap.fromTo(
      ".hero-gif",
      { y: "-40px" },
      { y: "0px", duration: 3, delay: 0.3 }
    );

    gsap.fromTo(".hero-name", { x: "-150px" }, { x: "0px", duration: 3.5 });
  }, []);

  return (
    <div className="hero flex-wrapper">
      <h1 className="hero-gif">MR</h1>
      <div className="flex-wrapper">
        <span className="hero-name">Creative</span>
        <TypeAnimation
          sequence={[500, "Malte Reppke", 1200, "Frontend Developer"]}
          wrapper="span"
          cursor={true}
          className="hero-position"
        />
      </div>
    </div>
  );
}

export default Hero;
