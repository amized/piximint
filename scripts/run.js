const main = async () => {

  const contractFactory = await hre.ethers.getContractFactory('PixiMint');
  const contract = await contractFactory.deploy(64);
  await contract.deployed();

  const txn = await contract.mintPixi(1);
  const txn2 = await contract.colorPixi(0xFFA0FF, 1);
  tokenUri = await contract.tokenURI(1);
  console.log(tokenUri);
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