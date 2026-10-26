import { lazy, Suspense, useState } from 'react'
import { RouteLink } from './RouteLink.jsx'

const ProjectRegister = lazy(() => import('./ProjectRegister.jsx'))

function Projects() {
  const [showRegister, setShowRegister] = useState(false)

  return (
    <main className="app-shell">
      <header className="topbar">
        <RouteLink className="wordmark" to="/">TASK / MANAGER</RouteLink>
        <nav className="primary-nav" aria-label="Main navigation">
          <RouteLink to="/">Tasks</RouteLink>
          <RouteLink aria-current="page" to="/projects">Projects</RouteLink>
          <RouteLink to="/contact">Contact</RouteLink>
        </nav>
      </header>
      <section className="route-page">
        <p className="eyebrow">PROJECTS / OVERVIEW</p>
        <h1>Work with a wider view.</h1>
        <p className="route-intro">Keep related tasks together and make the next milestone visible.</p>
        <div className="project-summary">
          <span className="project-index">01</span>
          <div>
            <h2>Personal workspace</h2>
            <p>Plan, track, and complete the work on your task list.</p>
          </div>
          <RouteLink className="project-link" to="/">Open tasks</RouteLink>
        </div>
        <button className="primary-button register-toggle" type="button" onClick={() => setShowRegister((visible) => !visible)}>
          {showRegister ? 'Hide project register' : 'Load project register'}
        </button>
        {showRegister && (
          <Suspense fallback={<p className="loading-panel" role="status">Loading project register...</p>}>
            <ProjectRegister />
          </Suspense>
        )}
      </section>
    </main>
  )
}

export default Projects