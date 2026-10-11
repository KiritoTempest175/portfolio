import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";
export default function Work() {
  return (
    <>
      <section id="work" className="work section">
        <div className="work-sticky">
          <div className="wrap">
            <div className="section-label">
              <span>02 / IDEAS, MADE REAL</span>
              <span id="project-counter">01 — 07</span>
            </div>
            <div className="work-heading">
              <h2>
                Selected <span className="muted">work.</span>
              </h2>
              <p>
                Seven completed projects.
                <br />
                <span className="muted">Hosting & deployment in progress.</span>
              </p>
            </div>
          </div>
          <div className="project-viewport">
            <div id="project-track">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.name}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          </div>
          <div className="work-bottom wrap">
            <div className="project-pagination" aria-label="Select project">
              {projects.map((project, index) => (
                <button
                  key={project.name}
                  aria-label={`Show ${project.name}`}
                  data-index={index}
                  className={index === 0 ? "active" : ""}
                />
              ))}
            </div>
            <span className="muted">SCROLL TO DISCOVER</span>
          </div>
        </div>
      </section>
    </>
  );
}
