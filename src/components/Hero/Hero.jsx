import React, { useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import { gsap, Power1 } from "gsap";
import logoUrl from "/Logo.png";
import { Opacity } from "@mui/icons-material";

function Hero() {
  useEffect(() => {
    gsap.fromTo(
      ".blob-container",
      { x: "-200px", Opacity: 0 },
      { x: "0px", Opacity: 1, duration: 1, ease: Power1.easeOut }
    );
  }, []);

  return (
    <div className="hero flex-wrapper">
      <div class="blob-container">
        <img className="hero-img" src={logoUrl} alt="logo-portrait" />
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
