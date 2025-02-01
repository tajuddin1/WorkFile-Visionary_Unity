document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission

    // Collect form data
    const name = document.querySelector('#name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const message = document.querySelector('#message').value.trim();
console.log(name,email,message)
    // Check if fields are empty
    if (!name || !email || !message) {
        alert('Please fill in all the fields.');
        return;
    }

    // Send data to the server
    try {
        const response = await fetch('http://localhost:5000/submit-form', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message }),
        });

        if (response.ok) {
            alert('Form submitted successfully!');
             // Clear input fields
             name.value = '';
             email.value = '';
             message.value = '';
        } else {
            const error = await response.json();
            alert(`Failed to submit the form: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});
