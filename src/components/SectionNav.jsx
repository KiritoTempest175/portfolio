export default function SectionNav() {
  return (
    <>
      <nav className="section-dots" aria-label="Jump to section">
        <a href="#home" aria-label="Introduction" className="active"></a>
        <a href="#about" aria-label="About"></a>
        <a href="#work" aria-label="Selected work"></a>
        <a href="#skills" aria-label="Expertise"></a>
        <a href="#journey" aria-label="Journey"></a>
        <a href="#contact" aria-label="Contact"></a>
      </nav>
    </>
  );
}
