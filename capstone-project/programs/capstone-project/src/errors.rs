use anchor_lang::prelude::*;

#[error_code]
pub enum Errors {
    #[msg("Bet's not availabe")]
    BetDoNotExists,
}