import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PredictionMarket } from "../target/types/prediction_market";

describe("capstone-project", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.PredictionMarket as Program<PredictionMarket>;

  it("Is initialized!", async () => {
    // Add your test here.
    const fee = 100;
    const tx = await program.methods.initializeProtocol(fee).rpc();
    console.log("Your transaction signature", tx);
  });
});
