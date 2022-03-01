// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import { ERC1155 } from '@solidstate/contracts/token/ERC1155/ERC1155.sol';
import { IERC1155 } from '@solidstate/contracts/token/ERC1155/IERC1155.sol';
import { ERC165Storage } from '@solidstate/contracts/introspection/ERC165Storage.sol';
// import { MyLib } from '../libraries/MyLib.sol';

contract MySet is ERC1155 {
    using ERC165Storage for ERC165Storage.Layout;

    constructor() {
        ERC165Storage.layout().setSupportedInterface(
            type(IERC1155).interfaceId,
            true
        );
    }

    function __mint(
        address account,
        uint256 id,
        uint256 amount
    ) external {
        _mint(account, id, amount, '');
    }

    function __burn(
        address account,
        uint256 id,
        uint256 amount
    ) external {
        _burn(account, id, amount);
    }
}