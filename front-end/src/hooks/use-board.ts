import useContract from './use-contract';
import { useEffect, useState } from 'react';
import { Tile } from '../types';
import { BigNumber } from '@ethersproject/bignumber';
import { bigNumToHexString } from '../utils/utils';

const makeTiles = (txnData: any) => {
  const newTiles = txnData.map(
    (item: { owner: string; tokenId: BigNumber; color: BigNumber }) => {
      const tile: Tile = {
        owner: item.owner,
        tokenId: item.tokenId.toNumber(),
        color: bigNumToHexString(item.color)
      };
      return tile;
    }
  );
  return newTiles;
};

const useBoard = () => {
  const contract = useContract();
  const [isInitialized, setIsInitialized] = useState(false);
  const [tiles, setTiles] = useState<Array<Tile>>([]);

  useEffect(() => {
    const getData = async () => {
      if (contract && !isInitialized) {
        const txn = await contract.getBoard();
        const newTiles = makeTiles(txn);
        setTiles(newTiles);
        setIsInitialized(true);
      }
    };
    getData();
  }, [contract, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      const handlePixelMinted = (
        sender: string,
        tokenId: BigNumber,
        tiles: any
      ) => {
        setTiles(makeTiles(tiles));
      };

      const handlePixelColorChanged = (tokenId: BigNumber, color: any) => {
        const index = tokenId.toNumber();
        const tileToUpdate = tiles[index];
        const newTile = {
          ...tileToUpdate,
          color: bigNumToHexString(color)
        };
        const updatedTiles = tiles.slice();
        updatedTiles.splice(index, 1, newTile);
        setTiles(updatedTiles);
      };

      if (contract) {
        contract.on('PixelMinted', handlePixelMinted);
        contract.on('PixelColorChanged', handlePixelColorChanged);
      }

      return () => {
        contract?.off('PixelMinted', handlePixelMinted);
        contract?.off('PixelColorChanged', handlePixelColorChanged);
      };
    }
    return () => {};
  }, [contract, tiles, isInitialized]);
  return tiles;
};

export default useBoard;
