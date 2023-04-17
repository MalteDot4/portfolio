import Hero from "./components/Hero/Hero";
import Header from "./components/Header/Header";
import Techstack from "./components/Techstack/Techstack";
import "./fonts/Lato/Lato-Regular.ttf";
import Experience from "./components/Experience/Experience";
import Skillset from "./components/Skillset/Skillset";
import Projects from "./components/MyProjects/Projects";
import Contact from "./components/Contact/Contact";
import Loader from "./components/Loader/Loader";
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);

  //TODO: True

  useEffect(() => {
    // Simulate a delay of 2 seconds
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      {loading ? <Loader /> : null}
      {!loading ? (
        <div className="app">
          <Header></Header>
          <div className="app-container">
            <Hero></Hero>
            <Techstack></Techstack>
            <Experience></Experience>
            <Skillset></Skillset>
            <Projects></Projects>
            <Contact></Contact>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default App;
