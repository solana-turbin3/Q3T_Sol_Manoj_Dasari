use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use crate::{state::Bet, BetStatus, Odds};

#[derive(Accounts)]
#[instruction(seed:u64)]
pub struct CreateBet<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    #[account(
        init,
        space=Bet::INIT_SPACE,
        payer=maker,
        seeds=[b"bet",maker.key().as_ref(),seed.to_le_bytes().as_ref()],
        bump
    )]
    pub bet: Account<'info, Bet>, 
    #[account(
        seeds=[b"vault",bet.key().as_ref()],
        bump
    )]
    pub vault_pool:SystemAccount<'info>,  
    pub system_program: Program<'info, System>,
}

impl<'info> CreateBet<'info> {
    pub fn create_bet(
        &mut self,
        token_mint: Pubkey,
        maker_odds: u64,
        opponent_odds: u64,
        price_prediction: i64,
        deadline_to_join: i64,
        start_time: i64,
        end_time: i64,
        amount: u64,
        seed: u64,
        bumps: &CreateBetBumps,
    ) -> Result<()> {
        self.bet.set_inner(Bet {
            maker: self.maker.key(),
            opponent: None,
            token_mint,
            odds: Odds {
                maker_odds,
                opponent_odds,
            },
            status: BetStatus::FindingOpponent,
            price_prediction,
            deadline_to_join,
            start_time,
            end_time,
            amount, //sol stored in lamports 
            amount_settled: false,
            seed,
            bump: bumps.bet,
            vault_pool:bumps.vault_pool
        });
        self.send_money_to_vault(amount)
    }

    pub fn send_money_to_vault(&mut self, amount: u64) -> Result<()> {
        let accounts = Transfer {
            from: self.maker.to_account_info(),
            to: self.vault_pool.to_account_info(),
        };
        let ctx = CpiContext::new(self.system_program.to_account_info(), accounts);
        transfer(ctx, amount)
    }
}