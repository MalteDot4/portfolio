import React, { useState } from "react";
import Home from "../../icons/Home";

function Header() {
  const [isClosed, setIsClosed] = useState(false);

  const toggleMenu = () => {
    setIsClosed((prevState) => !prevState);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <section className="header">
      <div className="nav">
        <div onClick={scrollToTop}>
          <Home></Home>
        </div>
        <div
          onClick={toggleMenu}
          className={`menu flex-wrapper ${isClosed ? "close" : ""}`}
        >
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
      </div>
    </section>
  );
}

export default Header;
