    function createCell(text) {
        const cell = document.createElement("td");
        cell.innerText = text
        return cell;
    }

    function renderTasks(tasks) {

        tasks.forEach((task) => {
            const tableRow = document.createElement("tr")

            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
            deleteButton.className = "deleteButton";
            deleteButton.addEventListener("click", () => deleteTask(task.id));

            const updateButton = document.createElement("button");
            updateButton.innerText = "Update";
            updateButton.className = "updateButton";
            updateButton.addEventListener("click", () => updateTask(task.id, task.title = prompt("New Title"), task.completed));

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "completed";
            task.completed === true ? checkbox.checked = true : checkbox.checked = false;
            checkbox.addEventListener("change", () => updateTask(task.id, task.title, !task.completed));

            const tableBody = document.querySelector("tbody");
            tableRow.append(createCell(task.id), createCell(task.title), deleteButton, updateButton, checkbox);
            tableBody.append(tableRow);
        });
    }

    function indexTask() { 
    fetch("http://127.0.0.1:3000/auth/jwt/tasks", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }})
        .then((response) => response.json())
        .then((data) => renderTasks(data))
        }

    function createTask(title) {
        fetch("http://127.0.0.1:3000/auth/jwt/tasks",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    title: title
                })
            }).then(function (response) {
                console.log(response)
                if (response.status == 401) {
                    alert("Loggen Sie sich zuerst ein")
                }
                else{
                    successful()
                }
    })}

    function deleteTask(id) {
        fetch(`http://127.0.0.1:3000/auth/jwt/task/${id}`,
            { method: "DELETE",
            headers:{
                "Authorization": `Bearer ${localStorage.getItem("token")}`}
            }).then(successful())
        }


    function updateTask(id, title, completed) {
        fetch("http://127.0.0.1:3000/auth/jwt/tasks",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    id: id,
                    title: title,
                    completed: completed
                })
            }).then(successful())
    }
    function checkedLoggedIn() {
        const loggedIn = document.getElementById("loggedIn")
        const notLoggedIn = document.getElementById("loginForm")

        fetch("http://127.0.0.1:3000/auth/jwt/verify",
        {
            method:"GET",
            headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }).then(function (response) {
            console.log(response)
            if (response.status == 401) {
                loggedIn.classList.add("hidden")
                notLoggedIn.classList.remove("hidden")
            } else {
                loggedIn.classList.remove("hidden")
                notLoggedIn.classList.add("hidden")
            }
        })
    }
    function login(email, password) {
        localStorage.removeItem("token");
        fetch("http://127.0.0.1:3000/auth/jwt/sign", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then((response) => {
                return (response.status == 200) ? response.json() : alert(error.message)
            })
            .then((response) => {
            console.log(response)
            localStorage.setItem("token", response.token)
                return fetch("http://127.0.0.1:3000/auth/jwt/verify", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                })
            }).then(response => {
                console.log(response)
            })
    }
    function successful(){
        document.getElementById("successful").classList.remove("hidden")
    }

    document.addEventListener("DOMContentLoaded", () => {
        checkedLoggedIn();
        indexTask();
        const newTaskForm = document.getElementById("newTaskForm");
        newTaskForm.addEventListener("submit", () => {
            const title = document.getElementById("newTask").value;
            createTask(title);
        })

        const loginForm = document.getElementById("loginForm");
        loginForm.addEventListener("submit", (event) => {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            login(email, password);

        })

        const logout = document.getElementById("logout");
        logout.addEventListener("click", () => {
        localStorage.removeItem("token")
        document.location.reload();
        })
    });