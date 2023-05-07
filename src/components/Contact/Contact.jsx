import React from "react";
import Github from "../../icons/Github";
import Xing from "../../icons/Xing";
import LinkedIn from "../../icons/LinkedIn";
import { useElementOnScreen } from "../../hooks/useElementOnScreen";

function Contact() {
  const [containerRef, containerVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  });
  return (
    <section id="contact" className="contact">
      <div className="flex-wrapper wrapper__fullwidth">
        <div
          ref={containerRef}
          className="flex-wrapper wrapper__fullwidth headline-wrapper"
        >
          <h2
            className={`contact-headline ${
              containerVisible ? "animation__headline" : undefined
            }`}
          >
            Hit me up on <span className="social">social Media</span>
          </h2>
        </div>
        <div className="icon-wrapper">
          <div className="contact__icon">
            <a target="blank" href=" https://github.com/MalteDot4">
              <Github fill={"#fff"}></Github>
            </a>
            <span style={{ color: "#fff" }}></span>
          </div>
          <div className="contact__icon">
            <a
              target="blank"
              href="https://www.xing.com/profile/Malte_Reppke/cv"
            >
              <Xing fill={"#fff"}></Xing>
            </a>
          </div>
          <div className="contact__icon">
            <LinkedIn fill={"#fff"}></LinkedIn>
            <span style={{ color: "#fff" }}></span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
