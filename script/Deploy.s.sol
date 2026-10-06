// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface Vm {
    function startBroadcast() external;
    function stopBroadcast() external;
    function envUint(string calldata) external returns (uint256);
}

import {ElectionManager} from "../contracts/ElectionManager.sol";
import {VotingElection} from "../contracts/VotingElection.sol";

contract DeployScript {
    Vm constant vm = Vm(address(bytes20(uint160(uint256(keccak256("hevm cheat code"))))));

    function run() external {
        vm.startBroadcast();

        // 1. Deploy Factory/Manager
        ElectionManager manager = new ElectionManager();

        // 2. Deploy Initial Demo Election
        bytes32 sampleMetadataHash = 0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855;
        uint256 startTime = block.timestamp;
        uint256 endTime = block.timestamp + 7 days;

        (uint256 electionId, address electionAddress) = manager.createElection(
            "University Student Council Election 2026",
            "Official campus election for Student Government Association leadership.",
            sampleMetadataHash,
            startTime,
            endTime
        );

        VotingElection election = VotingElection(electionAddress);

        // 3. Register Candidates
        election.addCandidate(
            "Alice Chen",
            "Platform: Campus sustainability, mental health support, transparent budgeting.",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
        );

        election.addCandidate(
            "Bob Miller",
            "Platform: Expanded research grants, campus 24/7 library access, tech innovation.",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
        );

        election.addCandidate(
            "Clara Rodriguez",
            "Platform: Diversity initiatives, dining services overhaul, commuter student support.",
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
        );

        vm.stopBroadcast();
    }
}
