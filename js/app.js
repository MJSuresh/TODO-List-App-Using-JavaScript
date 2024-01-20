document.getElementById('form-Task').addEventListener('submit', saveTask);
 
// Save new To-Do
function saveTask(e) {
 
  let title = document.getElementById('title').value;
  let description = document.getElementById('description').value;
 
 
  let task = {
    title,
    description
  };
 
  if (localStorage.getItem('tasks') === null) {
    let tasks = [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } else {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
 
  getTasks();
 
  // Reset form-Task
  document.getElementById('form-Task').reset();
  e.preventDefault();
 
}
 
// Delete To-Do 
function deleteTask(title) {
 
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].title == title) {
      tasks.splice(i, 1);
    }
  }
 
  localStorage.setItem('tasks', JSON.stringify(tasks));
  getTasks();
}
 
// Show To-Do List
function getTasks() {
 
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  let tasksView = document.getElementById('tasks');
  tasksView.innerHTML = '';
 
  for (let i = 0; i < tasks.length; i++) {
    let title = tasks[i].title;
    let description = tasks[i].description;
 
    tasksView.innerHTML +=
      `
        <div class="row">
          
            <p>${title}</p>
        
            <p>${description}</p>
        
            <a href="#" onclick="deleteTask('${title}')" class="intu">X</a>
          
        
      </div>`;
  }

}
 
getTasks();