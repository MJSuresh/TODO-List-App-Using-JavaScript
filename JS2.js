let taskBefore;
let completed, all, progress;
let todos = [];
let completedTodos = [];
let all_displayedTodos = [];
let progress_displayedTodos = [];
let completed_displayedTodos = [];
let input;
let li2 = "";

function showNotification(message, type) {
  let popUp = document.createElement("div");
  popUp.id = "notification-popup";
  popUp.classList.add(type); // Add class for color (e.g., "success", "error")

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
  messageBox.textContent = message;
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
  let form = document.querySelector("#new-task-form");
  all = document.querySelector("#All");
  progress = document.querySelector("#Progress");
  completed = document.querySelector("#Completed");
  let taskBox = document.querySelector("#tasks");

  todos = JSON.parse(localStorage.getItem("todos")) || [];
  completedTodos = JSON.parse(localStorage.getItem("completedTodos")) || [];

  let navbarItems = document.querySelectorAll(".navbar a");

  navbarItems.forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelector(".active").classList.remove("active"); // Remove any existing active classes
      item.classList.add("active"); // Add active class to the clicked item
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    input = document.querySelector("#title");
    let task = input.value.trim();
    if (!todos.includes(task) && !task == "") {
      // adding the task into local storage
      todos.push(task);
      localStorage.setItem("todos", JSON.stringify(todos));

      if (document.querySelector(".active").id == "All") {
        all.click();
      } else if (document.querySelector(".active").id == "Progress") {
        progress.click();
      } else {
        completed.click();
      }

      input.value = "";
      showNotification("Task added successfully.", "success");
    } else if (task == "") {
      showNotification("Empty Task not accepted.", "error");
      input.value = "";
    } else {
      showNotification("Task already added.", "error");
      input.value = "";
    }
  });

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
      //   showNotification("No Task were added.", "error");
    }
  });

  all.click();

  progress.addEventListener("click", () => {
    if (todos.length > 0) {
      li2 = "";
      for (let i = 0; i < todos.length; i++) {
        const display_completedTodos = todos[i];
        if (
          !completedTodos.includes(display_completedTodos) &&
          !progress_displayedTodos.includes(display_completedTodos)
        ) {
          display(display_completedTodos);
          progress_displayedTodos.push(display_completedTodos);
        }
      }
      progress_displayedTodos = [];
      taskBox.innerHTML =
        li2 ||
        `<span class="no_task_span">You don't have any Pending Task</span>`;
    } else {
      taskBox.innerHTML = `<span class="no_task_span">You don't have any Pending Task</span>`;
      //   showNotification("No Task were added.", "error");
    }
  });

  completed.addEventListener("click", () => {
    if (completedTodos.length > 0) {
      li2 = "";
      for (let i = 0; i < completedTodos.length; i++) {
        const display_completedTodos = completedTodos[i];
        if (
          completedTodos.includes(display_completedTodos) &&
          !completed_displayedTodos.includes(display_completedTodos)
        ) {
          display(display_completedTodos);
          completed_displayedTodos.push(display_completedTodos);
        }
      }
      completed_displayedTodos = [];
      taskBox.innerHTML = li2;
    } else {
      taskBox.innerHTML = `<span class="no_task_span">You don't have any Completed Task</span>`;
      //   showNotification("No Task were added.", "error");
    }
  });
});

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
        showNotification("Task moved to Progress.", "orange");
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

  if (edit_task.innerText == "Edit") {
    taskBefore = update_edit_task.value;
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
    todos.push(update_edit_task.value);
    completedTodos.push(update_edit_task.value);
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
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
    todos.push(update_edit_task.value);
    localStorage.setItem("todos", JSON.stringify(todos));
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

  if (
    document.querySelector(".active").id == "Completed" ||
    (delete_task.parentElement.previousElementSibling.querySelector("span")
      .style.backgroundColor == "green" &&
      document.querySelector(".active").id == "All")
  ) {
    confirmFunction("Want to delete the TASK?", function (result) {
      if (result) {
        todos.splice(todos.indexOf(update_delete_task), 1);
        completedTodos.splice(completedTodos.indexOf(update_delete_task), 1);
        localStorage.setItem("todos", JSON.stringify(todos));
        localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
        showNotification("Task deleted.", "error");
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
    confirmFunction("Want to delete the TASK?", function (result) {
      if (result) {
        todos.splice(todos.indexOf(update_delete_task), 1);
        localStorage.setItem("todos", JSON.stringify(todos));
        showNotification("Task deleted.", "error");
        if (document.querySelector(".active").id == "Progress") {
          progress.click();
        } else {
          all.click();
        }
      }
    });
  }
}
