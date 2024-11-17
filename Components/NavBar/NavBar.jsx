'use client';
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

//Import Internal
import Style from "./NavBar.module.css";
import images from "../../assets";
import { Model, TokenList } from "../index";

const NavBar = () => {
  const menuItems = [
    {
      name: "Swap",
      link: "/",
    },
    {
      name: "Tokens",
      link: "/",
    },
    {
      name: "Pools",
      link: "/",
    },
  ];

  //UseState
  const [openModel, setOpenModel] = useState(false);
  const [openTokenBox, setOpenTokenBox] = useState(false);
  const [account, setAccount] = useState(true);

  return (
    <div className={Style.NavBar}>
      <div className={Style.NavBar_box}>
        <div className={Style.NavBar_box_left}>
          {/* Logo Image */}
          <div className={Style.NavBar_box_left_img}>
            <Image src={images.indiswap} alt="logo" width={50} height={50} />
          </div>
          {/* Menu Items */}
          <div className={Style.NavBar_box_left_menu}>
            {menuItems.map((el, i) => (
              <Link
                style={{ textDecoration: "none" }}
                key={i + 1}
                href={{ pathname: `${el.name}`, query: `${el.link}` }}
              >
                <p className={Style.NavBar_box_left_menu_item}>{el.name}</p>
              </Link>
            ))}
          </div>
        </div>
        {/* Middle Section */}
        <div className={Style.NavBar_box_middle}>
            <div className={Style.NavBar_box_middle_search}>
                <div className={Style.NavBar_box_middle_search_img}>
                    <Image src={images.search} alt="search" width={20} height={20} />
                </div>
                {/* Input Section */}
                <input type="text" placeholder="Search tokens"/>
            </div>
        </div>
        {/* Right Section */}

        <div className={Style.NavBar_box_right}>
            <div className={Style.NavBar_box_right_box}>
                <div className={Style.NavBar_box_right_box_img}>
                    <Image src={images.ether} alt="ether" width={30} height={30} />
                </div>
                <p>Network Name</p>
            </div>
            { account ? (
            <button onClick={()=>setOpenModel(true)}>Connect Wallet</button>
            ) : (
              <button onClick={()=>setOpenTokenBox(true)}>0x0000000000.</button>
            )}
            {openModel && (
                <Model setOpenModel={setOpenModel}  connectWallet = "Connect"/>
            )}
        </div>
      </div>
      {/* Token List */}
      {openTokenBox && (
          <TokenList tokenDate = "hey" setOpenTokenBox={setOpenTokenBox} />
      )}
    </div>
  );
};

export default NavBar;
