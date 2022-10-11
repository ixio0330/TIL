import Type from "../../components/order/type";
import { OrderContext } from "../../context/order";
import { useContext } from "react";

export default function OrderPage({ setStep }) {
  const [orderDatas] = useContext(OrderContext);
  return (
    <div>
      <h2>Products</h2>
      <div>
        <Type orderType='products' />
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%'}}>
          <Type orderType='options' />
        </div>
        <div style={{ width: '50%'}}>
          <h3>All Total Price: {orderDatas.totals.total}</h3>
          <button onClick={() => setStep(1)}>주문</button>
        </div>
      </div>
    </div>
  );
}