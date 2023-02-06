import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex } from "ethereum-cryptography/utils"
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, setMessage }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = toHex(secp.getPublicKey(privateKey))
    setAddress(address);
    signMessage("Hello World", privateKey);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

    // Signing Process

    async function recoverKey(message, signature, recoveryBit) {
      const publicKey = await secp.recoverPublicKey(hashMessage(message), signature, recoveryBit)
      return publicKey;
    }

    const hashMessage = (message) => {
      const bytes = utf8ToBytes(message);
      const hash = keccak256(bytes);
    
      return hash;
    }
  
    const signMessage = async(msg,privateKey) => {
      const hashedMessage = hashMessage(msg);
      const message = await secp.sign(hashedMessage,
        privateKey = privateKey,
        {recovered : true} )
  
      setMessage(message);
      
      return message
    }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type in a private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Address: {address.slice(0, )}...
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
