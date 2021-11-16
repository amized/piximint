import React from 'react';
import styled from '@emotion/styled';

const Button = styled.button<{ mode?: 'dark' | 'light' }>`
  position: relative;
  top: 0px;
  outline: none;
  box-shadow: none;
  border: 2px solid ${(props) => (props.mode == 'dark' ? '#777777' : '#183153')};
  border-bottom: 4px solid
    ${(props) => (props.mode == 'dark' ? '#777777' : '#183153')};
  background: ${(props) => (props.mode == 'dark' ? '#000000' : '#ffeac3')};
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  padding: 0px 30px;
  font-weight: bold;
  font-size: 16px;
  color: ${(props) => (props.mode == 'dark' ? '#FFFFFF' : '#183153')};
  box-sizing: border-box;
  cursor: pointer;
  &:active {
    border-bottom: 2px solid
      ${(props) => (props.mode == 'dark' ? '#777777' : '#183153')};
    top: 2px;
  }
`;

export default Button;
