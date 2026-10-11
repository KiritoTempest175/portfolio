import { useEffect, useRef } from "react";
import Header from "./components/Header";
import GuideOverlay from "./components/GuideOverlay";
import SectionNav from "./components/SectionNav";
import Hero from "./components/Hero";
import About from "./components/About";
import Work from "./components/Work";
import Skills from "./components/Skills";
import Journey from "./components/Journey";
import Contact from "./components/Contact";
import { createPortfolioExperience } from "./three/createPortfolioExperience";

export default function App() {
  const root = useRef(null);
  useEffect(() => createPortfolioExperience(root.current), []);
  return (
    <div ref={root}>
      <a className="skip" href="#about">
        Skip introduction
      </a>
      <div id="progress" aria-hidden="true" />
      <Header />
      <GuideOverlay />
      <SectionNav />
      <main>
        <Hero />
        <About />
        <Work />
        <Skills />
        <Journey />
        <Contact />
      </main>
    </div>
  );
}
