import { Keypair, PublicKey, Connection} from "@solana/web3.js";
import {BN, web3} from "@coral-xyz/anchor";

//TODO - import admin, maker, taker wallets

//TODO - airdropping and filling up the wallets with sufficient SOL funds

// connection provider
export const connection = new Connection("https://api.devnet.solana.com", 'confirmed');

/*
   Program ID: SBondMDrcV3K4kxZR1HNVT7osZxAHVHgYXL5Ze1oMUv

   Devnet Program ID: Aio4gaXjXzJNVLtzwtNVmSqGKpANtXhybbkhtAC94ji2
   
   Default Devnet Queue: EYiAmGSdsQTuCw413V5BzaruWuCCSDgTPtBGvLkXHbe7
   
   Default Mainnet Queue: A43DyUGA7s8eXPxqEjJY6EBu1KKbNgfxF8h17VAHn13w
*/
// switchboard oracle program ID 
export const switchboardProgramIdDevnet = new PublicKey("Aio4gaXjXzJNVLtzwtNVmSqGKpANtXhybbkhtAC94ji2");
export const solUsdSwitchboardFeedDevnet = "8g6zZtZFLJCRBm85rZbMws3ce2oqzzDKEGBj9wQGp1kY";

const programId = new PublicKey("E5kv2j41SfsrZyCeEohk8SQ3i71Yzgiv32ey8ekeL5mQ");

//TODO - init program

//TODO - bet program

//TODO - acount PDAs