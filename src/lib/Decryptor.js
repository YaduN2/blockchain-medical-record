
//pass the cid of file to be decrypted and it will be downloaded

export async function decryptor(fileTodecrypt){
  try{
    const fileRes = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${fileTodecrypt}?filename=encrypted.zip`)
    const file = await fileRes.blob()
    const litNodeClient = new LitJsSdk.LitNodeClient({
      litNetwork: "cayenne",
    })



    await litNodeClient.connect()
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: "ethereum",
      nonce: "abcd",
    })

    const {decryptedFile, metadata} = await LitJsSdk.decryptFileAndMetadata({
      file,
      authSig,
      litNodeClient,
    })

    const blob = new Blob([decryptedFile], { type: "application/octet-stream" })
    const downloadLink = document.createElement("a")
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = metadata.filename
    downloadLink.click()

  }
  catch(err){
    console.log(err)
  }
  
}