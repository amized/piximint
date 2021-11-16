import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers, Contract, BigNumber } from 'ethers';
import { CONTRACT_ADDRESS } from '../../constants/contract';
import contractAbi from '../../utils/PixiMint.json';
import { bigNumToHexString } from '../../utils/utils';
import { createCanvas } from 'canvas';

const API_KEY = process.env.ALCHEMY_API_KEY;

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
  pngData: Buffer | null;
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
    this.pngData = null;
    this.lastUpdateAt = null;
  }

  private async request() {
    const txn = await this.contract.getBoard();
    return txn as Array<Item>;
  }

  async buildPng() {
    const width = IMAGE_SIZE;
    const height = IMAGE_SIZE;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    const data = await this.request();
    data.forEach((item) => {
      const tokenId = item.tokenId.toNumber();
      const x = tokenId % 8;
      const y = Math.floor(tokenId / 8);
      context.fillStyle = bigNumToHexString(item.color);
      context.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    });

    const buffer = canvas.toBuffer('image/png');
    this.pngData = buffer;
    this.lastUpdateAt = new Date().valueOf();
    return this.pngData;
  }

  async getPng() {
    if (this.pngData === null || this.lastUpdateAt === null) {
      return await this.buildPng();
    }
    const now = new Date().valueOf();
    if (now - this.lastUpdateAt > CACHE_DEBOUCNE) {
      this.buildPng();
    }
    return this.pngData;
  }
}

const imageCache = new ImageCache();

export default async function handler(
  req: NextApiRequest, // eslint-disable-line
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const png = await imageCache.getPng();
    res.setHeader('content-type', 'image/png');
    res.status(200).send(png);
  }
}
