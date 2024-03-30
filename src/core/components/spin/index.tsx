import { AntdSpin, styled } from '@/core';
import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

const SpinWrapper = styled(AntdSpin)`
  &.ant-spin {
    flex: 1;
    justify-content: center;
    display: flex;
    align-items: center;

    span {
      font-size: 24px;
      color: #823d97;
    }
  }
`;

export const Spin = () => {
  return <SpinWrapper indicator={<LoadingOutlined spin />} />;
};
