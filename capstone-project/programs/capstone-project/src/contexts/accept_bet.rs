use anchor_lang::prelude::*;

use crate::state::Bet;

#[derive(Accounts)]
#[instruction(seed:u64)]
pub struct UpdateBet<'info> {
    #[account(mut)]
    pub opponent: Signer<'info>,
    /// CHECK: BET MAKER ADDRESS FOR DERIVING PDA
    pub maker:UncheckedAccount<'info>,
     #[account(
        mut,
        seeds=[b"bet",maker.key().as_ref(),seed.to_le_bytes().as_ref()],
        bump=bet.bump
    )]
    pub bet: Account<'info, Bet>, 
    #[account(
        seeds=[b"vault",bet.key().as_ref()],
        bump
    )]
    pub vault_pool:SystemAccount<'info>,
}
