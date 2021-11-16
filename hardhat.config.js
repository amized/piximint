require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  networks: {
    localhost: {
      url: "http://127.0.0.1:7545",
      accounts: [`4835beaf8f72b4688d254ddfec77bd8d33d4d6a185c1e5c87527fdb9f11032a7`]
    },
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/vzKH9SLaPVMPh26lsa23f1A60jLXofXC',
      accounts: ['7727c803ee8a7c8437379b923cc2e589b5a6c3478068ea74a10dbff6d30e3821']
    }
  }
};
