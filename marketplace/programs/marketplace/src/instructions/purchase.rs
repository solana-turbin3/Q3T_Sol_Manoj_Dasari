use crate::state::{Listing, Marketplace};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{
        close_account, transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked,
    },
};

#[derive(Accounts)]
pub struct Purchase<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub maker: AccountInfo<'info>,
    #[account(
        seeds = [b"marketplace", marketplace.name.as_str().as_bytes()],
        bump = marketplace.bump
    )]
    pub marketplace: Box<Account<'info, Marketplace>>,
    pub maker_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        mut,
        associated_token::authority = buyer,
        associated_token::mint = maker_mint,
    )]
    pub buyer_ata: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(
        mut,
        close = maker,
        seeds = [marketplace.key().as_ref(), maker_mint.key().as_ref()],
        bump = listing.bump,
    )]
    pub listing: Box<Account<'info, Listing>>,
    #[account(
        mut,
        associated_token::authority = listing,
        associated_token::mint = maker_mint,
    )]
    pub vault: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(
        mut,
        seeds = [b"treasury", marketplace.key().as_ref()],
        bump = marketplace.treasury_bump,
    )]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub treasury: AccountInfo<'info>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> Purchase<'info> {
    pub fn transfer_nft(&mut self) -> Result<()> {
        let signer_seeds: &[&[&[u8]]] = &[&[
            &self.marketplace.key().to_bytes(),
            &self.maker_mint.key().to_bytes(),
            &[self.listing.bump],
        ]];
        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = TransferChecked {
            from: self.vault.to_account_info(),
            to: self.buyer_ata.to_account_info(),
            authority: self.listing.to_account_info(),
            mint: self.maker_mint.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        transfer_checked(cpi_ctx, 1, self.maker_mint.decimals)
    }

    pub fn close_vault(&mut self) -> Result<()> {
        let signer_seeds: &[&[&[u8]]] = &[&[
            &self.marketplace.key().to_bytes(),
            &self.maker_mint.key().to_bytes(),
            &[self.listing.bump],
        ]];
        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = anchor_spl::token_interface::CloseAccount {
            account: self.vault.to_account_info(),
            destination: self.maker.to_account_info(),
            authority: self.listing.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        close_account(cpi_ctx)
    }

    pub fn transfer_payment(&mut self) -> Result<()> {
        let fee_amount = (self.listing.price as u128)
            .checked_mul(self.marketplace.fee as u128)
            .unwrap()
            .checked_div(10000)
            .unwrap() as u64;
        let maker_amount = self.listing.price.checked_sub(fee_amount).unwrap();

        let system_program_info = self.system_program.to_account_info();
        let buyer_info = self.buyer.to_account_info();
        let treasury_info = self.treasury.to_account_info();
        let maker_info = self.maker.to_account_info();

        // Transfer fee to treasury
        if fee_amount > 0 {
            let fee_transfer_accounts = anchor_lang::system_program::Transfer {
                from: buyer_info.clone(),
                to: treasury_info,
            };
            let fee_transfer_ctx =
                CpiContext::new(system_program_info.clone(), fee_transfer_accounts);
            anchor_lang::system_program::transfer(fee_transfer_ctx, fee_amount)?;
        }

        // Transfer payment to maker
        let maker_transfer_accounts = anchor_lang::system_program::Transfer {
            from: buyer_info,
            to: maker_info,
        };
        let maker_transfer_ctx = CpiContext::new(system_program_info, maker_transfer_accounts);
        anchor_lang::system_program::transfer(maker_transfer_ctx, maker_amount)?;

        Ok(())
    }
}