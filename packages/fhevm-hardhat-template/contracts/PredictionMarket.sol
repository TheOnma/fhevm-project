// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint128, externalEuint128} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title MVP Private Prediction Market (YES/NO)
/// @notice Minimal market that stores encrypted stakes per outcome and per user.
/// @dev This MVP focuses on encrypted accounting patterns similar to FHECounter.
///      It does NOT handle custody or transfers of funds; only encrypted amounts.
contract PredictionMarket is SepoliaConfig {
    /// @dev Two outcomes: 0 = NO, 1 = YES
    string public question;
    uint256 public endTime;
    address public oracle;
    bool public resolved;
    uint8 public resolvedOutcome; // 0 or 1

    // Encrypted totals per outcome
    euint128[2] private _encryptedTotalByOutcome;

    // Encrypted user stakes per outcome
    mapping(address => euint128[2]) private _encryptedUserStakeByOutcome;

    event BetPlaced(address indexed user, uint8 indexed outcome);
    event Resolved(uint8 indexed outcome);

    error MarketClosed();
    error AlreadyResolved();
    error NotOracle();
    error InvalidOutcome();

    constructor(string memory _question, uint256 _endTime, address _oracle) {
        require(_endTime > block.timestamp, "endTime in past");
        require(_oracle != address(0), "oracle=0");
        question = _question;
        endTime = _endTime;
        oracle = _oracle;
    }

    function _requireOpen(uint8 outcome) internal view {
        if (resolved) revert AlreadyResolved();
        if (block.timestamp >= endTime) revert MarketClosed();
        if (outcome > 1) revert InvalidOutcome();
    }

    /// @notice Place an encrypted bet for the selected outcome.
    /// @param outcome 0 = NO, 1 = YES
    /// @param encAmount encrypted amount handle
    /// @param inputProof input proof generated client-side
    function placeBet(
        uint8 outcome,
        externalEuint128 encAmount,
        bytes calldata inputProof
    ) external {
        _requireOpen(outcome);

        euint128 amount = FHE.fromExternal(encAmount, inputProof);

        // Update user encrypted position
        euint128 prevUser = _encryptedUserStakeByOutcome[msg.sender][outcome];
        euint128 newUser = FHE.add(prevUser, amount);
        _encryptedUserStakeByOutcome[msg.sender][outcome] = newUser;

        // Update total encrypted pool for the outcome
        euint128 prevTotal = _encryptedTotalByOutcome[outcome];
        euint128 newTotal = FHE.add(prevTotal, amount);
        _encryptedTotalByOutcome[outcome] = newTotal;

        // Allow contract and user to access updated handles
        FHE.allowThis(newUser);
        FHE.allow(newUser, msg.sender);
        FHE.allowThis(newTotal);

        emit BetPlaced(msg.sender, outcome);
    }

    /// @notice Returns the caller's encrypted stake handle for a given outcome.
    function getMyStake(uint8 outcome) external view returns (euint128) {
        if (outcome > 1) revert InvalidOutcome();
        return _encryptedUserStakeByOutcome[msg.sender][outcome];
    }

    /// @notice Returns the encrypted total pool for a given outcome.
    /// @dev Exposing the handle does not reveal the clear amount without decryption rights.
    function getEncryptedTotal(uint8 outcome) external view returns (euint128) {
        if (outcome > 1) revert InvalidOutcome();
        return _encryptedTotalByOutcome[outcome];
    }

    /// @notice Resolve the market to the given outcome. Only oracle after endTime.
    function resolve(uint8 outcome) external {
        if (msg.sender != oracle) revert NotOracle();
        if (resolved) revert AlreadyResolved();
        if (block.timestamp < endTime) revert MarketClosed();
        if (outcome > 1) revert InvalidOutcome();

        resolved = true;
        resolvedOutcome = outcome;
        emit Resolved(outcome);
    }
}


