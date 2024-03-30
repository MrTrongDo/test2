'use client';
import React from 'react';
import { BankInfo } from './bank-info';
import { Profit } from './profit';
import { Chart } from './chart';
import { clsx } from '@/core';

import styles from './information.module.css';
import { Search } from './search';

const mock = {
  name: 'Ngân hàng TMCP Á Châu',
  branch: 'Ngân hàng',
  indexPrice: { status: 'up', value: '27,600' },
  upDownPrice: { status: 'up', value: '100' },
  upDownPercent: { status: 'up', value: '0.36%' }
};

const profitMock = {
  grossProfitMargin: {
    status: 'up',
    value: '47.7%'
  },
  netProfitMargin: {
    status: 'up',
    value: '31.0%'
  },
  profitGrowth: {
    status: 'balance',
    value: '42.5%'
  },
  pe: {
    status: 'normal',
    value: '31.0%'
  },
  pb: {
    status: 'normal',
    value: '1.76'
  },
  outPerformanceRatio: {
    status: 'normal',
    value: '55,36%'
  }
};

const Information = () => {
  return (
    <div className={clsx(styles.wrapper)}>
      <Search>
        <BankInfo bankInfo={mock as any} />
        <Profit profitInfo={profitMock as any} />
        <Chart />
      </Search>
    </div>
  );
};

export default Information;
