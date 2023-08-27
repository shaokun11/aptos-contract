const Movement = require("movement-sdk");
const fs = require("fs");
const path = require("path");
let aptos = Movement;
const HexString = aptos.HexString;
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
// const NODE_URL = "http://127.0.0.1:8080";
// const FAUCET_URL = "http://127.0.0.1:8081";
const aptosCoin = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";
const normal_account = {
    address: "0xb3e5e9d58797efbce688894c9aebf09afb074d9c03201b452bc81e8afcd4a75d",
    publicKeyHex: "0xd91cd0f918bcf87fa5b1969dbe21af5973de6abbc1eced010f866e4a19dbeeca",
    privateKeyHex: "0xf238ff22567c56bdaa18105f229ac0dacc2d9f73dfc5bf08a2a2a4a0fac4d222",
};

deploy();

async function deploy() {
    const client = new aptos.AptosClient(NODE_URL);
    const faucetClient = new aptos.FaucetClient(NODE_URL, FAUCET_URL);
    const account = aptos.AptosAccount.fromAptosAccountObject({
        privateKeyHex: normal_account.privateKeyHex,
    });
    console.log(account.toPrivateKeyObject());
    await faucetClient.fundAccount(account.address(), 100_000_000);
    let resources = await client.getAccountResources(account.address());
    let accountResource = resources.find((r) => r.type === aptosCoin);
    console.log(`account coins: ${accountResource.data.coin.value}`);

    let address = account.address().hexString;

    const packageMetadata = fs.readFileSync(
        path.resolve("contract_native/build/demo01/package-metadata.bcs")
    );
    const moduleData = fs.readFileSync(path.resolve("contract_native/build/demo01/bytecode_modules/na01.mv"));
    let res = await client.publishPackage(
        account,
        new HexString(packageMetadata.toString("hex")).toUint8Array(),
        [new aptos.TxnBuilderTypes.Module(new HexString(moduleData.toString("hex")).toUint8Array())]
    );
    console.log(res);
    await client.waitForTransaction(res);
    let payload = {
        function: address + "::na01::evm_hash",
        type_arguments: [],
        arguments: ["helloworld"],
    };
    let msg = await client.view(payload);
    console.log("keccak256 message :", msg[0]);

    // payload = {
    //     function: address + "::na01::evm_chain_id",
    //     type_arguments: [],
    //     arguments: [],
    // };
    // msg = await client.view(payload);
    // console.log("evm_chain_id  :", msg[0]);
}
