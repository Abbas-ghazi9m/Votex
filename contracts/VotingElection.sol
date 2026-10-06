// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ElectionTypes} from "./libraries/ElectionTypes.sol";
import {IVotingElection} from "./interfaces/IVotingElection.sol";

/**
 * @title VotingElection
 * @author VOTEX Protocol Core
 * @notice Individual election smart contract enforcing immutable one-person-one-vote rules on Polygon.
 */
contract VotingElection is IVotingElection {
    // ==========================================
    // STATE VARIABLES
    // ==========================================
    uint256 public immutable electionId;
    string public title;
    string public description;
    bytes32 public immutable metadataHash;
    uint256 public startTime;
    uint256 public endTime;
    address public admin;

    ElectionTypes.ElectionStatus public status;
    uint256 public totalVotes;
    uint256 public eligibleVoterCount;

    uint256 private _candidateIdCounter;
    uint256[] private _candidateIds;

    mapping(uint256 => ElectionTypes.Candidate) private _candidates;
    mapping(address => bool) public eligibleVoters;
    mapping(address => bool) public hasVoted;
    mapping(address => ElectionTypes.VoterInfo) private _voterRecords;

    // ==========================================
    // MODIFIERS
    // ==========================================
    modifier onlyAdmin() {
        if (msg.sender != admin) revert ElectionTypes.Unauthorized();
        _;
    }

    modifier inStatus(ElectionTypes.ElectionStatus expectedStatus) {
        if (status != expectedStatus) {
            if (expectedStatus == ElectionTypes.ElectionStatus.ACTIVE) revert ElectionTypes.ElectionNotActive();
            if (expectedStatus == ElectionTypes.ElectionStatus.ENDED) revert ElectionTypes.ElectionNotEnded();
            revert ElectionTypes.Unauthorized();
        }
        _;
    }

    // ==========================================
    // CONSTRUCTOR
    // ==========================================
    constructor(
        uint256 _electionId,
        string memory _title,
        string memory _description,
        bytes32 _metadataHash,
        uint256 _startTime,
        uint256 _endTime,
        address _admin
    ) {
        if (_admin == address(0)) revert ElectionTypes.ZeroAddress();
        if (bytes(_title).length == 0) revert ElectionTypes.EmptyTitle();
        if (_metadataHash == bytes32(0)) revert ElectionTypes.EmptyMetadataHash();
        if (_startTime >= _endTime) revert ElectionTypes.InvalidTimeRange();

        electionId = _electionId;
        title = _title;
        description = _description;
        metadataHash = _metadataHash;
        startTime = _startTime;
        endTime = _endTime;
        admin = _admin;
        status = ElectionTypes.ElectionStatus.CREATED;

        emit ElectionInitialized(_electionId, _title, _metadataHash, _startTime, _endTime, _admin);
    }

    // ==========================================
    // ADMIN FUNCTIONS
    // ==========================================

    /**
     * @notice Register a new candidate for the election (while in CREATED state)
     */
    function addCandidate(
        string calldata name,
        string calldata candidateDescription,
        string calldata metadataURI
    ) external override onlyAdmin returns (uint256) {
        if (status != ElectionTypes.ElectionStatus.CREATED) revert ElectionTypes.ElectionAlreadyStarted();
        if (bytes(name).length == 0) revert ElectionTypes.EmptyTitle();

        _candidateIdCounter++;
        uint256 newId = _candidateIdCounter;

        _candidates[newId] = ElectionTypes.Candidate({
            id: newId,
            name: name,
            description: candidateDescription,
            metadataURI: metadataURI,
            voteCount: 0,
            exists: true
        });

        _candidateIds.push(newId);

        emit CandidateAdded(electionId, newId, name, metadataURI);
        return newId;
    }

    /**
     * @notice Whitelist an eligible voter wallet address
     */
    function registerVoter(address voter) external override onlyAdmin {
        if (status == ElectionTypes.ElectionStatus.FINALIZED) revert ElectionTypes.ElectionAlreadyFinalized();
        if (voter == address(0)) revert ElectionTypes.ZeroAddress();
        if (eligibleVoters[voter]) revert ElectionTypes.VoterAlreadyRegistered();

        eligibleVoters[voter] = true;
        eligibleVoterCount++;

        _voterRecords[voter].isEligible = true;

        emit VoterRegistered(electionId, voter);
    }

    /**
     * @notice Batch register eligible voter wallet addresses for gas efficiency
     */
    function registerVotersBatch(address[] calldata voters) external override onlyAdmin {
        if (status == ElectionTypes.ElectionStatus.FINALIZED) revert ElectionTypes.ElectionAlreadyFinalized();

        for (uint256 i = 0; i < voters.length; i++) {
            address voter = voters[i];
            if (voter != address(0) && !eligibleVoters[voter]) {
                eligibleVoters[voter] = true;
                eligibleVoterCount++;
                _voterRecords[voter].isEligible = true;
                emit VoterRegistered(electionId, voter);
            }
        }
    }

    /**
     * @notice Remove an address from eligible voters before they vote
     */
    function removeVoter(address voter) external override onlyAdmin {
        if (!eligibleVoters[voter]) revert ElectionTypes.VoterNotRegistered();
        if (hasVoted[voter]) revert ElectionTypes.AlreadyVoted();

        eligibleVoters[voter] = false;
        eligibleVoterCount--;

        _voterRecords[voter].isEligible = false;

        emit VoterRemoved(electionId, voter);
    }

    /**
     * @notice Transition election status from CREATED to ACTIVE
     */
    function startElection() external override onlyAdmin {
        if (status != ElectionTypes.ElectionStatus.CREATED) revert ElectionTypes.ElectionAlreadyStarted();
        if (_candidateIds.length < 2) revert ElectionTypes.InvalidCandidate();

        status = ElectionTypes.ElectionStatus.ACTIVE;
        emit ElectionStarted(electionId, block.timestamp);
    }

    /**
     * @notice Close voting period
     */
    function endElection() external override onlyAdmin {
        if (status != ElectionTypes.ElectionStatus.ACTIVE) revert ElectionTypes.ElectionNotActive();

        status = ElectionTypes.ElectionStatus.ENDED;
        emit ElectionEnded(electionId, block.timestamp);
    }

    /**
     * @notice Calculate winner and permanently seal election results
     */
    function finalizeElection() external override onlyAdmin returns (uint256 winnerId) {
        if (status != ElectionTypes.ElectionStatus.ENDED && (status == ElectionTypes.ElectionStatus.ACTIVE && block.timestamp <= endTime)) {
            revert ElectionTypes.ElectionNotEnded();
        }
        if (status == ElectionTypes.ElectionStatus.FINALIZED) {
            revert ElectionTypes.ElectionAlreadyFinalized();
        }

        status = ElectionTypes.ElectionStatus.FINALIZED;

        uint256 highestVotes = 0;
        uint256 winningId = 0;

        for (uint256 i = 0; i < _candidateIds.length; i++) {
            uint256 cId = _candidateIds[i];
            if (_candidates[cId].voteCount > highestVotes) {
                highestVotes = _candidates[cId].voteCount;
                winningId = cId;
            }
        }

        emit ElectionFinalized(electionId, winningId, totalVotes, block.timestamp);
        return winningId;
    }

    // ==========================================
    // VOTER FUNCTION (Checks-Effects-Interactions)
    // ==========================================

    /**
     * @notice Cast a single ballot for a registered candidate
     * @param candidateId The ID of the desired candidate
     */
    function castVote(uint256 candidateId) external override {
        // 1. Check Election Active & Time Window
        if (status != ElectionTypes.ElectionStatus.ACTIVE) {
            if (status == ElectionTypes.ElectionStatus.ENDED || status == ElectionTypes.ElectionStatus.FINALIZED) {
                revert ElectionTypes.ElectionEnded();
            }
            revert ElectionTypes.ElectionNotActive();
        }

        if (block.timestamp < startTime) revert ElectionTypes.ElectionNotActive();
        if (block.timestamp > endTime) revert ElectionTypes.ElectionEnded();

        // 2. Check Voter Eligibility
        if (!eligibleVoters[msg.sender]) revert ElectionTypes.NotEligible();

        // 3. Check Duplicate Vote Prevention (One-person-one-vote)
        if (hasVoted[msg.sender]) revert ElectionTypes.AlreadyVoted();

        // 4. Validate Candidate
        ElectionTypes.Candidate storage candidate = _candidates[candidateId];
        if (!candidate.exists) revert ElectionTypes.InvalidCandidate();

        // 5. Effects
        hasVoted[msg.sender] = true;
        _voterRecords[msg.sender] = ElectionTypes.VoterInfo({
            isEligible: true,
            hasVoted: true,
            votedCandidateId: candidateId,
            timestamp: block.timestamp
        });

        candidate.voteCount += 1;
        totalVotes += 1;

        // 6. Interaction / Event
        emit VoteCast(electionId, msg.sender, candidateId, block.timestamp);
    }

    // ==========================================
    // VIEW FUNCTIONS
    // ==========================================

    function getElectionDetails() external view override returns (ElectionTypes.ElectionDetails memory) {
        return ElectionTypes.ElectionDetails({
            electionId: electionId,
            title: title,
            description: description,
            metadataHash: metadataHash,
            startTime: startTime,
            endTime: endTime,
            status: status,
            totalVotes: totalVotes,
            eligibleVoterCount: eligibleVoterCount,
            admin: admin,
            exists: true
        });
    }

    function getCandidate(uint256 candidateId) external view override returns (ElectionTypes.Candidate memory) {
        if (!_candidates[candidateId].exists) revert ElectionTypes.InvalidCandidate();
        return _candidates[candidateId];
    }

    function getAllCandidates() external view override returns (ElectionTypes.Candidate[] memory) {
        ElectionTypes.Candidate[] memory list = new ElectionTypes.Candidate[](_candidateIds.length);
        for (uint256 i = 0; i < _candidateIds.length; i++) {
            list[i] = _candidates[_candidateIds[i]];
        }
        return list;
    }

    function isVoterEligible(address voter) external view override returns (bool) {
        return eligibleVoters[voter];
    }

    function hasVoterVoted(address voter) external view override returns (bool) {
        return hasVoted[voter];
    }

    function getVoterInfo(address voter) external view override returns (ElectionTypes.VoterInfo memory) {
        return _voterRecords[voter];
    }

    function getWinner() external view override returns (uint256 winnerId, string memory winnerName, uint256 voteCount) {
        if (status != ElectionTypes.ElectionStatus.ENDED && status != ElectionTypes.ElectionStatus.FINALIZED) {
            revert ElectionTypes.ElectionNotEnded();
        }

        uint256 highestVotes = 0;
        uint256 winningId = 0;
        string memory name = "";

        for (uint256 i = 0; i < _candidateIds.length; i++) {
            uint256 cId = _candidateIds[i];
            if (_candidates[cId].voteCount > highestVotes) {
                highestVotes = _candidates[cId].voteCount;
                winningId = cId;
                name = _candidates[cId].name;
            }
        }

        return (winningId, name, highestVotes);
    }
}
