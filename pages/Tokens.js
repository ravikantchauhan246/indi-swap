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

  const clearSearch = () => {
    setSearchItem("");
    setSearch("");
    onClearSearch();
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
        <div className={Style.Tokens_box_title}>
          <h2>Top tokens on IndiSwap</h2>
          <p className={Style.Tokens_box_subtitle}>The most popular tokens in the IndiSwap ecosystem</p>
        </div>
        
        <div className={Style.Tokens_box_search_container}>
          <div className={Style.Tokens_box_search}>
            <div className={Style.Tokens_box_search_icon}>
              <Image src={images.search} alt="search" width={20} height={20} />
            </div>
            <input
              type="text"
              placeholder="Search tokens by name or symbol"
              onChange={(e) => setSearchItem(e.target.value)}
              value={searchItem}
              className={Style.Tokens_box_search_input}
            />
            {searchItem && (
              <div className={Style.Tokens_box_search_clear} onClick={clearSearch}>
                <Image src={images.close} alt="clear" width={15} height={15} />
              </div>
            )}
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
