    function createCell(text) {
//creates cells for tables
        const cell = document.createElement("td");
        cell.innerText = text
        return cell;
    }

    function renderTasks(tasks) {
//shows all the tasks
        tasks.forEach((task) => {
            const tableRow = document.createElement("tr")
//creates Button to delete a task
            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
            deleteButton.className = "deleteButton";
            deleteButton.addEventListener("click", () => deleteTask(task.id));
//creates Button to update the due state
            const updateButton = document.createElement("button");
            updateButton.innerText = "Update";
            updateButton.className = "updateButton";
            updateButton.addEventListener("click", () => updateTask(task.id, task.title = prompt("New Title"), task.completed));
//creates Checkbox
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "completed";
            task.completed === true ? checkbox.checked = true : checkbox.checked = false;
            checkbox.addEventListener("change", () => updateTask(task.id, task.title, !task.completed));
//Puts the Parts together
            const tableBody = document.querySelector("tbody");
            tableRow.append(createCell(task.id), createCell(task.title), deleteButton, updateButton, checkbox);
            tableBody.append(tableRow);
        });
    }

    function indexTask() { 
//gets Tasks
    fetch("http://127.0.0.1:3000/auth/jwt/tasks", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }})
        .then((response) => response.json())
        .then((data) => renderTasks(data))
        }
//creates new Task
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
//deletes Task
    function deleteTask(id) {
        fetch(`http://127.0.0.1:3000/auth/jwt/task/${id}`,
            { method: "DELETE",
            headers:{
                "Authorization": `Bearer ${localStorage.getItem("token")}`}
            }).then(successful())
        }

//updates an existing Task
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
//checks if the user is logged in
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
//logs user in
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
//marks a succesful task
    function successful(){
        document.getElementById("successful").classList.remove("hidden")
    }
//Waits until everything is loaded
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