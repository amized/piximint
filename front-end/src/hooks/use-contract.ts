import { useWallet } from 'context/wallet';
import { ethers, Contract } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { CONTRACT_ADDRESS } from '../constants/contract';
import contractAbi from '../utils/PixiMint.json';

let contract: Contract | null = null;

const useContract = () => {
  const { currentAccount, wrongChain } = useWallet();

  /*
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = provider.getSigner(0);
  contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
*/

  contract = useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    // Check account and that we are on the correct network
    if (window.ethereum && currentAccount && !wrongChain) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
    } else {
      return null;
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_ETH_NETWORK_URL
      );
      const signer = provider.getSigner(0);
      contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
    }
    return contract;
  }, [currentAccount, wrongChain]);

  return contract;
};

export default useContract;
