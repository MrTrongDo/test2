import { FormInstance } from 'antd';
import React from 'react';
import { Form, InputPassword, InputText, Button } from '@/core';

type Props = {
  form: FormInstance<any>;
};

export const SignInForm = (props: Props) => {
  return (
    <>
      <Form layout='vertical' autoComplete='off'>
        <Form.Item label='Tài khoản'>
          <InputText placeholder='Nhập tài khoản' />
        </Form.Item>

        <Form.Item label='Mật khẩu'>
          <InputPassword placeholder='Nhập mật khẩu' />
        </Form.Item>
      </Form>
      <Button type='primary'>Đăng Nhập</Button>
    </>
  );
};
