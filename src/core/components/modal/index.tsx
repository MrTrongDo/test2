import React, { ReactNode } from 'react';
import { AntdModal, clsx, Form } from '@/core';
import styles from './modal.module.css';

type Props = {
  open: boolean;
  onCancel?: (open: boolean) => void;
  children?: ReactNode;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
};

export const Modal = (props: Props) => {
  const { open, onCancel, header, className, footer, children } = props;

  return (
    <AntdModal
      open={open}
      onCancel={() => onCancel?.(!open)}
      title=''
      className={clsx(className, styles.modal)}
      footer={[]}
    >
      {header ? <div className={styles.modalHeader}>{header}</div> : null}
      <div className={styles.modalContent}>{children}</div>
      {footer ? <div className={styles.modalFooter}>{footer}</div> : null}
    </AntdModal>
  );
};
