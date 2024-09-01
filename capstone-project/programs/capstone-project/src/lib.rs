use anchor_lang::prelude::*;

declare_id!("HWJYZbkVaB3DxUnUE9RN3RCNKEoLK8ioiWfNpMAvu3Pb");

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
