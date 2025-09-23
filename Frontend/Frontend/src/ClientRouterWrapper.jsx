// src/ClientRouterWrapper.jsx
// In Next.js this file ensured client-only routing via dynamic(..., { ssr: false }).
// In a Vite/React app everything is client-side, so this is a simple passthrough wrapper.
// If you prefer you can remove this file and update imports to use BrowserRouter directly.

export default function ClientRouterWrapper({ children }) {
    return <>{children}</>
}
