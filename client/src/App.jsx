import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [message, setMessage] = useState([]);
  

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        message={message}
        setMessage={setMessage}
      />
      <Transfer setBalance={setBalance} address={address} privateKey={privateKey} message = {message} />
    </div>
  );
}

export default App;
