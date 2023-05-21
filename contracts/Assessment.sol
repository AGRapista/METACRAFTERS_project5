// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {

    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
    }

    struct transaction {
        address senderAddress;
        address receiverAddress;
        int amount;
    }

    mapping(string => transaction) public transactionHistory;

    string[] public keys;
    transaction[] public values;

    function sendETH(address receiverAddress, int amount, string memory id) public {
        transaction memory newTransaction = transaction(msg.sender, receiverAddress, amount);

        transactionHistory[id] = newTransaction;

        keys.push(id);
        values.push(newTransaction);
    }

    function getTransactionKeys() public view returns (string[] memory) {
        return keys;
    }

    function getTransactionValues() public view returns (transaction[] memory) {
        return values;
    }

    function deleteTransaction(string memory id) public {
        require(msg.sender == owner);
        
        if (keys.length != 0){
            delete(transactionHistory[id]);
            keys.pop();
            values.pop();
        }
    }
}
