let inventory = JSON.parse(localStorage.getItem('labInventory')) || [];
let pcs = JSON.parse(localStorage.getItem('pcs')) || [];

document.getElementById('saveToReportButton').addEventListener('click', saveToReport);

function saveToReport() {
    const currentDate = new Date().toISOString().split('T')[0];

    // format ng ipapasa sa local storage ng report
    const newReportItems = inventory
        .filter(item => item.status === 'Not Working' || item.status === 'Missing')
        .map(item => {
            return {
                name: item.name,
                status: item.status,
                pc: item.pc,
                dateReported: currentDate,
                details: 'Pending', // default na pending lalabas sa report
            };
        });

    // prevent loss of previous datas
    let report = JSON.parse(localStorage.getItem('reportData')) || [];

    // new items lang iaadd
    newReportItems.forEach(newItem => {
        const isItemExisting = report.some(existingItem => 
            existingItem.name === newItem.name && 
            existingItem.pc === newItem.pc && 
            existingItem.status === newItem.status
        );

        if (!isItemExisting) {
            report.push(newItem);
        }
    });

    // save to localStorage
    localStorage.setItem('reportData', JSON.stringify(report));

    alert('Data saved to report successfully!');

    // disable dropdown if not workinf or missng
    inventory.forEach((item, index) => {
        if (item.status === 'Not Working' || item.status === 'Missing') {
            const dropdown = document.querySelector(
                `#pc${item.pc.charAt(2)}Inventory tr:nth-child(${index + 1}) select`
            );
            if (dropdown) dropdown.disabled = true;
        }
    });

    renderInventory();
}

function renderInventory() {
    const pcTables = document.getElementById('pcTables');
    const pcNumberDropdown = document.getElementById('pcNumber');

    pcTables.innerHTML = '';
    pcNumberDropdown.innerHTML = '';

    pcs.forEach(pc => {
        // Add PC to dropdown
        const option = document.createElement('option');
        option.value = pc;
        option.textContent = pc;
        pcNumberDropdown.appendChild(option);

        // Create PC table with a Remove PC button
        const tableContainer = document.createElement('div');
        tableContainer.innerHTML = `
            <h2>${pc} <button onclick="removePc('${pc}')">Remove PC</button></h2>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Status</th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody id="${pc.toLowerCase()}Inventory"></tbody>
            </table>
        `;
        pcTables.appendChild(tableContainer);
    });



    inventory.forEach((item, index) => {
        const row = document.createElement('tr');
        const isDisabled = item.status === 'Not Working' || item.status === 'Missing';

        row.innerHTML = `
            <td>${item.name}</td>
            <td>
                <select onchange="updateStatus(${index}, this.value)" ${isDisabled ? 'disabled' : ''}>
                    <option value="Working" ${item.status === 'Working' ? 'selected' : ''}>Working</option>
                    <option value="Not Working" ${item.status === 'Not Working' ? 'selected' : ''}>Not Working</option>
                    <option value="Missing" ${item.status === 'Missing' ? 'selected' : ''}>Missing</option>
                </select>
            </td>
            <td>
                <button onclick="removeItem(${index})">Remove</button>
            </td>
        `;

        const tableBody = document.getElementById(`${item.pc.toLowerCase()}Inventory`);
        if (tableBody) tableBody.appendChild(row);
    });
}

function removePc(pcName) {
    // Remove PC from pcs array
    pcs = pcs.filter(pc => pc !== pcName);

    // Remove related items from inventory
    inventory = inventory.filter(item => item.pc !== pcName);

    // Remove related items from reportData
    let report = JSON.parse(localStorage.getItem('reportData')) || [];
    report = report.filter(item => item.pc !== pcName);

    // Update localStorage
    localStorage.setItem('pcs', JSON.stringify(pcs));
    localStorage.setItem('labInventory', JSON.stringify(inventory));
    localStorage.setItem('reportData', JSON.stringify(report));

    // Re-render the inventory
    renderInventory();

    alert(`${pcName} and its related items have been removed.`);
}

function addItem() {
    const itemName = document.getElementById('itemName').value.trim();
    const itemStatus = document.getElementById('itemStatus').value;
    const pcNumber = document.getElementById('pcNumber').value;

    if (!itemName || !pcNumber) {
        alert('Please fill in all fields.');
        return;
    }

    const isDuplicate = inventory.some(item => item.name === itemName && item.pc === pcNumber);

    if (isDuplicate) {
        alert('This item already exists in the inventory.');
        return;
    }

    inventory.push({ name: itemName, status: itemStatus, pc: pcNumber });
    saveInventory();
    renderInventory();
    document.getElementById('itemName').value = '';
    document.getElementById('itemStatus').value = 'Working';
    document.getElementById('pcNumber').value = pcs[0];
}

function addNewPc() {
    const newPcName = document.getElementById('newPcName').value.trim();

    if (newPcName && !pcs.includes(newPcName)) {
        pcs.push(newPcName);
        savePcs();
        renderInventory();

        document.getElementById('newPcName').value = '';
        alert(`${newPcName} added successfully!`);
    } else {
        alert('Please enter a valid, unique PC name.');
    }
}

function updateStatus(index, newStatus) {
    inventory[index].status = newStatus;
    saveInventory();
}

function removeItem(index) {
    const item = inventory[index];
    inventory.splice(index, 1);

    let report = JSON.parse(localStorage.getItem('reportData')) || [];
    report = report.filter(r => !(r.name === item.name && r.pc === item.pc));

    localStorage.setItem('labInventory', JSON.stringify(inventory));
    localStorage.setItem('reportData', JSON.stringify(report));

    renderInventory();
}

function saveInventory() {
    localStorage.setItem('labInventory', JSON.stringify(inventory));
}

function savePcs() {
    localStorage.setItem('pcs', JSON.stringify(pcs));
}

document.getElementById('clearHistoryButton').addEventListener('click', () => {
    inventory = [];
    localStorage.setItem('labInventory', JSON.stringify(inventory));
    renderInventory();
    alert('Report history cleared!');
});

renderInventory();
