import { Provider } from "@coral-xyz/anchor";
import { Commitment } from "@solana/web3.js";

const commitment: Commitment = "confirmed";

  export const confirmTx = async (provider: Provider, signature: string) => {
    const latestBlockhash = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction(
      {
        signature,
        ...latestBlockhash,
      },
      commitment
    )
  }
  export const confirmTxs = async (provider: Provider, signatures: string[]) => {
    await Promise.all(signatures.map(signature => confirmTx(provider, signature)))
  }