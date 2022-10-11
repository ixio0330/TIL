import { createContext, useEffect, useMemo, useState } from "react";

export const OrderContext = createContext(null);

const pricePerItem = {
  products: 1000,
  options: 500
}

function calculateSubtotal(orderType, orderCounts) {
  let optionsCount = 0;
  for (const count of orderCounts[orderType].values()) {
    optionsCount += count;
  }
  return optionsCount * pricePerItem[orderType];
}

export default function OrderContextProvider(props) {
  const [orderCounts, setOrderCounts] = useState({
    products: new Map(),
    options: new Map(),
  });
  const [totals, setTotals] = useState({
    products: 0,
    options: 0,
    total: 0,
  });

  function resetOrderDatas() {
    setOrderCounts({
      products: new Map(),
      options: new Map(),
    })
  }

  useEffect(() => {
    const productsTotal = calculateSubtotal('products', orderCounts);
    const optionsTotal = calculateSubtotal('options', orderCounts);
    const total = productsTotal + optionsTotal;
    setTotals({
      products: productsTotal,
      options: optionsTotal,
      total,
    });
  }, [orderCounts]);

  const value = useMemo(() => {
    function updateItemCount(itemName, newItemCount, orderType) {
      const newOrderCounts = { ...orderCounts };
      const orderCountsMap = newOrderCounts[orderType];
      orderCountsMap.set(itemName, parseInt(newItemCount));
      setOrderCounts(newOrderCounts);
    }
    return [{ ...orderCounts, totals }, updateItemCount, resetOrderDatas];
  }, [ orderCounts, totals ]);
  return <OrderContext.Provider value={value} {...props} />
}