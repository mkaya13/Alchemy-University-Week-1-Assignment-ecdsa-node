const express = require("express");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { toHex } = require("ethereum-cryptography/utils");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes);

  return hash;
}

async function recoverKey(message, signature, recoveryBit) {
  const publicKey = await secp.recoverPublicKey(
    message,
    signature,
    recoveryBit
  );

  return publicKey;
}

const balances = {
  "04e25e67b9052218cc514ad00297f93ef802b900d214cfa694beab1202e92a71e7563ae13b8739faf4524b250b6356c5747522ff789a0f6e1c4bd6de837e84a038": 100,
  "044591d922daded77fdd26130ce20cbf98c9f77b81e708e80632c8c7d679c386e46c6127a227e544964d4da314700e9fa7ab21ceabaef5dcca3b8200cbff986022": 50,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  // TODO: get a signature from the client-side application

  const myMessage = "Hello World";
  const signature = new Uint8Array(Object.values(req.body.message[0]));
  const recoveryBit = req.body.message[1];

  // Recover the public address from the signature, and that is gonna be your sender

  const publicKey = toHex(
    await recoverKey(hashMessage(myMessage), signature, recoveryBit)
  );

  console.log("Public Key recovered by the signature: ", publicKey);

  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
