import { Contract, ethers } from "ethers";
import contract_ABI from "./contract_abi.json";

const contractAddress = "0x417Bf7C9dc415FEEb693B6FE313d1186C692600F";
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

export {
  registerDoctor,
  registerPatient,
  giveAccessDoctor,
  revokeAccessDoctor,
  getPatientIPFS,
};
