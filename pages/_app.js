import "../styles/globals.css";

//Internal Import

import { NavBar } from "../Components/index";

const MyApp = ({ Component, pageProps }) => (
    <>
        <NavBar />
        <Component {...pageProps} />
    </>
)

export default MyApp;
