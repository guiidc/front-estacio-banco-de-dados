import styles from './styles.module.scss';
import {ButtonHTMLAttributes, ReactNode} from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function ButtonComponent({children, ...rest}: Props) {
  return (
      <button className={styles.button} {...rest}>{children}</button>
  )
}