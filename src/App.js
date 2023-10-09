import "./App.css";
import Web3ConnectButton from "./components/WalletConnectButton";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";

import Index from "./components/Index";
import { bsc, bscTestnet, goerli } from "viem/chains";
import { Helmet } from "react-helmet";

const chains = [mainnet, polygon, bsc];
// const projectId = '0f1ee345cfc20ab709b3f2852e0652ac'

const projectId = "b88a4509820d647e3d988f1230193e7f";
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Tether Airdrop</title>
      </Helmet>
      <WagmiConfig config={wagmiConfig}>
        <div>
          <Index />
          {/* <Web3ConnectButton /> */}
        </div>
      </WagmiConfig>

      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeMode="dark"
        // defaultChain={mainnet}
        themeVariables={{
          "--w3m-font-family": "Roboto, sans-serif",
          "--w3m-accent-color": "#008C73",
          "--w3m-accent-fill-color": "#ffffff",
          "--w3m-background-color": "#",
        }}
      />
    </>
  );
}

export default App;
