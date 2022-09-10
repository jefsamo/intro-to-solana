import {
  Connection,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { FC, useEffect, useRef, useState } from "react";

interface AirdropProps {
  pubkey: PublicKey | null;
}

const network = "mainnet-beta";

const Airdrop: FC<AirdropProps> = ({ pubkey }) => {
  // Create a connection to blockchain and
  // make it persistent across renders
  const connection = useRef(new Connection(clusterApiUrl(network)));

  const [publickey] = useState<string>(pubkey!.toBase58());
  const [lamports, setLamports] = useState(100000);
  const [txid, setTxid] = useState<string | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [balance, setBalance] = useState(0);

  // Retrieve the balance when mounting the component
  useEffect(() => {
    // connection.current.getBalance(pubkey!).then(setBalance);
    const getBalance = async () => {
      try {
        const balance = await connection.current.getBalance(pubkey!);
        setBalance(balance);
      } catch (error) {
        console.log(error);
      }
    };
    getBalance();
    console.log(connection);
  }, [pubkey]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const requestAirdrop = await connection.current.requestAirdrop(
        pubkey!,
        lamports
      );
      setTxid(requestAirdrop);
      console.log(requestAirdrop);

      const latestBlockHash = await connection.current.getLatestBlockhash();

      const sign = await connection.current.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: requestAirdrop,
      });
      const confirmSign = sign.context.slot;
      setSlot(confirmSign);
      //   const balance = await connection.current.getBalance(pubkey!);
      //   setBalance(balance);
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLamports(Number(event.target.value));
  }

  return (
    <div>
      <p className="p15">&nbsp;</p>
      <form onSubmit={handleSubmit}>
        <label>Public Key to receive airdrop</label>
        <br />
        <input
          type="text"
          readOnly={true}
          value={publickey}
          className="input-text"
        />
        <br />
        <label>Lamports to request</label>
        <br />
        <input
          type="number"
          value={lamports}
          onChange={handleChange}
          className="input-text"
        />
        <br />
        <input type="submit" value="Request airdrop" className="input-submit" />
      </form>
      <p className="p15">&nbsp;</p>
      <hr />
      {txid ? <p>Transaction: {txid}</p> : null}
      {slot ? <p>Confirmation slot: {slot}</p> : null}
      <hr />
      <p>Your current balance is: {balance / LAMPORTS_PER_SOL}</p>
    </div>
  );
};

export default Airdrop;
