import { lazy } from 'react'

export const Projects = lazy(() =>
    import ('./Projects.jsx'))
export const Contact = lazy(() =>
    import ('./Contact.jsx'))