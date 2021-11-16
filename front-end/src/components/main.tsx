import styled from '@emotion/styled';

import useContract from 'hooks/use-contract';
import { useEffect } from 'react';
import PixiBoard from '../components/pixi-board';
import styles from '../styles/Home.module.css';

const Main = () => {
  const contract = useContract();

  useEffect(() => {
    const getData = async () => {
      if (contract) {
        const txn = await contract.getBoard();
        console.log('The txn???', txn);
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
          <p>
            PixiMint is a peice of collaborative artwork that lives on the
            Polygon blockchain. Each NFT is both the artwork itself and
            ownership over a particular pixel within the work. As a pixel owner
            you can choose the color of your pixel and change it any time.
          </p>
          <p>Go mint yourself a pixel for free + gas.</p>
        </Intro>
      </main>

      <PixiBoard />

      <footer className={styles.footer}>
        <a
          href="http://amielzwier.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          By <span className={styles.logo}>Amiel Zwier</span>
        </a>
      </footer>
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

export default Main;
