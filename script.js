const appID = '2ee81c1b7b834078a6f4a6dd1d53872c';
let exchangeRates = {};

// Завантажити курси валют при завантаженні сторінки
window.addEventListener('load', () => {
    fetch(`https://openexchangerates.org/api/latest.json?app_id=${appID}`)
        .then(response => response.json())
        .then(data => {
            exchangeRates = data.rates;
            console.log('Exchange rates loaded:', exchangeRates);
        })
        .catch(error => console.error('Error fetching exchange rates:', error));
});

function calculate() {
    // Отримати значення з поля введення
    const price = parseFloat(document.getElementById('price').value);
    const currency = document.getElementById('currency').value;

    // Перевірити, чи введене значення є числом
    if (isNaN(price)) {
        alert("Будь ласка, введіть правильне числове значення.");
        return;
    }

    // Конвертувати ціну в євро
    const priceInEuro = convertToEuro(price, currency);

    // Розрахувати мито і ПДВ
    const duty = (priceInEuro - 150) * 0.1;
    const vat = (priceInEuro - 150 + duty) * 0.2;

    // Відобразити результати на HTML
    document.getElementById('duty').innerText = `Мито: ${duty.toFixed(2)} євро`;
    document.getElementById('vat').innerText = `ПДВ: ${vat.toFixed(2)} євро`;
    document.getElementById('total').innerText = `Загалом: ${(duty + vat).toFixed(2)} євро`;
}

function convertToEuro(amount, currency) {
    if (!exchangeRates || !exchangeRates['EUR']) {
        alert('Курси валют не завантажені. Будь ласка, спробуйте пізніше.');
        return 0;
    }

    const rateToEuro = exchangeRates[currency] ? (1 / exchangeRates[currency]) * exchangeRates['EUR'] : 1;
    return amount * rateToEuro;
}
