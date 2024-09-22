

async function sendUser(name, mail, pass) {
    const data = {
        username: name,
        email: mail,
        password: pass,
    };

    const petition = await fetch("http://localhost:3000/register/auth", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });

    const response = await petition.json();

    console.log(response)

    if (!response.ok) {
        // window.location.reload();
        return response;
    }

    
    return response;
}

async function getUserData() {
    const response = await fetch(`http://localhost:3000/users/data`);
    const userData = await response.json();
    if (!response.ok) {
        return userData;
    }
    return userData;
}

async function updateUserData(id, user, mail, pass) {
    const data = {
        id: id,
        username: user,
        email: mail,
        password: pass,
    };

    const petition = await fetch('http://localhost:3000/users/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const response = await petition.json();
    if (!petition.ok) {
        return response;

    }
    console.log(response);
    return response;

}

async function deleteUser(id) {
    const data = {
        id: id,
    }

    console.log(data)

    const petition = await fetch('http://localhost:3000/users/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const response = await petition.json();
    if (!response.ok) {
        return response;
    }

    return response;
}

export default {
    sendUser,
    getUserData,
    updateUserData,
    deleteUser,
}