import styles from './styles.module.scss';
import {CgShutterstock} from "react-icons/cg";
import { MdOutlineChangeCircle } from "react-icons/md";
import Link from "next/link";

interface Props {
  id: number;
  name: string;
  quantity: number;
  onClickChangeQuantity: (id: number) => void;
}

export default function ItemCard({ id, name, quantity, onClickChangeQuantity }: Props) {
  return (
      <div className={styles.itemCard}>
        <div className={styles.thumbContainer}>
          <CgShutterstock size={120} color="#BFBFBF"/>
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.itemName}>
            <span>{name}</span>
          </div>
          <div className={styles.itemQuantity}>
            <span>Estoque: </span>
            <span>{quantity} {quantity > 1 ? 'unidades' : 'unidade'}</span>
          </div>
            <Link href={"/stock/items/" + id} className={styles.link}>Ver detalhes</Link>
          <div className={styles.buttonsContainer}>
            <button onClick={() => onClickChangeQuantity(id)}>
              <MdOutlineChangeCircle size={35} color="green"/>
              <span>Alterar estoque</span>
            </button>
          </div>
        </div>
      </div>
  )
}