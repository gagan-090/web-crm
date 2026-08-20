import { createRoot } from 'react-dom/client'
import './styles/index.css'
// Loaded after index.css so its overrides win on equal specificity. Inert
// unless <html data-theme="tricolor"> is set, which is decided one line below.
import './styles/theme-tricolor.css'
// Shared micro-interactions for every role. Self-disables under
// prefers-reduced-motion.
import './styles/motion.css'
// LAST of the stylesheets: dark mode redefines the light utilities the rest
// of the app is written in, so it has to win on equal specificity.
import './styles/dark.css'
// Imported for the side effect: applies the agent's stored light/dark choice
// to <html> synchronously, BEFORE React mounts. Doing it in an effect would
// flash the full light UI on every reload.
import './shared/theme/darkMode'
import App from './App.tsx'
// Importing the runtime applies the cached theme synchronously, before React
// mounts, so no screen flashes the wrong palette. The fetch below then asks the
// server (crm_theme table) what the CRM should actually be wearing and repaints
// only if it differs.
import { refreshCrmTheme } from './shared/theme/crmTheme'

void refreshCrmTheme()

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
