import { FC, useEffect, useState } from "react";

import { PublicKey } from "@solana/web3.js";
import Airdrop from "./Airdrop";

enum Event {
  disconnect = "disconnect",
  connect = "connect",
  accountChanged = "accountChanged",
}

type PhantomEvent = Event.disconnect | Event.connect | Event.accountChanged;

interface ConnectOptions {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
  connect: (opts?: ConnectOptions) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, callback: (args: any) => void) => void;
  isPhantom: boolean;
}

type WindowWithSolana = Window & {
  solana?: PhantomProvider;
};

const Connect2Phantom: FC = () => {
  const [walletAvail, setWalletAvail] = useState(false);
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [connected, setConnected] = useState(false);
  const [pubKey, setPubKey] = useState<PublicKey | null>(null);

  useEffect(() => {
    if ("solana" in window) {
      const solWindow = window as WindowWithSolana;
      if (solWindow?.solana?.isPhantom) {
        setProvider(solWindow.solana);
        setWalletAvail(true);

        solWindow.solana.connect({ onlyIfTrusted: true });
      }
    }
  }, []);

  useEffect(() => {
    provider?.on(Event.connect, (publicKey: PublicKey) => {
      console.log(`Connect event: ${publicKey}`);
      setConnected(true);
      setPubKey(publicKey);
    });
    provider?.on(Event.disconnect, () => {
      console.log(`disconnect event: `);
      setConnected(false);
      setPubKey(null);
    });
  }, [provider]);

  const connectHandler = () => {
    console.log(`connect handler`);
    provider?.connect().catch((err) => {
      console.error("connect ERROR:", err);
    });
  };

  const disconnectHandler = () => {
    console.log("disconnect handler");
    provider?.disconnect().catch((err) => {
      console.error("disconnect ERROR:", err);
    });
  };
  return (
    <div>
      {walletAvail ? (
        <>
          <button onClick={connected ? disconnectHandler : connectHandler}>
            {connected ? "Disconnect" : "Connect"}
          </button>

          {connected ? <p>Your public key is : {pubKey?.toBase58()}</p> : null}
        </>
      ) : (
        <>
          <p>
            Opps!!! Phantom is not available. Go get it{" "}
            <a href="https://phantom.app/">https://phantom.app/</a>.
          </p>
        </>
      )}
      {pubKey ? <Airdrop pubkey={pubKey} /> : <p>Connect your wallet</p>}
    </div>
  );
};

export default Connect2Phantom;
