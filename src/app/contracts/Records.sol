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
        string ipfsCID;
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
    event PatientIpfsUpdated(address patient, string ipfsCID);

    function registerDoctor(string memory name, string memory specialization) external {
        require(!isDoctor[msg.sender], "Doctor already registered");
        isDoctor[msg.sender] = true;
        doctors[msg.sender] = Doctor(name, specialization);
        emit DoctorRegistered(msg.sender);
    }

    function registerPatient(string memory name, uint256 dateOfBirth, ) external {
        require(!isPatient[msg.sender], "Patient already registered");
        isPatient[msg.sender] = true;
        patients[msg.sender] = Patient(name, dateOfBirth, ipfsCID,);
        emit PatientRegistered(msg.sender);
    }

    function giveAccessDoctor(address doctor) external {
        require(isDoctor[doctor], "Doctor not registered");
        require(isPatient[msg.sender], "Patient not registered");
        doctorAccess[doctor][msg.sender] = true;
        emit DoctorAccessGranted(doctor, msg.sender);
    }

    function revokeAccessDoctor(address doctor) external {
        require(isDoctor[doctor], "Doctor not registered");
        require(isPatient[msg.sender], "Patient not registered");
        doctorAccess[doctor][msg.sender] = false;
        emit DoctorAccessRevoked(doctor, msg.sender);
    }

    function updatePatientIpfs(string memory ipfsCID) external {
        require(isPatient[msg.sender], "Patient not registered");
        patients[msg.sender].ipfsCID = ipfsCID;
        emit PatientIpfsUpdated(msg.sender, ipfsCID);
    }
    
    function isDoctorRegistered(address doctor) external view returns (bool) {
        return isDoctor[doctor];
    }
    
    function isPatientRegistered(address patient) external view returns (bool) {
        return isPatient[patient];
    }
}