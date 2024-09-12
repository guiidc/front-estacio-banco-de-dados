'use client'

import {ChangeEvent, InputHTMLAttributes, useState} from 'react';
import {FaEye, FaEyeSlash} from "react-icons/fa";

import styles from './styles.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  helperText?: string;
  invalid?: boolean;
  currency?: boolean;
}

export default function InputComponent({helperText, invalid, currency, ...rest}: Props) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const formatCurrency = (value: string): string => {
    const onlyNumbers = value.replace(/[^0-9]/g, '');

    if (onlyNumbers.length === 0) return '';

    const formattedValue = Number(onlyNumbers) / 100;

    return `R$ ${formattedValue.toFixed(2).replace('.', ',')}`;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!rest.onChange) return

    if (currency) {
      e.target.value = formatCurrency(e.target.value);
    }

    rest.onChange(e);
  }

  return (
      <div className={styles.inputWrapper}>
        <div className={styles.inputContainer}>
          <input
              {...rest}
              className={styles.inputComponent}
              type={rest.type === 'password' && showPassword ? 'text' : rest.type}
              data-invalid={invalid}
              onChange={handleChange}
              value={rest.value}
              placeholder={currency ? 'R$ 0,00' : rest.placeholder}
          />
          {rest.type === 'password' && (
              <>
                {showPassword ? (
                    <FaEye className={styles.passwordIcon} onClick={handleShowPassword}/>
                ) : (
                    <FaEyeSlash className={styles.passwordIcon} onClick={handleShowPassword}/>
                )}
              </>
          )}
        </div>
        <small>{invalid && helperText}</small>
      </div>
  )
}