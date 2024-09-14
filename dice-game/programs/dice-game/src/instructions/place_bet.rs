use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};
use solana_program::address_lookup_table::instruction;

use crate::state::Bet;

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    //// CHECK: this is safe
    pub house: UncheckedAccount<'info>,
    #[account(
        mut, 
        seeds = [
            b"vault",
            house.key().as_ref(),
        ],
        bump,
    )]
    pub vault: SystemAccount<'info>,
    #[account(
        init,
        payer = player,
        space = Bet::LEN,
        seeds = [
            b"bet",
            player.key().as_ref(),
            vault.key().as_ref(),
            seed.to_le_bytes().as_ref(),
        ],
        bump
    )]
    pub bet: Account<'info, Bet>,
    pub system_program: Program<'info, System>,
}

impl<'info> PlaceBet<'info> {
    pub fn create_bet(&mut self, seed: u64, bumps: &PlaceBetBumps, amount: u64, roll: u8) -> Result<()> {
        self.bet.set_inner(Bet {
            player: self.player.key(),
            seed,
            amount,
            roll,
            slot: Clock::get().unwrap().slot,
            bump: bumps.bet,
        });
        Ok(())
    }

    pub fn deposit(&mut self, amount: u64) -> Result<()> {
        let cpi_program = self.system_program.to_account_info();
        let cpi_accounts = Transfer {
            from: self.player.to_account_info(),
            to: self.vault.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        transfer(cpi_ctx, amount)
    }
}