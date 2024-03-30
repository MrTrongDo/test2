import React from 'react';
import { InputBase } from './input-base';
import { BaseInput } from './type';

export const InputPassword = (props: Omit<BaseInput, 'type'>) => {
  return <InputBase type='password' {...props}></InputBase>;
};
