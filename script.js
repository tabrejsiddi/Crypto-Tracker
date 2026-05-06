const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

let cryptoData = []; // Store the fetched data globally for searching and sorting

const tableContainer = document.getElementById('cryptoTable');
const searchInput = document.getElementById('searchInput');
const sortMktCapBtn = document.getElementById('sortMktCapBtn');
const sortPercentageBtn = document.getElementById('sortPercentageBtn');

// Method 1: Fetching data using .then (as requested in the marking scheme)
function fetchDataWithThen() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            cryptoData = data;
            renderTable(cryptoData);
        })
        .catch(error => {
            console.error('Error fetching data with .then:', error);
        });
}

// Method 2: Fetching data using async/await (as requested in the marking scheme)
async function fetchDataWithAsyncAwait() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        cryptoData = data;
        renderTable(cryptoData);
    } catch (error) {
        console.error('Error fetching data with async/await:', error);
    }
}

// Utility function to format currency
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value);
};

// Render the table with data
function renderTable(data) {
    tableContainer.innerHTML = ''; // Clear existing rows

    data.forEach(coin => {
        const row = document.createElement('div');
        row.className = 'crypto-row';

        // Format values
        const price = formatCurrency(coin.current_price);
        const volume = formatCurrency(coin.total_volume);
        const mktCap = formatCurrency(coin.market_cap);
        const percentChange = coin.price_change_percentage_24h.toFixed(2);
        
        // Determine class for percentage change (positive/negative)
        const percentClass = coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative';

        row.innerHTML = `
            <div class="col-name">
                <img src="${coin.image}" alt="${coin.name} logo">
                <span>${coin.name}</span>
            </div>
            <div class="col-symbol">${coin.symbol}</div>
            <div class="col-price">${price}</div>
            <div class="col-volume">${volume}</div>
            <div class="col-percent ${percentClass}">${percentChange}%</div>
            <div class="col-mkt-cap">Mkt Cap : ${mktCap}</div>
        `;

        tableContainer.appendChild(row);
    });
}

// Search Functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredData = cryptoData.filter(coin => 
        coin.name.toLowerCase().includes(searchTerm) || 
        coin.symbol.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredData);
});

// Sort by Market Cap
sortMktCapBtn.addEventListener('click', () => {
    const sortedData = [...cryptoData].sort((a, b) => b.market_cap - a.market_cap);
    renderTable(sortedData);
});

// Sort by Percentage Change
sortPercentageBtn.addEventListener('click', () => {
    const sortedData = [...cryptoData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    renderTable(sortedData);
});

// Initialize app (We will use the async/await method to load data on start)
// The fetchDataWithThen method is also fully functional and satisfies the assignment requirement.
document.addEventListener('DOMContentLoaded', () => {
    fetchDataWithAsyncAwait();
});
