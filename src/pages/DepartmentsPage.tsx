.dept-toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.dept-toolbar .search-input {
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.dept-table-container {
  overflow-x: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-primary, #fff);
}

.dept-table {
  width: 100%;
  border-collapse: collapse;
}

.dept-table thead {
  background-color: var(--color-primary);
  color: white;
}

.dept-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
}

.dept-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.dept-table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.btn-small {
  padding: 0.4rem 0.8rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: #3b82f6;
  color: white;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-small:hover {
  background-color: #2563eb;
}

.btn-small.btn-danger {
  background-color: #ef4444;
}

.btn-small.btn-danger:hover {
  background-color: #dc2626;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--bg-primary, #fff);
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
}

.modal-content h2 {
  margin-bottom: 1.5rem;
}

.modal-content form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-content input,
.modal-content select,
.modal-content textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.form-actions button {
  flex: 1;
}

@media (max-width: 768px) {
  .dept-toolbar { flex-direction: column; }
  .dept-table { font-size: 0.875rem; }
  .dept-table th, .dept-table td { padding: 0.75rem; }
}
