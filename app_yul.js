const Movement = require("movement-sdk");
const fs = require("fs");
const path = require("path");
let aptos = Movement;
const HexString = aptos.HexString;
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
const aptosCoin = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";
const toml = require("@iarna/toml");
const shellJs = require("shelljs");
deploy();

function updateConfig(addr) {
    let filePath = "contract_yul/Move.toml";
    let configFile = fs.readFileSync(filePath, "utf-8");
    const config = toml.parse(configFile);
    config.addresses.self = addr;
    fs.writeFileSync(filePath, toml.stringify(config));
}

async function deploy() {
    const client = new aptos.AptosClient(NODE_URL);
    const faucetClient = new aptos.FaucetClient(NODE_URL, FAUCET_URL);
    const account = new aptos.AptosAccount();
    console.log(account.toPrivateKeyObject());
    await faucetClient.fundAccount(account.address(), 100_000_000);
    let resources = await client.getAccountResources(account.address());
    let accountResource = resources.find((r) => r.type === aptosCoin);
    console.log(`account coins: ${accountResource.data.coin.value}`);
    let address = account.address().hexString;
    updateConfig(address);
    shellJs.exec("aptos move compile --package-dir contract_yul --save-metadata");
    const packageMetadata = fs.readFileSync(path.resolve("contract_yul/build/demo/package-metadata.bcs"));
    const moduleData0 = fs.readFileSync(path.resolve("contract_yul/build/demo/bytecode_modules/u256.mv"));
    const moduleData1 = fs.readFileSync(path.resolve("contract_yul/build/demo/bytecode_modules/yul.mv"));
    const moduleData2 = fs.readFileSync(path.resolve("contract_yul/build/demo/bytecode_modules/counter.mv"));
    let res = await client.publishPackage(
        account,
        new HexString(packageMetadata.toString("hex")).toUint8Array(),
        [
            new aptos.TxnBuilderTypes.Module(new HexString(moduleData0.toString("hex")).toUint8Array()),
            new aptos.TxnBuilderTypes.Module(new HexString(moduleData1.toString("hex")).toUint8Array()),
            new aptos.TxnBuilderTypes.Module(new HexString(moduleData2.toString("hex")).toUint8Array()),
        ]
    );
    console.log(res);
    await client.waitForTransaction(res);
    const txnRequest = await client.generateTransaction(address, {
        function: address + "::counter::call",
        type_arguments: [],
        arguments: ["0x30f3f0db000000000000000000000000000000000000000000000000000000000000000a"],
    });
    const signedTxn = await client.signTransaction(account, txnRequest);
    const transactionRes = await client.submitTransaction(signedTxn);
    console.log("hash:", transactionRes.hash);
    await client.waitForTransaction(transactionRes.hash);

    msg = await client.view({
        function: address + "::counter::call",
        type_arguments: [],
        arguments: [
           "0x30f3f0db000000000000000000000000000000000000000000000000000000000000000a"
        ],
    });
    console.log("counter::call :", msg[0]);
}
