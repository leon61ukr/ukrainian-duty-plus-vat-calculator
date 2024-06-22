function calculate() {
    // Отримати значення з поля введення
    const price = parseFloat(document.getElementById('price').value);

    // Перевірити, чи введене значення є числом
    if (isNaN(price)) {
        alert("Будь ласка, введіть правильне числове значення.");
        return;
    }

    // Розрахувати мито і ПДВ
    const duty = (price - 150) * 0.1;
    const vat = (price - 150 + duty) * 0.2;

    // Відобразити результати на HTML
    document.getElementById('duty').innerText = `Мито: ${duty.toFixed(2)} євро`;
    document.getElementById('vat').innerText = `ПДВ: ${vat.toFixed(2)} євро`;
    document.getElementById('total').innerText = `Загалом: ${(duty + vat).toFixed(2)} євро`;
}