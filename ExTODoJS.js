let all, progress, completed;
let todos = [],
  completedTodos = [];
let input, taskBefore, confirm_message;
let li2 = "";
let edit_and_save;

function showNotification(message, type) {
  let popUp = document.createElement("div");
  popUp.id = "notification-popup";
  popUp.classList.add(type); // Add class for color (e.g., "success", "warning", "process")

  let content = document.createElement("div");
  content.classList.add("popup-content");
  content.textContent = message;

  popUp.appendChild(content);
  document.body.appendChild(popUp);

  // Auto-hide after a few seconds
  setTimeout(() => {
    document.body.removeChild(popUp);
  }, 1000);
}

function confirmFunction(message, callback) {
  let confirmBox = document.createElement("div");
  confirmBox.classList.add("confirm-box");

  let messageBox = document.createElement("div");
  messageBox.classList.add("message-box");
  messageBox.innerText = message;
  confirmBox.appendChild(messageBox);

  let buttonBox = document.createElement("div");
  buttonBox.classList.add("button-box");
  messageBox.appendChild(buttonBox);

  let yesBox = document.createElement("button");
  yesBox.classList.add("yes-button");
  yesBox.textContent = "Yes";
  buttonBox.appendChild(yesBox);

  let noBox = document.createElement("button");
  noBox.classList.add("no-button");
  noBox.textContent = "No";
  buttonBox.appendChild(noBox);

  document.body.appendChild(confirmBox);

  function removeConfirmationBox() {
    document.body.removeChild(confirmBox);
  }

  yesBox.addEventListener("click", yesButtonClick);

  function yesButtonClick() {
    callback(true);
    removeConfirmationBox();
  }

  noBox.addEventListener("click", noButtonClick);

  function noButtonClick() {
    callback(false);
    removeConfirmationBox();
  }
}

window.addEventListener("load", () => {
  let form = document.querySelector("#new-task-form #title");
  all = document.querySelector("#All");
  progress = document.querySelector("#Progress");
  completed = document.querySelector("#Completed");
  let taskBox = document.querySelector("#tasks");
  // edit_and_save = document.querySelector(".edit");
  // console.log(edit_and_save.innerHTML);

  todos = JSON.parse(localStorage.getItem("todos")) || [];
  completedTodos = JSON.parse(localStorage.getItem("completedTodos")) || [];

  let navbarItems = document.querySelectorAll(".navbar a");
  navbarItems.forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelector(".active").classList.remove("active"); // Remove any existing active classes
      item.classList.add("active"); // Add active class to the clicked item
    });
  });

  form.addEventListener("keyup", (e) => {
    // e.preventDefault();
    if (e.key == "Enter") {
      submitTask();
    }
  });

  document.getElementById("add-icon").addEventListener("click", submitTask);

  all.addEventListener("click", () => {
    if (todos.length > 0) {
      li2 = "";
      for (let i = 0; i < todos.length; i++) {
        const display_completedTodos = todos[i];
        display(display_completedTodos);
      }
      taskBox.innerHTML = li2;
    } else {
      taskBox.innerHTML = `<span class="no_task_span">No Task were added</span>`;
    }
  });

  all.click();

  progress.addEventListener("click", () => {
    if (todos.length > 0) {
      li2 = "";
      for (let i = 0; i < todos.length; i++) {
        const display_completedTodos = todos[i];
        if (!completedTodos.includes(display_completedTodos)) {
          display(display_completedTodos);
        }
      }
      taskBox.innerHTML =
        li2 ||
        `<span class="no_task_span">You don't have any Pending Task</span>`;
    } else {
      taskBox.innerHTML = `<span class="no_task_span">You don't have any Pending Task</span>`;
    }
  });

  completed.addEventListener("click", () => {
    if (completedTodos.length > 0) {
      li2 = "";
      for (let i = 0; i < completedTodos.length; i++) {
        const display_completedTodos = completedTodos[i];
        if (completedTodos.includes(display_completedTodos)) {
          display(display_completedTodos);
        }
      }
      taskBox.innerHTML = li2;
    } else {
      taskBox.innerHTML = `<span class="no_task_span">You don't have any Completed Task</span>`;
    }
  });
});

function submitTask() {
  input = document.querySelector("#title");
  let task = input.value.trim();

  // for not accepting existing task which is in different format like uppercase/lowercase

  // let flag=true;
  // for(let i=0;i<todos.length;i++){
  //     if(todos[i].toLowerCase()==task.toLowerCase()){
  //       flag=false;
  //     }
  // }

  // if (!todos.includes(task) && task!="" && flag) {

  if (!todos.includes(task) && task != "") {
    todos.push(task);
    localStorage.setItem("todos", JSON.stringify(todos)); // adding the task into local storage

    if (document.querySelector(".active").id == "All") {
      all.click();
    } else if (document.querySelector(".active").id == "Progress") {
      progress.click();
    } else {
      completed.click();
    }

    input.value = "";
    input.focus();
    showNotification("Task added successfully.", "success");
  } else if (task == "") {
    input.value = "";
    input.focus();
    showNotification("Empty Task not accepted.", "warning");
  } else {
    input.value = "";
    input.focus();
    showNotification("Task already added.", "warning");
  }
}

function display(task) {
  if (!completedTodos.includes(task)) {
    let li = `<li class="task">
                        <div class="content">
                        <span type="checkbox" onclick="checkbox_function(this)" id="myCheckbox" class="material-symbols-outlined" style="background-color: orange;border-radius: 100%;">check_circle</span>
                        <input type="text" name="text" class="text" value="${task}" readonly>
                        </div>
                        <div class="actions">
                            <button class="edit" onclick="edit_function(this)">Edit</button>
                            <button class="delete" onclick="delete_function(this)">Delete</button>
                        </div>
        </li>`;
    li2 = li + li2;
  } else {
    let li = `<li class="task">
                        <div class="content">
                        <span type="checkbox" onclick="checkbox_function(this)" id="myCheckbox" class="material-symbols-outlined" style="background-color: green;border-radius: 100%;">check_circle</span>
                        <input type="text" name="text" class="text" value="${task}" readonly>
                        </div>
                        <div class="actions">
                            <button class="edit" onclick="edit_function(this)">Edit</button>
                            <button class="delete" onclick="delete_function(this)">Delete</button>
                        </div>
        </li>`;
    li2 = li + li2;
  }
}

function checkbox_function(check_task) {
  const update_check_task = check_task.parentElement.lastElementChild.value;

  if (
    document.querySelector(".active").id == "Completed" ||
    (check_task.style.backgroundColor == "green" &&
      document.querySelector(".active").id == "All")
  ) {
    confirmFunction("Not completed the TASK?", function (result) {
      if (result) {
        completedTodos.splice(completedTodos.indexOf(update_check_task), 1);
        localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
        showNotification("Task moved to Progress.", "process");
        if (document.querySelector(".active").id == "Completed") {
          completed.click();
        } else {
          all.click();
        }
      }
    });
  } else if (
    document.querySelector(".active").id == "Progress" ||
    (check_task.style.backgroundColor == "orange" &&
      document.querySelector(".active").id == "All")
  ) {
    confirmFunction("Completed the TASK?", function (result) {
      if (result) {
        completedTodos.push(update_check_task);
        localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
        showNotification("Task moved to Completed.", "success");
        if (document.querySelector(".active").id == "Progress") {
          progress.click();
        } else {
          all.click();
        }
      }
    });
  }
}

function edit_function(edit_task) {
  let update_edit_task =
    edit_task.parentElement.previousElementSibling.querySelector(".text");
    edit_and_save=edit_task.parentElement.querySelector(".edit");
    console.log(edit_and_save);

  if (edit_task.innerText == "Edit") {
    taskBefore = update_edit_task.value;
    // edit_and_save.innerText="Edit"
    edit_task.innerText = "Save";
    update_edit_task.removeAttribute("readonly");
    update_edit_task.setSelectionRange(taskBefore.length, taskBefore.length);
    update_edit_task.focus();
  } else if (
    document.querySelector(".active").id == "Completed" ||
    (edit_task.parentElement.previousElementSibling.querySelector("span").style
      .backgroundColor == "green" &&
      document.querySelector(".active").id == "All")
  ) {
    const indexToChangeT = todos.indexOf(taskBefore);
    const indexToChangeC = completedTodos.indexOf(taskBefore);
    todos.splice(indexToChangeT, 1);
    completedTodos.splice(indexToChangeC, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("completedTodos", JSON.stringify(completedTodos));

    if (update_edit_task.value != "") {
      todos.push(update_edit_task.value);
      completedTodos.push(update_edit_task.value);
      localStorage.setItem("todos", JSON.stringify(todos));
      localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
    }

    if (document.querySelector(".active").id == "Completed") {
      completed.click();
    } else {
      all.click();
    }
    showNotification("Task updated.", "success");
  } else if (
    document.querySelector(".active").id == "Progress" ||
    (edit_task.parentElement.previousElementSibling.querySelector("span").style
      .backgroundColor == "orange" &&
      document.querySelector(".active").id == "All")
  ) {
    const indexToChangeT = todos.indexOf(taskBefore);
    todos.splice(indexToChangeT, 1);
    localStorage.setItem("todos", JSON.stringify(todos));

    if (update_edit_task.value != "") {
      todos.push(update_edit_task.value);
      localStorage.setItem("todos", JSON.stringify(todos));
    }

    if (document.querySelector(".active").id == "Progress") {
      progress.click();
    } else {
      all.click();
    }
    showNotification("Task updated.", "success");
  }
}

function delete_function(delete_task) {
  const update_delete_task =
    delete_task.parentElement.previousElementSibling.querySelector(
      ".text"
    ).value;
  let shortened = update_delete_task;

  if (
    document.querySelector(".active").id == "Completed" ||
    (delete_task.parentElement.previousElementSibling.querySelector("span")
      .style.backgroundColor == "green" &&
      document.querySelector(".active").id == "All")
  ) {
    shortened =
      shortened.length > 20 ? shortened.slice(0, 20) + "..." : shortened; //checking the tasks that exists more than 20 characters or not
    confirm_message = `Want to delete the TASK?\n\n${shortened}`;
    confirmFunction(confirm_message, function (result) {
      if (result) {
        todos.splice(todos.indexOf(update_delete_task), 1);
        completedTodos.splice(completedTodos.indexOf(update_delete_task), 1);
        localStorage.setItem("todos", JSON.stringify(todos));
        localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
        showNotification("Task deleted.", "warning");
        if (document.querySelector(".active").id == "Completed") {
          completed.click();
        } else {
          all.click();
        }
      }
    });
  } else if (
    document.querySelector(".active").id == "Progress" ||
    (delete_task.parentElement.previousElementSibling.querySelector("span")
      .style.backgroundColor == "orange" &&
      document.querySelector(".active").id == "All")
  ) {
    shortened =
      shortened.length > 20 ? shortened.slice(0, 20) + "..." : shortened;
    confirm_message = `Want to delete the TASK?\n\n${shortened}`;
    confirmFunction(confirm_message, function (result) {
      if (result) {
        todos.splice(todos.indexOf(update_delete_task), 1);
        localStorage.setItem("todos", JSON.stringify(todos));
        showNotification("Task deleted.", "warning");
        if (document.querySelector(".active").id == "Progress") {
          progress.click();
        } else {
          all.click();
        }
      }
    });
  }
}
