import React, { useContext } from "react";
import { HeroSection } from "../Components/index";
import { SwapTokenContext } from "../Context/SwapContext";

const Home = () => {
  const { tokenData, account } = useContext(SwapTokenContext);

  return (
    <div>
      <HeroSection />
    </div>
  );
};

export default Home;
