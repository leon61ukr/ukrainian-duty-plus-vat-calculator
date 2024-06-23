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
    const price = parseFloat(document.getElementById('price').value);
    const currency = document.getElementById('currency').value;

    if (isNaN(price)) {
        alert("Будь ласка, введіть правильне числове значення.");
        return;
    }

    const priceInEuro = convertToEuro(price, currency);
    const priceInUAH = convertToUAH(price, currency);

    const duty = (priceInEuro - 150) * 0.1;
    const vat = (priceInEuro - 150 + duty) * 0.2;
    let total = duty + vat;

    if (total < 0) {
        total = 0;
    }

    const dutyUAH = duty * exchangeRates['UAH'];
    const vatUAH = vat * exchangeRates['UAH'];
    const totalUAH = total * exchangeRates['UAH'];

    const dutyUSD = duty * exchangeRates['USD'];
    const vatUSD = vat * exchangeRates['USD'];
    const totalUSD = total * exchangeRates['USD'];
    
    const dutyEUR = duty * exchangeRates['EUR'];
    const vatEUR = vat * exchangeRates['EUR'];
    const totalEUR = total * exchangeRates['EUR'];

    document.getElementById('duty').innerText = `Мито: ${formatNumber(dutyUAH)} грн. (${formatNumber(dutyUSD)} $/${formatNumber(dutyEUR)} €)`;
    document.getElementById('vat').innerText = `ПДВ: ${formatNumber(vatUAH)} грн. (${formatNumber(vatUSD)} $/${formatNumber(vatEUR)} €)`;
    document.getElementById('total').innerHTML = `Загалом: <span id="totalValue">${formatNumber(totalUAH)} грн. (${formatNumber(totalUSD)} $/${formatNumber(totalEUR)} €)</span>`;
    
    document.getElementById('results').style.display = 'block';
    document.querySelector('.content').style.height = 'auto';
}

function convertToEuro(amount, currency) {
    if (!exchangeRates || !exchangeRates['EUR']) {
        alert('Курси валют не завантажені. Будь ласка, спробуйте пізніше.');
        return 0;
    }

    const rateToEuro = exchangeRates[currency] ? (1 / exchangeRates[currency]) * exchangeRates['EUR'] : 1;
    return amount * rateToEuro;
}

function convertToUAH(amount, currency) {
    if (!exchangeRates || !exchangeRates['UAH']) {
        alert('Курси валют не завантажені. Будь ласка, спробуйте пізніше.');
        return 0;
    }

    const rateToUAH = exchangeRates[currency] ? (1 / exchangeRates[currency]) * exchangeRates['UAH'] : 1;
    return amount * rateToUAH;
}

function formatNumber(num) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function copyToClipboard() {
    const copyText = document.getElementById('totalValue').innerText;
    navigator.clipboard.writeText(copyText).then(() => {
        alert('Скопійовано: ' + copyText);
    }, (err) => {
        alert('Помилка при копіюванні: ', err);
    });
}
