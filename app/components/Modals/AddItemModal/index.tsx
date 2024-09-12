import styles from './styles.module.scss';

import BaseModal from "@/app/components/Shared/BaseModal";
import InputComponent from "@/app/components/Shared/InputComponent";
import {ChangeEvent, Dispatch, SetStateAction, useState} from "react";
import StringUtils from "@/app/utils/stringUtils";
import {StockItem} from "@/app/stock/items/page";
import {createStockItem} from "@/app/services/stockService";

interface Props {
  show: boolean;
  setStock: Dispatch<SetStateAction<StockItem[]>>
  onCloseModal: () => void;
}

export interface ItemData {
  name: string;
  quantity: string;
  description: string;
  price: string;
}

const initialData: ItemData = {
  name: '',
  quantity: '',
  description: '',
  price: ''
}

export default function AddItemModal({show, setStock, onCloseModal}: Props) {
  const [itemData, setItemData] = useState<ItemData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItemData({
      ...itemData,
      [e.target.name]: e.target.value
    });
  }

  const validateFields = (): boolean => {
    const tempErrors: Record<string, string> = {};

    if (StringUtils.isEmpty(itemData.name)) {
      tempErrors.name = 'É obrigatório informar o nome do item';
    }

    const parsedQuantity = Number(itemData.quantity);

    if (itemData.quantity === '') {
      tempErrors.quantity = 'O campo quantidade é obrigatório';
    } else if (!Number.isInteger(parsedQuantity)) {
      tempErrors.quantity = 'A quantidade deve ser um número inteiro';
    } else if (parsedQuantity < 0) {
      tempErrors.quantity = 'A quantidade deve ser um número positivo';
    }

    let parsedPrice = itemData.price.replace(/[^\d|,]/, '');
    parsedPrice = parsedPrice.replace(',', '.');
    const numberPrice = Number(parsedPrice);

    if (itemData.price === '') {
      tempErrors.price = 'O campo preço é obrigatório';
    } else if (numberPrice < 0) {
      tempErrors.price = 'O preço deve ser um número positivo';
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  }

  const cleanupBeforeClose = () => {
    setItemData(initialData);
    setErrors({});
    onCloseModal();
  }

  const fromStringToDouble = (value: string) => {
    let parsed = value.replace(',', '.')
    parsed = parsed.replace(/[^\d.]/g, '');
    return parseFloat(parsed);
  }

  const onConfirm = async () => {
    if (!validateFields()) return

    try {
      const requestBody = {...itemData, price: fromStringToDouble(itemData.price)};
      const insertedItem = await createStockItem(requestBody);

      setStock((prevState) => {
        return [
          ...prevState,
          {
            id: insertedItem.id,
            name: insertedItem.name,
            quantity: insertedItem.quantity,
            description: insertedItem.description,
            price: insertedItem.price
          }
        ]
      })
      cleanupBeforeClose();
    } catch (err) {
      if (err.isAxiosError && err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Ocorreu um erro ao adicionar o item');
      }
    }
  }


  return (
      <BaseModal show={show} title="Adicionar item ao estoque" onConfirm={onConfirm} onClose={cleanupBeforeClose}>
        <div className={styles.inputsWrapper}>
          <InputComponent
              placeholder={"Nome do item*"}
              name="name"
              value={itemData.name}
              onChange={handleChange}
              invalid={errors.hasOwnProperty('name')}
              helperText={errors.name}
          />
          <InputComponent
              placeholder={"Quantidade do item*"}
              name="quantity"
              type="number"
              value={itemData.quantity}
              onChange={handleChange}
              invalid={errors.hasOwnProperty('quantity')}
              helperText={errors.quantity}
          />
          <InputComponent
              placeholder={"Preço do item*"}
              name="price"
              currency={true}
              value={itemData.price}
              onChange={handleChange}
              invalid={errors.hasOwnProperty('price')}
              helperText={errors.price}
          />
          <InputComponent
              placeholder={"Descrição"}
              name="description"
              value={itemData.description}
              onChange={handleChange}
          />
        </div>
      </BaseModal>
  )
}