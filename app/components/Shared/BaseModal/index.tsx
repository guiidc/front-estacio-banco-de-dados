import styles from './styles.module.scss';
import {ReactNode, useEffect} from "react";
import { IoCloseCircleOutline } from "react-icons/io5";


interface Props {
  children: ReactNode;
  show: boolean;
  title: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function BaseModal({ children, show, title, onConfirm, onClose }: Props) {

  const closeOnKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', closeOnKeyPress);
    return () => {
      document.removeEventListener('keydown', closeOnKeyPress);
    }
  }, []);
  return (
    show && <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.titleContainer}>
            <span>{title}</span>
          </div>
          <button onClick={onClose}>
            <IoCloseCircleOutline size={35} />
          </button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.declineButton}>Cancelar</button>
          <button onClick={onConfirm} className={styles.confirmButton}>Confirmar</button>
        </div>
      </div>
    </div>
  )
}