/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactNode, forwardRef, useMemo } from 'react';
import { AntdInput, styled, InputRef, WebTarget } from '@/core';
import { BaseInput } from './type';

type BaseInputProps = {
  width?: string;
  height?: string;
  suffix?: any;
  prefix?: ReactNode;
  maxLength?: number;
} & BaseInput;

const createStyledComponent = (input: WebTarget) => {
  return styled(input)`
    &.ant-input,
    &.ant-input-password {
      height: ${(props) => props.height};
      &:hover {
      }

      &:focus {
        box-shadow: none !important;
      }

      &:active {
        box-shadow: none !important;
      }
    }
  `;
};

const InputWrapperPassword = createStyledComponent(AntdInput.Password);
const InputWrapper = createStyledComponent(AntdInput);

export const InputBase = forwardRef<InputRef, BaseInputProps>((props, ref) => {
  const { type, width = '100%', height = '52px', onChange, ...rest } = props;

  const defaultProps = useMemo(() => {
    return {
      ...rest,
      ref,
      height,
      width,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)
    };
  }, [width, height]);

  const renderInput = () => {
    const inputType: Partial<{ [key in BaseInput['type']]: ReactNode }> = {
      text: <InputWrapper {...defaultProps} />,
      password: <InputWrapperPassword {...defaultProps} />
    };

    return inputType?.[type ?? ''];
  };

  return <>{renderInput()}</>;
});
