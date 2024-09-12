import styles from "./styles.module.scss";
import BaseModal from "@/app/components/Shared/BaseModal";
import InputComponent from "@/app/components/Shared/InputComponent";
import {Dispatch, SetStateAction, useState} from "react";
import {StockItem} from "@/app/stock/items/page";
import {updateStockItem} from "@/app/services/stockService";

export type Action = 'add' | 'remove' | '';

interface Props {
  show: boolean;
  setStock: Dispatch<SetStateAction<StockItem[]>>
  onClose: () => void;
  currentQuantity: number;
  idSelectedItem: number;
}


export default function AlterStockQuantityModal({show, currentQuantity, setStock, idSelectedItem, onClose}: Props) {
  const [quantity, setQuantity] = useState<string>('');
  const [error, setError] = useState<string>('');

  const cleanupBeforeClose = () => {
    setQuantity('');
    onClose();
  }

  const validateQuantity = (quantity: string) => {
    setError('');
    if (!quantity) {
      setError('O campo quantidade é obrigatório');
      return false;
    }

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity)) {
      setError('A quantidade deve ser um número inteiro');
      return false;
    }

    if (parsedQuantity < currentQuantity * -1) {
      setError('A quantidade não pode ser menor que a atual');
      return false;
    }

    return true;
  }

  const onConfirmChangeQuantity = async () => {
    if (!validateQuantity(quantity)) return

    try {
      const updatedItem = await updateStockItem(idSelectedItem, Number(quantity));
      setStock((prevState) => {
        return prevState.map((item) => {
          if (item.id === idSelectedItem) {
            return {
              ...item,
              quantity: updatedItem.quantity
            }
          }
          return item;
        })
      });

      cleanupBeforeClose();
    } catch (err) {
      if (err.isAxiosError && err.response?.data?.message) {
        setError(err.response.data.message);
        return
      }

      setError('Algo deu errado ao atualizar quantidade do item. Tente novamente em alguns instantes.');
    }

  }

  return (
      <BaseModal
          show={show}
          title='Alterar quantidade do estque'
          onConfirm={onConfirmChangeQuantity}
          onClose={cleanupBeforeClose}
      >
        <div className={styles.modalBodyContent}>
          <span>Quantidade atual: {currentQuantity} {currentQuantity > 1 ? 'unidades' : 'unidade'}</span>
          <InputComponent
              type={'number'}
              placeholder={'Digite a quantidade'}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              invalid={!!error}
              helperText={error}
          />
        </div>
      </BaseModal>
  )
}