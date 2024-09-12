import styles from './styles.module.scss';

interface Props {
  message: string;
}

export default function Alert({message}: Props) {
  return (
      <div className={styles.alertContainer}>
        <div className={styles.alert}>
          <span>{message}</span>
        </div>
      </div>
  )
}