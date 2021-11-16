declare global {
  interface Window {
    ethereum: any;
  }
}

export interface Tile {
  tokenId: number;
  color: string;
  owner: string;
}

export default {};
