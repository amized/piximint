import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef
} from 'react';
import styled from '@emotion/styled';
import { Tile } from '../types';
import useContract from 'hooks/use-contract';
import { useWallet } from 'context/wallet';
import { SketchPicker } from 'react-color';
import Button from './button';
import Spinner from './spinner';
import PencilIcon from './pencil';
import { useEditor } from 'context/editor';

interface Props {
  pixel: Tile;
  showControls: boolean;
}

const Pixel = ({ pixel, showControls }: Props) => {
  const contract = useContract();
  const editor = useEditor();
  const { currentAccount } = useWallet();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  const [isMintSuccess, setIsMintSuccess] = useState(false);
  const doMint = useCallback(
    async (tokenId: number) => {
      if (contract) {
        try {
          setIsMinting(true);
          const txn = await contract.mintPixi(tokenId);
          const result = await txn.wait();
        } catch (err) {
          setIsMinting(false);
        }
      }
    },
    [contract]
  );

  const ownedByMe = useMemo(() => {
    return pixel.owner.toLowerCase() === currentAccount?.toLowerCase();
  }, [pixel.owner, currentAccount]);

  useEffect(() => {
    if (ownedByMe && isMinting) {
      setIsMinting(false);
      setIsMintSuccess(true);
    }
  }, [ownedByMe, isMinting]);

  const mintable = pixel.owner === '0x0000000000000000000000000000000000000000';

  const color =
    editor.currentTokenId === pixel.tokenId && editor.editColor
      ? editor.editColor
      : pixel.color;

  const children = useMemo(
    () => (
      <>
        <Wrapper color={color} ref={wrapperRef} showControls={showControls}>
          <Inner>
            {showControls ? (
              <Centered>
                {isMinting ? (
                  <Spinner />
                ) : mintable ? (
                  <MintButton mode="dark" onClick={() => doMint(pixel.tokenId)}>
                    Mint
                  </MintButton>
                ) : null}
                {ownedByMe ? (
                  <EditWrapper
                    onClick={() => {
                      editor.startEdit(pixel.tokenId, pixel.color);
                      setIsMintSuccess(false);
                    }}
                  >
                    <PencilIcon />
                  </EditWrapper>
                ) : null}
              </Centered>
            ) : null}
          </Inner>
          {isMintSuccess ? (
            <MintSuccessMessage>
              Mint successful! Click the pencil icon to choose a color.
            </MintSuccessMessage>
          ) : null}
        </Wrapper>
      </>
    ),
    [color, mintable, isMinting, isMintSuccess, ownedByMe, pixel, showControls]
  );

  return children;
};

const MintButton = styled(Button)`
  padding: 0px 10px;
  font-size: 12px;
`;

const Wrapper = styled.div<{ color: string; showControls: boolean }>`
  flex: 0 0 12.5%;
  width: 12.5%;
  background: ${(props) => props.color};
  position: relative;
  box-sizing: border-box;
  ${(props) =>
    props.showControls
      ? `
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      border-right: 1px solid rgba(255, 255, 255, 0.1);

    `
      : ''}
`;

const Inner = styled.div`
  padding-top: 100%;
  position: relative;
`;

const Centered = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const EditWrapper = styled.div`
  background: rgba(0, 0, 0, 0.1);
  width: 60%;
  height: 60%;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
  svg {
    width: 90%;
    height: 90%;
  }
`;

const MintSuccessMessage = styled.div`
  width: 200px;
  background: #fff;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid #183153;
`;

const ColorPickerWrapper = styled.div`
  //padding: 30px;
  //background: #fff;
  position: absolute;
  bottom: -296px;
  left: 0px;
  z-index: 100;
`;

export default Pixel;
