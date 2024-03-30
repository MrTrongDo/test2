'use client';
import { Button, Modal, clsx, Form, Box } from '@/core';
import React, { useState } from 'react';
import styles from './action.module.css';
import { SignInForm } from './sign-in-form';
import { SignUpForm } from './sign-up-form';
import { GoogleOutlined, FacebookFilled } from '@ant-design/icons';

enum Method {
  SignIn,
  SignUp,
  ForgotPassword
}

const OAuth2 = [
  {
    _type: 'Google',
    title: 'Tiếp tục với Google',
    icon: <GoogleOutlined className='mr-2' style={{ fontSize: '18px' }} />
  },
  {
    _type: 'FaceBook',
    title: 'Tiếp tục với Facebook',
    icon: <FacebookFilled className='mr-2' style={{ fontSize: '18px' }} />
  }
];

export const Action = () => {
  const [mode, setMode] = useState<Method>(Method.SignIn);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);

  const isSignIn = mode === Method.SignIn;

  const [form] = Form.useForm();

  const methods = [
    {
      title: 'Đăng nhập',
      method: Method.SignIn
    },
    {
      title: 'Đăng ký',
      method: Method.SignUp
    }
  ];

  const handleClick = (method: Method) => () => setMode(method);

  const renderHeader = () => {
    return (
      <div className={styles.modalHeader}>
        {methods.map(({ title, method: _method }, index) => (
          <div key={_method} onClick={handleClick(_method)}>
            <p
              className={clsx(styles.modalHeaderTitle, {
                ['mr-8']: index === 0,
                ['font-bold']: _method === mode,
                [styles.line]: _method === mode
              })}
            >
              {title}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderFooter = () => {
    const renderMethodOAuth2 = () => {
      return OAuth2.map((elm) => (
        <Box key={elm._type} className='mt-6' isHaveHover>
          {elm.icon} {elm.title}
        </Box>
      ));
    };

    return (
      <div className={styles.modalFooter}>
        <div className={styles.modalFooterLine}>OR</div>
        {renderMethodOAuth2()}
      </div>
    );
  };

  return (
    <>
      <div className='header--right'>
        <Button type='primary' onClick={() => setIsShowModal(true)}>
          Đăng nhập
        </Button>
      </div>

      {isShowModal ? (
        <Modal open={isShowModal} onCancel={setIsShowModal} header={renderHeader()} footer={renderFooter()}>
          {isSignIn ? <SignInForm form={form} /> : <SignUpForm form={form} />}
        </Modal>
      ) : null}
    </>
  );
};
