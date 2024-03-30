import React from 'react';
import styles from './header.module.css';
import Image from 'next/image';
import { Menu } from './menu';
import { Action } from './action';

export const Header = () => {
  return (
    <>
      <header className={styles.header_wrapper}>
        <div className={styles.content}>
          <Menu />
          <div className={`${styles.logo} header--logo`}>
            <Image src='/finpal-logo.svg' alt='finpal-logo' width={140} height={100} priority />
          </div>
          <Action />
        </div>
      </header>
    </>
  );
};
