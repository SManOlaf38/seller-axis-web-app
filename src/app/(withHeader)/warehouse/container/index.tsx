"use client"

import { useStore } from "../context";

const WarehouseContainer = () => {

  const { state, dispatch } = useStore();

  return (
    <main>
      Warehouse page
    </main>
  )
}

export default WarehouseContainer