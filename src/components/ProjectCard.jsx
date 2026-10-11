export default function ProjectCard({ project, index }) {
  return (
    <article className="project-card" tabIndex={0} data-index={index}>
      <div className="project-art">
        <span className="art-label">{project.category}</span>
        <span className="art-number">
          {String(index + 1).padStart(2, "0")} / 07
        </span>
        <span className="concept-label">INTERFACE CONCEPT / 3D STUDY</span>
      </div>
      <div className="project-body">
        <div className="project-topline">
          <h3>{project.name}</h3>
          {project.repo ? (
            <a
              className="text-link"
              href={`https://github.com/KiritoTempest175/${project.repo}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View repository
            </a>
          ) : (
            <span className="source-note">Project overview</span>
          )}
        </div>
        <p>{project.desc}</p>
        <div className="tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
