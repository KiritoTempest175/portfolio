export default function Header() {
  return (
    <>
      <header className="header">
        <a className="brand" href="#home" aria-label="Huzaifa Zaman home">
          <span className="brand-monogram">HZ</span>
          <span className="brand-name">
            Huzaifa Zaman<small>AI / ML ENGINEER</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#skills">Expertise</a>
          <a href="#journey">Journey</a>
        </nav>
        <a href="#contact" className="nav-contact">
          Available for projects <span className="tiny-dot"></span>
        </a>
      </header>
    </>
  );
}
