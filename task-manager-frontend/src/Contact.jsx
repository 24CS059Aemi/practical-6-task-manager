import { RouteLink } from './RouteLink.jsx'

function Contact() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <RouteLink className="wordmark" to="/">TASK / MANAGER</RouteLink>
        <nav className="primary-nav" aria-label="Main navigation">
          <RouteLink to="/">Tasks</RouteLink>
          <RouteLink to="/projects">Projects</RouteLink>
          <RouteLink aria-current="page" to="/contact">Contact</RouteLink>
        </nav>
      </header>
      <section className="route-page contact-page">
        <p className="eyebrow">CONTACT / SUPPORT</p>
        <h1>A hand with your workflow.</h1>
        <p className="route-intro">Questions or feedback about your task workspace? Get in touch.</p>
        <a className="contact-link" href="mailto:support@taskmanager.example">Email support</a>
      </section>
    </main>
  )
}

export default Contact