import React, { useState } from 'react';
import ShoppingItem from './components/ShoppingItem';

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  // Цены хранятся в тиынах, чтобы избежать ошибок сложения дробных чисел.
  const total = items.reduce((sum, item) => sum + item.price, 0);

  function addItem(event) {
    event.preventDefault();
    const normalizedPrice = price.trim().replace(',', '.');
    const priceInMinorUnits = Math.round(Number(normalizedPrice) * 100);

    if (!name.trim()) {
      setError('Введите название товара.');
      return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(normalizedPrice)
      || !Number.isSafeInteger(priceInMinorUnits)
      || priceInMinorUnits < 0
      || !Number.isSafeInteger(total + priceInMinorUnits)) {
      setError('Введите неотрицательную цену, не более двух знаков после запятой.');
      return;
    }

    setItems((previousItems) => [
      ...previousItems,
      { id: crypto.randomUUID(), name: name.trim(), price: priceInMinorUnits },
    ]);
    setName('');
    setPrice('');
    setError('');
  }

  function deleteItem(id) {
    setItems((previousItems) => previousItems.filter((item) => item.id !== id));
  }

  return (
    <main className="container">
      <header>
        <span className="eyebrow">ПОКУПКИ БЕЗ СУЕТЫ</span>
        <h1>Список покупок</h1>
        <p>Добавляйте товары и следите за общей стоимостью.</p>
      </header>

      <section className="card" aria-labelledby="add-title">
        <h2 id="add-title">Добавить товар</h2>
        <form onSubmit={addItem}>
          <div className="fields">
            <label className="name-field">
              Название
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Например, молоко"
                maxLength={100}
                required
              />
            </label>
            <label className="price-field">
              Цена, ₸
              <input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="0,00"
                inputMode="decimal"
                maxLength={16}
                required
                aria-describedby={error ? 'form-error' : undefined}
              />
            </label>
            <button className="add-button" type="submit">+ Добавить</button>
          </div>
          {error && <p className="error" id="form-error" role="alert">{error}</p>}
        </form>
      </section>

      <section className="card" aria-labelledby="list-title">
        <div className="list-heading">
          <h2 id="list-title">Мои покупки</h2>
          <span className="count">Товаров: {items.length}</span>
        </div>
        {items.length === 0 ? (
          <p className="empty">Список пока пуст. Добавьте первый товар выше.</p>
        ) : (
          <ul className="shopping-list">
            {items.map((item) => (
              <ShoppingItem key={item.id} item={item} onDelete={deleteItem} />
            ))}
          </ul>
        )}
        <div className="total" aria-live="polite" aria-atomic="true">
          <span>Общая стоимость</span>
          <strong>{(total / 100).toLocaleString('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} ₸</strong>
        </div>
      </section>
      <p className="footnote">Всё под рукой — ничего лишнего.</p>
    </main>
  );
}
