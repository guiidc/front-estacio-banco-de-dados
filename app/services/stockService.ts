'use client'

import api from "@/app/services/api";

export async function createStockItem(item: any) {
 const {data} = await api.post('/stock/item', item);
 return data
}

export async function listStockItems() {
  const {data} = await api.get('/stock/list');
  return data
}

export async function updateStockItem(idItem: number, quantity: number) {
  const {data} = await api.put('/stock/item/' + idItem, {quantity});
  return data
}

export interface ItemHistory {
  id: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface ItemDetails {
  id: number;
  name: string;
  quantity: number;
  description: string;
  price: number;
  minQuantityWarning: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  itemHistories: ItemHistory[];
}
export async function getStockItem(idItem: number) {
  const {data} = await api.get<ItemDetails>('/stock/item/' + idItem);
  return data
}