// complaint
const complaintForm = document.getElementById("complaint-form");

complaintForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(complaintForm);
    const data = {
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        isAnonymous: document.getElementById("isAnonymous").checked,
        name: formData.get("name"),
        email: formData.get("email"),
        rollNo: formData.get("rollNo")
    };
    try {
        const token = localStorage.getItem("token"); // JWT from login
        const res = await fetch("http://localhost:5001/api/complaints/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        document.getElementById("complaintMessage").innerText = JSON.stringify(result);
        if (res.ok) {
            window.location.href = "complaint.html";
        } else {
            //const error = await res.json();
            console.error("Error submitting complaint");
        }
    } catch (err) {
        console.error(err);
        document.getElementById("complaintMessage").innerText = "Error submitting complaint!";
    }
});
