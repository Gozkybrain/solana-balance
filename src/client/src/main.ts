import {
    Keypair, // Importing Keypair class to manage cryptographic keypair
    Connection, // Importing Connection class to interact with the Solana blockchain
    PublicKey, // Importing PublicKey class to represent Solana public keys
    LAMPORTS_PER_SOL, // Importing constant for the number of lamports in one SOL (Solana token)
    TransactionInstruction, // Importing TransactionInstruction class to define transactions
    Transaction, // Importing Transaction class to create and send transactions
    sendAndConfirmTransaction, // Importing function to send and confirm transactions
} from '@solana/web3.js'; // Importing required modules from the Solana Web3.js library

import fs from 'mz/fs'; // Importing fs module with promises from Node.js file system utilities
import path from 'path'; // Importing path module from Node.js to handle file paths


// Path to the program keypair JSON file
const PROGRAM_KEYPAIR_PATH = path.join(
    path.resolve(__dirname, '../../../dist/program'),
    'program-keypair.json'
);

// Main function to execute the client application
async function main() {
    console.log("Launching client...");

    try {
        // Establish connection to the Solana Devnet
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

        // Load the program keypair
        const programKeypair = await loadProgramKeypair();

        // Generate a new keypair for triggering actions
        const triggerKeypair = Keypair.generate();
        console.log('Airdrop Account Public Key:', triggerKeypair.publicKey.toBase58());

        // Request airdrop for the trigger account
        await requestAirdrop(connection, triggerKeypair.publicKey);

        // Ping the Solana program
        await pingProgram(connection, programKeypair.publicKey, triggerKeypair);

        // Get the balance of the trigger account
        const triggerBalance = await getBalance(connection, triggerKeypair.publicKey);
        console.log('Wallet Address:', triggerKeypair.publicKey.toBase58());
        console.log('New Balance:', triggerBalance / LAMPORTS_PER_SOL, 'SOL');

        // Calculate estimated earnings based on current hour
        const currentHour = new Date().getHours();
        const estimatedEarnings = (triggerBalance / LAMPORTS_PER_SOL) * currentHour;
        console.log('Estimated Earnings for the Hour in', currentHour ,'hour:', estimatedEarnings, 'SOL');
    } catch (error) {
        console.error("An error occurred:", error);
        process.exit(-1);
    }
}

// Function to load the program keypair from file
async function loadProgramKeypair(): Promise<Keypair> {
    const secretKeyString = await fs.readFile(PROGRAM_KEYPAIR_PATH, { encoding: 'utf8' });
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return Keypair.fromSecretKey(secretKey);
}

// Function to request airdrop for an account
async function requestAirdrop(connection: Connection, publicKey: PublicKey): Promise<void> {
    const airdropRequest = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropRequest);
}

// Function to ping the Solana program
async function pingProgram(connection: Connection, programId: PublicKey, triggerKeypair: Keypair): Promise<void> {
    console.log('-- Pinging Program ', programId.toBase58());

    // Construct the instruction to send to the program
    const instruction = new TransactionInstruction({
        keys: [{ pubkey: triggerKeypair.publicKey, isSigner: false, isWritable: true }],
        programId,
        data: Buffer.alloc(0), // No data payload for this instruction
    });

    // Send and confirm the transaction
    await sendAndConfirmTransaction(connection, new Transaction().add(instruction), [triggerKeypair]);
}

// Function to get the balance of an account
async function getBalance(connection: Connection, publicKey: PublicKey): Promise<number> {
    return await connection.getBalance(publicKey);
}

// Execute the main function and handle any errors
main().then(
    () => process.exit(), // Exit the process when execution completes successfully
    err => {
        console.error(err); // Log any errors encountered during execution
        process.exit(-1);   // Exit the process with a non-zero status code
    }
);
