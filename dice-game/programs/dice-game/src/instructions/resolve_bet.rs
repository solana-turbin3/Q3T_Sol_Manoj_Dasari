// Import necessary modules and dependencies from Anchor, Solana, and other crates
use anchor_lang::{prelude::*, solana_program, system_program::{transfer, Transfer}};  // Importing Anchor framework prelude and transfer functionality from the system program
use anchor_instruction_sysvar::Ed25519InstructionSignatures;  // Importing a utility for handling Ed25519 instruction signatures
use solana_program::{sysvar::instructions::load_instruction_at_checked, ed25519_program, hash::hash};  // Importing Solana program utilities for instruction introspection, Ed25519 program ID, and hashing

// Import custom modules from the current crate
use crate::{state::Bet, errors::DiceError};  // Importing custom Bet state and DiceError definitions

// Constant definition
pub const HOUSE_EDGE: u16 = 150; // Defines a 1.5% house edge for the betting logic

// Struct definition for account context required by the ResolveBet instruction
#[derive(Accounts)]
pub struct ResolveBet<'info> {
    #[account(mut)]
    pub house: Signer<'info>,  // The house (i.e., the authority or manager of the vault) must sign the transaction

    #[account(
        mut
    )]
    ///CHECK: This is safe
    pub player: UncheckedAccount<'info>,  // The player placing the bet; UncheckedAccount is used here as no checks are performed

    #[account(
        mut,
        seeds = [b"vault", house.key().as_ref()],  // Defines a PDA (Program Derived Address) for the vault using the house's key
        bump
    )]
    pub vault: SystemAccount<'info>,  // The vault account holding the funds

    #[account(
        mut,
        close = player,  // Close the bet account and send the remaining funds to the player when done
        seeds = [b"bet", vault.key().as_ref(), bet.seed.to_le_bytes().as_ref()],  // Defines a PDA for the bet using the vault key and bet seed
        bump = bet.bump
    )]
    pub bet: Account<'info, Bet>,  // The bet account containing information about the bet

    #[account(
        address = solana_program::sysvar::instructions::ID
    )]
    pub instruction_sysvar: AccountInfo<'info>,  // The system variable that holds instructions information (required for signature verification)

    pub system_program: Program<'info, System>  // Reference to the Solana system program
}

// Implementation of methods for the ResolveBet struct
impl<'info> ResolveBet<'info> {

    // Method to verify an Ed25519 signature
    pub fn verify_ed25519_signature(&mut self, sig: &[u8]) -> Result<()> {
        // Load the Ed25519 signature instruction from the instruction sysvar
        let ix = load_instruction_at_checked(
            0,  // Load the first instruction
            &self.instruction_sysvar.to_account_info()
        )?;

        // Ensure the instruction is from the Ed25519 program
        require_keys_eq!(ix.program_id, ed25519_program::ID, DiceError::Ed25519Program);

        // Ensure that no accounts are associated with this instruction
        require_eq!(ix.accounts.len(), 0, DiceError::Ed25519Accounts);

        // Unpack the Ed25519 signatures from the instruction data
        let signatures = Ed25519InstructionSignatures::unpack(&ix.data)?.0;

        // Ensure that there is exactly one signature in the instruction
        require_eq!(signatures.len(), 1, DiceError::Ed25519DataLength);
        let signature = &signatures[0];

        // Ensure that the signature data is verifiable
        require!(signature.is_verifiable, DiceError::Ed25519Header);

        // Verify that the public key matches the house's key
        require_keys_eq!(signature.public_key.ok_or(DiceError::Ed25519Pubkey)?, self.house.key(), DiceError::Ed25519Pubkey);

        // Verify that the provided signature matches the expected signature
        require!(&signature.signature.ok_or(DiceError::Ed25519Signature)?.eq(sig), DiceError::Ed25519Signature);

        // Verify that the message data matches the serialized bet data
        require!(&signature.message.as_ref().ok_or(DiceError::Ed25519Signature)?.eq(&self.bet.to_slice()), DiceError::Ed25519Signature);

        Ok(())
    }

    // Method to resolve a bet based on a signature
    pub fn resolve_bet(&mut self, bumps: &ResolveBetBumps, sig: &[u8]) -> Result<()> {
        // Hash the signature to generate a pseudo-random number
        let hash = hash(sig).to_bytes();
        let mut hash_16: [u8;16] = [0;16];  // Create a 16-byte array for the lower half of the hash
        hash_16.copy_from_slice(&hash[0..16]);  // Copy the lower 16 bytes from the hash
        let lower = u128::from_le_bytes(hash_16);  // Convert the lower half to a u128 value

        hash_16.copy_from_slice(&hash[16..32]);  // Copy the upper 16 bytes from the hash
        let upper = u128::from_le_bytes(hash_16);  // Convert the upper half to a u128 value
        
        // Calculate the roll outcome using the hash values
        let roll = lower
            .wrapping_add(upper)  // Add the two u128 values
            .wrapping_rem(100) as u8 + 1;  // Take the modulus 100 of the result and add 1 to get a value between 1 and 100

        // Check if the bet's roll value is greater than the calculated roll
        if self.bet.roll > roll {
            // Calculate the payout based on the bet amount and house edge
            let payout = (self.bet.amount as u128)
            .checked_mul(10000 - HOUSE_EDGE as u128).ok_or(DiceError::Overflow)?  // Subtract the house edge from 100%
            .checked_div(self.bet.roll as u128 - 1).ok_or(DiceError::Overflow)?  // Divide by the player's roll - 1
            .checked_div(100).ok_or(DiceError::Overflow)? as u64;  // Divide by 100 and cast to u64

            // Create a Transfer context to move the payout from the vault to the player
            let accounts = Transfer {
                from: self.vault.to_account_info(),
                to: self.player.to_account_info()
            };

            // Prepare the signer seeds for the vault PDA
            let seeds = [b"vault", &self.house.key().to_bytes()[..], &[bumps.vault]];
            let signer_seeds = &[&seeds[..]][..];
    
            // Create a CPI context with the signer seeds
            let ctx = CpiContext::new_with_signer(
                self.system_program.to_account_info(),
                accounts,
                signer_seeds
            );

            // Execute the transfer of the payout
            transfer(ctx, payout)?;
        }
        Ok(())
    }
}