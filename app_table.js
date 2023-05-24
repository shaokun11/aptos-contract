const fs = require("fs");
const aptos = require("aptos");
const HexString = aptos.HexString;
const NODE_URL = "http://127.0.0.1:3002/v1/";
const client = new aptos.AptosClient(NODE_URL);
const pair = {
  address: "0x44977ccdbdfb32fd0c0361417b721ea890ada2dd217e3dd0956ee0a16af0331f",
  publicKeyHex:
    "0x6313b8035a6203591fb3b245471a8227dec113691d76233280c18552c26baeed",
  privateKeyHex:
    "0x724758a32bfed41d6ed6d209f57139e214d9f68b1ce4c8ffe3c9fe12f9cbbebd",
};
const account = aptos.AptosAccount.fromAptosAccountObject({
  privateKeyHex: pair.privateKeyHex,
});
// deploy()
// sendContract();
// getTableItem();

async function deploy() {
  const packageMetadata = fs.readFileSync(
    "contract_table/build/friends/package-metadata.bcs"
  );
  const moduleData = fs.readFileSync(
    "contract_table/build/friends/bytecode_modules/nicknames.mv"
  );

  let res = await client.publishPackage(
    account,
    new HexString(packageMetadata.toString("hex")).toUint8Array(),
    [
      new aptos.TxnBuilderTypes.Module(
        new HexString(moduleData.toString("hex")).toUint8Array()
      ),
    ]
  );
  console.log("publishPackage ", res);
  await client.waitForTransaction(res);
}

async function sendContract() {
  const address = account.address();
  let payload = {
    function: address + "::nicknames::initialize",
    type_arguments: [],
    arguments: [],
  };
  // init
  sendTx(payload);
  await new Promise((r) => setTimeout(r, 3 * 1000));
  payload = {
    function: address + "::nicknames::add",
    type_arguments: [],
    arguments: ["shaokun", address],
  };
  // set contract
  sendTx(payload);
}

async function sendTx(payload) {
  const txnRequest = await client.generateTransaction(
    account.address(),
    payload
  );
  const signedTxn = await client.signTransaction(account, txnRequest);
  const transactionRes = await client.submitTransaction(signedTxn);
  console.log("hash:", transactionRes.hash);
  await client.waitForTransaction(transactionRes.hash);
}

async function getTableItem() {
// https://submove-fuji.bbd.sh/v1/accounts/0x44977ccdbdfb32fd0c0361417b721ea890ada2dd217e3dd0956ee0a16af0331f/resource/0x44977ccdbdfb32fd0c0361417b721ea890ada2dd217e3dd0956ee0a16af0331f::nicknames::Nicknames
// {
//     "type": "0x44977ccdbdfb32fd0c0361417b721ea890ada2dd217e3dd0956ee0a16af0331f::nicknames::Nicknames",
//     "data": {
//       "nickname_to_addr": {
//         "handle": "0x5cac4615a8082d98568dbdbd06da7019c594313068cf04b4b202836f8185176a"
//       }
//     }
//   }
  let tableItem = await client.getTableItem(
    "0x5cac4615a8082d98568dbdbd06da7019c594313068cf04b4b202836f8185176a",
    {
      key_type: "0x1::string::String",
      value_type: "address",
      key: "shaokun",
    }
  );
  console.log("tableItem:", tableItem);
}

