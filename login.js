// login.js
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const data = {
        email: formData.get("email")?.trim(),
        password: formData.get("password")?.trim()
    };

    try {
        const res = await fetch("http://localhost:5001/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        // Display server response message
        document.getElementById("loginMessage").innerText = result.message;

        if (result.token) {
            // Save JWT to localStorage for future requests
            localStorage.setItem("token", result.token);
            localStorage.setItem("name", result.user.name);
            if (result.user.role === "admin") {
                window.location.href = "dashboard.html";
            } else if (result.user.role === "user") {
                window.location.href = "index.html";
            } else {
                window.location.href = "index.html";
            }
        }
    } catch (err) {
        console.error(err);
        document.getElementById("loginMessage").innerText = "Error logging in!";
    }
});
