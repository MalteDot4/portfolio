import React, { useState, useEffect, useRef } from "react";
import Home from "../../icons/Home";

function Nav() {
  const [isToggled, setIstoggled] = useState(false);
  const [isScrollOnTop, setIsScrollOnTop] = useState(true);
  const navLinksRef = React.createRef();
  const toggleButtonRef = React.createRef();
  const navMainMenuRef = React.createRef();

  useEffect(() => {
    function watchScroll() {
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 0) setIsScrollOnTop(false);
        else setIsScrollOnTop(true);
      });
    }
    watchScroll();
    return () => {
      window.removeEventListener("scroll", () => {
        if (window.pageYOffset > 0) setIsScrollOnTop(false);
      });
    };
  });

  const toggleMenu = () => {
    setIstoggled((prevState) => !prevState);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeNavEvent = () => {
    toggleMenu();
    navMainMenuRef.current.classList.remove("toggled");
    navLinksRef.current.classList.remove("nav__links--active");
    toggleButtonRef.current.classList.remove("nav__toggleMenu--closeBars");
  };
  return (
    <nav
      ref={navMainMenuRef}
      className={`nav__mainMenu ${isScrollOnTop ? "on-top" : undefined} 
      ${isToggled ? "toggled" : undefined}`}
    >
      <div className="nav__home" onClick={scrollToTop}>
        <Home></Home>
      </div>
      <div
        ref={navLinksRef}
        className={`nav__links ${isToggled ? "nav__links--active" : undefined}`}
      >
        <ul>
          <li>
            <a onClick={closeNavEvent} href="#techstack">
              Techstack
            </a>
          </li>
          <li>
            <a onClick={closeNavEvent} href="#experience">
              Experience{" "}
            </a>
          </li>
          <li>
            <a onClick={closeNavEvent} href="#skill">
              Skillset
            </a>
          </li>
          <li>
            {" "}
            <a onClick={closeNavEvent} href="#projects">
              Projects{" "}
            </a>{" "}
          </li>
          <li>
            <a onClick={closeNavEvent} href="#contact">
              Contact{" "}
            </a>{" "}
          </li>
        </ul>
      </div>
      <div
        ref={toggleButtonRef}
        onClick={toggleMenu}
        className={`nav__toggleMenu ${
          isToggled ? "nav__toggleMenu--closeBars" : undefined
        }`}
      >
        <div className="bar1"></div>
        <div className="bar2"></div>
        <div className="bar3"></div>
      </div>
    </nav>
  );
}

export default Nav;
