// src/AppProvider.jsx
// Next.js had a custom _app.js to wrap every page.
// In Vite/React you usually wrap at the entry point (src/main.jsx).
// This component replicates the wrapper behaviour if you need it.

import ClientRouterWrapper from "./ClientRouterWrapper"

export default function AppProvider({ children }) {
    // You can add global providers here (Context, Theme, Auth, etc.)
    return <ClientRouterWrapper>{children}</ClientRouterWrapper>
}
