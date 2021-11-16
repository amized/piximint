// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers, Contract, BigNumber } from 'ethers';
import { CONTRACT_ADDRESS } from '../../constants/contract';
import contractAbi from '../../utils/PixiMint.json';
import { bigNumToHexString } from '../../utils/utils';
const API_KEY = process.env.ALCHEMY_API_KEY;
const PRIVATE_KEY =
  '8817c9b4e5af821053a661afca5ef0d7f0b632582bc78d4b40dc9a0a72092ad3';

interface Item {
  owner: string;
  color: BigNumber;
  tokenId: BigNumber;
}

const IMAGE_SIZE = 512;
const PIXEL_SIZE = IMAGE_SIZE / 8;
const CACHE_DEBOUCNE = 10000;

class ImageCache {
  contract: Contract;
  svgData: string | null;
  lastUpdateAt: number | null;
  constructor() {
    const alchemyProvider = new ethers.providers.AlchemyProvider(
      'rinkeby',
      API_KEY
    );
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractAbi.abi,
      alchemyProvider
    );
    this.svgData = null;
    this.lastUpdateAt = null;
  }

  private async request() {
    const txn = await this.contract.getBoard();
    return txn as Array<Item>;
  }

  async buildSvg() {
    const data = await this.request();
    const rects = data.map((item) => {
      const tokenId = item.tokenId.toNumber();
      const x = tokenId % 8;
      const y = Math.floor(tokenId / 8);

      return `<rect x="${x * PIXEL_SIZE}" y="${
        y * PIXEL_SIZE
      }" style="fill: ${bigNumToHexString(
        item.color
      )}" width="${PIXEL_SIZE}" height="${PIXEL_SIZE}" />`;
    });

    this.svgData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${IMAGE_SIZE} ${IMAGE_SIZE}" width="${IMAGE_SIZE}" height="${IMAGE_SIZE}">${rects.join(
      ''
    )}</svg>`;
    this.lastUpdateAt = new Date().valueOf();
    return this.svgData;
  }

  async getSvg() {
    if (this.svgData === null || this.lastUpdateAt === null) {
      return await this.buildSvg();
    }

    const now = new Date().valueOf();

    if (now - this.lastUpdateAt > CACHE_DEBOUCNE) {
      this.buildSvg();
    }

    return this.svgData;
  }
}

const imageCache = new ImageCache();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const svg = await imageCache.getSvg();
  res.setHeader('content-type', 'image/svg+xml');
  res.status(200).send(svg);
}
