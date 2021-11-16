import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Main from '../components/main';
import WalletProvider from 'context/wallet';
import { EditorProvider } from 'context/editor';
const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WalletProvider>
        <EditorProvider>
          <Main />
        </EditorProvider>
      </WalletProvider>
    </div>
  );
};

export default Home;