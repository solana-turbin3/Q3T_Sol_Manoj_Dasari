import { Keypair, PublicKey, Connection} from "@solana/web3.js";
import {BN, web3} from "@coral-xyz/anchor";

//TODO - import admin, maker, taker wallets
import adminWallet from '../wallets/admin.json';
import makerWallet from '../wallets/maker.json';
import takerWallet from '../wallets/taker.json';

export const admin = Keypair.fromSecretKey(new Uint8Array(adminWallet));
export const betCreator = Keypair.fromSecretKey(new Uint8Array(makerWallet));
export const betTaker = Keypair.fromSecretKey(new Uint8Array(takerWallet));

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

//init program
export const initSeed = new BN(123); // vary this to create multiple instances from the same admin wallet
export const fees = 1000; // 1,000 = 10%

//bet parameters
export const betSeed = new BN(999); // vary this to have multiple open bets from the same creator wallet open at the same time
export const currentTime = new BN(Date.now() / 1000); // Current unix timestamp in seconds
export const deadlineToJoin = new BN(currentTime.toNumber() + 30); // 30 seconds to join
export const startTime = new BN(currentTime.toNumber() + 35); // Bet starts after 35 seconds
export const endTime = new BN(currentTime.toNumber() + 65); // Bet ends after 65 seconds
export const pricePrediction = new BN(2000 * (10**8)); // Price prediction with 8 decimal places
export const wagerAmount = new BN(0.1 * web3.LAMPORTS_PER_SOL); // 0.1 SOL wager
export const makerOdds = new BN(60); // 60% odds for maker
export const opponentOdds = new BN(40); // 40% odds for opponent
export const creatorEstimate = true; // Maker predicts price will be higher

//TODO - account PDAs