const main = async () => {

  const contractFactory = await hre.ethers.getContractFactory('PixiMint');
  const contract = await contractFactory.deploy(64);
  await contract.deployed();
  console.log("Contract deployed to:", contract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();