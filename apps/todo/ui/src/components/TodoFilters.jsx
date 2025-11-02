import React from 'react'

/**
 * TodoFilters component for filtering todos by due date
 * @param {object} props - Component props
 * @param {boolean} props.filterDueToday - Whether due-today filter is active
 * @param {function} props.onFilterChange - Callback when filter changes
 * @param {number} props.todoCount - Total number of todos
 * @param {number} props.filteredCount - Number of filtered todos
 * @returns {JSX.Element} TodoFilters component
 */
function TodoFilters({
  filterDueToday,
  onFilterChange,
  todoCount,
  filteredCount
}) {
  const handleFilterChange = (event) => {
    onFilterChange(event.target.checked)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onFilterChange(!filterDueToday)
    }
  }

  const getCountDisplay = () => {
    if (filteredCount !== todoCount) {
      // Show filtered count when different from total
      return `Showing ${filteredCount} of ${todoCount} ${todoCount === 1 ? 'todo' : 'todos'}`
    } else {
      // Show total count
      return `Total: ${todoCount} ${todoCount === 1 ? 'todo' : 'todos'}`
    }
  }

  return (
    <section className="todo-filters-section" aria-labelledby="filters-heading">
      <h2 id="filters-heading" className="sr-only">Filters</h2>
      <div className={`todo-filters ${filterDueToday ? 'todo-filters--active' : ''}`}>
        <label className="todo-filter-label">
          <input
            type="checkbox"
            className="todo-filter-checkbox"
            checked={filterDueToday}
            onChange={handleFilterChange}
            onKeyDown={handleKeyDown}
            aria-describedby="filter-description"
          />
          <span className="todo-filter-text">Show only todos due today</span>
        </label>
        <p className="todo-filter-description" id="filter-description">
          When enabled, only shows todos that are due today. Todos without due dates are hidden.
        </p>
        <div className="todo-filter-actions">
          {filterDueToday && (
            <button
              type="button"
              className="todo-filter-clear-btn"
              onClick={() => onFilterChange(false)}
              aria-label="Clear filter and show all todos"
            >
              Clear Filter
            </button>
          )}
        </div>
        <div className="todo-filter-count" aria-live="polite">
          {getCountDisplay()}
        </div>
      </div>
    </section>
  )
}

export default React.memo(TodoFilters)