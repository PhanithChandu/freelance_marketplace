// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Escrow.sol";

/**
 * @title EscrowFactory
 * @notice Deploys isolated Escrow contract instances for each freelance project.
 * @dev The factory pattern ensures each project has its own contract with
 *      its own balance and state — no cross-project interference.
 */
contract EscrowFactory {
    // --- Events ---
    event EscrowCreated(
        address indexed escrowAddress,
        address indexed client,
        address indexed freelancer,
        uint256 totalAmount
    );

    // --- Storage ---
    struct EscrowRecord {
        address escrowAddress;
        address client;
        address freelancer;
        uint256 totalAmount;
        uint256 createdAt;
    }

    EscrowRecord[] public escrows;
    mapping(address => uint256[]) public clientEscrows;
    mapping(address => uint256[]) public freelancerEscrows;

    // --- Deploy a new Escrow ---
    function deployEscrow(
        address _freelancer,
        string[] calldata _milestoneTitles,
        uint256[] calldata _milestoneAmounts
    ) external returns (address) {
        Escrow escrow = new Escrow(
            msg.sender,
            _freelancer,
            _milestoneTitles,
            _milestoneAmounts
        );

        address escrowAddr = address(escrow);

        uint256 total = 0;
        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            total += _milestoneAmounts[i];
        }

        uint256 idx = escrows.length;
        escrows.push(EscrowRecord({
            escrowAddress: escrowAddr,
            client:        msg.sender,
            freelancer:    _freelancer,
            totalAmount:   total,
            createdAt:     block.timestamp
        }));

        clientEscrows[msg.sender].push(idx);
        freelancerEscrows[_freelancer].push(idx);

        emit EscrowCreated(escrowAddr, msg.sender, _freelancer, total);

        return escrowAddr;
    }

    // --- View helpers ---
    function getEscrowCount() external view returns (uint256) {
        return escrows.length;
    }

    function getClientEscrowCount(address _client) external view returns (uint256) {
        return clientEscrows[_client].length;
    }

    function getFreelancerEscrowCount(address _freelancer) external view returns (uint256) {
        return freelancerEscrows[_freelancer].length;
    }
}
