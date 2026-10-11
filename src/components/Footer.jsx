export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand" href="#home">
              <span className="brand-monogram">HZ</span>
              <span className="brand-name">
                Huzaifa Zaman<small>AI/ML ENGINEER & SOFTWARE DEVELOPER</small>
              </span>
            </a>
            <p>
              Intelligent systems.
              <br />
              Thoughtfully engineered.
            </p>
          </div>
          <div className="footer-column">
            <span>EXPLORE</span>
            <a href="#about">About me</a>
            <a href="#work">Selected work</a>
            <a href="#skills">Expertise</a>
            <a href="#journey">My journey</a>
          </div>
          <div className="footer-column">
            <span>CONNECT</span>
            <a
              href="https://github.com/KiritoTempest175"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/huzaifa-zaman/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://www.fiverr.com/s/9d9lGNd"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fiverr
            </a>
            <a href="mailto:huzaifazaman38@gmail.com">Email me</a>
          </div>
          <div className="footer-availability">
            <span className="tiny-dot"></span> Open to collaboration
            <p>Freelance · Internships · Part-time</p>
            <span>Islamabad, Pakistan</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © <span id="year">{new Date().getFullYear()}</span> Muhammad
            Huzaifa Zaman
          </span>
          <span>BUILT WITH CURIOSITY. MADE TO BE USEFUL.</span>
          <a href="#home">Back to top</a>
        </div>
      </footer>
    </>
  );
}
