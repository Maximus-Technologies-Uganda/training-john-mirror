import { useEffect } from 'react';
import { AddExpenseForm } from './components/AddExpenseForm';
import { ExpenseView } from './components/ExpenseView';
import { useExpenses } from './hooks/useExpenses';
import './App.css';

function App() {
  const { loadExpenses, isLoading, error } = useExpenses();

  // Load expenses on app initialization
  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  return (
    <div className="App">
      {/* Skip to main content link for keyboard accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <header className="app-header">
        <h1>Expense Tracker</h1>
        <p>Track your expenses with ease</p>
      </header>

      <main className="app-main" id="main-content">
        <section className="add-expense-section">
          <h2>Add New Expense</h2>
          <AddExpenseForm />
        </section>

        <section className="expenses-section">
          <ExpenseView />
        </section>
      </main>

      {isLoading && (
        <div className="loading-overlay" role="status" aria-live="assertive" aria-busy="true">
          <div className="loading-spinner" aria-hidden="true"></div>
          <p>Loading expenses...</p>
        </div>
      )}

      {error && (
        <div className="error-banner" role="alert" aria-live="assertive">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
}

export default App;
