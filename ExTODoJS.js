let all, progress, completed;
let todos = [],
  completedTodos = [];
let input, taskBefore, confirm_message;
let li2 = "";
let edit_and_save;
let all_count, progress_count, completed_count;

todos = JSON.parse(localStorage.getItem("todos")) || [];
completedTodos = JSON.parse(localStorage.getItem("completedTodos")) || [];

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

function confirmFunction(message, content, callback) {
  let confirmBox = document.createElement("div");
  confirmBox.classList.add("confirm-box");

  let messageBox = document.createElement("div");
  messageBox.classList.add("message-box");
  messageBox.innerText = message;
  confirmBox.appendChild(messageBox);

  let popTaskBox = document.createElement("div");
  popTaskBox.classList.add("popTaskBox");
  popTaskBox.innerText = content;
  messageBox.appendChild(popTaskBox);

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
  input = document.querySelector("#title");
  edit_and_save = "null";

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
      submitTask(input.value, edit_and_save);
    }
  });

  document.getElementById("add-icon").addEventListener("click", () => {
    submitTask(input.value, edit_and_save);
  });

  all.addEventListener("click", () => {
    if (todos.length > 0) {
      li2 = "";
      for (let i = 0; i < todos.length; i++) {
        display(todos[i]);
      }
      taskBox.innerHTML = li2;
    } else {
      taskBox.innerHTML = `<span class="no_task_span">No Task were added</span>`;
    }
  });
  all.click();
  counts();

  progress.addEventListener("click", () => {
    if (todos.length > 0) {
      li2 = "";
      for (let i = 0; i < todos.length; i++) {
        if (!completedTodos.includes(todos[i])) {
          display(todos[i]);
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
        if (completedTodos.includes(completedTodos[i])) {
          display(completedTodos[i]);
        }
      }
      taskBox.innerHTML = li2;
    } else {
      taskBox.innerHTML = `<span class="no_task_span">You don't have any Finished Task</span>`;
    }
  });
});

function submitTask(task, edit_and_save2) {
  task = task.trim();
  task = task.replace(/[^a-zA-Z0-9 ]/g, "");
  task = task.replace(/\s+/g, " ");
  const toast_check = edit_and_save2;

  if (todos.includes(edit_and_save2)) {
    todos.splice(todos.indexOf(edit_and_save2), 1);
    localStorage.setItem("todos", JSON.stringify(todos));

    // if(completedTodos.includes(edit_and_save2)){
    //   completedTodos.splice(completedTodos.indexOf(edit_and_save2),1);
    //   completedTodos.push(task2);
    //   localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
    // }
    edit_and_save = "null";
    edit_and_save2 = "null";
  }

  if (!todos.includes(task) && task != "" && edit_and_save2 == "null") {
    todos.push(task);
    localStorage.setItem("todos", JSON.stringify(todos)); // adding the task into local storage

    if (document.querySelector(".active").id == "Progress") {
      progress.click();
    } else {
      all.click();
    }

    input.value = "";
    input.focus();
    counts();
    handleInputOrSubmit();
    if (toast_check == "null") {
      showNotification("Task added successfully.", "success");
    } else if (task == toast_check) {
      showNotification("Task discarded.", "warning");
    } else {
      showNotification("Task updated successfully.", "success");
    }
  } else if (task == "") {
    input.value = "";
    input.focus();
    showNotification("Empty/Invalid Task not accepted.", "warning");
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
                          <span class="text">${task}</span>
                          </div>
                          <div class="actions">
                          <button title="Pending Task" onclick="checkbox_function(this)" id="myCheckbox" ><i class="fa-regular fa-circle-check" style="background-color: orange;border-radius:100%;"></i></button>
                            <button class="edit" title="Edit" onclick="edit_function(this)"><i class="fa-solid fa-pen"></i></button>
                            <button class="delete" title="Delete" onclick="delete_function(this)"><i class="fa-solid fa-trash"></i></button>
                          </div>
          </li>`;
    li2 = li + li2;
  } else {
    let li = `<li class="task">
      <div class="content">
      <span class="text">${task}</span>
      </div>
      <div class="actions">
      <button title="Finished Task" onclick="checkbox_function(this)" id="myCheckbox" ><i class="fa-regular fa-circle-check" style="background-color: green;border-radius:100%;"></i></button>
        <button class="edit" title="Edit" onclick="edit_function(this)"><i class="fa-solid fa-pen"></i></button>
        <button class="delete" title="Delete" onclick="delete_function(this)"><i class="fa-solid fa-trash"></i></button>
      </div>
  </li>`;
    li2 = li + li2;
  }
}

function checkbox_function(check_task) {
  const update_check_task =
    check_task.parentElement.previousElementSibling.querySelector(
      "span"
    ).innerHTML;

  if (
    document.querySelector(".active").id == "Completed" ||
    (check_task.firstChild.style.backgroundColor == "green" &&
      document.querySelector(".active").id == "All")
  ) {
    confirmFunction(
      "Task still in progress?",
      (content = ""),
      function (result) {
        if (result) {
          completedTodos.splice(completedTodos.indexOf(update_check_task), 1);
          localStorage.setItem(
            "completedTodos",
            JSON.stringify(completedTodos)
          );
          showNotification("Task moved to Progress.", "process");
          if (document.querySelector(".active").id == "Completed") {
            completed.click();
            counts();
          } else {
            all.click();
            counts();
          }
        }
      }
    );
  } else if (
    document.querySelector(".active").id == "Progress" ||
    (check_task.firstChild.style.backgroundColor == "orange" &&
      document.querySelector(".active").id == "All")
  ) {
    confirmFunction(
      "Are you sure to complete the task?",
      (content = ""),
      function (result) {
        if (result) {
          completedTodos.push(update_check_task);
          localStorage.setItem(
            "completedTodos",
            JSON.stringify(completedTodos)
          );
          showNotification("Task moved to Completed.", "success");
          if (document.querySelector(".active").id == "Progress") {
            progress.click();
            counts();
          } else {
            all.click();
            counts();
          }
        }
      }
    );
  }
}

function edit_function(edit_task) {
  let update_edit_task =
    edit_task.parentElement.previousElementSibling.querySelector(
      "span"
    ).innerHTML;

  if (!completedTodos.includes(update_edit_task)) {
    input.value = update_edit_task;
    input.focus();
    edit_and_save = update_edit_task;
  } else {
    showNotification("Can't edit the completed task.", "warning");
  }
}

function delete_function(delete_task) {
  const update_delete_task =
    delete_task.parentElement.previousElementSibling.querySelector(
      "span"
    ).innerHTML;

  if (
    document.querySelector(".active").id == "Completed" ||
    (delete_task.parentElement.firstElementChild.firstChild.style
      .backgroundColor == "green" &&
      document.querySelector(".active").id == "All" &&
      input.value == "")
  ) {
    confirmFunction(
      `Are you sure want to delete the TASK?\n\n`,
      update_delete_task,
      function (result) {
        if (result) {
          todos.splice(todos.indexOf(update_delete_task), 1);
          completedTodos.splice(completedTodos.indexOf(update_delete_task), 1);
          localStorage.setItem("todos", JSON.stringify(todos));
          localStorage.setItem(
            "completedTodos",
            JSON.stringify(completedTodos)
          );
          showNotification("Task deleted.", "warning");
          if (document.querySelector(".active").id == "Completed") {
            completed.click();
            counts();
          } else {
            all.click();
            counts();
          }
        }
      }
    );
  } else if (
    document.querySelector(".active").id == "Progress" ||
    (delete_task.parentElement.firstElementChild.firstChild.style
      .backgroundColor == "orange" &&
      document.querySelector(".active").id == "All" &&
      input.value == "")
  ) {
    confirmFunction(
      `Are you sure want to delete the TASK?\n\n`,
      update_delete_task,
      function (result) {
        if (result) {
          todos.splice(todos.indexOf(update_delete_task), 1);
          localStorage.setItem("todos", JSON.stringify(todos));
          showNotification("Task deleted.", "warning");
          if (document.querySelector(".active").id == "Progress") {
            progress.click();
            counts();
          } else {
            all.click();
            counts();
          }
        }
      }
    );
  } else {
    showNotification("Can't delete the task while updating.", "warning");
  }
}

function counts() {
  all_count = todos.length;
  progress_count = all_count - completedTodos.length;
  completed_count = completedTodos.length;
  document.getElementById("All").innerHTML = `All(${all_count})`;
  document.getElementById("Progress").innerHTML = `Pending(${progress_count})`;
  document.getElementById(
    "Completed"
  ).innerHTML = `Finished(${completed_count})`;
}

function handleInputOrSubmit() {
  const tasksList = document.getElementById("tasks");
  // tasksList.scrollTop = 0; // Scroll to top immediately

  // For smoother scrolling with animation:
  tasksList.scrollTo({ top: 0, behavior: "smooth" });
}
