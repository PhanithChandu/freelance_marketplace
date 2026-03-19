// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Escrow
 * @notice Holds funds for a freelance project with milestone-based release.
 * @dev Deployed by EscrowFactory for each project.
 *
 *  State machine:
 *    AwaitingDeposit → Funded → InProgress → UnderReview → Released → Completed
 *                                                          ↘ Disputed → Arbitration
 */
contract Escrow is ReentrancyGuard {
    enum State {
        AwaitingDeposit,
        Funded,
        InProgress,
        UnderReview,
        Released,
        Completed,
        Disputed,
        Refunded
    }

    struct Milestone {
        string title;
        uint256 amount;
        bool completed;
        bool approved;
        string evidenceCID; // IPFS CID
    }

    // --- Storage ---
    address public client;
    address public freelancer;
    State   public state;

    Milestone[] public milestones;
    uint256 public totalAmount;
    uint256 public releasedAmount;

    // --- Events ---
    event EscrowFunded(uint256 amount);
    event MilestoneCompleted(uint256 indexed milestoneId, string evidenceCID);
    event MilestoneApproved(uint256 indexed milestoneId, uint256 amount);
    event PaymentReleased(uint256 amount, address indexed to);
    event DisputeRaised(address indexed by);
    event EscrowRefunded(uint256 amount, address indexed to);

    // --- Modifiers ---
    modifier onlyClient()     { require(msg.sender == client,     "Not client");     _; }
    modifier onlyFreelancer() { require(msg.sender == freelancer, "Not freelancer"); _; }
    modifier inState(State s) { require(state == s,               "Invalid state");  _; }

    // --- Constructor ---
    constructor(
        address _client,
        address _freelancer,
        string[] memory _titles,
        uint256[] memory _amounts
    ) {
        require(_titles.length == _amounts.length, "Length mismatch");
        require(_titles.length > 0, "Need milestones");

        client     = _client;
        freelancer = _freelancer;
        state      = State.AwaitingDeposit;

        uint256 total = 0;
        for (uint256 i = 0; i < _titles.length; i++) {
            milestones.push(Milestone({
                title:       _titles[i],
                amount:      _amounts[i],
                completed:   false,
                approved:    false,
                evidenceCID: ""
            }));
            total += _amounts[i];
        }
        totalAmount = total;
    }

    // --- Client: Fund the escrow ---
    function fund() external payable onlyClient inState(State.AwaitingDeposit) {
        require(msg.value == totalAmount, "Incorrect amount");
        state = State.Funded;
        emit EscrowFunded(msg.value);
    }

    // --- Client: Start work ---
    function startWork() external onlyClient inState(State.Funded) {
        state = State.InProgress;
    }

    // --- Freelancer: Submit milestone evidence ---
    function completeMilestone(uint256 _id, string calldata _evidenceCID)
        external
        onlyFreelancer
    {
        require(state == State.InProgress || state == State.UnderReview, "Invalid state");
        require(_id < milestones.length,    "Invalid milestone");
        require(!milestones[_id].completed, "Already completed");

        milestones[_id].completed   = true;
        milestones[_id].evidenceCID = _evidenceCID;
        state = State.UnderReview;

        emit MilestoneCompleted(_id, _evidenceCID);
    }

    // --- Client: Approve a milestone and release its funds ---
    function approveMilestone(uint256 _id)
        external
        onlyClient
        nonReentrant
    {
        require(state == State.UnderReview || state == State.InProgress, "Invalid state");
        require(_id < milestones.length,   "Invalid milestone");
        require(milestones[_id].completed, "Not completed");
        require(!milestones[_id].approved, "Already approved");

        milestones[_id].approved = true;
        uint256 amount = milestones[_id].amount;
        releasedAmount += amount;

        (bool ok, ) = freelancer.call{value: amount}("");
        require(ok, "Transfer failed");

        emit MilestoneApproved(_id, amount);

        // Auto-complete if all milestones are approved
        if (_allApproved()) {
            state = State.Completed;
            emit PaymentReleased(totalAmount, freelancer);
        }
    }

    // --- Client: Release all remaining funds ---
    function releasePayment()
        external
        onlyClient
        nonReentrant
        inState(State.UnderReview)
    {
        uint256 remaining = address(this).balance;
        require(remaining > 0, "No funds");

        state = State.Completed;
        releasedAmount = totalAmount;

        (bool ok, ) = freelancer.call{value: remaining}("");
        require(ok, "Transfer failed");

        emit PaymentReleased(remaining, freelancer);
    }

    // --- Either party: Raise dispute ---
    function raiseDispute() external {
        require(msg.sender == client || msg.sender == freelancer, "Not party");
        require(
            state == State.InProgress || state == State.UnderReview,
            "Cannot dispute"
        );
        state = State.Disputed;
        emit DisputeRaised(msg.sender);
    }

    // --- Client: Refund (only before work starts) ---
    function refund()
        external
        onlyClient
        nonReentrant
        inState(State.Funded)
    {
        uint256 bal = address(this).balance;
        state = State.Refunded;

        (bool ok, ) = client.call{value: bal}("");
        require(ok, "Transfer failed");

        emit EscrowRefunded(bal, client);
    }

    // --- View helpers ---
    function getMilestoneCount() external view returns (uint256) {
        return milestones.length;
    }

    function _allApproved() internal view returns (bool) {
        for (uint256 i = 0; i < milestones.length; i++) {
            if (!milestones[i].approved) return false;
        }
        return true;
    }
}
