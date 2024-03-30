import { FormInstance } from 'antd';
import React from 'react';
import { Button, Form, InputPassword, InputText } from '@/core';

type Props = {
  form: FormInstance<any>;
};

const inputs = [
  {
    type: 'text',
    label: 'Tài khoản',
    placeholder: 'Nhập tài khoản'
  },
  {
    type: 'text',
    label: 'Họ và Tên',
    placeholder: 'Nhập họ và tên'
  },
  {
    type: 'text',
    label: 'Email',
    placeholder: 'Nhập email'
  },
  {
    type: 'text',
    label: 'Số điện thoại',
    placeholder: 'Nhập số điện thoại'
  },

  {
    type: 'password',
    label: 'Mật khẩu',
    placeholder: 'Nhập mật khẩu'
  },
  {
    type: 'password',
    label: 'Nhập lại mật khẩu',
    placeholder: 'Nhập lại mật khẩu'
  }
];

export const SignUpForm = (props: Props) => {
  const renderInputs = inputs.map(({ label, placeholder, type }, index) => {
    return (
      <Form.Item label={label} key={index}>
        {type === 'text' ? <InputText placeholder={placeholder} /> : <InputPassword placeholder={placeholder} />}
      </Form.Item>
    );
  });

  return (
    <>
      <Form layout='vertical' autoComplete='off'>
        {renderInputs}
      </Form>

      <Button type='primary'>Đăng Ký</Button>
    </>
  );
};
