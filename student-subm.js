let clockInterval;

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const year = params.get("year");
    const section = params.get("section");
    const time = params.get("time");

    if (!name || !year || !section || !time) {
        document.body.innerHTML = "<h1>Invalid data. Please go back and submit the form again.</h1>";
        return;
    }

    document.getElementById("name").textContent = name;
    document.getElementById("section").textContent = `${year} Year - Section ${section}`;
    document.getElementById("time").textContent = time;

    startClock();
};
function startClock() {
    const timeOutElement = document.getElementById("timeout");
    clockInterval = setInterval(() => {
        const now = new Date();
        timeOutElement.textContent = now.toLocaleTimeString();
    }, 1000);
}

function stopClock() {
 
    window.open("index.html", "_blank");
    window.close();
}

function openHistory() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const year = params.get("year");
    const section = params.get("section");
    const timeIn = params.get("time");
    const timeOut = "In progress...";

    const submissions = JSON.parse(localStorage.getItem("submissions")) || [];
    submissions.push({ name, year, section, timeIn, timeOut });
    localStorage.setItem("submissions", JSON.stringify(submissions));

    alert("Submission saved to history!");
    window.open("history.html", "_blank");
}

function openStudent() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const year = params.get("year");
    const section = params.get("section");
    const timeIn = params.get("time");
    const timeOut = "In progress...";

    const submissions = JSON.parse(localStorage.getItem("submissions")) || [];
    submissions.push({ name, year, section, timeIn, timeOut });
    localStorage.setItem("submissions", JSON.stringify(submissions));

    alert("Submission saved to history!");

    window.open("index.html", "_blank");
    window.close("student-subm.html", "_blank");
}
