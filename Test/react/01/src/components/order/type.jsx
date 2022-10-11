import { useContext, useEffect, useState } from "react";
import Product from "./product";
import Option from "./option";
import ErrorBanner from "../error/errorBanner";
import { OrderContext } from "../../context/order";

export default function Type({ orderType }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);
  const [orderDatas, updateItemCount] = useContext(OrderContext);
  
  useEffect(() => {
    loadItems(orderType);
  }, [ orderType ]);

  const loadItems =  async (orderType) => {
    try {
      const response = await fetch(`http://localhost:5000/${orderType}`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      setError(true);
    }
  };

  if (error) return <ErrorBanner message='에러가 발생했습니다.' />

  const ItemComponent = orderType === 'products' ? Product : Option;
  const optionItems = items.map((item) => (
    <ItemComponent 
      key={item.name}
      name={item.name}
      imgPath={item.imgPath}
      updateItemCount={(itemName, newItemCount) => updateItemCount(itemName, newItemCount, orderType)}
    />
  ));

  const type = orderType === 'products' ? 'Products' : 'Options';

  return (
    <>
      <h2>Order Type</h2>
      <p>{type} Total Price: { orderDatas.totals[orderType] }</p>
      <div style={{ display: 'flex', flexDirection: orderType === 'options' && 'column' }}>
        { optionItems }
      </div>
    </>
  );
}