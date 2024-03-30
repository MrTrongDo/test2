'use client';

import React, { useState } from 'react';
import styles from '../header.module.css';
import { AntdDrawer } from '@/core';

export const Menu = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <div className='header--left' onClick={() => setOpen(true)}>
        <div className={styles.menu_icon}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      {open ? (
        <AntdDrawer
          title='Drawer with extra actions'
          placement='left'
          width={500}
          onClose={() => setOpen(false)}
          open={open}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </AntdDrawer>
      ) : null}
    </>
  );
};
