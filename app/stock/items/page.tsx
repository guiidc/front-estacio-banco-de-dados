'use client'

import Image from "next/image";
import ButtonComponent from "@/app/components/Shared/ButtonComponent";
import styles from "./styles.module.scss";
import {useEffect, useState} from "react";
import ItemCard from "@/app/components/Shared/ItemCard";
import AddItemModal from "@/app/components/Modals/AddItemModal";
import AlterStockQuantityModal from "@/app/components/Modals/AlterStockQuantityModal";
import {listStockItems} from "@/app/services/stockService";

export interface StockItem {
  id: number;
  name: string;
  quantity: number;
  description: string;
  price: number;
}



export default function ItemsList() {
  const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false);
  const [showChangeQuantityModal, setShowChangeQuantityModal] = useState<boolean>(false);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [idSelectedItem, setIdSelectedItem] = useState<number>(0);

  const loadInitialData = async () => {
    const result = await listStockItems()
    setStock(result)
  }

  const toggleAddItemModal = () => {
    setShowAddItemModal((prevState) => !prevState);
  }

  const onCloseAddItemModal = () => {
    setShowAddItemModal(false);
  }

  const onClickChangeQuantity = (id: number) => {
    setIdSelectedItem(id);
    setShowChangeQuantityModal(true);
  }

  const onCloseChangeQuantityModal = () => {
    setShowChangeQuantityModal(false);
  }

  useEffect(() => {
    loadInitialData()
  }, []);


  return (
      <>
        {stock.length ? (
            <div className={styles.contentContainer}>
              <div className={styles.title}>
                {/*<h4>Estoque {user}</h4>*/}
              </div>
              <div className={styles.actionContainer}>
                <ButtonComponent onClick={toggleAddItemModal}>Adicionar item ao estoque</ButtonComponent>
              </div>
              <br />
              <div className={styles.itemsList}>
                {stock.map((item) => (
                    <ItemCard
                        key={item.id}
                        onClickChangeQuantity={onClickChangeQuantity}
                        id={item.id}
                        name={item.name}
                        quantity={item.quantity}
                    />
                ))}
              </div>
            </div>
        ) : (
            <>
              <div className={styles.contentContainer}>
                <Image src="/illustration/empty-cart.svg" alt="aaa" width={300} height={300}/>
                <span className={styles.actionText}>Parece que você ainda não possui itens em seu estoque.</span>
                <ButtonComponent onClick={toggleAddItemModal}>Adicionar item ao estoque</ButtonComponent>
              </div>
            </>
        )}
        <AddItemModal
            show={showAddItemModal}
            onCloseModal={onCloseAddItemModal}
            setStock={setStock}
        />
        <AlterStockQuantityModal
            show={showChangeQuantityModal}
            onClose={onCloseChangeQuantityModal}
            idSelectedItem={idSelectedItem}
            currentQuantity={stock.find((item) => item.id === idSelectedItem)?.quantity || 0}
            setStock={setStock}
        />
      </>
  )
}