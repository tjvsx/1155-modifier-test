// // SPDX-License-Identifier: MIT

// import { IERC1155Enumerable } from '@solidstate/contracts/token/ERC1155/enumerable/IERC1155Enumerable.sol';


// pragma solidity ^0.8.12;

// library MyLib {
//     bytes32 constant MY_STORAGE_POSITION =
//         keccak256("my.lib.storage");

//     struct MyStorage {
//         mapping(uint256 => address) poolController;
//     }

//     function getStorage()
//         internal
//         pure
//         returns (MyStorage storage ms)
//     {
//         bytes32 position = MY_STORAGE_POSITION;
//         assembly {
//             ms.slot := position
//         }
//     }

//     function getTotalSupply(uint256 id) external view returns (uint256) {
//       IERC1155Enumerable.totalSupply(id);
//     }

//     // function _isApprovedForPool(uint256 poolID, address operator)
//     //     internal
//     //     view
//     //     returns (bool)
//     // {
//     //     // MyLib.MyLibStorage storage mls = MyLib.myLibStorage();
//     //     // if (operator == mls.poolController[poolID]) {
//     //     //     return true;
//     //     // } else if (mls.globalPoolOperatorApprovals[poolID][operator]) {
//     //     //     return true;
//     //     // }
//     //     // return false;
//     // }
// }