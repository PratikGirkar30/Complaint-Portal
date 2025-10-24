document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('complaint-form');
    const statusMessage = document.getElementById('status-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the form from reloading the page

        // 1. Get all the form data
        const formData = {
            user_name: document.getElementById('name').value,
            rollNo: document.getElementById('rollNo').value,
            email: document.getElementById('email').value,
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            isAnonymous: document.getElementById('isAnonymous').checked,
        };

        // Show a "submitting" message
        statusMessage.textContent = 'Submitting your complaint...';
        statusMessage.className = 'status-message'; // Reset classes

        try {
            // 2. Send the data to the backend API
            const response = await fetch('http://localhost:5001/api/complaints/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                // 3. Handle success
                statusMessage.textContent = 'Complaint submitted successfully!';
                statusMessage.classList.add('success');
                form.reset(); // Clear the form fields
            } else {
                // 4. Handle errors from the server
                throw new Error(result.message || 'An error occurred.');
            }

        } catch (error) {
            // 5. Handle network or other errors
            statusMessage.textContent = `Error: ${error.message}`;
            statusMessage.classList.add('error');
            console.error('Submission failed:', error);
        }
    });
});

// register form submit handler
const payload = { user_name, email, rollNo, password };
const res1 = await fetch('http://localhost:5001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
});

const data1 = await res.json();
if (res.ok) {
    localStorage.setItem('token', data1.token);
    localStorage.setItem('user', JSON.stringify(data1.user));
    localStorage.setItem('name', data1.user.name)
    // redirect to homepage
}

const res2 = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});
const data = await res.json();
if (res.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('name', data.user.name);
}

const token1 = localStorage.getItem('token');
const res3 = await fetch('http://localhost:5001/api/complaints/submit', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        ...(token1 ? { Authorization: `Bearer ${token1}` } : {})
    },
    body: JSON.stringify({
        title, description, category, isAnonymous, name, email, rollNo
    })
});

const token2 = localStorage.getItem('token');
const res4 = await fetch('http://localhost:5001/api/complaints/my', {
    headers: { Authorization: `Bearer ${token2}` }
});

const token = localStorage.getItem('token'); // admin's token
const res = await fetch('http://localhost:5001/api/complaints', {
    headers: { Authorization: `Bearer ${token}` }
});


