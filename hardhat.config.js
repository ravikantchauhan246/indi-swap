// require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.7.6",
        settings: {
          evmVersion: "istanbul",
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/ug7xoz6Y9pdwDGYPA8cmfKRL06N77Jgo",
      },
    },
  },
};

// require("@nomiclabs/hardhat-waffle");

// module.exports = {
//   solidity: {
//     version: "0.7.6",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 5000,
//         details: { yul: false },
//       },
//     },
//   },
//   networks: {
//     hardhat: {
//       forking: {
//         url: "your",
//         accounts: [`0x${"your"}`],
//       },
//     },
//   },
// };
