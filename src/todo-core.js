/**
 * Adds a new task to the list.
 * @param {Array<Object>} tasks - The array of task objects.
 * @param {string} taskName - The name/text of the new task.
 * @returns {Array<Object>} A new array with the new task added.
 */
export function addTask(tasks, taskName) {
  const newTask = {
    id: tasks.length + 1, // Simple ID generation
    text: taskName,
    done: false
  };
  return [...tasks, newTask];
}

/**
 * Marks a specific task as done.
 * @param {Array<Object>} tasks - The array of task objects.
 * @param {number} taskId - The ID of the task to mark as done.
 * @returns {Array<Object>} A new array with the updated task.
 */
export function markTaskDone(tasks, taskId) {
    return tasks.map(task => {
      if (task.id === taskId) {
        // If this is the task we're looking for, return a new object
        return { ...task, done: true };
      }
      // Otherwise, return the task unchanged
      return task;
    });
  }