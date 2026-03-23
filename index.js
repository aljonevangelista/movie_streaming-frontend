const API_URL = "http://localhost:7000/api/users";

const content = document.querySelector("#content");
const submit = document.querySelector('#add');
const updateBtn = document.querySelector("#update");

// LOAD USERS
window.addEventListener('load', getUsers);

function getUsers() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            content.innerHTML = "";

            data.forEach(user => {
                content.innerHTML += `
                    <li>
                        <span>${user.fname} ${user.lname}</span>
                        <div class="action-buttons">
                            <button onclick="editUser(${user.id})">Update</button>
                            <button onclick="deleteUser(${user.id})">Delete</button>
                        </div>
                    </li>
                `;
            });
        })
        .catch(err => console.error("Fetch error:", err));
}

// ADD USER
submit.addEventListener('click', () => {
    const fname = document.querySelector('#fname').value;
    const lname = document.querySelector('#lname').value;
    const course = document.querySelector('#course').value;
    const year = document.querySelector('#year').value;

    if (!fname || !lname) {
        return alert("First and last name required!");
    }

    fetch(API_URL, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fname, lname, course, year })
    })
    .then(async res => {
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || data.error);
        }

        return data;
    })
    .then(() => {
        alert("User added!");
        clearForm();
        getUsers();
    })
    .catch(err => {
        console.error(err);
        alert(err.message);
    });
});

// DELETE USER
function deleteUser(id) {
    if (!confirm("Delete this user?")) return;

    fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    })
    .then(async res => {
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || data.error);
        }

        return data;
    })
    .then(() => {
        alert("User deleted!");
        getUsers();
    })
    .catch(err => {
        console.error(err);
        alert(err.message);
    });
}

// ✅LOAD USER INTO FORM
function editUser(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(data => {
            const user = data[0];

            document.querySelector("#fname").value = user.fname;
            document.querySelector("#lname").value = user.lname;
            document.querySelector("#course").value = user.course;
            document.querySelector("#year").value = user.year;
            document.querySelector("#ID").value = user.id;
        })
        .catch(err => console.error(err));
}

// UPDATE USER
updateBtn.addEventListener('click', () => {
    const id = document.querySelector("#ID").value;
    const fname = document.querySelector("#fname").value;
    const lname = document.querySelector("#lname").value;
    const course = document.querySelector("#course").value;
    const year = document.querySelector("#year").value;

    if (!id) {
        return alert("Select a user first!");
    }

    fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, fname, lname, course, year })
    })
    .then(async res => {
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || data.error);
        }

        return data;
    })
    .then(() => {
        alert("User updated!");
        clearForm();
        getUsers();
    })
    .catch(err => {
        console.error(err);
        alert(err.message);
    });
});

//  CLEAR FORM
function clearForm() {
    document.querySelector("#fname").value = "";
    document.querySelector("#lname").value = "";
    document.querySelector("#course").value = "";
    document.querySelector("#year").value = "";
    document.querySelector("#ID").value = "";
}
