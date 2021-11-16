import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import Pixel from './pixel';
import useBoard from '../hooks/use-board';
import { useEditor } from 'context/editor';
import Button from './button';
import WalletConnect from 'components/wallet-connect';
import { useWallet } from 'context/wallet';

interface Props {
  numTiles: number;
}

type Mode = 'edit' | 'normal';

const PixiBoard = () => {
  const [mode, setMode] = useState<Mode>('normal');
  const editor = useEditor();
  const tiles = useBoard();
  const { currentAccount, wrongChain } = useWallet();
  return (
    <Outer>
      <Wallet>
        {currentAccount === null ? (
          <WalletConnect />
        ) : wrongChain ? (
          <WrongNetwork>
            You are connected to the wrong network. In metamask, change your
            network to <b>Polygon Mainnet</b>.
          </WrongNetwork>
        ) : mode === 'normal' ? (
          <Button onClick={() => setMode('edit')}>Edit / Mint</Button>
        ) : (
          <Button onClick={() => setMode('normal')}>View mode</Button>
        )}
      </Wallet>

      <Wrapper>
        <List>
          {tiles.length > 0 ? (
            tiles.map((tile, index) => {
              return (
                <Pixel
                  key={index}
                  pixel={tile}
                  showControls={
                    editor.currentTokenId === null ? mode === 'edit' : false
                  }
                />
              );
            })
          ) : (
            <StaticBoard src={'/api/image'} />
          )}
        </List>
      </Wrapper>
    </Outer>
  );
};

const Outer = styled.div`
  padding: 0px 50px;
  border-top: 2px solid #eee;
  border-bottom: 2px solid #eee;
`;

const WrongNetwork = styled.div`
  padding: 20px;
  background: #ff9595;
`;

const Wrapper = styled.div`
  max-width: 700px;
  margin: 0px auto 80px auto;
`;

const List = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const StaticBoard = styled.img`
  width: 100%;
  display: block;
`;

const Wallet = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px 0px;
`;

const Connetcted = styled.div`
  width: 400px;
  margin-bottom: 40px;
  text-align: center;
  background: #d9eefb;
  padding: 20px;
`;

export default PixiBoard;
