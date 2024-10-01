use anchor_lang::prelude::*;

pub mod contexts;
pub mod errors;
pub mod state;

pub use contexts::*;
pub use errors::*;
pub use state::*;

declare_id!("E5kv2j41SfsrZyCeEohk8SQ3i71Yzgiv32ey8ekeL5mQ");

#[program]
pub mod prediction_market {
    use anchor_spl::token_2022::spl_token_2022::solana_zk_token_sdk::instruction::PubkeyValidityProofContext;

    use super::*;

    pub fn initialize_protocol(ctx: Context<Init>, fees: i16) -> Result<()> {
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
        feed_injector: Pubkey,
        
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
            // pass swithcboard here
            feed_injector,
        )
    }

    pub fn accept_bet(ctx: Context<AcceptBet>, _seed: u64) -> Result<()> {
        ctx.accounts.accept_bet(&ctx.bumps)
    }
    pub fn cancel_bet(ctx: Context<CancelBet>, _seed: u64) -> Result<()> {
        ctx.accounts.cancel_bet()
    }
    
    pub fn check_winner_dummy(ctx: Context<CheckWinner>, seed: u64) -> Result<()> {
        ctx.accounts.check_winner__bet_dummy()
    }

    //TODO - feedInjector invocation should be implemented here
    pub fn check_winner(ctx:Context<CheckWinner>,_seed:u64)->Result<()>{
        ctx.accounts.check_winner();
        ctx.accounts.check_winner_bet_switchboard()
    }

    pub fn claim_prize(ctx:Context<ClaimPrize>,_seed:u64)->Result<()>{
        ctx.accounts.claim_prize()
    }

    //used for withdrawal money from the protocol treasury
    pub fn withdraw_treasury(ctx: Context<WithdrawTreasury>) -> Result<()> {
        ctx.accounts.withdraw_treasury()
    }
}

#[derive(Accounts)]
pub struct Initialize {}