import dynamic from "next/dynamic";
import "../styles/globals.css";

const ClientOnlyRouter = dynamic(
    () => import("./ClientRouterWrapper"),
    { ssr: false }
);

function MyApp({ Component, pageProps }) {
    return (
        <ClientOnlyRouter>
            <Component {...pageProps} />
        </ClientOnlyRouter>
    );
}

export default MyApp;
