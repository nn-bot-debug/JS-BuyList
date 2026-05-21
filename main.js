const input = document.getElementById('product-name');
const form = document.querySelector('.product-input');
const list = document.querySelector('.management ul');
const savedData = localStorage.getItem('products');

const initialProducts = [
    { name: 'Яблука', amount: 2, isBought: true },
    { name: 'Банани', amount: 2, isBought: false },
    { name: 'Сир', amount: 1, isBought: false }
];

const productsToLoad = savedData ? JSON.parse(savedData) : initialProducts;

productsToLoad.forEach((product) => {
    addProduct(product.name, product.amount, product.isBought);
});

updateStatistics();

form.addEventListener('submit', (e) => { 
    e.preventDefault();
    const productName = input.value.trim();
    if (productName) {
        addProduct(productName);
        updateStatistics();
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

list.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) { 
        e.target.closest('li').remove();
        updateStatistics();
    }

    if (e.target.classList.contains('status')) {
        const listItem = e.target.closest('li');
        listItem.classList.toggle('is-bought');
        const isBought = listItem.classList.contains('is-bought');
        e.target.textContent = isBought ? 'Не куплено' : 'Куплено';
        e.target.setAttribute('data-tooltip', isBought ? 'Позначити як не куплено' : 'Позначити як куплено');
        updateStatistics();
    }
    
    if (e.target.classList.contains('product-title')) {
        const listItem = e.target.closest('li');
        if (listItem.classList.contains('is-bought')) return;
        const currentText = e.target.textContent;
        
        const editContainer = document.createElement('div');
        editContainer.className = 'product-edit-container';

        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = currentText;
        editInput.className = 'product-edit';

        editContainer.append(editInput);
        e.target.replaceWith(editContainer);
        editInput.focus();

        const saveEdit = () => {
            const newName = editInput.value.trim();
            const finalName = newName ? newName : currentText;

            const newSpan = document.createElement('span');
            newSpan.className = 'product-title';
            newSpan.textContent = finalName;
            editContainer.replaceWith(newSpan);
            updateStatistics();
        };

        editInput.addEventListener('blur', saveEdit);

        editInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    saveEdit();
                }
        });
    }

    const targetText = e.target.textContent;

    if (targetText === '+' || targetText === '−') {
        const listItem = e.target.closest('li');
        if (listItem.classList.contains('is-bought')) return;
        const amountSpan = listItem.querySelector('.n');
        let currentAmount = Number(amountSpan.textContent);

        if (targetText === '+') {
            currentAmount++;
            const minusButton = listItem.querySelector('button[aria-label="Зменшити кількість"]');
            minusButton.removeAttribute('disabled');
        }else if (targetText === '−') {
            if (currentAmount > 1) {
                currentAmount--;
            }
            if (currentAmount === 1) {
                e.target.setAttribute('disabled', '');
            }
        }
        amountSpan.textContent = currentAmount;
        updateStatistics();
    }
});

function updateStatistics() {
    const leftTagsContainer = document.querySelector('aside .left .tags-container');
    const boughtTagsContainer = document.querySelector('aside .is-bought .tags-container');

    let leftTagsString = '';
    let boughtTagsString = '';

    const productsToSave = [];
    const allItems = document.querySelectorAll('.management ul li');

    allItems.forEach(item => {
        const name = item.querySelector('.product-title').textContent;
        const amount = item.querySelector('.n').textContent;
        const isBought = item.classList.contains('is-bought');

        const productObject = { name, amount, isBought };
        productsToSave.push(productObject);

        const badgeHTML = `
            <span class="product-item">
                <span class="name">${name}</span>
                <span class="amount">${amount}</span>
            </span>
        `;

        if (isBought) {
            boughtTagsString += badgeHTML;
        } else {
            leftTagsString += badgeHTML;
        }
    });
    localStorage.setItem('products', JSON.stringify(productsToSave));

    leftTagsContainer.innerHTML = leftTagsString;
    boughtTagsContainer.innerHTML = boughtTagsString;
}