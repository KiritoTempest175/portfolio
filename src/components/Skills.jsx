export default function Skills() {
  return (
    <>
      <section id="skills" className="skills section">
        <div className="wrap">
          <div className="section-label reveal">
            <span>03 / THE TOOLKIT</span>
            <span>EXPERTISE</span>
          </div>
          <h2 className="reveal">
            From the model
            <br />
            to the <span className="muted">whole product.</span>
          </h2>
          <p className="skills-intro reveal">
            Intelligence is one part of the system.
            <br />I connect it to everything that makes a product useful.
          </p>
          <div className="skills-layout">
            <div className="skill-group reveal">
              <span className="mini-label">01 / INTELLIGENCE</span>
              <h3>AI & Machine Learning</h3>
              <p className="muted">
                Building systems that understand language, learn patterns, and
                support better decisions.
              </p>
              <div className="tags">
                <span>Machine Learning</span>
                <span>Deep Learning</span>
                <span>Neural Networks</span>
                <span>NLP</span>
                <span>Reinforcement Learning</span>
                <span>PyTorch</span>
              </div>
            </div>
            <div className="skill-group reveal">
              <span className="mini-label">02 / ENGINEERING</span>
              <h3>Applications & Automation</h3>
              <p className="muted">
                Connecting models to chatbots, automated workflows, and web,
                mobile, or desktop applications.
              </p>
              <div className="tags">
                <span>FastAPI</span>
                <span>Flask</span>
                <span>React</span>
                <span>Next.js</span>
                <span>Tauri</span>
                <span>REST APIs</span>
                <span>DSA</span>
                <span>OOP</span>
              </div>
            </div>
            <div className="languages reveal">
              <span className="mini-label">LANGUAGES I WORK WITH</span>
              <div>
                Python <span>/</span> C++ <span>/</span> Java
                <br />
                Rust <span>/</span> R <span>/</span> Julia
              </div>
            </div>
          </div>
          <div className="service-strip reveal">
            <span>LET’S BUILD</span>
            <p>
              Custom ML models · AI chatbots · Intelligent automation ·
              Full-stack AI applications
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
