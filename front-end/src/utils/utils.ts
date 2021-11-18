import { BigNumber } from '@ethersproject/bignumber';
import { CONTRACT_ADDRESS } from '../constants/contract';

export const bigNumToHexString = (color: BigNumber) => {
  return color._hex.replace('0x', '#').padEnd(7, '0');
};

export const openSeaLink = (tokenId: number) => {
  return `${process.env.NEXT_PUBLIC_OPEN_SEA_URL}/assets/${CONTRACT_ADDRESS}/${tokenId}`;
};
