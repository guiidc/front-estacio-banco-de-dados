'use client'

import {ReactNode} from "react";
import Header from "../components/Shared/Header";
import PrivateRoute from "@/app/components/PrivateRoute";

interface Props {
  children: ReactNode;
}

export default function ItemListLayout({children}: Props) {
  return (
      <PrivateRoute>
        <main>
          <Header/>
          {children}
        </main>
      </PrivateRoute>
  )
}