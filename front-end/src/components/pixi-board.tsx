import React, { useState } from 'react';
import styled from '@emotion/styled';
import Pixel from './pixel';
import useBoard from '../hooks/use-board';
import { useEditor } from 'context/editor';
import Button from './button';
import WalletConnect from 'components/wallet-connect';
import { useWallet } from 'context/wallet';

type Mode = 'edit' | 'normal';

const PixiBoard = () => {
  const [mode, setMode] = useState<Mode>('normal');
  const editor = useEditor();
  const tiles = useBoard();
  const { currentAccount, wrongChain, hasEthereum, changeChain } = useWallet();
  return (
    <Outer>
      <Wallet>
        {currentAccount === null ? (
          <WalletConnect />
        ) : hasEthereum === false ? (
          <div>Please install metamask</div>
        ) : wrongChain ? (
          <WrongNetwork>
            You are connected to the wrong network. Please{' '}
            <ChangeChain onClick={changeChain}>
              change your network to Polygon Mainnet
            </ChangeChain>
            .
          </WrongNetwork>
        ) : mode === 'normal' ? (
          <Button onClick={() => setMode('edit')}>Edit / Mint</Button>
        ) : (
          <Button onClick={() => setMode('normal')}>View mode</Button>
        )}
      </Wallet>

      <Wrapper>
        {tiles.length > 0 ? (
          <List>
            {tiles.map((tile, index) => {
              return (
                <Pixel
                  key={index}
                  pixel={tile}
                  showControls={
                    editor.currentTokenId === null ? mode === 'edit' : false
                  }
                />
              );
            })}
          </List>
        ) : (
          <PlaceholderImg src="/api/image" alt="The pixmint board" />
        )}
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

const Wallet = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px 0px;
`;

const PlaceholderImg = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

const ChangeChain = styled.span`
  text-decoration: underline;
  cursor: pointer;
  user-select: none;
`;

export default PixiBoard;
