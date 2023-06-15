const aptos = require("aptos");
const fs = require("fs");
const NODE_URL = "http://127.0.0.1:3001/v1/";
const readline = require("readline");
const axios = require("axios");
const rand_acc_file_name = "acc.txt";
const _ = require("lodash");
const client = new aptos.AptosClient(NODE_URL);
const aptosCoin = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";

async function createAccount() {
  const account = new aptos.AptosAccount();
  const info = account.toPrivateKeyObject();
  await axios({
    method: "post",
    url: NODE_URL + "/mint?pub_key=" + account.pubKey(),
  });
  await new Promise((r) => setTimeout(r, 2 * 1000));
  try {
    let resources = await client.getAccountResources(info.address);
    let accountResource = resources.find((r) => r.type === aptosCoin);
    const amount = accountResource.data.coin.value;
    console.log(info.address, " amount is ", amount);
    if (amount > 0) {
      fs.appendFileSync(rand_acc_file_name, JSON.stringify(info) + "\n");
    } else {
      await new Promise((r) => setTimeout(r, 5 * 1000));
    }
  } catch (error) {
    await new Promise((r) => setTimeout(r, 5 * 1000));
  }
}

function exeAccTransfer() {
  let arr = [];
  const rl = readline.createInterface({
    input: fs.createReadStream(rand_acc_file_name),
    crlfDelay: Infinity,
  });
  rl.on("line", (line) => {
    const key = JSON.parse(line);
    arr.push(key);
  });
  rl.on("close", async function () {
    while (true) {
      for (let i = 0; i < arr.length - 1; i += 1) {
        transfer(arr[i].privateKeyHex, arr[i + 1].address);
        const ts = _.random(2, 5);
        await new Promise((r) => setTimeout(r, 0.1 * 1000));
        console.log("send i is ", i);
      }
    }
  });
}

async function batchCreateAcc() {
  for (let index = 0; index < 20000; index++) {
    await createAccount();
  }
}
batchCreateAcc();
// batchCreateAcc().then(exeAccTransfer);
// exeAccTransfer();

async function transfer(privateKey, to) {
  console.log("start send %s to ", privateKey, to);
  const account1 = aptos.AptosAccount.fromAptosAccountObject({
    privateKeyHex: privateKey,
  });
  const amount = _.random(1, 10);
  const payload = {
    type: "entry_function_payload",
    function: "0x1::coin::transfer",
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: [to, amount],
  };

  const txnRequest = await client.generateTransaction(
    account1.address(),
    payload
  );
  const signedTxn = await client.signTransaction(account1, txnRequest);
  const transactionRes = await client.submitTransaction(signedTxn);
  console.log("tx", transactionRes.hash);
}
