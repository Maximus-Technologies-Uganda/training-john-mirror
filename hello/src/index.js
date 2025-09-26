// /src/hello/index.js
function generateGreeting(name = 'World') {
  if (typeof name !== 'string' || name.trim() === '') {
    name = 'World';
  }
  return `Hello, ${name}!`;
}

module.exports = {
  generateGreeting,
};
