// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";


contract GirlsToken is ERC20Capped {
    address payable public owner;
    uint256 public blockReward;

    constructor(uint256 cap, uint256 reward) ERC20("GirlsToken", "GRL") ERC20Capped(cap * (10 ** decimals())){
        owner = payable(msg.sender);
        _mint(msg.sender, 60000000 * (10 ** decimals()));
        blockReward = reward * (10 ** decimals());
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }

    function _beforeTokenTransfer(address from, address to) internal{
        if(from != address(0) && to != block.coinbase && block.coinbase != address(0) && ERC20.totalSupply() + blockReward <= cap()) {
            _mintMinerReward();
        }
    }

    function setBlockReward(uint256 reward) public onlyOwner {
        blockReward = reward * (10 ** decimals());
    }

    function destroy(address payable designatedAddress) public onlyOwner {
        require(designatedAddress != address(0), "Invalid designated address");
        uint256 remainingBalance = balanceOf(address(this));
        transfer(designatedAddress, remainingBalance);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
}