import React, { ReactNode } from 'react';
import { clsx } from '@/core';
import styles from './button.module.css';

enum ButtonType {
  primary = 'primary',
  text = 'text'
}

type Props = {
  type: `${ButtonType}`;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
};

export const Button = (props: Props) => {
  const { type = 'primary', onClick, children, className } = props;
  return (
    <button
      onClick={() => onClick?.()}
      className={clsx(className, styles.button, {
        [styles.primary]: type === 'primary',
        [styles.text]: type === 'text'
      })}
    >
      {children}
    </button>
  );
};
