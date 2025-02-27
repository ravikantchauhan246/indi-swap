import React, { useContext } from "react";
import Image from "next/image";

//Internal Imports
import Style from "./Model.module.css";
import images from "./../../assets";
import { SwapTokenContext } from "../../Context/SwapContext";

const Model = ({ setOpenModel }) => {
  const { account, ether } = useContext(SwapTokenContext);

  //useState
  const walletMenu = ["MetaMask", "Coinbase", "Wallet", "WalletConnect"];

  const handleWalletConnect = () => {
    console.log("Account:", account);
    console.log("Balance:", ether);
    setOpenModel(false);
  };

  return (
    <div className={Style.Model}>
      <div className={Style.Model_box}>
        <div className={Style.Model_box_heading}>
          <p>Connect a Wallet</p>
          <div className={Style.Model_box_heading_img}>
            <Image
              src={images.close}
              alt="close"
              width={40}
              height={40}
              onClick={() => setOpenModel(false)}
            />
          </div>
        </div>
        <div className={Style.Model_box_wallet}>
          {walletMenu.map((el, i) => (
            <p key={i + 1} onClick={handleWalletConnect}>
              {el}
            </p>
          ))}
        </div>
        <p className={Style.Model_box_para}>
          By connecting your wallet, you agree to Wallets
          <span> Terms of Service and Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Model;
