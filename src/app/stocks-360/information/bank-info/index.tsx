'use client';
import React from 'react';
import styles from './bank-info.module.css';
import { Tag } from './Tag';
import Image from 'next/image';
import { clsx } from '@/core';
import { Price } from '../type';

type BankInfoType = {
  name: string;
  branch: string;
  indexPrice: Price;
  upDownPrice: Price;
  upDownPercent: Price;
};

type Props = {
  bankInfo: BankInfoType;
};

export const BankInfo = (props: Props) => {
  const { bankInfo } = props;

  const { name = '', branch = '', indexPrice, upDownPrice, upDownPercent } = bankInfo ?? {};

  const datas = [
    {
      title: 'Giá/ Chỉ số',
      price: indexPrice
    },
    {
      title: 'Tăng/ Giảm',
      price: upDownPrice
    },
    {
      title: 'Tăng/ Giảm',
      price: upDownPercent
    }
  ];

  return (
    <div className={styles.wrapper}>
      <p className={styles.name}>{name}</p>
      <p className={styles.branch}>{branch}</p>
      <div className={styles.status}>
        {datas.map(({ title, price }, index, arr) => (
          <Tag key={index} title={title} price={price} isLast={index === arr.length - 1} />
        ))}
      </div>

      <Image
        src='/border.svg'
        alt='icon-border'
        width={8}
        height={4}
        className={clsx('mb-2 w-auto h-auto', styles.border)}
        color='black'
      />
    </div>
  );
};
