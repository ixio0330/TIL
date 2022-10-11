export default function Option({ name, updateItemCount }) {
  function handleChange({ target: { checked }}) {
    const count = checked ? 1 : 0;
    updateItemCount(name, count);
  }
  return (
    <form>
      <input type="checkbox" id={`${name}_option`} onChange={handleChange} />
      <label htmlFor={`${name}_option`}>{name}</label>
    </form>
  );
}