import { BrowserRouter } from "react-router-dom";

export default function ClientRouterWrapper({ children }) {
    return <BrowserRouter>{children}</BrowserRouter>;
}
