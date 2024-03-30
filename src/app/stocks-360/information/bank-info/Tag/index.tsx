'use client';
import React from 'react';
import { styled } from '@/core';
import { Price, Status } from '../../type';
import { detectColor } from '@/app/stocks-360/utils';

type Props = {
  title: string;
  price: Price;
  isLast: boolean;
};

const TagWrapper = styled.div<{ $status: Status; $isLast: boolean }>`
  margin-right: ${(props) => (!props.$isLast ? '24px' : '0px')};
  .title {
    color: #002060;
    font-size: 10px;
  }
  .value {
    font-size: 14px;
    color: ${(props) => detectColor(props.$status)};
  }
`;

export const Tag = (props: Props) => {
  const { title, price, isLast } = props;

  const { status, value } = price;

  return (
    <>
      <TagWrapper $status={status} $isLast={isLast}>
        <p className='title mb-1'>{title}</p>
        <p className='value'> {value}</p>
      </TagWrapper>
    </>
  );
};
