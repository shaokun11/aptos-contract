const aptos = require("aptos");
const account = new aptos.AptosAccount();
const info = account.toPrivateKeyObject();
console.log(info)


