import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import Style from "../styles/Tokens.module.css";
import images from "../assets";
import { AllTokens } from "../Components/index";
import { SwapTokenContext } from "../Context/SwapContext";

const Tokens = () => {
  const { topTokenList, isLoadingTokens } = useContext(SwapTokenContext);
  const [allTokenList, setAllTokenList] = useState([]);
  const [coppyAllTokenList, setCoppyAllTokenList] = useState([]);
  const [search, setSearch] = useState("");
  const [searchItem, setSearchItem] = useState(search);
  const router = useRouter();

  useEffect(() => {
    if (topTokenList.length > 0) {
      setAllTokenList(topTokenList);
      setCoppyAllTokenList(topTokenList);
    }
  }, [topTokenList]);

  const onHandleSearch = (value) => {
    const filteredTokens = coppyAllTokenList.filter(
      ({ name, symbol }) => 
        name.toLowerCase().includes(value.toLowerCase()) || 
        symbol.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredTokens.length === 0) {
      setAllTokenList(coppyAllTokenList);
    } else {
      setAllTokenList(filteredTokens);
    }
  };

  const onClearSearch = () => {
    if (allTokenList.length && coppyAllTokenList.length) {
      setAllTokenList(coppyAllTokenList);
    }
  };

  const handleTokenClick = (tokenId) => {
    router.push(`/token/${tokenId}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchItem), 1000);
    return () => clearTimeout(timer);
  }, [searchItem]);

  useEffect(() => {
    if (search) {
      onHandleSearch(search);
    } else {
      onClearSearch();
    }
  }, [search]);

  return (
    <div className={Style.Tokens}>
      <div className={Style.Tokens_box}>
        <h2>Top tokens on IndiSwap</h2>
        <div className={Style.Tokens_box_header}>
          <div className={Style.Tokens_box_ethereum}>
            <p>
              <Image
                src={images.etherlogo}
                alt="ether"
                width={20}
                height={20}
              />
            </p>
            <p>Ethereum</p>
          </div>
          <div className={Style.Tokens_box_search}>
            <p>
              <Image src={images.search} alt="image" width={20} height={20} />
            </p>
            <input
              type="text"
              placeholder="Filter tokens"
              onChange={(e) => setSearchItem(e.target.value)}
              value={searchItem}
            />
          </div>
        </div>

        {isLoadingTokens ? (
          <div className={Style.Tokens_loading}>
            <Image src={images.loading} alt="Loading..." width={100} height={100} />
            <p>Loading token data...</p>
          </div>
        ) : (
          <AllTokens 
            allTokenList={allTokenList} 
            handleTokenClick={handleTokenClick}
          />
        )}
      </div>
    </div>
  );
};

export default Tokens;
