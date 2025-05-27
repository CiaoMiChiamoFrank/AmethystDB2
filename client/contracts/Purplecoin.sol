// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//utilizzo di ERC20 per la gestione dei tokn attraverso OpenZeppelin

contract PurpleCoin is ERC20 {
    constructor() ERC20("PurpleCoin", "PURP") {}

    //migliore leggibilità del codice
    /**
     * @dev Mint new PurpleCoins to a specific address. Can be called by anyone to reward users.
     * @param to The address to receive the PurpleCoins.
     * @param amount The amount of PurpleCoins to mint.
     */
    function mint(address to, uint256 amount) public {
        _mint(to, amount); // mint dei token per un determinato indirizzo
    }

    /**
     * @dev Get the balance of PurpleCoins for a specific address.
     * @param account The address to query the balance for.
     * @return The balance of PurpleCoins for the provided address.
     */
    //restituisce il saldo dell'indirizzo passato
    function getBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }
}
