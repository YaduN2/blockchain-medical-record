import {ethers} from "ethers"
import contract_abi from "./contract_abi.json"
import web3 from "web3"



let contract_address = "0xd9145CCE52D386f254917e481eB44e9943F39138"



export const CheckIfWalletConnected = async () => {
  try {
    if (!window.ethereum) return console.log("Install MateMask");

    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    const firstAccount = accounts[0];
    return firstAccount;
  } catch (error) {
    console.log(error);
  }
};



export const connectWallet = async () => {
  try {
    if (!window.ethereum) return console.log("Install MetaMask");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const firstAccount = accounts[0];
    return firstAccount;
  } catch (error) {
    console.log(error);
  }
};


 
export const connectContract = async () => {
  try{
    
    window.web3 = new web3(window.ethereum)
    window.web3 = new web3(window.web3.currentProvider)
    
    return contract
  }catch(error){
    console.log(error)
  }
}
