let inventory = JSON.parse(localStorage.getItem('labInventory')) || []; 
let report = JSON.parse(localStorage.getItem('reportData')) || [];

document.getElementById('clearHistoryButton').addEventListener('click', clearReportHistory);

function clearReportHistory() {
    // clear report array
    report = [];
    
    localStorage.setItem('reportData', JSON.stringify(report));
    renderReport();
    
    alert('Report history cleared!');
}

function renderReport() {
    const reportTable = document.getElementById('reportTable');
    reportTable.innerHTML = '';

    report.forEach((item, index) => {
        const isUnrepairable = item.details === 'Unrepairable';
        const isMissing = item.status === 'Missing';
        const isReplaced = item.details === 'Replaced';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.status}</td>
            <td>${item.pc}</td>
            <td>${item.dateReported}</td>
            <td>
                <select onchange="updateDetails(${index}, this.value)" ${isUnrepairable ? 'disabled' : ''}>
                    ${isMissing ? ` 
                        <option value="Pending" ${item.details === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Replaced" ${isReplaced ? 'selected' : ''}>Replaced</option>
                    ` : ` 
                        <option value="Pending" ${item.details === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Fixed" ${isReplaced ? 'selected' : ''}>Fixed</option>
                        <option value="Unrepairable" ${item.details === 'Unrepairable' ? 'selected' : ''}>Unrepairable</option>
                    `}
                </select>
            </td>
        `;
        reportTable.appendChild(row);
    });
}

function updateDetails(index, value) {
    report[index].details = value;

    // if marked as replaced or fixed, ia-update yung inventory
    if (value === 'Replaced' || value === 'Fixed') {
        const item = report[index];
        const inventoryItem = inventory.find(i => i.name === item.name && i.pc === item.pc);
        if (inventoryItem) {
            inventoryItem.status = 'Working'; // default
            localStorage.setItem('labInventory', JSON.stringify(inventory));
        }
    }

    // unrepairable = byebye
    if (value === 'Unrepairable') {
        const item = report[index];
        inventory = inventory.filter(i => !(i.name === item.name && i.pc === item.pc));
        localStorage.setItem('labInventory', JSON.stringify(inventory)); // Save changes
    }
}


function saveReport() {
    report = report.filter(item => item.details !== 'Fixed' && item.details !== 'Replaced');


    // Save changes to local storage
    localStorage.setItem('labInventory', JSON.stringify(inventory));
    localStorage.setItem('reportData', JSON.stringify(report));
    renderReport();
    alert('Changes saved!');
}

document.getElementById('saveButton').addEventListener('click', saveReport);

renderReport();
