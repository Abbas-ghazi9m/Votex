// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface Vm {
    function warp(uint256) external;
    function prank(address) external;
    function startPrank(address) external;
    function stopPrank() external;
    function expectRevert(bytes4) external;
    function expectRevert() external;
    function assume(bool) external;
}

import {VotingElection} from "../contracts/VotingElection.sol";
import {ElectionManager} from "../contracts/ElectionManager.sol";
import {ElectionTypes} from "../contracts/libraries/ElectionTypes.sol";

contract ElectionTest {
    Vm constant vm = Vm(address(bytes20(uint160(uint256(keccak256("hevm cheat code"))))));

    ElectionManager public manager;
    VotingElection public election;

    address public admin = address(0xAA11);
    address public voter1 = address(0xBB22);
    address public voter2 = address(0xCC33);
    address public attacker = address(0xDD44);

    bytes32 public testMetadataHash = 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890;
    uint256 public startTime = 1000;
    uint256 public endTime = 5000;

    function setUp() public {
        vm.warp(startTime);
        vm.prank(admin);
        manager = new ElectionManager();

        vm.prank(admin);
        (uint256 id, address electionAddr) = manager.createElection(
            "Test Election",
            "Description of election",
            testMetadataHash,
            startTime,
            endTime
        );

        election = VotingElection(electionAddr);

        // Add 2 candidates
        vm.startPrank(admin);
        election.addCandidate("Alice", "Candidate 1", "https://ipfs.io/ipfs/Qm1");
        election.addCandidate("Bob", "Candidate 2", "https://ipfs.io/ipfs/Qm2");
        vm.stopPrank();
    }

    // 1. Basic Setup & Metadata Integrity
    function test_InitialState() public view {
        ElectionTypes.ElectionDetails memory details = election.getElectionDetails();
        assert(details.electionId == 1);
        assert(details.metadataHash == testMetadataHash);
        assert(details.status == ElectionTypes.ElectionStatus.CREATED);
        assert(details.totalVotes == 0);
        assert(details.admin == admin);
    }

    // 2. Candidate Registration Restrictions
    function test_NonAdminCannotAddCandidate() public {
        vm.prank(attacker);
        vm.expectRevert(ElectionTypes.Unauthorized.selector);
        election.addCandidate("Mallory", "Attacker", "");
    }

    // 3. Voter Registration
    function test_VoterRegistration() public {
        vm.prank(admin);
        election.registerVoter(voter1);

        assert(election.isVoterEligible(voter1) == true);
        assert(election.isVoterEligible(voter2) == false);

        // Cannot register twice
        vm.prank(admin);
        vm.expectRevert(ElectionTypes.VoterAlreadyRegistered.selector);
        election.registerVoter(voter1);
    }

    // 4. Batch Voter Registration
    function test_BatchVoterRegistration() public {
        address[] memory voters = new address[](2);
        voters[0] = voter1;
        voters[1] = voter2;

        vm.prank(admin);
        election.registerVotersBatch(voters);

        assert(election.isVoterEligible(voter1) == true);
        assert(election.isVoterEligible(voter2) == true);
        assert(election.eligibleVoterCount() == 2);
    }

    // 5. Voter Removal
    function test_VoterRemoval() public {
        vm.startPrank(admin);
        election.registerVoter(voter1);
        assert(election.isVoterEligible(voter1) == true);

        election.removeVoter(voter1);
        assert(election.isVoterEligible(voter1) == false);
        vm.stopPrank();
    }

    // 6. Election Start Lifecycle
    function test_StartElection() public {
        vm.prank(admin);
        election.startElection();

        assert(election.status() == ElectionTypes.ElectionStatus.ACTIVE);

        // Cannot start twice
        vm.prank(admin);
        vm.expectRevert(ElectionTypes.ElectionAlreadyStarted.selector);
        election.startElection();
    }

    // 7. Successful Voting Flow
    function test_CastVoteValid() public {
        // Setup: register and start
        vm.startPrank(admin);
        election.registerVoter(voter1);
        election.startElection();
        vm.stopPrank();

        // Voter casts vote for candidate 1
        vm.prank(voter1);
        election.castVote(1);

        assert(election.hasVoterVoted(voter1) == true);
        assert(election.totalVotes() == 1);

        ElectionTypes.Candidate memory c1 = election.getCandidate(1);
        assert(c1.voteCount == 1);
    }

    // 8. Invariant: One Person One Vote (Reject duplicate vote)
    function test_CannotVoteTwice() public {
        vm.startPrank(admin);
        election.registerVoter(voter1);
        election.startElection();
        vm.stopPrank();

        vm.prank(voter1);
        election.castVote(1);

        // Second vote must revert
        vm.prank(voter1);
        vm.expectRevert(ElectionTypes.AlreadyVoted.selector);
        election.castVote(2);
    }

    // 9. Rejection: Ineligible Voter
    function test_IneligibleCannotVote() public {
        vm.prank(admin);
        election.startElection();

        vm.prank(attacker);
        vm.expectRevert(ElectionTypes.NotEligible.selector);
        election.castVote(1);
    }

    // 10. Rejection: Voting before election started
    function test_CannotVoteBeforeStart() public {
        vm.prank(admin);
        election.registerVoter(voter1);

        vm.prank(voter1);
        vm.expectRevert(ElectionTypes.ElectionNotActive.selector);
        election.castVote(1);
    }

    // 11. Rejection: Voting after election ended
    function test_CannotVoteAfterEnd() public {
        vm.startPrank(admin);
        election.registerVoter(voter1);
        election.startElection();
        vm.stopPrank();

        // Warp past end time
        vm.warp(endTime + 1);

        vm.prank(voter1);
        vm.expectRevert(ElectionTypes.ElectionEnded.selector);
        election.castVote(1);
    }

    // 12. Rejection: Invalid Candidate
    function test_InvalidCandidateRejected() public {
        vm.startPrank(admin);
        election.registerVoter(voter1);
        election.startElection();
        vm.stopPrank();

        vm.prank(voter1);
        vm.expectRevert(ElectionTypes.InvalidCandidate.selector);
        election.castVote(999);
    }

    // 13. End & Finalize Election
    function test_EndAndFinalize() public {
        vm.startPrank(admin);
        election.registerVoter(voter1);
        election.registerVoter(voter2);
        election.startElection();
        vm.stopPrank();

        // 2 votes for Alice (candidate 1)
        vm.prank(voter1);
        election.castVote(1);
        vm.prank(voter2);
        election.castVote(1);

        // End election
        vm.prank(admin);
        election.endElection();
        assert(election.status() == ElectionTypes.ElectionStatus.ENDED);

        // Finalize election
        vm.prank(admin);
        uint256 winnerId = election.finalizeElection();
        assert(winnerId == 1);
        assert(election.status() == ElectionTypes.ElectionStatus.FINALIZED);

        (uint256 id, string memory winnerName, uint256 count) = election.getWinner();
        assert(id == 1);
        assert(keccak256(bytes(winnerName)) == keccak256(bytes("Alice")));
        assert(count == 2);
    }

    // 14. Invariant: Vote count cannot decrease
    function test_FuzzVoteMonotonicity(uint8 votesCount) public {
        vm.assume(votesCount > 0 && votesCount < 50);

        vm.startPrank(admin);
        election.startElection();
        uint256 prevTotal = 0;

        for (uint160 i = 1; i <= votesCount; i++) {
            address v = address(i + 0x1000);
            election.registerVoter(v);
            vm.stopPrank();

            vm.prank(v);
            election.castVote(1);

            uint256 currentTotal = election.totalVotes();
            assert(currentTotal > prevTotal);
            prevTotal = currentTotal;

            vm.startPrank(admin);
        }
        vm.stopPrank();
    }
}
