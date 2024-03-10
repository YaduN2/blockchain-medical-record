import { Contract, ethers } from "ethers";
import contract_ABI from "./contract_abi.json";

const contractAddress = "0x9bF88fAe8CF8BaB76041c1db6467E7b37b977dD7";
const contractABI = contract_ABI;
const provider = new ethers.providers.JsonRpcProvider();
const contract = new Contract(contractAddress, contractABI, provider);

async function registerDoctor(
  doctorAddress: string,
  name: string,
  specialization: string
) {
  await contract.registerDoctor(doctorAddress, name, specialization);
}

async function registerPatient(
  patientAddress: string,
  name: string,
  dateOfBirth: number,
  ipfsUID: string
) {
  await contract.registerPatient(patientAddress, name, dateOfBirth, ipfsUID);
}

async function giveAccessDoctor(doctorAddress: string, patientAddress: string) {
  await contract.giveAccessDoctor(doctorAddress, patientAddress);
}

async function revokeAccessDoctor(
  doctorAddress: string,
  patientAddress: string
) {
  await contract.revokeAccessDoctor(doctorAddress, patientAddress);
}

async function getPatientIPFS(patientAddress: string) {
  const ipfsUID = await contract.getPatientIPFS(patientAddress);
  return ipfsUID;
}

async function updatePatientIPFS(patientAddress: string, ipfsUID: string) {
  await contract.updatePatientIpfs(patientAddress, ipfsUID);
}

export {
  registerDoctor,
  registerPatient,
  giveAccessDoctor,
  revokeAccessDoctor,
  getPatientIPFS,
  updatePatientIPFS,
};
