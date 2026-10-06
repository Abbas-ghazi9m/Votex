// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ElectionTypes
 * @author VOTEX Protocol Core
 * @notice Data structures, enums, and custom errors for the VOTEX voting platform.
 */
library ElectionTypes {
    /// @notice State machine for election lifecycle
    enum ElectionStatus {
        CREATED,   // Election registered, candidate/voter setup in progress
        ACTIVE,    // Open for casting votes
        ENDED,     // Voting closed, awaiting result finalization
        FINALIZED  // Results permanently sealed and certified on-chain
    }

    /// @notice Candidate information
    struct Candidate {
        uint256 id;
        string name;
        string description;
        string metadataURI; // IPFS CID or secure metadata URL for photo/manifesto
        uint256 voteCount;
        bool exists;
    }

    /// @notice Full election configuration and metadata
    struct ElectionDetails {
        uint256 electionId;
        string title;
        string description;
        bytes32 metadataHash; // SHA-256 canonical hash of off-chain metadata
        uint256 startTime;
        uint256 endTime;
        ElectionStatus status;
        uint256 totalVotes;
        uint256 eligibleVoterCount;
        address admin;
        bool exists;
    }

    /// @notice Voter status record
    struct VoterInfo {
        bool isEligible;
        bool hasVoted;
        uint256 votedCandidateId;
        uint256 timestamp;
    }

    // ==========================================
    // CUSTOM ERRORS (Gas-efficient & descriptive)
    // ==========================================
    error Unauthorized();
    error ElectionNotActive();
    error ElectionAlreadyStarted();
    error ElectionEnded();
    error ElectionNotEnded();
    error ElectionAlreadyFinalized();
    error NotEligible();
    error AlreadyVoted();
    error InvalidCandidate();
    error InvalidTimeRange();
    error CandidateAlreadyExists();
    error VoterAlreadyRegistered();
    error VoterNotRegistered();
    error EmptyMetadataHash();
    error EmptyTitle();
    error ZeroAddress();
}
