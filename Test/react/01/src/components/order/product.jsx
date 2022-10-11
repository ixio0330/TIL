export default function Product({ name, imgPath, updateItemCount }) {
  function handleChange({ target: { value } }) {
    updateItemCount(name, value);
  }
  return (
    <div style={{ textAlign: 'center', margin: '10px 50px' }}>
      {/* <img  
        src={`http://localhost:5000/${imgPath}`}
        alt={`${name} product`}
      /> */}
      <form>
        <label htmlFor={name}>{name}</label>
        <input type='number' id={name} min='0' max='10' defaultValue='0' onChange={handleChange} />
      </form>
    </div>
  );
}