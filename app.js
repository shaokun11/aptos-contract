const Movement = require("movement-sdk");
const fs = require("fs");
const axios = require("axios");
let aptos = Movement;
const HexString = aptos.HexString;
const shellJs = require("shelljs");
const toml = require("@iarna/toml");
// const NODE_URL = "https://submovet.bbd.sh/v1";
const NODE_URL = "https://seed-node1.movementlabs.xyz";
const normal_account = {
  address: "0xb3e5e9d58797efbce688894c9aebf09afb074d9c03201b452bc81e8afcd4a75d",
  publicKeyHex:
    "0xd91cd0f918bcf87fa5b1969dbe21af5973de6abbc1eced010f866e4a19dbeeca",
  privateKeyHex:
    "0xf238ff22567c56bdaa18105f229ac0dacc2d9f73dfc5bf08a2a2a4a0fac4d222",
};

// Update the `Move.toml` file with the new address value2
function updateConfig(addr) {
  let filePath = "contract/Move.toml";
  let configFile = fs.readFileSync(filePath, "utf-8");
  const config = toml.parse(configFile);
  // Replace the existing address with the new address value
  config.addresses.hello_blockchain = addr;
  fs.writeFileSync(filePath, toml.stringify(config));
}

// Call the `start` function when the script is executed
// deploy();

getLegerInfo()
async function getLegerInfo(){
  const client = new aptos.AptosClient(NODE_URL);
  let info = await client.getLedgerInfo();
  console.log(info);
}


async function deploy() {
  const client = new aptos.AptosClient(NODE_URL);
  // Create a new account
  // const account = new aptos.AptosAccount();
  const account = aptos.AptosAccount.fromAptosAccountObject({
    privateKeyHex: normal_account.privateKeyHex,
  });

  console.log(account.toPrivateKeyObject());
  // Get the hexadecimal representation of the account's address
  let address = account.address().hexString;
  // Update the configuration file for the contract
  updateConfig(address);
  // Claim registration tokens
  await axios({
    method: "post",
    url: NODE_URL + "/mint?pub_key=" + account.pubKey(),
  });
  // Compile the contract
  // shellJs.exec("aptos move compile --package-dir contract --save-metadata");
  // Load the contract
  const packageMetadata = fs.readFileSync(
    "contract/build/hello_blockchain/package-metadata.bcs"
  );
  const moduleData = fs.readFileSync(
    "contract/build/hello_blockchain/bytecode_modules/hello.mv"
  );
  // Deploy the contract
  let res = await client.publishPackage(
    account,
    new HexString(packageMetadata.toString("hex")).toUint8Array(),
    [
      new aptos.TxnBuilderTypes.Module(
        new HexString(moduleData.toString("hex")).toUint8Array()
      ),
    ]
  );
  await client.waitForTransaction(res);
  // Call a function on the contract to get an initial message
  let payload = {
    function: address + "::hello::get_message",
    type_arguments: [],
    arguments: [address],
  };
  let msg = await client.view(payload);
  console.log("init chain message :", msg[0]);
  // Call a function on the contract to set a new message
  payload = {
    function: address + "::hello::set_message",
    type_arguments: [],
    arguments: ["hello move , now is " + Date.now()],
  };
  const txnRequest = await client.generateTransaction(
    account.address(),
    payload
  );
  const signedTxn = await client.signTransaction(account, txnRequest);
  const transactionRes = await client.submitTransaction(signedTxn);
  await client.waitForTransaction(transactionRes.hash);
  // Call a function on the contract to get the new message
  payload = {
    function: address + "::hello::get_message",
    type_arguments: [],
    arguments: [address],
  };
  msg = await client.view(payload);
  console.log("new message", msg[0]);
}


function readContract(){
  let payload = {
    function: address + "::hello::get_message",
    type_arguments: [],
    arguments: [address],
  };
}