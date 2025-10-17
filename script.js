let tasks = [];

const taskInput = document.getElementById('new-task');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

function saveTasks() {
    localStorage.setItem('todos', JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem('todos');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        tasks.forEach(task => appendTaskToDOM(task));
    }
}

function appendTaskToDOM(task) {
    const listItem = document.createElement('li');
    listItem.setAttribute('data-id', task.id);
    listItem.classList.add('task-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.classList.add('task-checkbox');
    checkbox.addEventListener('change', () => toggleCompleteTask(task.id));

    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = task.text;
    taskTextSpan.classList.add('task-text');
    if (task.completed) {
        listItem.classList.add('completed');
    }
    taskTextSpan.addEventListener('click', () => {
        window.editTask(task.id, listItem, taskTextSpan);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✖';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(task.id, listItem));

    listItem.appendChild(checkbox);
    listItem.appendChild(taskTextSpan);
    listItem.appendChild(deleteBtn);
    taskList.appendChild(listItem);
}

window.editTask = function(id, listItem, currentSpan) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;

    const task = tasks[taskIndex];

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = task.text;
    inputField.classList.add('edit-input');

    listItem.replaceChild(inputField, currentSpan);
    inputField.focus();

    const saveEditChanges = () => {
        const newText = inputField.value.trim();
        if (newText && newText !== task.text) {
            tasks[taskIndex].text = newText;
            saveTasks();
            currentSpan.textContent = newText;
        }
        listItem.replaceChild(currentSpan, inputField);
    };

    inputField.addEventListener('blur', saveEditChanges);
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveEditChanges();
            inputField.blur();
        }
    });
};

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    appendTaskToDOM(newTask);
    taskInput.value = '';
}

function deleteTask(id, listItem) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    listItem.remove();
}

function toggleCompleteTask(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        const listItem = document.querySelector(`li[data-id="${id}"]`);
        if (listItem) {
            listItem.classList.toggle('completed', tasks[taskIndex].completed);
        }
    }
}

document.addEventListener('DOMContentLoaded', loadTasks);
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});