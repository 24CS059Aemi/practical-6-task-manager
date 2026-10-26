import { Suspense, useSyncExternalStore } from 'react'
import App from './App.jsx'
import { Contact, Projects } from './route-components.js'
import { RouteLink } from './RouteLink.jsx'

const pages = {
  '/': App,
  '/projects': Projects,
  '/contact': Contact,
}

function getPathname() {
  return window.location.pathname.replace(/\/+$/, '') || '/'
}

function subscribe(listener) {
  window.addEventListener('popstate', listener)
  return () => window.removeEventListener('popstate', listener)
}

export function RouteView() {
  const pathname = useSyncExternalStore(subscribe, getPathname, () => '/')
  const Page = pages[pathname]

  return (
    <Suspense fallback={<main className="route-loading" role="status" aria-live="polite">Loading page...</main>}>
      {Page ? <Page /> : <main className="route-page"><h1>Page not found</h1><RouteLink to="/">Return to tasks</RouteLink></main>}
    </Suspense>
  )
}