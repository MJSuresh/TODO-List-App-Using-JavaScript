var btns = document.querySelectorAll('.btns button'),
    showChange = document.querySelector('.showChange'),
    penTaskFilter = document.querySelector('#penTaskFilter'),
    comTaskFilter = document.querySelector('#comTaskFilter'),
    pendingTodos = document.querySelector('.pendingTodos'),
    completeTodos = document.querySelector('.completeTodos'),
    todoList = document.querySelectorAll('.todoList'),
    addInputField = document.querySelector('.addInputField'),
    editInputField = document.querySelector('.editInputField'),
    addTaskBtn = document.querySelector('.addTask'),
    saveTaskBtn = document.querySelector('.saveTask')
pending = document.querySelector(".pending"),
    completeTasks = document.querySelector('.completeTask')
notification = document.querySelector('.notification'),
    deleteAllPenTodos = document.querySelector('.penTodos button'),
    deleteAllComTodos = document.querySelector('.comTodos button')
pendingNum = document.querySelector('.pendingNum'),
    completeNum = document.querySelector('.completeNum')


btns[0].addEventListener('click', () => {
    showChange.style.left = "0"
    btns[0].style.pointerEvents = "none"
    btns[1].style.pointerEvents = "auto"
    penTaskFilter.style.display = "block"
    comTaskFilter.style.display = "none"
    pendingTodos.style.display = "block"
    completeTodos.style.display = "none"
    todoList.forEach(todo => {
        todo.offsetHeight >= 320 ? todo.classList.add('overflow') : todo.classList.remove('overflow')
    })
})

btns[1].addEventListener('click', () => {
    showChange.style.left = "50%"
    btns[0].style.pointerEvents = "auto"
    btns[1].style.pointerEvents = "none"
    penTaskFilter.style.display = "none"
    comTaskFilter.style.display = "block"
    pendingTodos.style.display = "none"
    completeTodos.style.display = "block"
    todoList.forEach(todo => {
        todo.offsetHeight >= 320 ? todo.classList.add('overflow') : todo.classList.remove('overflow')
    })
})


addInputField.addEventListener('keyup', () => {
    var inputVal = addInputField.value;
    if (inputVal.trim() !== "") {
        addTaskBtn.classList.add('active');
    } else {
        addTaskBtn.classList.remove('active');
    }
});


function showNotification(text, id) {
    notification.textContent = text
    notification.classList.add(`${id}`)
    setTimeout(() => {
        notification.textContent = ""
        notification.classList.remove(`${id}`)
    }, 1500)
}

showtask()


addTaskBtn.onclick = () => {
    let userData = addInputField.value.trim();

    if (userData.length > 0) {
        let getLocalStorage = localStorage.getItem("Pending Todos");
        let listArr;

        if (getLocalStorage == null) {
            listArr = [];
        } else {
            listArr = JSON.parse(getLocalStorage);

            if (!listArr.includes(userData)) {

                listArr.unshift(userData);

                localStorage.setItem("Pending Todos", JSON.stringify(listArr));
                showtask();

                addInputField.value = "";
                addTaskBtn.classList.remove("active");
                showNotification("ToDo is Added Successfully", "success");
            } else {

                showNotification("Task already exists", "danger");
            }
        }
    }
};


function showtask() {
    let getLocalStorage = localStorage.getItem("Pending Todos")
    if (getLocalStorage == null) {
        listArr = []
    }
    else {
        listArr = JSON.parse(getLocalStorage)
    }

    pendingNum.textContent = listArr.length

    if (listArr.length >= 1) {
        deleteAllPenTodos.classList.add('active')
    }
    else {
        deleteAllPenTodos.classList.remove('active')
    }

    let newTodos = ""

    listArr.forEach((element, index) => {
        newTodos += `<li>${element} <div class="action"><button onclick = "editTask(${index})"><i class="fa-solid fa-pen-to-square"></i></button><button onclick = "completeTask(${index})"><i class="fa-regular fa-square-check"></i></button><button onclick = "deleteTask(${index})"><i class="fa-solid fa-trash"></i></button></div></li>`
    })

    pending.innerHTML = newTodos
    addInputField.value = ""

    todoList.forEach(todo => {
        todo.offsetHeight >= 320 ? todo.classList.add('overflow') : todo.classList.remove('overflow')
    })
}


function deleteTask(index) {
    showConfirm("are you shore you want to delete?", function (result) {
        if (result) {
            let getLocalStorage = localStorage.getItem("Pending Todos")
            let listArr = JSON.parse(getLocalStorage)
            listArr.splice(index, 1)

            localStorage.setItem("Pending Todos", JSON.stringify(listArr))
            showtask()
            showNotification("Task is Deleted Successfully", "danger")
        } else {
            console.log("you pressed no")
        }
    });
}

function showConfirm(message, callback) {
    var confirmbox = document.createElement("div");
    confirmbox.classList.add('confirm-box');

    var messagebox = document.createElement("div");
    messagebox.classList.add('message-box');
    messagebox.textContent = message;
    confirmbox.appendChild(messagebox);

    var buttonbox = document.createElement("div");
    buttonbox.classList.add('button-box');
    messagebox.appendChild(buttonbox);

    var yesButton = document.createElement("button");
    yesButton.classList.add('yes-button');
    yesButton.textContent = "Yes";
    buttonbox.appendChild(yesButton);
    yesButton.addEventListener('click', YesButtonClick);

    var noButton = document.createElement("button");
    noButton.classList.add('no-button');
    noButton.textContent = "No";
    buttonbox.appendChild(noButton);
    noButton.addEventListener('click', NoButtonClick);

    function removeConfirmBox() {
        document.body.removeChild(confirmbox);
    }

    function YesButtonClick() {
        callback(true);
        removeConfirmBox();
    }

    function NoButtonClick() {
        callback(false);
        removeConfirmBox();
    }

    document.body.appendChild(confirmbox);
}

deleteAllPenTodos.addEventListener('click', () => {

    showConfirm("are you shore you want to delete?", function (result) {
        if (result) {
            listArr = []

            localStorage.setItem("Pending Todos", JSON.stringify(listArr))
            showtask()
            showNotification("Deleted All Pending Task Successfully", "danger")
        } else {
            console.log("you pressed no")
        }
    });

})


function editTask(index) {
    editInputField.value = index;
    let getLocalStorage = localStorage.getItem("Pending Todos");
    let listArr = JSON.parse(getLocalStorage);

    addInputField.value = listArr[index];
    addTaskBtn.style.display = "none";
    saveTaskBtn.style.display = "block";

    saveTaskBtn.onclick = () => {
        let editedValue = addInputField.value.trim();

        if (editedValue.length > 0) {

            listArr.splice(index, 1);

            listArr.unshift(editedValue);

            localStorage.setItem("Pending Todos", JSON.stringify(listArr));

            showtask();

            addInputField.value = "";
            addTaskBtn.style.display = "block";
            saveTaskBtn.style.display = "none";
            showNotification("ToDo is Edited Successfully", "success");
        } else {

            showNotification("Please enter a valid task", "error");
        }
    };
}

showCompleteTask()

function completeTask(index) {
    let getLocalStorage = localStorage.getItem("Pending Todos")
    let listArr = JSON.parse(getLocalStorage)

    let comp = listArr.splice(index, 1)

    localStorage.setItem('Pending Todos', JSON.stringify(listArr))
    showtask()

    comp.forEach(com => {
        comArr.push(com)
    })

    localStorage.setItem("Complete Todos", JSON.stringify(comArr))
    showCompleteTask()
    showNotification("You have successfully Completed one Task", "success")
}


function showCompleteTask() {
    let getLocalStorage = localStorage.getItem("Complete Todos")

    if (getLocalStorage == null) {
        comArr = []
    }
    else {
        comArr = JSON.parse(getLocalStorage)
    }

    completeNum.textContent = comArr.length

    if (comArr.length >= 1) {
        deleteAllComTodos.classList.add("active")
    }
    else {
        deleteAllComTodos.classList.remove("active")
    }

    let completeTask = ""

    comArr.forEach((element, index) => {
        completeTask += `<li>${element} <div class="action com"><button onclick = "back(${index})"><i class="fa-solid fa-xmark"></i></button><button onclick = "comDeleteTask(${index})"><i class="fa-solid fa-trash"></i></button></div></li>`
    })

    completeTasks.innerHTML = completeTask
}


function comDeleteTask(index) {
    showConfirm("are you shore you want to delete?", function (result) {
        if (result) {
            let getLocalStorage = localStorage.getItem("Complete Todos")
            let comArr = JSON.parse(getLocalStorage)
            comArr.splice(index, 1)

            localStorage.setItem("Complete Todos", JSON.stringify(comArr))
            showCompleteTask()
            showNotification("Deleted one Task from Completed Task", "danger")
        } else {
            console.log("you pressed no")
        }
    });
}


deleteAllComTodos.addEventListener('click', () => {

    showConfirm("are you shore you want to delete?", function (result) {
        if (result) {
            comArr = []

            localStorage.setItem("Complete Todos", JSON.stringify(comArr))
            showCompleteTask()
            showNotification("Deleted All Tasks from Completed Task", "danger")
        } else {
            console.log("you pressed no")
        }
    });

})

function back(index) {
    let getLocalStorage = localStorage.getItem("Complete Todos")
    let comArr = JSON.parse(getLocalStorage)
    let backTodo = comArr.splice(index, 1)

    localStorage.setItem("Complete Todos", JSON.stringify(comArr))
    showCompleteTask()

    backTodo.forEach(back => {
        listArr.push(back)
    })

    localStorage.setItem("Pending Todos", JSON.stringify(listArr))
    showtask()
}


function filterPenTask() {
    let filterInput = document.querySelector('#penTaskFilter').value.toUpperCase()
    let li = pending.querySelectorAll('li')

    li.forEach(todo => {
        if (todo) {
            let textValue = todo.textContent || todo.innerHTML
            if (textValue.toUpperCase().indexOf(filterInput) > -1) {
                todo.style.display = ""
            }
            else {
                todo.style.display = "none"
            }
        }
    })
}

function filterCompleteTask() {
    let filterInput = document.querySelector('#comTaskFilter').value.toUpperCase()
    let li = completeTasks.querySelectorAll('li')

    li.forEach(todo => {
        if (todo) {
            let textValue = todo.textContent || todo.innerHTML
            if (textValue.toUpperCase().indexOf(filterInput) > -1) {
                todo.style.display = ""
            }
            else {
                todo.style.display = "none"
            }
        }
    })
}