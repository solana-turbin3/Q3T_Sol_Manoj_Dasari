use anchor_lang::prelude::*;

declare_id!("E5kv2j41SfsrZyCeEohk8SQ3i71Yzgiv32ey8ekeL5mQ");

#[program]
pub mod capstone_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
