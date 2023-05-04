import React, { useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import { gsap, Power1 } from "gsap";
import logoUrl from "/Logo.png";

function Hero() {
  useEffect(() => {
    gsap.fromTo(
      ".hero__blob-container",
      { x: "-200px", Opacity: 0 },
      { x: "0px", Opacity: 1, duration: 1, ease: Power1.easeOut }
    );
  }, []);

  return (
    <section className="section__hero">
      <div className="hero flex-wrapper">
        <div class="hero__blob-container">
          <img className="hero__img" src={logoUrl} alt="logo-portrait" />
        </div>
        <div className="flex-wrapper">
          <span className="hero__prefix">Creative</span>
          <TypeAnimation
            sequence={[1000, "Malte Reppke", 1200, "Frontend Developer"]}
            wrapper="span"
            cursor={true}
            className="hero__position"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
