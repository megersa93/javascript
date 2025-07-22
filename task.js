// script.js

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-button');
const clearCompletedButton = document.querySelector('.clear-completed-button');

// Global state for tasks and current filter
let tasks = [];
let currentFilter = 'all'; // 'all', 'active', 'completed'

// --- Helper Functions ---

// Generate a unique ID for tasks (simple UUID-like string)
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Save tasks to Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from Local Storage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

// Render tasks to the DOM based on the current filter
function renderTasks() {
    taskList.innerHTML = ''; // Clear current list

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') {
            return !task.completed;
        } else if (currentFilter === 'completed') {
            return task.completed;
        }
        return true; // 'all' filter
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `<p class="empty-message">${getEmptyMessage()}</p>`;
        return;
    }

    filteredTasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        listItem.dataset.id = task.id; // Store ID on the element

        listItem.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="icon-button delete-button" title="Delete Task"><i class="fas fa-trash"></i></button>
            </div>
        `;

        // Event listener for checkbox (toggle completion)
        listItem.querySelector('input[type="checkbox"]').addEventListener('change', (event) => {
            toggleTaskCompletion(task.id, event.target.checked);
        });

        // Event listener for delete button
        listItem.querySelector('.delete-button').addEventListener('click', () => {
            deleteTask(task.id);
        });

        taskList.appendChild(listItem);
    });
}

// Get appropriate empty message based on current filter
function getEmptyMessage() {
    if (currentFilter === 'active') {
        return 'No active tasks. Time to relax!';
    } else if (currentFilter === 'completed') {
        return 'No completed tasks yet.';
    }
    return 'No tasks yet. Add one above!';
}

// --- Task Management Functions ---

// Add a new task
function addTask(text) {
    const newTask = {
        id: generateId(),
        text: text.trim(),
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = ''; // Clear input
}

// Toggle task completion status
function toggleTaskCompletion(id, completed) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = completed;
        saveTasks();
        renderTasks(); // Re-render to apply completed class or filter
    }
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Clear all completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

// --- Event Listeners ---

// Handle form submission for adding new tasks
taskForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent page reload
    const taskText = taskInput.value;
    if (taskText) {
        addTask(taskText);
    }
});

// Handle filter button clicks
filterButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        // Remove active class from all filter buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to the clicked button
        event.target.classList.add('active');
        // Update current filter and re-render tasks
        currentFilter = event.target.dataset.filter;
        renderTasks();
    });
});

// Handle clear completed tasks button click
clearCompletedButton.addEventListener('click', clearCompletedTasks);

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();    // Load tasks from local storage
    renderTasks();  // Display tasks
});
