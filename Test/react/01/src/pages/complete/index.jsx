import { useContext, useEffect, useState } from "react";
import { OrderContext } from "../../context/order";

export default function CompletePage({ setStep }) {
  const [orderDatas, ,resetOrderDatas] = useContext(OrderContext);
  const [loading, setLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    orderCompleted(orderDatas);
  }, [orderDatas]);

  async function orderCompleted(orderDatas) {
    try {
      const response = await fetch('http://localhost:5000/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: orderDatas.totals.total,
        })
      });
      const data = await response.json();
      setOrderHistory(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  function handleClick() {
    setStep(0);
    resetOrderDatas();
  }
  if (loading) return <div>Loading</div>
  const orderHistoryEl = (
    orderHistory.map((order) => <tr key={order.orderNumber}><td>{order.orderNumber}</td><td>{order.price}</td></tr>)
  );
  return (
    <div>
      <h1>주문을 완료했습니다.</h1>
      <p>지금까지의 주문내역</p>
      <table>
        <thead>
          <tr>
            <th>number</th>
            <th>price</th>
          </tr>
        </thead>
        <tbody>
          { orderHistoryEl }
        </tbody>
      </table>
      <button onClick={handleClick}>첫 페이지로</button>
    </div>
  );
}