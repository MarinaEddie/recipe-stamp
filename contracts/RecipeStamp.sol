// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RecipeStamp {
    mapping(address => uint256) public userSweets;
    mapping(address => uint256) public userSpicies;
    mapping(address => uint256) public userFreshes;

    uint256 public totalSweets;
    uint256 public totalSpicies;
    uint256 public totalFreshes;

    event SweetStamped(address indexed user, uint256 userSweets, uint256 totalSweets);
    event SpicyStamped(address indexed user, uint256 userSpicies, uint256 totalSpicies);
    event FreshStamped(address indexed user, uint256 userFreshes, uint256 totalFreshes);

    function stampSweet() external {
        unchecked {
            userSweets[msg.sender] += 1;
            totalSweets += 1;
        }
        emit SweetStamped(msg.sender, userSweets[msg.sender], totalSweets);
    }

    function stampSpicy() external {
        unchecked {
            userSpicies[msg.sender] += 1;
            totalSpicies += 1;
        }
        emit SpicyStamped(msg.sender, userSpicies[msg.sender], totalSpicies);
    }

    function stampFresh() external {
        unchecked {
            userFreshes[msg.sender] += 1;
            totalFreshes += 1;
        }
        emit FreshStamped(msg.sender, userFreshes[msg.sender], totalFreshes);
    }
}
