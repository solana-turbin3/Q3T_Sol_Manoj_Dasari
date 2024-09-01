import wallet from "./wallet/wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

const imageUri = "https://arweave.net/-OkvGq_N9_DU1oaRECEa9ugKSfdX2UE3cDQ9J3tApBA";

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        // const image = "https://arweave.net/-OkvGq_N9_DU1oaRECEa9ugKSfdX2UE3cDQ9J3tApBA";
        const metadata = {
            name: "Rug Master",
            symbol: "RGM",
            description: "Master of RUG PULL",
            image: "https://arweave.net/-OkvGq_N9_DU1oaRECEa9ugKSfdX2UE3cDQ9J3tApBA",
            attributes: [
                // {trait_type: '?', value: '?'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "https://arweave.net/-OkvGq_N9_DU1oaRECEa9ugKSfdX2UE3cDQ9J3tApBA"
                    },
                ]
            },
            creators: []
        };
        const metadataJsonString = JSON.stringify(metadata);
        const metadataArray = new Uint8Array(Buffer.from(metadataJsonString));
        const metadataFile = createGenericFile(metadataArray, "metadata.json");
        const metadataUris = await umi.uploader.upload([metadataFile]); 
        const myUri = metadataUris[0];
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
