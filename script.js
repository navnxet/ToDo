const ul = document.querySelector('ul')
const input_task = document.querySelector('.input_task')
const input_time = document.querySelector('.input_time')
const add_task = document.querySelector('.add_task')
const clear_all_tasks = document.querySelector('.clear_all_tasks')
const all_tasks = document.querySelector('.all_tasks')
const pending_tasks = document.querySelector('.pending_tasks')
const completed_tasks = document.querySelector('.completed_tasks')

let currentFilter = 'all' // Initialize the filter to 'all'

// Function to filter and display tasks based on the current filter
function filterTasks() {
	const tasks = ul.querySelectorAll('li')
	tasks.forEach((li) => {
		const isCompleted = li.classList.contains('checked')
		if (
			currentFilter === 'all' ||
			(currentFilter === 'pending' && !isCompleted) ||
			(currentFilter === 'completed' && isCompleted)
		) {
			li.style.display = 'block'
		} else {
			li.style.display = 'none'
		}
	})
}

all_tasks.addEventListener('click', () => {
	all_tasks.style.borderBottom = 'var(--border)'
	pending_tasks.style.borderBottom = 'none'
	completed_tasks.style.borderBottom = 'none'
	currentFilter = 'all'
	filterTasks()
})

pending_tasks.addEventListener('click', () => {
	pending_tasks.style.borderBottom = 'var(--border)'
	completed_tasks.style.borderBottom = 'none'
	all_tasks.style.borderBottom = 'none'
	currentFilter = 'pending'
	filterTasks()
})

completed_tasks.addEventListener('click', () => {
	completed_tasks.style.borderBottom = 'var(--border)'
	pending_tasks.style.borderBottom = 'none'
	all_tasks.style.borderBottom = 'none'
	currentFilter = 'completed'
	filterTasks()
})

// Load tasks from local storage when the page loads
document.addEventListener('DOMContentLoaded', () => {
	const savedTasks = JSON.parse(localStorage.getItem('tasks')) || []
	savedTasks.forEach((taskData) => {
		addTaskFromLocalStorage(taskData)
	})
	filterTasks() // Apply the initial filter when loading tasks
})

add_task.addEventListener('click', (e) => {
	e.preventDefault()
	var selectedTime = input_time.value
	var timeParts = selectedTime.split(':')
	var hours = parseInt(timeParts[0], 10)
	var minutes = timeParts[1]
	let period = 'AM'
	if (hours >= 12) {
		if (hours > 12) {
			hours -= 12
		}
		period = 'PM'
	}
	if (hours === 0) {
		hours = 12
	}
	const formattedTime = `${hours}:${minutes} ${period}`
	let taskData = {
		task: input_task.value,
		time: formattedTime,
		checked: false, // Initialize the checked state to false
	}

	// Add the task data to the UI
	addTaskFromLocalStorage(taskData)

	// Save the task data, including the checked state, to local storage
	saveTaskToLocalStorage(taskData)

	input_task.value = ''
	input_time.value = ''
	filterTasks() // Apply the current filter after adding a task
})

// Function to add a task to the UI
function addTaskFromLocalStorage(taskData) {
	let li = document.createElement('li')
	li.innerHTML = `<div class="left"><p>${taskData.task}</p><p style="font-size: 0.7rem">${taskData.time}</p></div>`
	ul.appendChild(li)

	// let deleteButton = document.createElement('button')
	// deleteButton.innerHTML = `<i class="ri-add-line"></i>`
	// li.appendChild(deleteButton)

	// Set the checked state based on the task data

	// // Add a click event listener to the delete button
	// deleteButton.addEventListener('click', () => {
	// 	li.remove()
	// 	// Remove the task from local storage when it's deleted
	// 	removeTaskFromLocalStorage(taskData)
	// 	filterTasks() // Apply the current filter after deleting a task
	// })

	if (taskData.checked) {
		li.classList.add('checked')
	}
	li.addEventListener('click', (e) => {
		li.classList.toggle('checked')
		// Update the checked state in the task data
		taskData.checked = !taskData.checked
		// Save the updated task data to local storage
		saveTaskToLocalStorage(taskData)
		filterTasks() // Apply the current filter after checking/unchecking a task
	})
}

// Function to save a task to local storage
function saveTaskToLocalStorage(taskData) {
	let savedTasks = JSON.parse(localStorage.getItem('tasks')) || []

	// Remove the old task data (if it exists) with the same task and time
	savedTasks = savedTasks.filter((task) => {
		return !(task.task === taskData.task && task.time === taskData.time)
	})

	// Add the updated task data
	savedTasks.push(taskData)

	localStorage.setItem('tasks', JSON.stringify(savedTasks))
}

// Function to remove a task from local storage
function removeTaskFromLocalStorage(taskData) {
	const savedTasks = JSON.parse(localStorage.getItem('tasks')) || []
	const updatedTasks = savedTasks.filter((task) => {
		return !(task.task === taskData.task && task.time === taskData.time)
	})
	localStorage.setItem('tasks', JSON.stringify(updatedTasks))
}

clear_all_tasks.addEventListener('click', (e) => {
	ul.innerHTML = '' // Clear all tasks by emptying the innerHTML of the ul element
	// Clear the tasks from local storage when the clear all button is clicked
	localStorage.removeItem('tasks')
	filterTasks() // Apply the current filter after clearing all tasks
})
