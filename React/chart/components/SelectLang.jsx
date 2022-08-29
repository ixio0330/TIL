export default function SelectLang({ updateLang }) {
  return (
    <div>
      <button onClick={updateLang.ko}>Korean</button>
      <button onClick={updateLang.en}>English</button>
    </div>
  )
}