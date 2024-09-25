use anchor_lang::prelude::*;

#[account]
pub struct Bet {
    pub maker: Pubkey,
    pub opponent: Option<Pubkey>,
    pub token_mint: Pubkey, //the token mint he want to predict bet on
    pub odds: Odds,
    pub status: BetStatus,
    pub price_prediction: i64, // price prediction of the token_mint he provided
    pub deadline_to_join: i64, //opponent can join before this
    pub start_time: i64,       //bet start
    pub end_time: i64,         //bet end
    pub maker_deposit: u64,    //amount he's placing about the price movement in lamports
    pub amount_settled: bool,
    pub seed: u64,
    pub bump: u8,
    pub vault_pool_bump: u8,
    pub opponent_deposit: u64, //in lamports should store
    pub winner: Option<Pubkey>,
    pub pyth_price_account: Pubkey
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Odds {
    pub maker_odds: u64,
    pub opponent_odds: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum BetStatus {
    FindingOpponent,
    WaitingToStart,
    Ongoing,
    Completed,
}

impl Space for Bet {
    const INIT_SPACE: usize = 8    // Anchor discriminator
        + 32   // Pubkey for maker
        + 1 + 32 // Option<Pubkey> for opponent (1 byte for option + 32 bytes for Pubkey)
        + 32   // Pubkey for token_mint
        + 8    // u64 for maker_odds
        + 8    // u64 for opponent_odds
        + 1    // BetStatus enum (1 byte)
        + 8    // i64 for price_prediction
        + 8    // i64 for deadline_to_join
        + 8    // i64 for start_time
        + 8    // i64 for end_time
        + 8    // u64 for maker_deposit
        + 1    // bool for amount_settled
        + 8    // u64 for seed
        + 1    // u8 for bump
        + 1    // u8 for vault_pool_bump
        + 8    // u64 for opponent_deposit
        + 1 + 32; // Option<Pubkey> for winner (1 byte for option + 32 bytes for Pubkey)
}
