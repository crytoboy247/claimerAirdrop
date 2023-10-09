import React, { useState, useEffect } from "react";
import tether from "../images/tether.jpeg";
import WalletConnectButton from "./WalletConnectButton";

function switchNetwork() {}
const NavBar = () => {
  return (
    <div>
      <div className="flex justify-between items-center drop-shadow-md p-2 px-10 bg-white z-4">
        <div className="flex items-center">
          <img src={tether} className="object-contain w-15 h-10 rounded-md" />
          <a href="#" className="mx-2 uppercase font-bold  text-lg">
            Tether
          </a>
        </div>
        <div className="flex space-x-4  md:mx-20 items-center">
          <WalletConnectButton />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
