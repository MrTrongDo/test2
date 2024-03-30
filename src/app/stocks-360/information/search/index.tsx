'use client';
import React from 'react';
import Image from 'next/image';
import { AntdSelect, clsx } from '@/core';
import styles from './search.module.css';

type Props = {
  children: React.ReactNode;
};
export const Search = (props: Props) => {
  const { children } = props;

  const renderSearch = (
    <div className={clsx('flex justify-center items-center', styles.search)}>
      <Image
        src='https://inkythuatso.com/uploads/images/2021/11/logo-acb-vector-inkythuatso-01-10-10-25-09.jpg'
        alt='logo'
        width={80}
        height={80}
      />
      <AntdSelect
        className='ml-2'
        showSearch
        style={{ width: 160, height: 48, margin: '0 24px' }}
        placeholder='Search to Select'
        optionFilterProp='children'
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
        }
        options={[
          {
            value: '1',
            label: 'Not Identified'
          },
          {
            value: '2',
            label: 'Closed'
          },
          {
            value: '3',
            label: 'Communicated'
          },
          {
            value: '4',
            label: 'Identified'
          },
          {
            value: '5',
            label: 'Resolved'
          },
          {
            value: '6',
            label: 'Cancelled'
          }
        ]}
      />
      <div className='icons mr-6'>
        <Image src='/news.svg' alt='icon-news' width={20} height={20} className={clsx('mb-2', styles.icon)} />
        <Image
          src='/download.svg'
          alt='icon-download'
          width={20}
          height={20}
          className={clsx('w-auto h-auto', styles.icon)}
        />
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

  return (
    <>
      {renderSearch}
      {children}
    </>
  );
};
