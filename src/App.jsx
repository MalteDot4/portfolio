import Hero from "./components/Hero/Hero";
import Nav from "./components/Nav/Nav";
import Techstack from "./components/Techstack/Techstack";
import "./fonts/Lato/Lato-Regular.ttf";
import Experience from "./components/Experience/Experience";
import Skillset from "./components/Skillset/Skillset";
import Projects from "./components/Projects/Projects";
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
          <header className="app-header">
            <Nav></Nav>
          </header>
          <main className="app-content">
            <Hero></Hero>
            <Techstack></Techstack>
            <Experience></Experience>
            <Skillset></Skillset>
            <Projects></Projects>
          </main>
          <footer className="app-footer">
            <Contact></Contact>
          </footer>
        </div>
      ) : null}
    </>
  );
}

export default App;
