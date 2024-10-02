import React, { useState, useContext } from "react";
import Image from "next/image";

//Internal Import
import Style from "./HeroSection.module.css";
import images from "../../assets";
import { Token, SearchToken } from "../index";

const HeroSection = ({ accounts, tokenData }) => {
  const [openSetting, setOpenSetting] = useState(false);
  const [openToken, setOpenToken] = useState(false);
  const [openTokensTwo, setOpenTokensTwo] = useState(false);

  const [tokenOne, setTokenOne] = useState({
    name: "",
    image: "",
  });

  const [tokenTwo, setTokenTwo] = useState({
    name: "",
    image: "",
  });

  //Jsx

  return (
    <div className={Style.HeroSection}>
      <div className={Style.HeroSection_box}>
        <div className={Style.HeroSection_box_heading}>
          <p>Swap</p>
          <div className={Style.HeroSection_heading_box_img}>
            <Image
              src={images.close}
              alt="close"
              width={40}
              height={40}
              onClick={() => setOpenSetting(true)}
            />
          </div>
        </div>
        <div className={Style.HeroSection_box_input}>
          <input
            type="text"
            placeholder="0"
          />
          <button onClick={() => setOpenToken(true)}>
            <Image
              src={tokenTwo.image || images.etherlogo}
              alt="token"
              width={20}
              height={20}
            />
            {tokenOne.name || "ETH"}
            <small>9474</small>
          </button>
        </div>
        <div className={Style.HeroSection_box_input}>
          <input
            type="text"
            placeholder="0"
          />
          <button onClick={() => setOpenToken(true)}>
            <Image
              src={tokenTwo.image || images.etherlogo}
              alt="token"
              width={20}
              height={20}
            />
            {tokenTwo.name || "ETH"}
            <small>9474</small>
          </button>
        </div>
        {accounts ? (<button className={Style.HeroSection_box_btn}>Connect Wallet</button>):(<button className={Style.HeroSection_box_btn} onClick={()=>{}}>Swap</button>)}
      </div>
      {openSetting &&  <Token openSetting={setOpenToken} />}
      {openToken && (<SearchToken openToken={openToken} 
      tokens={setTokenOne}
      tokenData={tokenData}/>)}

      {openToken && (<SearchToken openToken={setOpenTokensTwo} 
      tokens={setTokenTwo}
      tokenData={tokenData}/>)}

    </div>
  );
};

export default HeroSection;
