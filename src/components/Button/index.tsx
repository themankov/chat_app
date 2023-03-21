import React from 'react';
import style from './Button.module.scss';
import { Button as BaseButton } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { ButtonHTMLType } from 'antd/es/button';

type ButtonType = 'link' | 'text' | 'ghost' | 'default' | 'primary' | 'dashed';
type ButtonProps = {
  className: string;
  type: ButtonType;
  children: string;
  size: SizeType;
  disabled?: boolean;
  onClick?: () => void;
  htmlType: ButtonHTMLType;
};
const Button: React.FC<ButtonProps> = ({
  className,
  type,
  children,
  size,
  onClick,
  htmlType,
}) => {
  return (
    <BaseButton
      type={type}
      size={size}
      onClick={onClick}
      className={className}
      htmlType={htmlType}
    >
      {children}
    </BaseButton>
  );
};
export default Button;
