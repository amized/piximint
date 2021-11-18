import styled from '@emotion/styled';

import useContract from 'hooks/use-contract';
import { useEffect } from 'react';
import PixiBoard from '../components/pixi-board';
import styles from '../styles/Home.module.css';
import { CONTRACT_ADDRESS } from 'constants/contract';
import { description } from 'constants/content';
const Main = () => {
  const contract = useContract();

  useEffect(() => {
    const getData = async () => {
      if (contract) {
        const txn = await contract.getBoard();
      }
    };
    getData();
  }, [contract]);

  return (
    <>
      <main>
        <Header>
          <h1 className={styles.title}>PIXIMINT</h1>
        </Header>
        <Intro>
          <p>{description}</p>
          <p>Go mint yourself a pixel for free + gas.</p>
        </Intro>
      </main>

      <PixiBoard />

      <Footer>
        <Contract>
          <a
            href={`https://polygonscan.com/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
          >
            {' '}
            Contract: {CONTRACT_ADDRESS}
          </a>
        </Contract>
        <div>
          <a
            href="http://amielzwier.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            By Amiel Zwier
          </a>
        </div>
      </Footer>
    </>
  );
};

const Header = styled.div`
  padding: 40px 0px;
  text-align: center;
  background: #ffeac3;
  h1 {
    margin: 0;
  }
`;
const Intro = styled.div`
  margin: 80px 0;
  padding: 0px 15px;
  line-height: 1.5;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  p {
    max-width: 700px;
    text-align: center;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Footer = styled.div`
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Contract = styled.div`
  font-size: 12px;
  margin-bottom: 20px;
`;

export default Main;
