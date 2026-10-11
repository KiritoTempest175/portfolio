import Footer from "./Footer";
export default function Contact() {
  return (
    <>
      <section id="contact" className="contact section">
        <div className="wrap">
          <div className="section-label reveal">
            <span>05 / THE NEXT GOOD IDEA</span>
            <span>LET’S TALK</span>
          </div>
          <div className="contact-content">
            <p className="eyebrow reveal">
              OPEN FOR FREELANCE · INTERNSHIPS · PART-TIME
            </p>
            <h2 className="reveal">
              Have something
              <br />
              <em>in mind?</em>
            </h2>
            <p className="muted reveal">
              An AI idea, a challenging problem, or a project that needs
              <br className="desktop" /> someone to take it from concept to
              application.
            </p>
            <a
              id="email-button"
              className="button primary magnetic reveal"
              href="mailto:huzaifazaman38@gmail.com"
            >
              huzaifazaman38@gmail.com
            </a>
            <div className="socials reveal">
              <a
                className="text-link"
                href="https://github.com/KiritoTempest175"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                className="text-link"
                href="https://www.linkedin.com/in/huzaifa-zaman/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="text-link"
                href="https://www.fiverr.com/s/9d9lGNd"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hire me on Fiverr
              </a>
            </div>
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
}
