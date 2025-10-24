// register 
const registerForm = document.getElementById("register-form");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent page reload

    // Collect form data
    const data = {
        name: document.getElementById("regName").value,
        email: document.getElementById("regEmail").value,
        roll: document.getElementById("regRoll").value,
        password: document.getElementById("regPassword").value
    };

    try {
        const res = await fetch("http://localhost:5001/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
            registerMessage.style.color = "green";
            registerMessage.innerText = result.message || "Registered successfully!";
            window.location.href = "login.html";
        } else {
            registerMessage.style.color = "red";
            registerMessage.innerText = result.message || "Registration failed!";
        }
    } catch (err) {
        console.error(err);
        registerMessage.style.color = "red";
        registerMessage.innerText = "Error connecting to server!";
    }
});
