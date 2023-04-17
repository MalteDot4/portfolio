import React from "react";

function Skillset() {
  return (
    <section className="skillset">
      <div className="skillset-container">
        <h1 className="skillset-headline">
          How can i bring value to your project?
        </h1>
        <div className="flex-wrapper skillbox">
          <h3 style={{ marginTop: "20px" }} className="light-text">
            Clean Code.
          </h3>
          <p style={{ fontSize: "1rem" }}>
            Writing clean code is not just a matter of professional obligation,
            it's a true passion of mine. I believe that writing clean code is an
            art form that requires creativity, attention to detail, and
            discipline.
          </p>
        </div>
        <div className="flex-wrapper skillbox">
          <h3 style={{ marginTop: "20px" }} className="light-text">
            Eager to learn.
          </h3>
          <p>
            I am always eager to learn new technologies and stay up-to-date with
            the latest trends in the tech industry.
          </p>
        </div>
        <div className="flex-wrapper skillbox">
          <h3 style={{ marginTop: "20px" }} className="light-text">
            Solid skills.
          </h3>
          <p>
            I have solid skills in React and TypeScript, and good skills in HTML
            and CSS. I am confident in my ability to build robust, scalable, and
            visually appealing web applications that provide a great user
            experience.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Skillset;
