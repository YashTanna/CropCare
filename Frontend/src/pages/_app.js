import { BrowserRouter } from "react-router-dom";
import "../styles/globals.css"; // adjust path if your global CSS is elsewhere

function MyApp({ Component, pageProps }) {
    return (
        <BrowserRouter>
            <Component {...pageProps} />
        </BrowserRouter>
    );
}

export default MyApp;
