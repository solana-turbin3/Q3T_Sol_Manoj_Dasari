use anchor_lang::prelude::*;

pub mod instructions;
pub mod errors;
pub mod state;

pub use instructions::*;
pub use error::*;
pub use state::*;

declare_id!("E5kv2j41SfsrZyCeEohk8SQ3i71Yzgiv32ey8ekeL5mQ");

#[program]
pub mod prediction_market {
    use super::*;

    pub fn initalize_protocol(ctx: Context<Init>, fees: i16) -> Result<()> {
        ctx.accounts.init(fees, &ctx.bumps)
    }

    pub fn create_bet(
        ctx: Context<CreateBet>,
        seed: u64,
        token_mint: Pubkey,
        maker_odds: u64,
        opponent_odds: u64,
        price_prediction: i64,
        deadline_to_join: i64,
        start_time: i64,
        end_time: i64,
        amount: u64,
    ) -> Result<()> {
        ctx.accounts.create_bet(
            token_mint,
            maker_odds,
            opponent_odds,
            price_prediction,
            deadline_to_join,
            start_time,
            end_time,
            amount,
            seed,
            &ctx.bumps,
        )
    }
}

#[derive(Accounts)]
pub struct Initialize {}