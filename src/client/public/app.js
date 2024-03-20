import * as solanaWeb3 from '@solana/web3.js';
import dotenv from 'dotenv'; // Import dotenv package

// Load environment variables from .env file
dotenv.config();

// Execute when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', async function () {
    // Get the button element for fetching the balance
    const getBalanceButton = document.getElementById('getBalanceButton');

    // Get the public key from environment variable
    const publicKeyString = process.env.PUBLIC_KEY;

    console.log('Public Key:', publicKeyString); // Log the public key

    if (!publicKeyString) {
        console.error('Error: Public key is not defined in the environment variables.');
        return;
    }

    // Create PublicKey object from publicKeyString
    const publicKey = new solanaWeb3.PublicKey(publicKeyString);

    // Connect to the Solana devnet cluster
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'));

    // Add an event listener to the button for fetching the balance
    getBalanceButton.addEventListener('click', async function () {
        try {
            // Disable the button and show loading spinner
            getBalanceButton.disabled = true;
            getBalanceButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';

            // Get the balance for your account
            const balance = await connection.getBalance(publicKey);
            const balanceInSol = balance / solanaWeb3.LAMPORTS_PER_SOL;

            // Get the wallet address
            const walletAddress = publicKey.toBase58();

            // Update modal with balance and wallet address
            displayModal('Account Information', `${balanceInSol.toFixed(6)} SOL`, `${walletAddress}`);

            // Enable the button after modal is displayed
            getBalanceButton.disabled = false;
            getBalanceButton.innerHTML = 'Get Balance';
        } catch (error) {
            // Display error message if fetching balance fails
            console.error('Error:', error);
            displayModal('Error', 'An error occurred while fetching the balance. Please try again.');

            // Enable the button if an error occurs
            getBalanceButton.disabled = false;
            getBalanceButton.innerHTML = 'Get Balance';
        }
    });

    // Function to display modal with given title and messages
    function displayModal(title, balanceMessage, walletAddressMessage) {
        const modalTitle = document.getElementById('airdropModalLabel');
        const balanceMessageElement = document.getElementById('balanceMessage');
        const walletAddressMessageElement = document.getElementById('walletAddressMessage');

        // Set modal title
        modalTitle.textContent = title;

        // Set balance message in modal
        balanceMessageElement.textContent = balanceMessage;

        // Set wallet address message in modal
        walletAddressMessageElement.textContent = walletAddressMessage;

        // Show the modal using jQuery
        $('#airdropModal').modal('show');
    }
});
