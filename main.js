const input = document.getElementById('product-name');
const form = document.querySelector('.product-input');
const list = document.querySelector('.management ul');

const initialProducts = [
    { name: 'Яблука', amount: 2, isBought: true },
    { name: 'Банани', amount: 2, isBought: false },
    { name: 'Сир', amount: 1, isBought: false }
];

initialProducts.forEach((product) => {
    addProduct(product.name, product.amount, product.isBought);
});

form.addEventListener('submit', (e) => { 
    e.preventDefault();
    const productName = input.value.trim();
    if (productName) {
        addProduct(productName);
        input.value = '';
        input.focus();
    }
});

function addProduct(name, amount = 1, isBought = false) {
    const listItem = document.createElement('li');
    if (isBought) {
            listItem.classList.add('is-bought');
    }
    const statusTooltip = isBought ? 'Позначити як не куплено' : 'Позначити як куплено';
    const statusText = isBought ? 'Не куплено' : 'Куплено';

    const minusDisabled = amount <= 1 ? 'disabled' : '';

    listItem.innerHTML = `
        <span class="product-title">${name}</span>
        <span class="number-of">
            <button type="button" data-tooltip="Зменшити кількість" aria-label="Зменшити кількість" ${minusDisabled}>&minus;</button>
            <span class="n">${amount}</span>
            <button type="button" data-tooltip="Збільшити кількість" aria-label="Збільшити кількість">&plus;</button>
        </span>
        <div class="controls">
            <button type="button" class="status" data-tooltip="${statusTooltip}">${statusText}</button>
            <button type="button" class="delete" aria-label="Видалити товар" data-tooltip="Видалити товар">&times;</button>
        </div>
    `;
    list.append(listItem);
}