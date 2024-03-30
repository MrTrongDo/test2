import React from 'react';
import { InputBase } from './input-base';
import { BaseInput } from './type';

export const InputText = (props: Omit<BaseInput, 'type'>) => {
  return <InputBase type='text' {...props} />;
};
