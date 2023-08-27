const Movement = require("movement-sdk");
const fs = require("fs");
const axios = require("axios");
let aptos = Movement;
const HexString = aptos.HexString;
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const normal_account = {
    address: "0xa272d39841bac0be1e8a8f5f4ab3185be67527cd7f5d8f3973df6140961299f9",
    publicKeyHex: "0x32d6d757b70c307f98f971b5cf5b13efe51d9b95cb3c7818a79f9eeeddd39f9c",
    privateKeyHex: "0x5bdd35adf43166f6310100513d779870a4c6a206750c13a784cf17e15b43f6f4",
};


// Call the `start` function when the script is executed
deploy();



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

    // const packageMetadata = fs.readFileSync("meta.bcs");
    const packageMetadata = fs.readFileSync("contract_counter\\build\\demo108\\package-metadata.bcs");
    // const moduleData = fs.readFileSync("demo.mv");
    const moduleData = fs.readFileSync("contract_counter\\build\\demo108\\bytecode_modules\\demo108.mv");
    let res = await client.publishPackage(
        account,
        new HexString(packageMetadata.toString("hex")).toUint8Array(),
        [new aptos.TxnBuilderTypes.Module(new HexString(moduleData.toString("hex")).toUint8Array())]
    );
    console.log(res);
    // await client.waitForTransaction(res);
    // let payload = {
    //     function: address + "::demo102::add",
    //     type_arguments: [],
    //     arguments: ["14", "3"],
    // };
    // let msg = await client.view(payload);
    // console.log("init chain message :", msg[0]);
}
