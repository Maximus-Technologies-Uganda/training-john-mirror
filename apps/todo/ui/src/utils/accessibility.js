/**
 * Accessibility helper utilities for the todo application
 * Provides ARIA support, focus management, keyboard navigation, and screen reader functionality
 */

/**
 * Generate ARIA attributes for form controls
 * @param {string} label - Accessible label text
 * @param {string} describedBy - ID of element that describes this control
 * @param {boolean} required - Whether the field is required
 * @param {string} errorId - ID of error message element
 * @returns {object} ARIA attributes object
 */
export function getAriaAttributes(label, describedBy = null, required = false, errorId = null) {
  const attributes = {
    'aria-label': label,
    'aria-required': required
  };

  if (describedBy) {
    attributes['aria-describedby'] = describedBy;
  }

  if (errorId) {
    attributes['aria-invalid'] = true;
    attributes['aria-describedby'] = errorId;
  }

  return attributes;
}

/**
 * Generate ARIA attributes for buttons
 * @param {string} label - Accessible button label
 * @param {string} description - Additional description
 * @param {boolean} expanded - Whether expandable content is expanded
 * @param {boolean} pressed - Whether button is in pressed state
 * @returns {object} ARIA attributes object
 */
export function getButtonAriaAttributes(label, description = null, expanded = null, pressed = null) {
  const attributes = {
    'aria-label': label
  };

  if (description) {
    attributes['aria-description'] = description;
  }

  if (expanded !== null) {
    attributes['aria-expanded'] = expanded;
  }

  if (pressed !== null) {
    attributes['aria-pressed'] = pressed;
  }

  return attributes;
}

/**
 * Generate ARIA attributes for list items
 * @param {number} index - Item index in list
 * @param {number} total - Total number of items
 * @param {string} label - Item label
 * @returns {object} ARIA attributes object
 */
export function getListItemAriaAttributes(index, total, label) {
  return {
    'aria-label': `${label}, ${index + 1} of ${total}`,
    'aria-setsize': total,
    'aria-posinset': index + 1
  };
}

/**
 * Focus management utilities
 */

/**
 * Focus the first focusable element in a container
 * @param {HTMLElement} container - Container element to search in
 * @returns {boolean} True if focus was set
 */
export function focusFirstFocusableElement(container) {
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
    return true;
  }
  return false;
}

/**
 * Focus the last focusable element in a container
 * @param {HTMLElement} container - Container element to search in
 * @returns {boolean} True if focus was set
 */
export function focusLastFocusableElement(container) {
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusableElements[focusableElements.length - 1].focus();
    return true;
  }
  return false;
}

/**
 * Get all focusable elements within a container
 * @param {HTMLElement} container - Container element to search in
 * @returns {HTMLElement[]} Array of focusable elements
 */
export function getFocusableElements(container) {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'details',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ];

  return Array.from(container.querySelectorAll(focusableSelectors.join(',')))
    .filter(element => {
      // Check if element is visible
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && window.getComputedStyle(element).visibility !== 'hidden';
    });
}

/**
 * Trap focus within a container (for modals, etc.)
 * @param {HTMLElement} container - Container to trap focus in
 * @param {function} onEscape - Callback when escape is pressed
 * @returns {function} Cleanup function to remove focus trap
 */
export function trapFocus(container, onEscape = null) {
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length === 0) return () => {};

  let currentFocusIndex = 0;

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && onEscape) {
      onEscape();
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();

      if (event.shiftKey) {
        // Shift + Tab: move to previous
        currentFocusIndex = currentFocusIndex > 0 ? currentFocusIndex - 1 : focusableElements.length - 1;
      } else {
        // Tab: move to next
        currentFocusIndex = currentFocusIndex < focusableElements.length - 1 ? currentFocusIndex + 1 : 0;
      }

      focusableElements[currentFocusIndex].focus();
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Focus first element
  focusableElements[0].focus();

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Screen reader announcement utilities
 */

/**
 * Announce a message to screen readers using aria-live region
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 * @param {string} role - ARIA role for the announcement
 */
export function announceToScreenReader(message, priority = 'polite', role = 'status') {
  // Input validation
  if (!message || typeof message !== 'string') {
     
    console.warn('announceToScreenReader: message must be a non-empty string');
    return;
  }

  if (!['polite', 'assertive'].includes(priority)) {
     
    console.warn('announceToScreenReader: priority must be "polite" or "assertive"');
    priority = 'polite';
  }

  if (typeof role !== 'string') {
     
    console.warn('announceToScreenReader: role must be a string');
    role = 'status';
  }

  // Remove any existing announcement
  const existingAnnouncement = document.getElementById('sr-announcement');
  if (existingAnnouncement) {
    existingAnnouncement.remove();
  }

  // Create new announcement element
  const announcement = document.createElement('div');
  announcement.id = 'sr-announcement';
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('role', role);
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';

  // Add message
  announcement.textContent = message;

  // Add to DOM
  document.body.appendChild(announcement);

  // Clean up after announcement
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement);
    }
  }, 1000);
}

/**
 * Announce an error message
 * @param {string} message - Error message to announce
 */
export function announceError(message) {
  announceToScreenReader(message, 'assertive', 'alert');
}

/**
 * Announce a success message
 * @param {string} message - Success message to announce
 */
export function announceSuccess(message) {
  announceToScreenReader(message, 'polite', 'status');
}

/**
 * Keyboard navigation utilities
 */

/**
 * Handle keyboard navigation for lists
 * @param {KeyboardEvent} event - Keyboard event
 * @param {function} onSelect - Callback when item is selected
 * @param {function} onEscape - Callback when escape is pressed
 */
export function handleListKeyboardNavigation(event, onSelect = null, onEscape = null) {
  const { key } = event;

  switch (key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      if (onSelect) onSelect();
      break;
    case 'Escape':
      event.preventDefault();
      if (onEscape) onEscape();
      break;
    default:
      // Allow other keys to bubble up
      break;
  }
}

/**
 * Handle keyboard navigation for todo items
 * @param {KeyboardEvent} event - Keyboard event
 * @param {object} actions - Action callbacks
 * @param {function} actions.onToggle - Toggle completion callback
 * @param {function} actions.onEdit - Edit callback
 * @param {function} actions.onDelete - Delete callback
 * @param {function} actions.onMoveUp - Move up callback
 * @param {function} actions.onMoveDown - Move down callback
 */
export function handleTodoKeyboardNavigation(event, actions = {}) {
  const { key } = event;
  const { onToggle, onEdit, onDelete, onMoveUp, onMoveDown } = actions;

  switch (key) {
    case 'Enter':
      event.preventDefault();
      if (onEdit) onEdit();
      break;
    case ' ':
      event.preventDefault();
      if (onToggle) onToggle();
      break;
    case 'Delete':
    case 'Backspace':
      event.preventDefault();
      if (onDelete) onDelete();
      break;
    case 'ArrowUp':
      if (event.altKey) {
        event.preventDefault();
        if (onMoveUp) onMoveUp();
      }
      break;
    case 'ArrowDown':
      if (event.altKey) {
        event.preventDefault();
        if (onMoveDown) onMoveDown();
      }
      break;
    default:
      break;
  }
}

/**
 * Form accessibility utilities
 */

/**
 * Generate unique IDs for form elements and their labels/errors
 * @param {string} baseId - Base ID for the form element
 * @returns {object} Object with labelId, errorId, and inputId
 */
export function generateFormIds(baseId) {
  return {
    inputId: `${baseId}-input`,
    labelId: `${baseId}-label`,
    errorId: `${baseId}-error`,
    descriptionId: `${baseId}-description`
  };
}

/**
 * Get appropriate ARIA attributes for a form field with validation
 * @param {string} fieldId - Unique field identifier
 * @param {boolean} hasError - Whether the field has an error
 * @param {string} description - Optional field description
 * @returns {object} ARIA attributes for the input element
 */
export function getFormFieldAriaAttributes(fieldId, hasError = false, description = null) {
  const ids = generateFormIds(fieldId);

  const attributes = {
    id: ids.inputId,
    'aria-labelledby': ids.labelId
  };

  if (hasError) {
    attributes['aria-invalid'] = true;
    attributes['aria-describedby'] = ids.errorId;
  } else if (description) {
    attributes['aria-describedby'] = ids.descriptionId;
  }

  return attributes;
}

/**
 * Skip link utilities for keyboard navigation
 */

/**
 * Create a skip link that focuses the main content
 * @param {string} targetId - ID of the main content element
 * @returns {HTMLElement} Skip link element
 */
export function createSkipLink(targetId) {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
    border-radius: 4px;
  `;

  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
  });

  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });

  return skipLink;
}

/**
 * High contrast mode detection
 * @returns {boolean} True if high contrast mode is detected
 */
export function isHighContrastMode() {
  // Create a test element to check computed styles
  const testElement = document.createElement('div');
  testElement.style.cssText = `
    position: absolute;
    left: -9999px;
    background-color: rgb(31, 41, 55);
    color: rgb(255, 255, 255);
  `;
  document.body.appendChild(testElement);

  const computedStyle = window.getComputedStyle(testElement);
  const backgroundColor = computedStyle.backgroundColor;
  const color = computedStyle.color;

  document.body.removeChild(testElement);

  // Check if colors are different (indicating high contrast mode)
  return backgroundColor !== color;
}
