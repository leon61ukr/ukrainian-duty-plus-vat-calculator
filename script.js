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
    
    if (!exchangeRates || !exchangeRates['EUR'] || !exchangeRates['UAH'] || !exchangeRates['USD']) {
        alert('Курси валют не завантажені. Будь ласка, спробуйте пізніше.');
        return;
    }
    
    const rateToEuro = exchangeRates[currency] ? (1 / exchangeRates[currency]) * exchangeRates['EUR'] : 1;
    const priceInEuro = price * rateToEuro;

    const taxableAmount = priceInEuro - 150;
    const duty = taxableAmount > 0 ? taxableAmount * 0.1 : 0;
    const vat = taxableAmount > 0 ? (taxableAmount + duty) * 0.2 : 0;
    const total = duty + vat;

    const euroToUAH = exchangeRates['UAH'] / exchangeRates['EUR'];
    const euroToUSD = exchangeRates['USD'] / exchangeRates['EUR'];

    const dutyUAH = duty * euroToUAH;
    const vatUAH = vat * euroToUAH;
    const totalUAH = total * euroToUAH;

    const dutyUSD = duty * euroToUSD;
    const vatUSD = vat * euroToUSD;
    const totalUSD = total * euroToUSD;

    const dutyEUR = duty;
    const vatEUR = vat;
    const totalEUR = total;

    document.getElementById('duty').innerText = `Мито: ${formatNumber(dutyUAH)} грн. (${formatNumber(dutyUSD)} $/${formatNumber(dutyEUR)} €)`;
    document.getElementById('vat').innerText = `ПДВ: ${formatNumber(vatUAH)} грн. (${formatNumber(vatUSD)} $/${formatNumber(vatEUR)} €)`;
    document.getElementById('total').innerHTML = `Загалом: <span id="totalValue">${formatNumber(totalUAH)} грн. (${formatNumber(totalUSD)} $/${formatNumber(totalEUR)} €)</span><button id="copyButton" onclick="copyToClipboard()"><img src="copy.png" alt="Copy Icon" width="24" height="24"></button>`;

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
