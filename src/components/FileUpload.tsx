"use client";

import React from "react";
import styles from "@/styles/fileUpload.module.css";
import Image from "next/image";
import { auth } from "@clerk/nextjs";
import { useState } from "react";
import axios from "axios";
import * as LitJsSdk from "@lit-protocol/lit-node-client";

function FileUpload() {
  const [cid, setCid] = React.useState<string>("");
  const [dycryptionCid, setDecryptionCid] = React.useState<string>("");

  const [fileToUpload, setfileToUpload] = useState(null);

  const sendFileToIPFS = async (e: any) => {
    e.preventDefault();
    if (fileToUpload) {
      try {
        const litNodeClient = new LitJsSdk.LitNodeClient({
          litNetwork: "cayenne",
        });
        // Then get the authSig
        await litNodeClient.connect();
        const authSig = await LitJsSdk.checkAndSignAuthMessage({
          chain: "ethereum",
          nonce: "abcdefghijkl",
        });

        const accs = [
          {
            contractAddress: "",
            standardContractType: "",
            chain: "ethereum",
            method: "",
            parameters: [":userAddress"],
            returnValueTest: {
              comparator: "=",
              value: "0x88Eeba39524a63e316D02DC21DC5F0F234c638e2",
            },
          },
        ];

        const encryptedZip = await LitJsSdk.encryptFileAndZipWithMetadata({
          accessControlConditions: accs,
          authSig,
          chain: "ethereum",
          file: fileToUpload,
          litNodeClient: litNodeClient,
          readme: "Use IPFS CID of this file to decrypt it",
        });

        // Then we turn it into a file that will be accepted by the Pinata API
        const encryptedBlob = new Blob([encryptedZip], {
          type: "text/plain",
        });

        const encryptedFile = new File([encryptedBlob], fileToUpload.name);

        const formData = new FormData();
        formData.append("file", encryptedFile);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: process.env.PINATA_API_KEY,
            pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        console.log(ImgHash);
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
      }
    }
  };

  const decryptFile = async (fileToDecrypt) => {
    try {
      // First we fetch the file from IPFS using the CID and our Gateway URL, then turn it into a blob
      const fileRes = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${fileToDecrypt}?filename=encrypted.zip`
      );
      const file = await fileRes.blob();
      // We recreated the litNodeClient and the authSig
      const litNodeClient = new LitJsSdk.LitNodeClient({
        litNetwork: "cayenne",
      });
      await litNodeClient.connect();
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: "ethereum",
        nonce: "abcdefghijkl",
      });
      // Then we simpyl extract the file and metadata from the zip
      // We could do more with this, like try to display it in the app UI if we wanted to
      console.log(authSig);
      const { decryptedFile, metadata } =
        await LitJsSdk.decryptZipFileWithMetadata({
          file: file,
          litNodeClient: litNodeClient,
          authSig: authSig,
        });
      // After we have our dcypted file we can download it
      const blob = new Blob([decryptedFile], {
        type: "application/octet-stream",
      });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = metadata.name;
      downloadLink.click(); // Use the metadata to get the file name and type
    } catch (error) {
      alert("Trouble decrypting file");
      console.log(error);
    }
  };

  return (
    <div className={styles.fileUpload}>
      <h1>File Upload</h1>
      <form onSubmit={sendFileToIPFS} className={styles.form}>
        <div className={styles.textArea}>
          <textarea
            name="description"
            id="description"
            className={styles.textarea}
            cols={50}
            rows={10}
            placeholder="Describe the uploaded files"
          ></textarea>
        </div>

        <div className={styles.upload_section}>
          <input
            type="file"
            name="file"
            id="file"
            className={styles.fileInput}
            onChange={(e) => setfileToUpload(e.target.files[0])}
          />
          <input type="submit" value="Submit" className={styles.submitBtn} />
        </div>
      </form>
      <div>
        <input type="text" onChange={(e) => setDecryptionCid(e.target.value)} />
        <button onClick={() => decryptFile(dycryptionCid)}>Decrypt</button>
      </div>
    </div>
  );
}

export default FileUpload;
