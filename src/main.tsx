import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'

// StrictMode intentionally double-mounts every component in dev to catch
// missing-cleanup bugs. That's fine for most components, but the SAN CTI
// iframe has to reload SAN's entire page (including their own async
// scripts) on every mount, so the double-mount tears it down and reloads
// it again right as we're trying to log in — causing real, reproducible
// silent failures that don't reflect production (StrictMode never runs
// there). Disabled to keep CTI testing reliable.
createRoot(document.getElementById('root')!).render(
  <App />,
)
