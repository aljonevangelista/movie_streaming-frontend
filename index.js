const content = document.querySelector("#content");
const submit = document.querySelector('#add');
const update = document.querySelector("#update");


// GET ALL USERS
window.addEventListener('load', getUsers);


function getUsers() {
    let html = "";
    fetch('http://localhost:7000/api/users', { mode: 'cors' })
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                html += `
                <li>
                    <span>${element.first_name} ${element.last_name}</span>
                    <div class="action-buttons">
                        <button type="button" onclick="updateMember(${element.id})" class="btn-edit-small">Update</button>
                        <button type="button" onclick="deleteMember(${element.id})" class="btn-delete-small">Delete</button>
                    </div>
                </li>`;
            });
            content.innerHTML = html;
        })
        .catch(error => console.log(error));
}


// POST - ADD USER
submit.addEventListener('click', () => {
    let fname = document.querySelector('#fname').value;
    let lname = document.querySelector('#lname').value;
    let course = document.querySelector('#course').value;
    let year = document.querySelector('#year').value;

    if(!fname || !lname) return alert("Please fill in the names!");


    let formData = { fname, lname, course, year };


    fetch('http://localhost:7000/api/users', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to add user");
        return response.json();
    })
    .then(data => {
        alert("User Added Successfully");
        location.reload(); // Only reload AFTER success
    })
    .catch(error => {
        console.log(error);
        alert("Error adding user.");
    });
});


// DELETE USER
function deleteMember(id) {
    if (confirm("Are you sure you want to delete this user?")) {
        fetch("http://localhost:7000/api/users", {
            method: 'DELETE',
            body: JSON.stringify({ id }),
            headers: { "Content-Type": "application/json" },
        })
        .then(response => {
            if (!response.ok) throw new Error('Server returned ' + response.status);
            return response.json();
        })
        .then(data => {
            alert("User Deleted Successfully");
            location.reload();
        })
        .catch(error => {
            console.error("Error details:", error);
            alert("An error occurred: " + error.message);
        });
    }
}


function updateMember(id) {
    fetch(`http://localhost:7000/api/users/${id}`)
        .then(response => response.json())
        .then(data => {


            const user = data[0];


            document.querySelector("#fname").value = user.first_name;
            document.querySelector("#lname").value = user.last_name;
            document.querySelector("#age").value = user.age;
            document.querySelector("#course").value = user.course;
            document.querySelector("#gender").value = user.gender;
            document.querySelector("#year").value = user.year;
            document.querySelector("#ID").value = user.id;
        });
}


update.addEventListener('click', () => {
    let fname = document.querySelector("#fname").value;
    let lname = document.querySelector("#lname").value;
    let age = document.querySelector("#age").value;
    let course = document.querySelector("#course").value;
    let gender = document.querySelector("#gender").value;
    let year = document.querySelector("#year").value;
    let id = document.querySelector("#ID").value;


    if (!id) return alert("Please select a user to update first!");


    let formdata = { fname, lname, age, course, gender, year, id };


    fetch(`http://localhost:7000/api/users`, {
        method: 'PUT',
        body: JSON.stringify(formdata),
        headers: { "Content-Type": "application/json" },
    })
    .then(response => {
        if (!response.ok) throw new Error("Update failed");
        return response.json();
    })
    .then(data => {
        alert("User Updated Successfully!");
        location.reload();
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Update failed.");
    });
});
