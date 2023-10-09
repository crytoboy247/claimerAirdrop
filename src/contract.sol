// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;


contract MyContract {
     address public owner;
 
 constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }
   

 // Allows users to check their balance in the contract
    function checkBalance() external view returns (uint256) {
        return address(this).balance;
    }
    function claim () payable public {

    }

    function withdrawContractBalance() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
