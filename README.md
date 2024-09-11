# General Portfolio

# Turbine3 Work

## Prerequisite Task

In the prerequisite task for the Turbin3 cohort, we used typescript to generate a keypair, airdrop to that wallet, transfer sol, and enroll to the WBA registration program.

Folder:

    prereq-airdrop

## Rust Registration

In the registration task, we used rust to generate a keypair, airdrop to that wallet, swap between wallet keys and b58, transfer sol, and enroll to the WBA registration program.

Folder:

    rust-registration

## Class 1

In Class 1 we created a working token initizalizer, created the associated token account (ATA) within our own wallet for that token, then minted tokens into that ATA. I used the following during the class for additional [documentation](https://spl.solana.com/token).

Files:

    ts\cluster1\spl_init.ts
    ts\cluster1\spl_mint.ts
<!-- 
Here is the final [transaction](https://explorer.solana.com/tx/54F32PnGEE2vAeNau2sJwanpYwrfHBSqRkZKevN9nQs13TFiZErDvp2vjWPopg1s7rNZU61CBrtCYsWr9eqxLBNs?cluster=devnet) of this class' work, which is the mint tx. -->

## Necessary Run Tasks

1.  Standard install of necessary modules

        npm install --force // Or fix depedents

2.  Add a wba-wallet address private key locally, and double check <code>.gitignore</code> based on your wallet file naming convention
3.  After updating any ts files, use <code>npm run {name in package.json scripts}</code> to run them

        cd ts
        npm run spl_init