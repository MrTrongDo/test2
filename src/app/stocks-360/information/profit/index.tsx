'use client';
import React from 'react';
import { Price, Status } from '../type';
import styles from './profit.module.css';
import { styled } from '@/core';
import { detectColor } from '../../utils';

type Props = {
  profitInfo: {
    grossProfitMargin: Price;
    netProfitMargin: Price;
    profitGrowth: Price;
    pe: Price;
    pb: Price;
    outPerformanceRatio: Price;
  };
};

const ColumnWrapper = styled.div<{ $status: Status }>`
  .title {
    color: #002060;
    font-size: 10px;
  }
  .value {
    font-size: 14px;
    color: ${(props) => detectColor(props.$status)};
  }
`;

export const Profit = (props: Props) => {
  const { profitInfo } = props;
  const { grossProfitMargin, netProfitMargin, profitGrowth, pe, pb, outPerformanceRatio } = profitInfo;

  const datas = [
    {
      title: 'Biên LN gộp quý',
      value: grossProfitMargin
    },
    {
      title: 'Biên LN ròng quý',
      value: netProfitMargin
    },
    {
      title: 'Tăng trưởng LN năm',
      value: profitGrowth
    },
    {
      title: 'PE',
      value: pe
    },
    {
      title: 'PB',
      value: pb
    },
    {
      title: 'Tỷ lệ trôi nổi',
      value: outPerformanceRatio
    }
  ];

  const renderDatas = () => {
    return datas.map((data, index) => {
      return (
        <React.Fragment key={index}>
          <ColumnWrapper $status={data.value.status}>
            <p className='title'>{data.title}</p>
            <p className='value'>{data.value.value}</p>
          </ColumnWrapper>
        </React.Fragment>
      );
    });
  };

  return <div className={styles.wrapper}>{renderDatas()}</div>;
};
