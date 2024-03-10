// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecord {
    struct Doctor {
        string name;
        string specialization;
    }

    struct Patient {
        string name;
        uint256 dateOfBirth;
        string ipfsUID;
    }

    mapping(address => bool) public isDoctor;
    mapping(address => bool) public isPatient;
    mapping(address => mapping(address => bool)) public doctorAccess;
    mapping(address => Doctor) public doctors;
    mapping(address => Patient) public patients;

    event DoctorRegistered(address doctor);
    event PatientRegistered(address patient);
    event DoctorAccessGranted(address doctor, address patient);
    event DoctorAccessRevoked(address doctor, address patient);

    function registerDoctor(address doctor, string memory name, string memory specialization) external {
        require(!isDoctor[doctor], "Doctor already registered");
        isDoctor[doctor] = true;
        doctors[doctor] = Doctor(name, specialization);
        emit DoctorRegistered(doctor);
    }

    function registerPatient(address patient, string memory name, uint256 dateOfBirth, string memory ipfsUID) external {
        require(!isPatient[patient], "Patient already registered");
        isPatient[patient] = true;
        patients[patient] = Patient(name, dateOfBirth, ipfsUID);
        emit PatientRegistered(patient);
    }

    function giveAccessDoctor(address doctor, address patient) external {
        require(isDoctor[doctor], "Doctor not registered");
        require(isPatient[patient], "Patient not registered");
        doctorAccess[doctor][patient] = true;
        emit DoctorAccessGranted(doctor, patient);
    }

    function revokeAccessDoctor(address doctor, address patient) external {
        require(isDoctor[doctor], "Doctor not registered");
        require(isPatient[patient], "Patient not registered");
        doctorAccess[doctor][patient] = false;
        emit DoctorAccessRevoked(doctor, patient);
    }

}