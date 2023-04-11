const aptos = require("aptos");
const fs = require("fs");
const axios = require("axios");
const HexString = aptos.HexString;
const shellJs = require("shelljs");
const toml = require("@iarna/toml");
const NODE_URL = "https://submove-fuji.bbd.sh/v1";

// Update the `Move.toml` file with the new address value
function updateConfig(addr) {
  let filePath = "contract/Move.toml";
  let configFile = fs.readFileSync(filePath, "utf-8");
  const config = toml.parse(configFile);
  // Replace the existing address with the new address value
  config.addresses.hello_blockchain = addr;
  fs.writeFileSync(filePath, toml.stringify(config));
}

// Call the `start` function when the script is executed
start();

async function start() {
  const client = new aptos.AptosClient(NODE_URL);
  // Create a new account
  const account = new aptos.AptosAccount();
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
  shellJs.exec("aptos move compile --package-dir contract --save-metadata");
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
    arguments: ["hello move"],
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