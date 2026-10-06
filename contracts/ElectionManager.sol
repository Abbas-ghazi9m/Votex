// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {VotingElection} from "./VotingElection.sol";
import {ElectionTypes} from "./libraries/ElectionTypes.sol";

/**
 * @title ElectionManager
 * @author VOTEX Protocol Core
 * @notice Factory and registry contract for deploying and tracking VOTEX elections on Polygon Amoy.
 */
contract ElectionManager {
    // ==========================================
    // STATE VARIABLES
    // ==========================================
    address public protocolOwner;
    uint256 public electionCount;

    // electionId => election contract address
    mapping(uint256 => address) public electionContracts;
    // admin => array of electionIds
    mapping(address => uint256[]) public adminElections;

    uint256[] public allElectionIds;

    // ==========================================
    // EVENTS
    // ==========================================
    event ElectionCreated(
        uint256 indexed electionId,
        address indexed electionAddress,
        string title,
        bytes32 metadataHash,
        address indexed admin,
        uint256 startTime,
        uint256 endTime
    );

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // ==========================================
    // MODIFIERS
    // ==========================================
    modifier onlyOwner() {
        if (msg.sender != protocolOwner) revert ElectionTypes.Unauthorized();
        _;
    }

    // ==========================================
    // CONSTRUCTOR
    // ==========================================
    constructor() {
        protocolOwner = msg.sender;
    }

    // ==========================================
    // FACTORY FUNCTIONS
    // ==========================================

    /**
     * @notice Deploy a new on-chain election contract
     * @param title Title of the election
     * @param description Short description
     * @param metadataHash SHA-256 canonical hash of the off-chain election metadata
     * @param startTime Unix timestamp when voting opens
     * @param endTime Unix timestamp when voting closes
     * @return electionId The unique identifier of the created election
     * @return electionAddress The address of the deployed VotingElection contract
     */
    function createElection(
        string calldata title,
        string calldata description,
        bytes32 metadataHash,
        uint256 startTime,
        uint256 endTime
    ) external returns (uint256 electionId, address electionAddress) {
        electionCount++;
        electionId = electionCount;

        VotingElection newElection = new VotingElection(
            electionId,
            title,
            description,
            metadataHash,
            startTime,
            endTime,
            msg.sender
        );

        electionAddress = address(newElection);
        electionContracts[electionId] = electionAddress;
        adminElections[msg.sender].push(electionId);
        allElectionIds.push(electionId);

        emit ElectionCreated(
            electionId,
            electionAddress,
            title,
            metadataHash,
            msg.sender,
            startTime,
            endTime
        );
    }

    /**
     * @notice Get all election IDs created across the platform
     */
    function getAllElectionIds() external view returns (uint256[] memory) {
        return allElectionIds;
    }

    /**
     * @notice Get all election IDs created by a specific admin
     */
    function getAdminElections(address admin) external view returns (uint256[] memory) {
        return adminElections[admin];
    }

    /**
     * @notice Transfer protocol ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ElectionTypes.ZeroAddress();
        emit OwnershipTransferred(protocolOwner, newOwner);
        protocolOwner = newOwner;
    }
}
