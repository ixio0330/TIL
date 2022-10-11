export default function ErrorBanner({ message = '에러입니다.' }) {
  return (
    <div 
      data-testid='error-banner'
      style={{ backgroundColor: 'salmon', color: 'white'}}
    >
      { message }
    </div>
  )
}