// import "../styles/globals.css";

// //Internal Import

// import { NavBar } from "../Components/index";

// const MyApp = ({ Component, pageProps }) => (
//     <>
//         <NavBar />
//         <Component {...pageProps} />
//     </>
// )

// export default MyApp;
import React from "react";
import { SwapTokenContextProvider } from "../Context/SwapContext";
import NavBar from "../Components/NavBar/NavBar";
import Model from "../Components/Model/Model";

function MyApp({ Component, pageProps }) {
  return (
    <SwapTokenContextProvider>
      <NavBar />
      <Component {...pageProps} />
      <Model />
    </SwapTokenContextProvider>
  );
}

export default MyApp;