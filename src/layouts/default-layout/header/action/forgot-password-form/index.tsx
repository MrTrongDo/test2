import React from 'react';
import { FormInstance } from 'antd';

type Props = {
  form: FormInstance<any>;
};
export const ForgotPasswordForm = (props: Props) => {
  console.log('props:', props);

  return <div>ForgotPasswordForm</div>;
};
