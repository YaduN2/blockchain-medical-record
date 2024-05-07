import { ethers } from "ethers";
import contract_abi from "./contract_abi.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const abi = contract_abi;
const provider = new ethers.providers.JsonRpcProvider();
// const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, abi,signer);

export const registerDoctor = async (name: string, specialization: string) => {
  const tx = await contract.registerDoctor(name, specialization);
  await tx.wait();
  console.log("Doctor registered");
};

export const registerPatient = async (
  name: string,
  dateOfBirth: number,
  ipfsCID: string
) => {
  const tx = await contract.registerPatient(name, dateOfBirth, ipfsCID);
  await tx.wait();
  console.log("Patient registered");
};

export const giveAccessDoctor = async (doctor: string) => {
  const tx = await contract.giveAccessDoctor(doctor);
  await tx.wait();
  console.log("Doctor access granted");
};

export const revokeAccessDoctor = async (doctor: string) => {
  const tx = await contract.revokeAccessDoctor(doctor);
  await tx.wait();
  console.log("Doctor access revoked");
};

export const updatePatientIpfs = async (ipfsCID: string) => {
  if(!ipfsCID) {
    console.log(ipfsCID);
    return
  }
  const tx = await contract.updatePatientIpfs(ipfsCID);
  await tx.wait();
  console.log("Patient IPFS updated");
};

export const isDoctorRegistered = async (doctor: string) => {
  const isRegistered = await contract.isDoctorRegistered(doctor);
  console.log("Is doctor registered:", isRegistered);
};

export const isPatientRegistered = async (patient: string) => {
  const isRegistered = await contract.isPatientRegistered(patient);
  console.log("Is patient registered:", isRegistered);
};


export const getIpfsCID = async () => {
  const ipfsCID = await contract.getIpfsCID();
  console.log("IPFS CID:", ipfsCID);
  return ipfsCID;
}
 