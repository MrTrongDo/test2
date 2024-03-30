import React, { ReactNode } from 'react';
import { clsx, styled } from '@/core';

const BoxWrapper = styled.div<{ borderRadius: string; isHaveHover: boolean }>`
  &.box {
    padding: 12px;
    width: 100%;
    border: 1px solid #cfd6e4;
    border-radius: ${(props) => props.borderRadius};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    ${(props) =>
      props.isHaveHover &&
      `&:hover {
      background-color: #f8fafd;
      transition: 0.5s;
    }`}
  }
`;

type Props = {
  className?: string;
  borderRadius?: string;
  children: ReactNode;
  isHaveHover?: boolean;
};

export const Box = (props: Props) => {
  const { borderRadius = '8px', className, children, isHaveHover = false } = props;

  return (
    <BoxWrapper className={clsx(className, 'box')} borderRadius={borderRadius} isHaveHover={isHaveHover}>
      {children}
    </BoxWrapper>
  );
};
