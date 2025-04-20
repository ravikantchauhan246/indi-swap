import React from "react";
import Image from "next/image";

import Style from "./AllTokens.module.css";
import images from "../../assets";

const AllTokens = ({ allTokenList, handleTokenClick }) => {
  return (
    <div className={Style.AllTokens}>
      <div className={Style.AllTokens_box}>
        <div className={Style.AllTokens_box_header}>
          <p className={Style.hide}>#</p>
          <p>Token name</p>
          <p>Price</p>
          <p className={Style.hide}>24h Change</p>
          <p className={Style.hide}>
            TVL{" "}
            <span className={Style.infoIcon}>
              <Image src={images.question} alt="info" width={14} height={14} />
            </span>
          </p>
          <p className={Style.hide}>
            Volume{" "}
            <span className={Style.infoIcon}>
              <Image src={images.question} alt="info" width={14} height={14} />
            </span>
          </p>
        </div>

        {allTokenList.length > 0 ? (
          allTokenList.map((el, i) => (
            <div 
              key={i} 
              className={`${Style.AllTokens_box_list} ${Style.clickable}`}
              onClick={() => handleTokenClick(el.id)}
            >
              <p className={Style.hide}>{el.number}</p>
              <div className={Style.AllTokens_box_list_para}>
                <div className={Style.tokenImageContainer}>
                  {el.image ? (
                    <img 
                      src={el.image} 
                      alt={el.symbol} 
                      width={28} 
                      height={28}
                      className={Style.tokenImage} 
                    />
                  ) : (
                    <Image src={images.etherlogo} alt="logo" width={28} height={28} />
                  )}
                </div>
                <div className={Style.tokenNameInfo}>
                  <span className={Style.tokenName}>{el.name}</span>
                  <span className={Style.tokenSymbol}>{el.symbol}</span>
                </div>
              </div>
              <p className={Style.tokenPrice}>{el.price}</p>
              <p className={`${Style.hide} ${parseFloat(el.change) >= 0 ? Style.positive : Style.negative}`}>
                {el.change}
              </p>
              <p className={Style.hide}>{el.tvl}</p>
              <p className={Style.hide}>{el.volume}</p>
            </div>
          ))
        ) : (
          <div className={Style.noResults}>
            <p>No tokens found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTokens;
