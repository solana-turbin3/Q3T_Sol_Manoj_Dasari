use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("E5kv2j41SfsrZyCeEohk8SQ3i71Yzgiv32ey8ekeL5mQ");

#[program]
pub mod dice_game {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, amount: u64) -> Result<()> {
        ctx.accounts.init(amount)
    }

    pub fn place_bet(ctx: Context<PlaceBet>, seed: u64, amount: u64, roll: u8) -> Result<()> {
        ctx.accounts.create_bet(seed, &ctx.bumps, amount, roll)?;
        ctx.accounts.deposit(amount)
    }

    // pub fn resolve_bet(ctx: Context<ResolveBet>, sig: Vec<u8>) -> Result<()> {
    //     ctx.accounts.verify_ed25519_signature(&sig)?;
    //     ctx.accounts.resolve_bet(&ctx.bumps, &sig)
    // }
}