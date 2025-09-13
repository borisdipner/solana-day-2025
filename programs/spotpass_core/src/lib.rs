use anchor_lang::prelude::*;

declare_id!("SpotPass1111111111111111111111111111111111111");

#[program]
pub mod spotpass_core {
    use super::*;

    pub fn initialize_asset(ctx: Context<InitializeAsset>, metadata_uri: String) -> Result<()> {
        let asset = &mut ctx.accounts.asset;
        asset.owner = ctx.accounts.owner.key();
        require!(metadata_uri.len() <= 200, SpotError::MetadataTooLong);
        asset.metadata_uri = metadata_uri;
        Ok(())
    }

    pub fn create_time_slice(
        ctx: Context<CreateTimeSlice>,
        start_ts: i64,
        end_ts: i64,
        price_lamports: u64,
    ) -> Result<()> {
        require!(end_ts > start_ts, SpotError::InvalidWindow);
        let slice = &mut ctx.accounts.slice;
        slice.asset = ctx.accounts.asset.key();
        slice.start_ts = start_ts;
        slice.end_ts = end_ts;
        slice.price_lamports = price_lamports;
        slice.status = SliceStatus::Open as u8;
        slice.buyer = None;
        emit!(SliceCreated { 
            slice: slice.key(), 
            asset: slice.asset, 
            start_ts, 
            end_ts, 
            price_lamports 
        });
        Ok(())
    }

    pub fn reserve_slice(ctx: Context<ReserveSlice>) -> Result<()> {
        let slice = &mut ctx.accounts.slice;
        require!(slice.status == SliceStatus::Open as u8, SpotError::NotOpen);
        // MOCK: здесь мог бы быть перевод buyer -> escrow PDA; в MVP только событие
        slice.buyer = Some(ctx.accounts.buyer.key());
        slice.status = SliceStatus::Reserved as u8;
        emit!(SliceReserved { 
            slice: slice.key(), 
            buyer: ctx.accounts.buyer.key() 
        });
        Ok(())
    }

    pub fn settle_slice(ctx: Context<SettleSlice>) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        let slice = &mut ctx.accounts.slice;
        require!(slice.status == SliceStatus::Reserved as u8, SpotError::WrongState);
        require!(now >= slice.end_ts, SpotError::TooEarly);
        // MOCK: escrow -> owner
        slice.status = SliceStatus::Settled as u8;
        emit!(SliceSettled { slice: slice.key() });
        Ok(())
    }

    pub fn cancel_unstarted(ctx: Context<CancelUnstarted>) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        let slice = &mut ctx.accounts.slice;
        require!(
            slice.status == SliceStatus::Reserved as u8 || slice.status == SliceStatus::Open as u8, 
            SpotError::WrongState
        );
        require!(now < slice.start_ts, SpotError::AlreadyStarted);
        // MOCK: refund buyer
        slice.status = SliceStatus::Cancelled as u8;
        emit!(SliceCancelled { slice: slice.key() });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeAsset<'info> {
    #[account(
        init, 
        payer = owner, 
        space = 8 + Asset::MAX_SIZE, 
        seeds = [b"asset", owner.key().as_ref()], 
        bump
    )]
    pub asset: Account<'info, Asset>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateTimeSlice<'info> {
    #[account(mut, has_one = owner)]
    pub asset: Account<'info, Asset>,
    pub owner: Signer<'info>,
    #[account(
        init, 
        payer = owner, 
        space = 8 + Slice::MAX_SIZE, 
        seeds = [b"slice", asset.key().as_ref(), &Clock::get()?.unix_timestamp.to_le_bytes()], 
        bump
    )]
    pub slice: Account<'info, Slice>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReserveSlice<'info> {
    #[account(mut)]
    pub slice: Account<'info, Slice>,
    pub buyer: Signer<'info>,
}

#[derive(Accounts)]
pub struct SettleSlice<'info> {
    #[account(mut)]
    pub slice: Account<'info, Slice>,
}

#[derive(Accounts)]
pub struct CancelUnstarted<'info> {
    #[account(mut)]
    pub slice: Account<'info, Slice>,
}

#[account]
pub struct Asset {
    pub owner: Pubkey,
    pub metadata_uri: String,
}

impl Asset { 
    pub const MAX_SIZE: usize = 32 + 4 + 200; 
}

#[account]
pub struct Slice {
    pub asset: Pubkey,
    pub start_ts: i64,
    pub end_ts: i64,
    pub price_lamports: u64,
    pub status: u8,             // 0 Open, 1 Reserved, 2 Settled, 3 Cancelled
    pub buyer: Option<Pubkey>,  // 1 + 32 в сериализации borsh
}

impl Slice { 
    pub const MAX_SIZE: usize = 32 + 8 + 8 + 8 + 1 + (1 + 32); 
}

#[event]
pub struct SliceCreated { 
    pub slice: Pubkey, 
    pub asset: Pubkey, 
    pub start_ts: i64, 
    pub end_ts: i64, 
    pub price_lamports: u64 
}

#[event]
pub struct SliceReserved { 
    pub slice: Pubkey, 
    pub buyer: Pubkey 
}

#[event]
pub struct SliceSettled { 
    pub slice: Pubkey 
}

#[event]
pub struct SliceCancelled { 
    pub slice: Pubkey 
}

#[error_code]
pub enum SpotError {
    #[msg("Invalid time window")] 
    InvalidWindow,
    #[msg("Slice not open")] 
    NotOpen,
    #[msg("Too early to settle")] 
    TooEarly,
    #[msg("Wrong state")] 
    WrongState,
    #[msg("Already started")] 
    AlreadyStarted,
    #[msg("Metadata too long")] 
    MetadataTooLong,
}

#[repr(u8)]
pub enum SliceStatus { 
    Open = 0, 
    Reserved = 1, 
    Settled = 2, 
    Cancelled = 3 
}
