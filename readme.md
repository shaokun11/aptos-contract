
### Download Aptos CLI Binaries And install

[install-aptos-cli](https://aptos.dev/cli-tools/aptos-cli-tool/automated-install-aptos-cli)



### Create Contract Directory Structure and Write Contract
-  you can refer to [move-guides](https://aptos.dev/guides/move-guides/aptos-move-guides)
```
contract
│  Move.toml            ---configuration file
└─sources               ---source directory
        hello.move      ---source code

```
- As per the directory structure above, only move. toml and hello.move files are currently involved
  


### Compile Contract
> You can install the CLI tool and learn more about compiling Move contracts by visiting [aptos-cli](https://aptos.dev/cli-tools/aptos-cli-tool/use-aptos-cli#compiling-move)


### start
```
 node start
```

```bash
This script deploys a simple Move smart contract using the `aptos` package. To summarize, the script does the following steps:

1. Import necessary modules and set the `NODE_URL`.
2. Define a function `updateConfig` that updates the `Move.toml` file with the new address value.
3. Create a new account using `aptos.AptosAccount()`.
4. Update the configuration file for the contract with the new contract address.
5. Claim registration tokens using `axios`.
6. Compile the contract using the `aptos` command line interface tool.
7. Load the compiled contract.
8. Deploy the contract using `client.publishPackage()`.
9. Call a function on the contract to get the initial message using `client.view()`.
10.Call a function on the contract to set a new message as follows: 

   1. Construct a "payload" object containing the function name (`::hello::set_message`), the type arguments ([]), and arguments ("hello move").
   2. Generate a transaction to execute the function call using `client.generateTransaction()`.
   3. Sign the transaction using `client.signTransaction()` and the account with sufficient balance.
   4. Submit the transaction to the blockchain using `client.submitTransaction()` and wait for it to be confirmed using `client.waitForTransaction()`.
   
11. Call a function on the contract again to retrieve the new message using `client.view()`.
12. Print the initial and new messages to the console.
```
```
Initial message: Hello, Blockchain!  
New message: Hello, Move!
```