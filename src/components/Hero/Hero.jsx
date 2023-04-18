import React, { useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import { gsap } from "gsap";

function Hero() {
  useEffect(() => {
    gsap.fromTo(".hero-gif", { y: "-60px" }, { y: "0px", duration: 0.5 });
  }, []);

  return (
    <div className="hero flex-wrapper">
      <div class="blob-container">
        <img className="hero-img" src="src/assets/Me.png" alt="logo-portrait" />
      </div>
      <div className="flex-wrapper">
        <span className="hero-name">Creative</span>
        <TypeAnimation
          sequence={[1000, "Malte Reppke", 1200, "Frontend Developer"]}
          wrapper="span"
          cursor={true}
          className="hero-position"
        />
      </div>
    </div>
  );
}

export default Hero;
