// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ElectionTypes} from "../libraries/ElectionTypes.sol";

/**
 * @title IVotingElection
 * @notice Standard interface for individual VOTEX elections
 */
interface IVotingElection {
    // ==========================================
    // EVENTS
    // ==========================================
    event ElectionInitialized(
        uint256 indexed electionId,
        string title,
        bytes32 metadataHash,
        uint256 startTime,
        uint256 endTime,
        address indexed admin
    );

    event CandidateAdded(
        uint256 indexed electionId,
        uint256 indexed candidateId,
        string name,
        string metadataURI
    );

    event VoterRegistered(
        uint256 indexed electionId,
        address indexed voter
    );

    event VoterRemoved(
        uint256 indexed electionId,
        address indexed voter
    );

    event ElectionStarted(
        uint256 indexed electionId,
        uint256 timestamp
    );

    event ElectionEnded(
        uint256 indexed electionId,
        uint256 timestamp
    );

    event ElectionFinalized(
        uint256 indexed electionId,
        uint256 winningCandidateId,
        uint256 totalVotes,
        uint256 timestamp
    );

    event VoteCast(
        uint256 indexed electionId,
        address indexed voter,
        uint256 indexed candidateId,
        uint256 timestamp
    );

    // ==========================================
    // WRITE FUNCTIONS
    // ==========================================
    function addCandidate(string calldata name, string calldata description, string calldata metadataURI) external returns (uint256);
    function registerVoter(address voter) external;
    function registerVotersBatch(address[] calldata voters) external;
    function removeVoter(address voter) external;
    function startElection() external;
    function endElection() external;
    function finalizeElection() external returns (uint256 winnerId);
    function castVote(uint256 candidateId) external;

    // ==========================================
    // VIEW FUNCTIONS
    // ==========================================
    function getElectionDetails() external view returns (ElectionTypes.ElectionDetails memory);
    function getCandidate(uint256 candidateId) external view returns (ElectionTypes.Candidate memory);
    function getAllCandidates() external view returns (ElectionTypes.Candidate[] memory);
    function isVoterEligible(address voter) external view returns (bool);
    function hasVoterVoted(address voter) external view returns (bool);
    function getVoterInfo(address voter) external view returns (ElectionTypes.VoterInfo memory);
    function getWinner() external view returns (uint256 winnerId, string memory winnerName, uint256 voteCount);
}
