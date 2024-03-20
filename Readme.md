# MY SOLANA BALANCE
This is my first attempt to build a simple smart contract with Rust on the Solana Network, I will leave a detailed guide as usual on all the steps I took, and all i had to do so that this process can be done again without stress.

## About Folder Structure

### 1. src/client/src/main.ts

This TypeScript file is the entry point for a Solana blockchain client application. It establishes a connection to the Solana Devnet, reads the program's keypair from a file, generates an airdrop account for transactions, requests an airdrop of SOL tokens to the account, and finally sends a transaction to interact with the deployed Solana program. The client logs various stages of the process to the console. It serves as a bridge between the client application and the Solana blockchain, enabling users to interact with the blockchain programmatically.

### 2. src/program/src/lib.rs

This program retrieves the current hour of the day from the clock account, extracts the user's balance, multiplies the balance by the current hour, and prints the estimated earnings. 

### NOTE:

As an update to the previous version, the frontend is now interacting with the smart contract with the help of our main.ts
Remember that this is a test project, and I will be leaving out some of my details just so it is easy to recognize in a real project trial.



## Setting up Environment
1. Start by generating Cargo: _cargo install cargo-generate_

2. Generate a New Keypair: _solana-keygen new_

```
Wrote new keypair to /Users/mac/.config/solana/id.json
=======================================================================
pubkey: CezKNcrACVzGQR9frARUWfGXQBRrFDEBtSkkCqYEwTGE
=======================================================================
Save this seed phrase and your BIP39 passphrase to recover your new keypair:
elite south vapor sea shuffle asthma tell rebel odor common vapor share
=======================================================================
```

3. Check the config and set a keypair: _solana config set --keypair /Users/mac/.config/solana/id.json_

Alternatively: _solana config get_

```
Config File: /Users/mac/.config/solana/cli/config.yml
RPC URL: https://api.mainnet-beta.solana.com 
WebSocket URL: wss://api.mainnet-beta.solana.com/ (computed)
Keypair Path: /Users/mac/.config/solana/id.json 
Commitment: confirmed 
```

4. This is set to the mainnet beta, to set to the devnet: _solana config set --url https://api.devnet.solana.com_

```
Config File: /Users/mac/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com 
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /Users/mac/.config/solana/id.json 
Commitment: confirmed 
```

5. Add Funds to Your devnet account: _solana airdrop 3_

Then check balance on the account: _solana balance_

This leaves the devnet account at 3Sol added via airdrop.

6. To get started with the Project,
```
mkdir my-solana
cd my-solana
touch package.json
mkdir src
cd src
solana
```
The solana command helps check if solana installed works globally even in the new directory.

Remember to run the _ls_ command to know where you are and how the folder structure looks from the terminal.

7. Now Create a Library with the program package, and run the build-bpf inside the program directory.
```
cargo new --lib program
cd program
cargo build-bpf
```
NOTE: Remember to update your Cargo.toml and lib.rs files.

8. To get the path to our solana program, usually program.so. From the Program Directory;
```
cd target
cd deploy
readlink -f program.so
```
the readlink command provides a link to the program.so file currently in the deploy folder.

_/Users/mac/Documents/Web3-App/my-solana/src/program/target/deploy/program.so_

9. Deploy the program from the path: 
```
solana program deploy /Users/mac/Documents/Web3-App/my-solana/src/program/target/deploy/program.so
```

_Program Id: HnERn4Epw7QaAT6s1r4CJ6ZXmAYgmeiRxDLg7cZ4YFwD_

10. Goto the root directory, ie my-solana. Then Install the Solana Web3 Package using NPM.
```
npm install --save @solana/web3.js
```
This should provide you with the node_modules, package.json and the package-lock.json.

Now, we run a build for our program using npm
```
npm run build:program
```

To deploy this time to the solana dev net, 
```
solana program deploy ./dist/program/program.so
```

Program Id: _CvfRN1ZcgoJPxGUhL1DkiiZPgoLgb3ZLT8QNBjngskbe_

* To check for invoked program from the program: _

```
solana logs | grep "CvfRN1ZcgoJPxGUhL1DkiiZPgoLgb3ZLT8QNBjngskbe invoke" - A 3
```
* To Start the program:
```
npm install
npm run start
```

* To start a local host server for frontend:

```
cd to the public folder inside the client
npm install -g parcel-bundler
parcel index.html
```
A server will start and you can preview your frontend and have it interact with the smart contract.

So far, the project from the command line can:

1. Request airdrop to add up balance
2. Check balance
3. Send transaction to a random airdrop (in the smart contract only)
4. generatePrivateKey is used to generate the private key for transactions.

* How does the application work from a developer angle?
The lib.rs is the smart contract written in rust, it is the blockchain but to connect to our smart contract or any contract, we use the main.ts This connects to the smart contracts using @solana/web3.js and returns necessary data, which can be displayed on the frontend using app.js. This app.js can be interacted with html or react.
