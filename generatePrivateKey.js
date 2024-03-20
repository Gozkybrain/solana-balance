const { Keypair } = require('@solana/web3.js');

// Generate a new keypair
const keypair = Keypair.generate();

// Get the private key
const privateKey = keypair.secretKey;

console.log('Private Key:', privateKey.toString());

// Private Key: 160, 252, 232, 221, 228, 222, 1, 79, 178, 23, 17, 103, 196, 65, 37, 169, 101, 47, 244, 181, 183, 124, 69, 61, 242, 212, 248, 94, 107, 211, 75, 240, 128, 179, 87, 26, 214, 71, 216, 1, 199, 180, 195, 65, 184, 86, 140, 104, 13, 120, 201, 73, 29, 248, 172, 216, 185, 147, 164, 32, 164, 237, 183, 241
