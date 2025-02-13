window.onload = function () {
    const historyTable = document.getElementById("historyTable");
    const submissions = JSON.parse(localStorage.getItem("submissions")) || [];
    const clearButton = document.getElementById("clearHistoryButton");

    const searchBar = document.getElementById("searchBar");
    const sortYear = document.getElementById("sortYear");
    const sortSection = document.getElementById("sortSection");
    const filterDate = document.getElementById("filterDate");

    // display table
    const renderTable = (filteredSubmissions) => {
        historyTable.innerHTML = "";

        if (filteredSubmissions.length === 0) {
            historyTable.innerHTML = "<tr><td colspan='5'>No submission history available.</td></tr>";
            return;
        }

        filteredSubmissions.forEach((submission, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${submission.name}</td>
                <td>${submission.year} Year - Section ${submission.section}</td>
                <td>${submission.timeIn}</td>
                <td id="timeOut-${index}">${submission.timeOut || ""}</td>
                <td>
                    ${submission.isStopped ? "<span>Stopped</span>" : `<button onclick="stopTime(${index})">Stop</button>`}
                </td>
            `;
            historyTable.appendChild(row);
        });
    };

    const filterTable = () => {
        let filtered = [...submissions];
    
        // search by name
        const searchQuery = searchBar.value.toLowerCase();
        if (searchQuery) {
            filtered = filtered.filter(submission =>
                submission.name.toLowerCase().includes(searchQuery)
            );
        }
    
        // sort by year
        const year = sortYear.value;
        if (year) {
            filtered = filtered.filter(submission => submission.year == year);
        }

        //sort by section
        const section = sortSection.value;
        if (section) {
            filtered = filtered.filter(submission => submission.section == section);
        }        
    
        // filtered by date
        const date = filterDate.value;
        if (date) {
            filtered = filtered.filter(submission => {
                const submissionDate = new Date(submission.timeIn).toISOString().split('T')[0];
                return submissionDate === date;
            });
        }
    
        renderTable(filtered);
    };
    
    

    // display sa table, updated version base sa prefered ni user
    if (submissions.length === 0) {
        renderTable([]);
    } else {
        renderTable(submissions);
    }

    searchBar.addEventListener("input", filterTable);
    sortYear.addEventListener("change", filterTable);
    sortSection.addEventListener("change", filterTable);
    filterDate.addEventListener("change", filterTable);

    clearButton.addEventListener("click", clearHistory);
};

// stop time
function stopTime(index) {
    const submissions = JSON.parse(localStorage.getItem("submissions")) || [];
    if (!submissions[index]) return;

    const now = new Date();
    const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`; // Includes date and time
    submissions[index].timeOut = formattedDateTime;
    submissions[index].isStopped = true;

    localStorage.setItem("submissions", JSON.stringify(submissions));

    alert(`Time Out updated for ${submissions[index].name}`);
    document.location.reload();
}

// clear button
function clearHistory() {
    if (confirm("Are you sure you want to clear all submission history?")) {
        localStorage.removeItem("submissions");
        const historyTable = document.getElementById("historyTable");
        historyTable.innerHTML = "<tr><td colspan='5'>No submission history available.</td></tr>";
        alert("Submission history has been cleared.");
    }
}
