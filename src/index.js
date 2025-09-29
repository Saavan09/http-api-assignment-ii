const nameForm = document.querySelector('#nameForm');
const userForm = document.querySelector('#userForm');
const contentDiv = document.querySelector('#content');

nameForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.querySelector('#nameField').value;
    const age = document.querySelector('#ageField').value;

    fetch('/addUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age }),
    })
        .then((response) => {
            if (response.status === 204) return null; // no content
            return response.json();
        })
        .then((data) => {
            let output = '';

            if (data) {
                if (data.id) output += `<b>${data.id}</b><br>`;
                output += `Message: ${data.message}`;
            } else {
                output = 'User updated successfully (204 No Content)';
            }

            contentDiv.innerHTML = output;
        })
        .catch((err) => {
            console.error('Error:', err);
            contentDiv.innerHTML = '<b>Error</b><br>Message: Failed to add user';
        });
});

userForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const urlField = document.querySelector('#urlField').value;
    const method = document.querySelector('#methodSelect').value.toUpperCase();

    fetch(urlField, { method })
        .then((response) => {
            if (method === 'HEAD') return null; // HEAD has no body
            return response.json();
        })
        .then((data) => {
            let output = '';

            if (data) {
                if (data.id) output += `<b>${data.id}</b><br>`;
                if (data.users) {
                    output += 'Users:<br>';
                    output += `${JSON.stringify(data.users, null, 2)}`;
                } else {
                    output += `Message: ${data.message}`;
                }
            } else {
                output = '(HEAD request, no body returned)';
            }

            contentDiv.innerHTML = output;
        })
        .catch((err) => {
            console.error('Error:', err);
            contentDiv.innerHTML = '<b>Error</b><br>Message: Failed to fetch';
        });
});
