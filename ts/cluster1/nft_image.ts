import wallet from "./wallet/wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";
import path from "path";

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Construct the correct file path using path.join
        const imagePath = path.join(__dirname, 'images', 'generug.png');
        
        // Print debug information
        console.log(`Image Path: ${imagePath}`);
        console.log(`Current Directory: ${process.cwd()}`);

        // Load image
        const images = await readFile(imagePath);
        
        // Convert image to generic file
        const generic = createGenericFile(images, "generug.png", { contentType: "image/png" });
        
        // Upload image
        const [uri] = await umi.uploader.upload([generic]);
        
        console.log("Your image URI: ", uri);
    } catch (error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
