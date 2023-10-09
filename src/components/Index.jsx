import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import HomePage from "./HomePage";
import Footer from "./Footer";
import { useAccount, useNetwork, useBalance } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import { Helmet } from "react-helmet";
const Index = () => {
  const [mainAddress, setAddress] = useState(null);
  const { chain } = useNetwork();
  const { address } = useAccount();

  // console.log("chain ", chain);
  //   useEffect(() => {

  //   }, [mainAddress]);
  return (
    <div className="bg-gray-100 font-body h-full">
      <NavBar address={address} chain={chain} />
      <HomePage address={address} chain={chain} />
      <Footer />
    </div>
  );
};

export default Index;
