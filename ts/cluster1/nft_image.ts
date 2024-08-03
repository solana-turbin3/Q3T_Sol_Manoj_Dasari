import wallet from "./wallet/wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"
import { read } from "fs"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image
        const images = await readFile('D:\manoj-projects\Turbin3-portfolio\ts\cluster1\images\generug.png');
        //2. Convert image to generic file.
        const generic = createGenericFile(images, "generug.png", { contentType: "image/png"});
        //3. Upload image
        const [uri] = await umi.uploader.upload([generic])
        // const image = ???
        
        // const [myUri] = ??? 
        console.log("Your image URI: ", uri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
