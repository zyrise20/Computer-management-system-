document.addEventListener("DOMContentLoaded", function () {
    const studentRadio = document.getElementById("studentRadio");
    const staffRadio = document.getElementById("staffRadio");
    const loginForm = document.getElementById("loginForm");
    const studentForm = document.getElementById("studentForm");

    const createAccountForm = document.getElementById("createAccountForm");
    const createAccountText = document.getElementById("createAccountText");
    const submitAccountButton = document.getElementById("submitAccountButton");

    const yearSelect = document.getElementById("year");
    const sectionSelect = document.getElementById("section");

    let accounts = JSON.parse(localStorage.getItem("staffAccounts")) || [];

    // depends and section sa year
    const yearSections = {
        
        "11": ["HUMMS", "GAS", "ICT","STEM", "ABM"],
        "12": ["HUMMS", "GAS", "ICT","STEM", "ABM"],
        "1st": ["A", "B", "C"],
        "2nd": ["A", "B", "C", "D"],
        "3rd": ["A", "B", "C", "D", "E"],
        "4th": ["A", "B", "C", "D", "E", "F"]
    };
    yearSelect.addEventListener("change", function () {
        const selectedYear = yearSelect.value;
        const sections = yearSections[selectedYear] || [];

        sectionSelect.innerHTML = '<option value="" disabled selected>Select Section</option>'; // reset
        sections.forEach(section => {
            const option = document.createElement("option");
            option.value = section;
            option.textContent = section;
            sectionSelect.appendChild(option);
        });
    });

        // show create account inputss
        createAccountText.addEventListener("click", function () {
            createAccountForm.style.display = "block";
            createAccountText.style.display = "none";
        });
    
        // submit account
        submitAccountButton.addEventListener("click", function () {
            const newUsername = document.getElementById("newUsername").value.trim();
            const newPassword = document.getElementById("newPassword").value.trim();
            const confirmPassword = document.getElementById("confirmPassword").value.trim();
    
            if (!newUsername || !newPassword || !confirmPassword) {
                alert("All fields are required.");
                return;
            }
    
            if (newPassword !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }
    
            if (accounts.some(account => account.username === newUsername)) {
                alert("Username already exists. Please choose a different username.");
                return;
            }

            const verificationCode = prompt("Enter the 10-digit verification code:");
            if (verificationCode !== "2510197825") {
                alert("Incorrect verification code. Account creation failed.");
                return;
            }
    
            // save account
            accounts.push({ username: newUsername, password: newPassword });
            localStorage.setItem("staffAccounts", JSON.stringify(accounts));
    
            alert("Account created successfully!");
            createAccountForm.style.display = "none";
            createAccountText.style.display = "block";
        });
    
        // validate login frm saved accounts
        function validateLogin(username, password) {
            return accounts.some(account => account.username === username && account.password === password);
        }
    

    // submit to respected place
    function nextStep() {
        if (studentRadio.checked) {
            const name = document.getElementById("name").value;
            const year = document.getElementById("year").value;
            const section = document.getElementById("section").value;

            if (!name || !year || !section) {
                alert("Please enter all required fields: Name, Year, and Section!");
                return;
            } 

            const now = new Date();
            const formattedTime = now.toLocaleString();

            // locate and save kung saan dapat ma-save sa local storage
            const url = `student-subm.html?name=${encodeURIComponent(name)}&year=${encodeURIComponent(year)}&section=${encodeURIComponent(section)}&time=${encodeURIComponent(formattedTime)}`;
            window.open(url, "_blank");
            window.close();
        } else if (staffRadio.checked) {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const loginError = document.getElementById("loginError");

            if (validateLogin(username, password)) {
                window.open("history.html", "_blank");
                window.close();
            } else {
                loginError.style.display = "block";
            }
        } else {
            alert("Please select a role.");
        }
    }

    document.getElementById("nextButton").addEventListener("click", nextStep);

    // toggle na ilalabas log in ni student
    studentRadio.addEventListener("change", function () {
        if (this.checked) {
            loginForm.style.display = "none";
            studentForm.style.display = "block";
        }
    });

    // toggle na ilalabas si staff
    staffRadio.addEventListener("change", function () {
        if (this.checked) {
            loginForm.style.display = "block";
            studentForm.style.display = "none";
        }
    });
});
