import React, { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import "./App.css";
import ConnectButton from "./components/ConnectWallet";
import DisconnectButton from "./components/DisconnectWallet";
import qrcode from "qrcode-generator";
import UpdateContract from "./components/UpdateContract";
import Transfers from "./components/Transfers";

enum BeaconConnection {
  NONE = "",
  LISTENING = "Listening to P2P channel",
  CONNECTED = "Channel connected",
  PERMISSION_REQUEST_SENT = "Permission request sent, waiting for response",
  PERMISSION_REQUEST_SUCCESS = "Wallet is connected"
}

const App = () => {
  const [Tezos, setTezos] = useState<TezosToolkit>(
    new TezosToolkit("https://ghostnet.ecadinfra.com")
  );
  const [contract, setContract] = useState<any>(undefined);
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);
  const [storage, setStorage] = useState<number>(0);
  const [copiedPublicToken, setCopiedPublicToken] = useState<boolean>(false);
  const [beaconConnection, setBeaconConnection] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("transfer");

  // Ghostnet Increment/Decrement contract
  const contractAddress: string = "KT1QMGSLynvwwSfGbaiJ8gzWHibTCweCGcu8";

  const generateQrCode = (): { __html: string } => {
    const qr = qrcode(0, "L");
    qr.addData(publicToken || "");
    qr.make();

    return { __html: qr.createImgTag(4) };
  };

  if (publicToken && (!userAddress || isNaN(userBalance))) {
    return (
      <div className="main-box">
        <h1>Taquito React template</h1>
        <div id="dialog">
          <header>Try the Taquito React template!</header>
          <div id="content">
            <p className="text-align-center">
              <i className="fas fa-broadcast-tower"></i>&nbsp; Connecting to
              your wallet
            </p>
            <div
              dangerouslySetInnerHTML={generateQrCode()}
              className="text-align-center"
            ></div>
            <p id="public-token">
              {copiedPublicToken ? (
                <span id="public-token-copy__copied">
                  <i className="far fa-thumbs-up"></i>
                </span>
              ) : (
                <span
                  id="public-token-copy"
                  onClick={() => {
                    if (publicToken) {
                      navigator.clipboard.writeText(publicToken);
                      setCopiedPublicToken(true);
                      setTimeout(() => setCopiedPublicToken(false), 2000);
                    }
                  }}
                >
                  <i className="far fa-copy"></i>
                </span>
              )}

              <span>
                Public token: <span>{publicToken}</span>
              </span>
            </p>
            <p className="text-align-center">
              Status: {beaconConnection ? "Connected" : "Disconnected"}
            </p>
          </div>
        </div>
        <div id="footer">
          <img src="built-with-taquito.png" alt="Built with Taquito" />
        </div>
      </div>
    );
  } else if (userAddress && !isNaN(userBalance)) {
    return (
      <div className="main-box">
        <h1>Taquito Boilerplate</h1>
        <div id="tabs">
          <div
            id="transfer"
            className={activeTab === "transfer" ? "active" : ""}
            onClick={() => setActiveTab("transfer")}
          >
            Make a transfer
          </div>
          <div
            id="contract"
            className={activeTab === "contract" ? "active" : ""}
            onClick={() => setActiveTab("contract")}
          >
            Interact with a contract
          </div>
        </div>
        <div id="dialog">
          <div id="content">
            {activeTab === "transfer" ? (
              <div id="transfers">
                <h3 className="text-align-center">Make a transfer</h3>
                <Transfers
                  Tezos={Tezos}
                  setUserBalance={setUserBalance}
                  userAddress={userAddress}
                />
              </div>
            ) : (
              <div id="increment-decrement">
                <h3 className="text-align-center">
                  Current counter: <span>{storage}</span>
                </h3>
                <UpdateContract
                  contract={contract}
                  setUserBalance={setUserBalance}
                  Tezos={Tezos}
                  userAddress={userAddress}
                  setStorage={setStorage}
                />
              </div>
            )}
            <p>
              <i className="far fa-file-code"></i>&nbsp;
              <a
                href={`https://better-call.dev/ghostnet/${contractAddress}/operations`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contractAddress}
              </a>
            </p>
            <p>
              <i className="far fa-address-card"></i>&nbsp; {userAddress}
            </p>
            <p>
              <i className="fas fa-piggy-bank"></i>&nbsp;
              {(userBalance / 1000000).toLocaleString("en-US")} ꜩ
            </p>
          </div>
          <DisconnectButton
            wallet={wallet}
            setPublicToken={setPublicToken}
            setUserAddress={setUserAddress}
            setUserBalance={setUserBalance}
            setWallet={setWallet}
            setTezos={setTezos}
            setBeaconConnection={setBeaconConnection}
          />
        </div>
        <div id="footer">
          <img src="built-with-taquito.png" alt="Built with Taquito" />
        </div>
      </div>
    );
  } else if (!publicToken && !userAddress && !userBalance) {
    return (
      <div className="main-box">
        <div className="title">
          <h1>Taquito React template</h1>
          <a href="https://app.netlify.com/start/deploy?repository=https://github.com/starlabman/Learnweb3_tezos_dapp">
            <img
              src="https://www.netlify.com/img/deploy/button.svg"
              alt="netlify-button"
            />
          </a>
        </div>
        <div id="dialog">
          <header>Welcome to the Tutorial : Building and deploying a dApp on Tezos Blockchain</header>
          <div id="content">
            <p>About us</p>
            <p>
            

Tezos India is a community-driven organisation that promotes the adoption of Tezos blockchain technology in India. The organisation has launched a bounty program to encourage the community to contribute to the Tezos ecosystem.

Tezos India bounty program offers rewards to individuals or teams who develop useful tools, applications, or other solutions that can help the Tezos network. The program is open to developers, designers, writers, and anyone who can contribute to the Tezos ecosystem.

The rewards for the Tezos India bounty program vary depending on the complexity and usefulness of the project.
              <br />
              If you have not done so already, go to the{" "}
              <a
                href="https://github.com/starlabman/Learnweb3_tezos_dapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                About the Bounty
              </a>{" "}
              Create a tutorial to teach future developers how write and  <em>"deploy dApp on Tezos Blockchain "</em> button.
            </p>
            <p>
            <h2>About the Bounty</h2>
              
              Create a tutorial to teach future developers how write and  <em>"deploy dApp on Tezos Blockchain "</em> button.
            </p>
            <p>Go forth and Tezos!</p>
          </div>
          <ConnectButton
            Tezos={Tezos}
            setContract={setContract}
            setPublicToken={setPublicToken}
            setWallet={setWallet}
            setUserAddress={setUserAddress}
            setUserBalance={setUserBalance}
            setStorage={setStorage}
            contractAddress={contractAddress}
            setBeaconConnection={setBeaconConnection}
            wallet={wallet}
          />
        </div>
        <div id="footer">
          <img src="built-with-taquito.png" alt="Built by starlabman" />
        </div>
      </div>
    );
  } else {
    return <div>An error has occurred</div>;
  }
};

export default App;
