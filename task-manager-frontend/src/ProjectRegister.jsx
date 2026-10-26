const projectItems = [
  { number: '01', title: 'Personal workspace', detail: 'Tasks and daily priorities' },
  { number: '02', title: 'Weekly planning', detail: 'Upcoming work and milestones' },
  { number: '03', title: 'Completed work', detail: 'A record of finished tasks' },
]

function ProjectRegister() {
  return (
    <ul className="project-register" aria-label="Project register">
      {projectItems.map((item) => (
        <li key={item.number}>
          <span>{item.number}</span>
          <strong>{item.title}</strong>
          <small>{item.detail}</small>
        </li>
      ))}
    </ul>
  )
}

export default ProjectRegister