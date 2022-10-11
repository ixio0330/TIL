import { useContext, useState } from "react";
import { OrderContext } from "../../context/order";

export default function SummaryPage({ setStep }) {
  const [orderDatas] = useContext(OrderContext);
  const [confirm, setConfirm] = useState(false);
  function onChangeCbox({ target: { checked }}) {
    setConfirm(checked);
  }
  const productsArray = Array.from(orderDatas.products);
  const productList = productsArray.map(([key, value]) => (
    <li key={key}>{value} {key}</li>
  ));
  let optionsEle = null;
  if (orderDatas.options.size > 0) {
    const optionsArray = Array.from(orderDatas.options.keys());
    const optionList = optionsArray.map((key) => (
      <li key={key}>{key}</li>
    ));
    optionsEle = (
      <>
        <h2>옵션: {orderDatas.totals.options}</h2>
        <ul>{ optionList }</ul>
      </>
    );
  }
  function handleSumbit(event) {
    event.preventDefault();
    setStep(2)
  }
  return (
    <div>
      <h1>주문 확인서</h1>
      <h2>상품: {orderDatas.totals.products}</h2>
      <ul>{ productList }</ul>
      { optionsEle }
      <form onSubmit={handleSumbit}>
        <div>
          <input type="checkbox" id="confirmCbox" checked={confirm} onChange={onChangeCbox} />
          <label htmlFor="confirmCbox">주문하려는 것을 확인하셨나요?</label>
        </div>
        <button type='submit' disabled={!confirm}>주문 확인</button>
      </form>
    </div>
  );
}