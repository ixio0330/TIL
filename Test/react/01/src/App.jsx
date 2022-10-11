import { useState } from "react";
import OrderPage from "./pages/order";
import SummaryPage from "./pages/summary";
import CompletePage from "./pages/complete";
import OrderContextProvider from "./context/order";

function App() {
  const [step, setStep] = useState(0);
  return (
    <div style={{ padding: '4rem' }}>
      <OrderContextProvider>
        {step === 0 && <OrderPage setStep={setStep} />}
        {step === 1 && <SummaryPage setStep={setStep} />}
        {step === 2 && <CompletePage setStep={setStep} />}
      </OrderContextProvider>
    </div>
  )
}

export default App;
