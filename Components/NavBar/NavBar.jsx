import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

//IMPORT INTERNAL
import Style from "./NavBar.module.css";
import images from "../../assets";
import Model from "../Model/Model";
import { connectWallet } from "../../Utils/appFeatures";

// CONTEXT
// Removed SwapTokenContext import as connectWallet is no longer needed

const NavBar = () => {
  //USESTATE
  const [openModel, setOpenModel] = useState(false);

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

  return (
    <div className={Style.NavBar}>
      <div className={Style.NavBar_box}>
        <div className={Style.NavBar_box_left}>
          {/*  LOGO IMAGE */}
          <div className={Style.NavBar_box_left_img}>
            <Image src={images.uniswap} alt="logo" width={50} height={50} />
          </div>
          {/* MENU ITEMS */}
          <div className={Style.NavBar_box_left_menu}>
            {menuItems.map((el, i) => (
              <Link key={i + 1} href={{ pathname: `${el.name}` }}>
                <p className={Style.NavBar_box_left_menu_item}>{el.name}</p>
              </Link>
            ))}
          </div>
        </div>
        {/* //Middle SECTION */}
        <div className={Style.NavBar_box_middle}>
          <div className={Style.NavBar_box_middle_search}>
            <div className={Style.NavBar_box_middle_search_img}>
              <Image src={images.search} alt="search" width={20} height={20} />
            </div>
            {/* //INPUT SECTION */}
            <input type="text" placeholder="Search Tokens" />
          </div>
        </div>
        {/* //RIGHT SECTION */}
        <div className={Style.NavBar_box_right}>
          <div className={Style.NavBar_box_right_box}>
            <div className={Style.NavBar_box_right_box_img}>
              <Image src={images.ether} alt="NetWork" height={30} width={30} />
            </div>
            <p>networkConnect</p>
          </div>

          <button onClick={() => setOpenModel(true)}>Connect</button>

          {openModel && (
            <Model setOpenModel={setOpenModel} connectWallet={connectWallet} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
