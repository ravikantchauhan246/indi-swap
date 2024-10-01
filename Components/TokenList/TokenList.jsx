import React from "react";

//Internal Imports
import Style from "./TokenList.module.css";
import images from "../../assets";
import Image from "next/image";

const TokenList = ({ tokenDate, setOpenTokenBox }) => {
  const data = [1, 2, 3, 4, 5, 7];

  return (
    <div className={Style.TokenList}>
      <p
        className={Style.TokenList_close}
        onClick={() => setOpenTokenBox(false)}
      >
        <Image src={images.close} alt="close" width={50} height={50} />
      </p>
      <div className={Style.TokenList_title}>
        <h2>Your Token List</h2>
      </div>
      {data.map((el, i) => (
        <div className={Style.TokenList_box}>
          <div className={Style.TokenList_info}>
            <p className={Style.TokenList_box_info_symbol}>
              Hey
            </p>
            <p>
              <span>34</span> Gold Coin
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TokenList;
