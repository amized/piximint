import React, { useContext, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import useContract from 'hooks/use-contract';
import { SketchPicker } from 'react-color';
import Button from '../components/button';
import Spinner from '../components/spinner';
import { CONTRACT_ADDRESS } from 'constants/contract';

interface EditorContextProps {
  currentTokenId: number | null;
  setCurrentTokenId(tokenId: number): void;
  editColor: string | null;
  setEditColor(color: string): void;
  startEdit(tokenId: number, initialColor: string): void;
}

type Status = 'normal' | 'submitting' | 'success';

const EditorContext = React.createContext<EditorContextProps>(
  {} as EditorContextProps
);

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [editColor, setEditColor] = useState<string | null>(null);
  const [currentTokenId, setCurrentTokenId] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>('normal');
  const contract = useContract();
  const doUpdateColor = useCallback(async () => {
    if (contract && editColor) {
      setStatus('submitting');
      try {
        const hexValue = parseInt(editColor.slice(1), 16);
        const txn = await contract.colorPixi(hexValue, currentTokenId);
        const result = await txn.wait();
        setStatus('success');
      } catch (err) {
        setStatus('normal');
      }
    }
  }, [currentTokenId, contract, editColor]);

  const startEdit = (tokenId: number, initialColor: string) => {
    setCurrentTokenId(tokenId);
    setEditColor(initialColor);
  };

  const handleCancel = () => {
    setCurrentTokenId(null);
    setEditColor(null);
    setStatus('normal');
  };

  const contextValue = {
    editColor,
    setEditColor,
    currentTokenId,
    setCurrentTokenId,
    startEdit
  };

  const pixelCoords = currentTokenId
    ? `[${currentTokenId % 8}, ${Math.floor(currentTokenId / 8)}]`
    : '';

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
      <Drawer isOpen={currentTokenId !== null && editColor !== null}>
        {currentTokenId !== null && editColor !== null ? (
          <>
            <h3>Edit pixel {pixelCoords}</h3>
            {status === 'submitting' ? (
              <>
                <Spinner />
                <div>Saving your color to the blockchain...</div>
              </>
            ) : status === 'success' ? (
              <div>
                <p>Color updated!</p>
                <Button onClick={handleCancel}>Close</Button>
              </div>
            ) : status === 'normal' ? (
              <div>
                <SketchPicker
                  color={editColor}
                  onChange={(colorResult) => setEditColor(colorResult.hex)}
                />
                <Buttons>
                  <Button onClick={() => doUpdateColor()}>Save</Button>
                  <Button onClick={() => handleCancel()}>Cancel</Button>
                </Buttons>
                <OSLink>
                  <a
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_OPEN_SEA_URL}/assets/${CONTRACT_ADDRESS}/${currentTokenId}`}
                    rel="noreferrer"
                  >
                    View on opensea
                  </a>
                </OSLink>
              </div>
            ) : null}
          </>
        ) : null}
      </Drawer>
    </EditorContext.Provider>
  );
};

const Drawer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 263px;
  background: #efefef;
  border-left: 2px solid #183153;
  padding: 20px;
  transform: ${(props) =>
    props.isOpen ? 'translateX(0px)' : 'translateX(263px)'};
  transition: transform 0.5s;
`;

const Buttons = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
`;

const OSLink = styled.div`
  margin: 20px 0px;
`;

export const useEditor = () => useContext(EditorContext);
