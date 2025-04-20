import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";

import Style from "./NavBar.module.css";
import images from "../../assets";
import { Model, TokenList } from "../index";
import { SwapTokenContext } from "../../Context/SwapContext";

const NavBar = () => {
  const { ether, account, networkConnect, connectWallet, tokenData } =
    useContext(SwapTokenContext);

  const menuItems = [
    {
      name: "Swap",
      link: "/",
    },
    {
      name: "Tokens",
      link: "/Tokens",
    },
    {
      name: "Pools",
      link: "/Pools",
    },
  ];

  const [openModel, setOpenModel] = useState(false);
  const [openTokenBox, setOpenTokenBox] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Handle search functionality
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Filter tokens based on search query
    const results = tokenData.filter(
      (token) =>
        token.name.toLowerCase().includes(query.toLowerCase()) ||
        token.symbol.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
    setShowSearchResults(true);
  };

  // Clear search and hide results
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Handle clicking outside of search results to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${Style.NavBar_box_middle}`)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={Style.NavBar}>
      <div className={Style.NavBar_box}>
        <div className={Style.NavBar_box_left}>
          <div className={Style.NavBar_box_left_img}>
            <Link href="/" passHref>
              <Image src={images.uniswap} alt="logo" width={50} height={50} />
            </Link>
          </div>
          <div className={Style.NavBar_box_left_menu}>
            {menuItems.map((el, i) => (
              <Link key={i + 1} href={el.link}>
                <p className={Style.NavBar_box_left_menu_item}>{el.name}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className={Style.NavBar_box_middle}>
          <div className={Style.NavBar_box_middle_search}>
            <div className={Style.NavBar_box_middle_search_img}>
              <Image src={images.search} alt="search" width={20} height={20} />
            </div>
            <input
              type="text"
              placeholder="Search Tokens"
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <div
                className={Style.NavBar_box_middle_search_clear}
                onClick={clearSearch}
              >
                <Image src={images.close} alt="clear" width={15} height={15} />
              </div>
            )}
          </div>
          {showSearchResults && searchResults.length > 0 && (
            <div className={Style.NavBar_box_middle_search_results}>
              {searchResults.map((token, i) => (
                <Link
                  key={i}
                  href={`/token/${token.tokenAddress}`}
                >
                  <div className={Style.NavBar_box_middle_search_item}>
                    <div className={Style.NavBar_box_middle_search_item_icon}>
                      <Image
                        src={images.etherlogo}
                        alt="token"
                        width={25}
                        height={25}
                      />
                    </div>
                    <div className={Style.NavBar_box_middle_search_item_info}>
                      <p>{token.name}</p>
                      <p className={Style.symbol}>{token.symbol}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {showSearchResults && searchQuery && searchResults.length === 0 && (
            <div className={Style.NavBar_box_middle_search_results}>
              <div className={Style.NavBar_box_middle_search_no_results}>
                <p>No tokens found</p>
              </div>
            </div>
          )}
        </div>
        <div className={Style.NavBar_box_right}>
          <div className={Style.NavBar_box_right_box}>
            <div className={Style.NavBar_box_right_box_img}>
              <Image src={images.ether} alt="NetWork" height={30} width={30} />
            </div>
            <p>{networkConnect}</p>
          </div>
          {account ? (
            <button onClick={() => setOpenTokenBox(true)}>
              {account.slice(0, 20)}...
            </button>
          ) : (
            <button onClick={() => setOpenModel(true)}>Connect</button>
          )}

          {openModel && (
            <Model setOpenModel={setOpenModel} connectWallet={connectWallet} />
          )}
        </div>
      </div>
      {openTokenBox && (
        <TokenList tokenData={tokenData} setOpenTokenBox={setOpenTokenBox} />
      )}
    </div>
  );
};

export default NavBar;
