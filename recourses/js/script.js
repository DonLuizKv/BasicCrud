import request from "../../crud/request.js";

//* Create
let username = document.getElementById("username");
let email = document.getElementById("email");
let password = document.getElementById("password");

let createForm = document.getElementById("createform");
let tableUsers = document.getElementById("tableBody");

let userError = document.getElementById("errorUsername")
let emailError = document.getElementById("errorEmail")
let passError = document.getElementById("errorPassword")

let editContenetor = document.getElementById("editContenetor");
let closeEdit = document.getElementById("cancelEdit");
let editUsername = document.getElementById("usernameEdit");
let editEmail = document.getElementById("emailEdit");
let editPassword = document.getElementById("passwordEdit");
let updateForm = document.getElementById("editform");
let tittleEditUser = document.getElementById("tittleEditUser");


createForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (username.value != null && validateEmail(email.value) && validatePassword(password.value)) {
        //petition
        const petition = await request.sendUser(username.value, email.value, password.value)
        if (petition.status == 400) {
            userError.style.display = "flex";
            emailError.style.display = "flex";
            return petition;
        }

        //window.location.reload();
    } else {
        console.log("Datos incorrectos.")
        passError.style.display = "flex";
        validationInput([username, email, password], "rgba(216, 0, 0, 0.403)")
    }
});

window.addEventListener("DOMContentLoaded", async (e) => {
    let data = await request.getUserData();
    if (!data.length > 0) {
        addUserInTableEmpty(tableUsers);
        return;
    }
    data.forEach(item => {
        addUserInTable(tableUsers, item.id, item.username, item.email, item.password);
    })

})

//* Update
updateForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (editUsername.value != null && validateEmail(editEmail.value) && validatePassword(editPassword.value)) {
        update(editUsername.value, editEmail.value, editPassword.value)
    } else {
        validationInput([editUsername, editEmail, editPassword], "rgba(216, 0, 0, 0.403)")
    }
});


//? functions
function addUserInTable(table, id, name, mail, pass) {
    const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-edit"> <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /> <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /> <path d="M16 5l3 3" /></svg>`
    const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"> <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M4 7l16 0" /> <path d="M10 11l0 6" /> <path d="M14 11l0 6" /> <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /> <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>`;
    //creamos una fila
    let row = document.createElement("tr")

    //creamos la celda id 
    let Id = document.createElement("td")
    Id.id = "identificationRow"

    //creamos la celda username 
    let username = document.createElement("td")
    username.id = "rowUserName"

    //creamos la celda email 
    let email = document.createElement("td")

    //creamos la celda contraseña
    let password = document.createElement("td")

    //celda de acciones
    let buttons = document.createElement("td");
    buttons.className = "action"
    let editButton = document.createElement("button")
    editButton.id = "edit"
    editButton.setAttribute("data-id", id);
    let deleteButton = document.createElement("button")
    deleteButton.id = "delete"
    deleteButton.setAttribute("data-id", id);

    //event
    editButton.addEventListener("click", async () => {
        editContenetor.style.display = "flex"
    });

    //close edit contenetor
    closeEdit?.addEventListener("click", () => {
        editContenetor.style.display = "none";
    });

    deleteButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const response = await request.deleteUser(deleteButton.getAttribute("data-id"))
        window.location.reload();
    })

    //llenamos los datos de cada celda
    Id.textContent = id;
    username.textContent = name;
    email.textContent = mail;
    password.textContent = pass;

    editButton.innerHTML = editIcon;
    deleteButton.innerHTML = deleteIcon;

    //insertamos las celdas en la fila
    row.appendChild(Id)
    row.appendChild(username)
    row.appendChild(email)
    row.appendChild(password)

    buttons.appendChild(editButton);
    buttons.appendChild(deleteButton);
    row.appendChild(buttons)


    //insertamos la fila dentro de la tabla
    table.appendChild(row)
}

function addUserInTableEmpty(table) {
    let row = document.createElement("tr")

    let message = document.createElement("td")
    message.textContent = "Not found users"
    message.colSpan = "5";

    row.appendChild(message)
    table.appendChild(row)
}

async function update(username, email, password) {
    let data = await request.getUserData();
    if (!data.length > 0) {
        console.log("ñerda");
    }

    let updateUser = await request.updateUserData(data[0].id, username, email, password)
    console.log(updateUser);
    window.location.reload();
}

function validationInput(inputs, color) {
    inputs.forEach(element => {
        element.style.border = `1px solid ${color}`;
        element.style.boxShadow = `0 0 0 4px ${color}`;
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
}