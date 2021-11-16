import { BigNumber } from '@ethersproject/bignumber';
export const bigNumToHexString = (color: BigNumber) => {
  return color._hex.replace('0x', '#').padEnd(7, '0');
};
