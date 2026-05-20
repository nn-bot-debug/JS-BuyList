const productInput = document.getElementById('product-name');
const productForm = document.querySelector('.product-input');
const productList = document.querySelector('.management ul');

productForm.addEventListener('submit', (e) => { 
    e.preventDefault();
    const productName = productInput.value.trim();
    if (productName) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span class="product-title">${productName}</span>
			<span class="number-of">
				<button type="button" data-tooltip="Зменшити кількість" aria-label="Зменшити кількість">&minus;</button>
				<span class="n">1</span>
				<button type="button" data-tooltip="Збільшити кількість" aria-label="Збільшити кількість">&plus;</button>
			</span>
            <div class="controls">
                <button type="button" class="status" data-tooltip="Позначити як куплено">Куплено</button>
                <button type="button" class="delete" aria-label="Видалити товар" data-tooltip="Видалити товар">&times;</button>
            </div>
        `
        productList.append(listItem);
        productInput.value = '';
        productInput.focus();
    }
});