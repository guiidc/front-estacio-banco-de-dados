'use client'

import styles from './styles.module.scss';

import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {getStockItem, ItemDetails} from "@/app/services/stockService";

export default function ItemDetailsPage() {
  const params = useParams()

  const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null)

  const loadInitialData = async () => {
    try {
      const idItem = params.idItem as string
      const result = await getStockItem(Number(idItem))
      setItemDetails(result)
    } catch (err) {
      alert('Erro ao carregar dados')
    }
  }

  const formatDateToBR = (date: string) => {
    // format date to BR dd/MM/yyyy HH:mm:ss
    const dateObj = new Date(date)
    return dateObj.toLocaleString('pt-BR')
  }


  useEffect(() => {
    loadInitialData()
  }, []);

  if (!itemDetails) return null

  return (
      <div className={styles.contentContainer}>
        <h2>{itemDetails.name}</h2>
        <table className={styles.historicTable}>
          <thead>
          <tr>
            <th>Data</th>
            <th>Quantidade</th>
          </tr>
          </thead>
          <tbody>
          {itemDetails.itemHistories.map((history) => (
              <tr key={history.id}>
                <td>{formatDateToBR(history.createdAt)}</td>
                <td>{history.quantity}</td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
}