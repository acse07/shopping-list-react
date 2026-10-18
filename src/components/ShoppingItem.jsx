export default function ShoppingItem({ item, onDelete }) {
  return (
    <li className="shopping-item">
      <span className="item-name">{item.name}</span>
      <span className="item-price">{(item.price / 100).toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ₸</span>
      <button
        className="delete-button"
        type="button"
        onClick={() => onDelete(item.id)}
        aria-label={`Удалить ${item.name}`}
      >
        Удалить
      </button>
    </li>
  );
}
