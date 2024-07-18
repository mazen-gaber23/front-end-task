let customers = [];
let transactions = [];
let selectedCustomerTransactions = [];
let myChart;

async function getApi() {
    let myData = await fetch('customers.json');
    let response = await myData.json();
    customers = response.customers;
    transactions = response.transactions;
    console.log(customers);
    console.log(transactions);
    displayData();
    $('.btn').click(function () {
        filter();
    });
}
getApi();

function getCustomerNameById(id) {
    for (let i = 0; i < customers.length; i++) {
        if (customers[i].id === id) {
            return customers[i].name;
        }
    }
    return 'unknown';
}

function displayData() {
    let cartuna = '';
    for (let i = 0; i < transactions.length; i++) {
        let customerName = getCustomerNameById(transactions[i].customer_id).toUpperCase();
        cartuna += `<tr>
           <td>${transactions[i].id}</td>
           <td>${customerName}</td>
           <td>${transactions[i].customer_id}</td>
           <td>${transactions[i].date}</td>
           <td>${transactions[i].amount}</td>
         </tr>`;
    }
    document.getElementById('demo').innerHTML = cartuna;
}

function filter() {
    let search = $('.search').val().toUpperCase().trim();
    let cartuna = '';
    selectedCustomerTransactions = [];
    for (let i = 0; i < transactions.length; i++) {
        let customerName = getCustomerNameById(transactions[i].customer_id).toUpperCase();
        if (transactions[i].amount == search || customerName == search) {
            cartuna += `<tr>
            <td>${transactions[i].id}</td>
            <td>${customerName}</td>
            <td>${transactions[i].customer_id}</td>
            <td>${transactions[i].date}</td>
            <td>${transactions[i].amount}</td>
          </tr>`;
            selectedCustomerTransactions.push(transactions[i]);
        }
    }
    document.getElementById('demo').innerHTML = cartuna;
    displayChart();
}

function displayChart() {
    const dates = [...new Set(selectedCustomerTransactions.map(tx => tx.date))];
    const amounts = dates.map(date => {
        return selectedCustomerTransactions
            .filter(tx => tx.date === date)
            .reduce((sum, tx) => sum + tx.amount, 0);
    });

    if (myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Total Transaction Amount',
                data: amounts,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
