import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PredictionMarket } from "../target/types";
import { Keypair, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { assert } from "chai";
import { Commitment } from "@solana/web3.js"

//* swithcboard sol/usd devnet price data feed ID = "8g6zZtZFLJCRBm85rZbMws3ce2oqzzDKEGBj9wQGp1kY"
const solUsdSwitchboardFeedDevnet = "8g6zZtZFLJCRBm85rZbMws3ce2oqzzDKEGBj9wQGp1kY";

const commitment: Commitment = "confirmed";

describe("capstone-project", () => {
  //? Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const connection = provider.connection;;

  const program = anchor.workspace.PriceBetting as Program<PredictionMarket>;

  //? setup admin, betCreator, betTaker keys
  const [ admin, maker, betTaker ] = Array(3).fill(null).map(() => anchor.web3.Keypair.generate());
  console.log("Admin wallet: ", admin.publicKey.toBase58());
  console.log("maker wallet: ", maker.publicKey.toBase58());
  console.log("opponent wallet: ", betTaker.publicKey.toBase58());

  //? defining the constants/test parameters
  const betSeed = new anchor.BN(100);
  const tokenMint = anchor.web3.Keypair.generate().publicKey;
  const makerOdds = new anchor.BN(2);
  const opponentOdds = new anchor.BN(3);
  const pricePrediction = new anchor.BN(1000);
  const creatorEstimate = true;
  const deadlineToJoin = new anchor.BN(Date.now() + 3600000); // 1 hour from now
  const startTime = new anchor.BN(Date.now() + 7200000); // 2 hours from now
  const endTime = new anchor.BN(Date.now() + 10800000); // 3 hours from now
  const amount = new anchor.BN(100000000); // 0.1 SOL
  const fees = 100; // 1%

  const [housePda, housePdaBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("house"), admin.publicKey.toBuffer()],
    program.programId
  );
  const [treasuryPda, treasuryPdaBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("treasury"), housePda.toBuffer()],
    program.programId
  );
  const [betPda, betPdaBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("bet"), maker.publicKey.toBuffer(), betSeed.toArrayLike(Buffer, 'le', 8)],
    program.programId
  );
  const [vaultPoolPda, vaultPoolPdaBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), betPda.toBuffer()],
    program.programId
  );
  const [userAccountPda, userAccountPdaBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), maker.publicKey.toBuffer()],
    program.programId
  );

   //? Airdrop sol to admin, maker, betTaker
   it("Airdropped some SOL to all the required wallets", async () => {
    await Promise.all([ admin, maker, betTaker].map(async (k) => {
      return await anchor.getProvider().connection.requestAirdrop(k.publicKey, 100 * anchor.web3.LAMPORTS_PER_SOL)
    })).then(confirmTxs);
  });

  //? Initializing the house 
  it("Initializes the Synora protocol", async () => {
    const tx = await program.methods.initializeProtocol(fees)
      .accountsPartial({
        admin: admin.publicKey,
        house: housePda,
        treasury: treasuryPda,
      })
      .signers([admin])
      .rpc();
    
      console.log("Protocol Init Transaction Signature - ", tx);

      await confirmTx(tx);

      const initializedBetHouse = await program.account.house.fetch(housePda);

      assert.equal(initializedBetHouse.admin.toBase58(), admin.publicKey.toBase58());
      assert.equal(initializedBetHouse.protoclFees, fees);
  });

  //? Start creating the bet 
  //TODO: feedInjector should be added to check the real-time data in lib.rs, bet.rs, create_bet.rs and resolve_bet.rs
  it("Bet creator creates the bet", async () => {
    const makerBalanceBefore = await connection.getBalance(maker.publicKey);

    const tx = await program.methods.createBet(
      betSeed, 
      tokenMint,
      makerOdds,
      opponentOdds,
      pricePrediction,
      creatorEstimate,
      deadlineToJoin,
      startTime,
      endTime,
      amount,
      new PublicKey(solUsdSwitchboardFeedDevnet)).accountsPartial({
        maker: maker.publicKey,
        bet: betPda,
        vaultPool: vaultPoolPda,
        userAccount: userAccountPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([maker])
      .rpc();

      console.log("Bet creation Transaction Signature - ", tx);

      await confirmTx(tx);

      //? Fetch the bet account and assert its data
      const betAccount = await program.account.bet.fetch(betPda);
      const vaultBalance = await connection.getBalance(vaultPoolPda);
      const makerBalanceAfter = await connection.getBalance(maker.publicKey);

      assert.equal(vaultBalance, amount.toNumber());
      assert.isAtMost(makerBalanceAfter, makerBalanceBefore - amount.toNumber());

      assert.ok(betAccount.maker.equals(maker.publicKey));
      assert.ok(betAccount.tokenMint.equals(tokenMint));
      assert.ok(betAccount.odds.makerOdds.eq(makerOdds));
      assert.ok(betAccount.odds.opponentOdds.eq(opponentOdds));
      assert.ok(betAccount.pricePrediction.eq(pricePrediction));
      assert.equal(betAccount.creatorEstimate, true);
      assert.ok(betAccount.deadlineToJoin.eq(deadlineToJoin));
      assert.ok(betAccount.startTime.eq(startTime));
      assert.ok(betAccount.endTime.eq(endTime));
      assert.ok(betAccount.makerDeposit.eq(amount));
      assert.equal(betAccount.status, { findingOpponent: {} });
      assert.equal(betAccount.feedInjector.toBase58(), new PublicKey(solUsdSwitchboardFeedDevnet).toBase58());
  });

  //? Cancelling the created bet for testing 
  it("Cancelling the bet in case of a mishap", async () => {
    const vaultBalanceBefore = await connection.getBalance(vaultPoolPda);
    const makerBalanceBefore = await connection.getBalance(maker.publicKey);

    //? Fetch the bet account before cancellation
    const betAccountBefore = await program.account.bet.fetch(betPda);
    assert.equal(betAccountBefore.status.findingOpponent, {}, "Bet status should be 'findingOpponent' before cancellation");

    const tx = await program.methods.cancelBet(betSeed)
      .accountsPartial({
        maker: maker.publicKey,
        bet: betPda,
        vaultPool: vaultPoolPda,
        userAccount: userAccountPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([maker])
      .rpc();
    
      console.log("Canceling bet Transaction Signature - ", tx);

      await confirmTx(tx);
      // Fetch the bet account after cancellation
      const betAccountAfter = await program.account.bet.fetch(betPda);
    
      // Check if the bet status is updated or not
      assert.equal(betAccountAfter.status.completed, {}, "Bet status should be 'completed' after cancellation");

      // Check if the funds have been returned to the maker
      const vaultBalanceAfter = await connection.getBalance(vaultPoolPda);
      const makerBalanceAfter = await connection.getBalance(maker.publicKey);
      assert.equal(vaultBalanceAfter, 0);
      assert.equal(makerBalanceAfter, 100 * anchor.web3.LAMPORTS_PER_SOL);
  });

  //? Creation of a bet after bet cancellation
  //TODO: feedInjector should be added to check the real-time data in lib.rs, bet.rs, create_bet.rs and resolve_bet.rs
  it("Bet maker creating another bet after cancelling", async () => {
    const makerBalanceBefore = await connection.getBalance(maker.publicKey);

    const tx = await program.methods.createBet(
      betSeed, 
      tokenMint,
      makerOdds,
      opponentOdds,
      pricePrediction,
      creatorEstimate,
      deadlineToJoin,
      startTime,
      endTime,
      amount,
      new PublicKey(solUsdSwitchboardFeedDevnet)).accountsPartial({
        maker: maker.publicKey,
        bet: betPda,
        vaultPool: vaultPoolPda,
        userAccount: userAccountPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([maker])
      .rpc();

      console.log("Bet creation Transaction Signature - ", tx);

      await confirmTx(tx);

      //? Fetch the bet account and assert its data
      const betAccount = await program.account.bet.fetch(betPda);
      const vaultBalance = await connection.getBalance(vaultPoolPda);
      const makerBalanceAfter = await connection.getBalance(maker.publicKey);

      assert.equal(vaultBalance, amount.toNumber());
      assert.isAtMost(makerBalanceAfter, makerBalanceBefore - amount.toNumber());

      assert.ok(betAccount.maker.equals(maker.publicKey));
      assert.ok(betAccount.tokenMint.equals(tokenMint));
      assert.ok(betAccount.odds.makerOdds.eq(makerOdds));
      assert.ok(betAccount.odds.opponentOdds.eq(opponentOdds));
      assert.ok(betAccount.pricePrediction.eq(pricePrediction));
      assert.equal(betAccount.creatorEstimate, true);
      assert.ok(betAccount.deadlineToJoin.eq(deadlineToJoin));
      assert.ok(betAccount.startTime.eq(startTime));
      assert.ok(betAccount.endTime.eq(endTime));
      assert.ok(betAccount.makerDeposit.eq(amount));
      assert.equal(betAccount.status, { findingOpponent: {} });
      assert.equal(betAccount.feedInjector.toBase58(), new PublicKey(solUsdSwitchboardFeedDevnet).toBase58());
  });

  it("Opponent accepting the bet once he joins in", async () => {
    const takerBalanceBefore = await connection.getBalance(betTaker.publicKey);
    const vaultBalanceBefore = await connection.getBalance(vaultPoolPda);

    const tx = await program.methods.acceptBet(betSeed).accountsPartial({
      opponent: betTaker.publicKey,
      maker: maker.publicKey,
      bet: betPda,
      vaultPool: vaultPoolPda,
      userAccount: userAccountPda,
      systemProgram: SystemProgram.programId, 
    })
    .signers([betTaker])
    .rpc();

    console.log("Accepting bet Transaction Signature - ", tx);

    await confirmTx(tx);

    const vaultBalanceAfter = await connection.getBalance(vaultPoolPda);
    const takerBalanceAfter = await connection.getBalance(betTaker.publicKey);
    const treasuryBalanceAfter = await connection.getBalance(treasuryPda);
    const betAccount = await program.account.bet.fetch(betPda);
    
    assert.equal(betAccount.opponent.toBase58(), betTaker.publicKey.toBase58());
    assert.equal(betAccount.status.waitingToStart != undefined, true);

    const totalBetAmount = amount.toNumber() * 2;
    const feesAmount = totalBetAmount * (fees / 10000);
    assert.equal(vaultBalanceAfter, vaultBalanceBefore + amount.toNumber() - feesAmount);
    assert.isAtMost(takerBalanceAfter, takerBalanceBefore - amount.toNumber());
    assert.equal(treasuryBalanceAfter, feesAmount);
  });

   //? Simulate time passing for 5 seconds 
   it("Simulating time passing for 5 seconds", async () => {
    await new Promise(resolve => setTimeout(resolve, 5000)); //? Wait for 5 seconds
  });

  //TODO: feedInjector should be added to check the real-time data in lib.rs, bet.rs, create_bet.rs and check_winner.rs
  //& [x] lib.rs 
  //& [x] bet.rs 
  //& [x] create_bet.rs 

  //? Checking the winner after some time has passed
  it("Checking the winner once the bet ends", async () => {
  const tx = await program.methods.checkWinner(betSeed)
    .accountsPartial({
      signer: admin.publicKey,
      maker: maker.publicKey,
      opponent: betTaker.publicKey,
      bet: betPda,
      feedInjector: new PublicKey(solUsdSwitchboardFeedDevnet),
    })
    .signers([admin])
    .rpc();
    console.log("Transaction signature - ", tx);
    await confirmTx(tx);

    const betAccount = await program.account.bet.fetch(betPda);
    assert.equal(betAccount.status.completed !== undefined, true);
    assert.isNotNull(betAccount.winner);
  });

  //? claiming prizes to whomever has won the prediction
  it("Claiming the rewards after assigning the winner", async () => {
    const vaultPoolBalanceBefore = await connection.getBalance(vaultPoolPda);
    const tx = await program.methods.claimPrize(betSeed)
      .accountsPartial({
        winner: maker.publicKey, // claim as bet maker since the check winner(dummy impl) always resolves to the maker
        maker: maker.publicKey,
        bet: betPda,
        vaultPool: vaultPoolPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([maker])
      .rpc();

      console.log("Winner's Transaction Signature", tx);

      await confirmTx(tx);

      const winnerBalanceAfter = await connection.getBalance(maker.publicKey);
      const vaultPoolBalanceAfter = await connection.getBalance(vaultPoolPda);

      assert.equal(vaultPoolBalanceAfter, 0);
      assert.equal(winnerBalanceAfter, 100 * anchor.web3.LAMPORTS_PER_SOL - amount.toNumber() + vaultPoolBalanceBefore);

      try {
        await program.account.bet.fetch(betPda);
        assert.fail("Bet account should have been closed");
      } catch (error) {
        assert.include(error.message, "Account does not exist");
      }
  });

  it("Withdraw funds from treasury after claiming", async () => {
    const adminBalanceBefore = await connection.getBalance(admin.publicKey);
    const treasuryBalanceBefore = await connection.getBalance(treasuryPda);

    const tx = await program.methods.withdrawTreasury()
      .accountsPartial({
        admin: admin.publicKey,
        house: housePda,
        treasury: treasuryPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([admin])
      .rpc();

      console.log("Withdraw Transaction Signature - ", tx);

      await confirmTx(tx);

      const adminBalanceAfter = await connection.getBalance(admin.publicKey);
      const treasuryBalanceAfter = await connection.getBalance(treasuryPda);
      assert.isAbove(adminBalanceAfter, adminBalanceBefore);
      assert.equal(treasuryBalanceAfter, 0);
  })
});
  
//? Helper functions
const confirmTx = async (signature: string) => { // Transaction confirmation
  const latestBlockhash = await anchor.getProvider().connection.getLatestBlockhash();
  await anchor.getProvider().connection.confirmTransaction(
    {
      signature,
      ...latestBlockhash,
    },
    commitment
  )
}
const confirmTxs = async (signatures: string[]) => { // batch transaction processing 
  await Promise.all(signatures.map(confirmTx)) // parrallel processing 
}