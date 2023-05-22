// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ArgentumToken is ERC20 {

    address public owner;
    mapping(address => uint) ledger;

    constructor() ERC20("Argentum", "AGT") {
        owner = msg.sender;
    }
    
    // Validation Control
    modifier onlyOwner {
		require (owner == msg.sender, "Not owner");
		_;
	}

    // Get the owner address for front-end verification
    function getOwner() public view returns(address) {
        return owner;
    }

    function getBalance(address account) public view returns(uint) {
        return balanceOf(account);
    }

    function getTotalSupply() public view returns(uint) {
        return totalSupply();
    }
    
    function mintToken(address receiver, uint amount) public onlyOwner {
        _mint(receiver, amount);
        approve(msg.sender, amount);
        increaseAllowance(receiver, amount);
    }

    function transferToken(address receiver, uint amount) public {
        approve(msg.sender, amount);
        transferFrom(msg.sender, receiver, amount);
        increaseAllowance(receiver, amount);
    }

    function burnToken(address account, uint amount) public {
        _burn(account, amount);
    }


}