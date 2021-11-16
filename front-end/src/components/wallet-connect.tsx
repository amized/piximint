import { useWallet } from 'context/wallet';
import React from 'react';
import Button from './button';
import styled from '@emotion/styled';

const WalletConnect = () => {
  const { connectWalletAction, currentAccount } = useWallet();

  return (
    <Wrapper>
      <Button onClick={() => connectWalletAction()}>Connect Wallet</Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 0px;
`;

export default WalletConnect;
