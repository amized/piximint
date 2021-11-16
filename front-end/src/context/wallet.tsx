import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback
} from 'react';
//import useContract from './use-contract';

interface WalletContextType {
  checkIfWalletIsConnected(): void;
  connectWalletAction(): void;
  currentAccount: string | null;
  currentChain: string | null;
  wrongChain: boolean;
}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

const WalletProvider: React.FC = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentChain, setCurrentChain] = useState<string | null>(null);
  const [wrongChain, setWrongChain] = useState(false);

  const checkChain = useCallback(async () => {
    function handleChainChanged(_chainId: string) {
      setCurrentChain(_chainId);
      if (_chainId !== process.env.NEXT_PUBLIC_ETH_NETWORK_ID) {
        setWrongChain(true);
      } else {
        setWrongChain(false);
      }
    }
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    handleChainChanged(chainId);
    ethereum.on('chainChanged', handleChainChanged);
  }, []);

  /*
   * Since this method will take some time, make sure to declare it as async
   */
  const checkIfWalletIsConnected = async () => {
    try {
      //const provider = await detectEthereumProvider();
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        /*
         * Check if we're authorized to access the user's wallet
         */
        const accounts = await ethereum.request!({ method: 'eth_accounts' });

        /*
         * User can have multiple authorized accounts, we grab the first one if its there!
         */
        if (accounts.length !== 0) {
          const account = accounts[0];
          await checkChain();
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWalletAction = async () => {
    try {
      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request!({
        method: 'eth_requestAccounts'
      });

      await checkChain();

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const { ethereum } = window;

    const checkChanged = async () => {
      function handleChainChanged(_chainId: string) {
        setCurrentChain(_chainId);
        if (_chainId !== process.env.NEXT_PUBLIC_ETH_NETWORK_ID) {
          setWrongChain(true);
        } else {
          setWrongChain(false);
        }
      }

      if (ethereum) {
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        handleChainChanged(chainId);
        ethereum.on('chainChanged', handleChainChanged);
      }
    };

    checkChanged();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        checkIfWalletIsConnected,
        connectWalletAction,
        currentAccount,
        currentChain,
        wrongChain
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);

export default WalletProvider;
