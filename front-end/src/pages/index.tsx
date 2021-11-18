import type { NextPage } from 'next';
import Head from 'next/head';
import Main from '../components/main';
import WalletProvider from 'context/wallet';
import { EditorProvider } from 'context/editor';
import { description } from 'constants/content';
const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Piximint - Go mint yourself a pixel</title>
        <meta name="description" content={description} />

        <meta property="og:site_name" content="Piximint" />
        <meta
          property="og:title"
          content="Piximint - Go mint yourself a pixel"
        />
        <meta property="og:description" content={description} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:description" content={description?.slice(0, 200)} />
        <meta property="og:image" content={'https://piximint.com/api/image'} />
        <meta
          property="twitter:image"
          content={'https://piximint.com/api/image'}
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <link rel="icon" href="/api/image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@500;700&display=swap"
          rel="stylesheet"
        ></link>
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
