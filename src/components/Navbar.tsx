/* src/styles/navbar.css */

.navbar {
  background-color: var(--color-primary);
  color: white;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  gap: 2rem;
}

.navbar-brand h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.navbar-menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 0;
  flex: 1;
  flex-wrap: wrap;
}

.nav-link {
  display: block;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
}

.nav-link:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  color: white;
  border-bottom-color: white;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
}

.user-name {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    align-items: stretch;
    padding: 0.75rem 1rem;
    gap: 0.75rem;
  }

  .navbar-brand h1 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .navbar-menu {
    flex-direction: column;
    width: 100%;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
    border-bottom: none;
    border-left: 3px solid transparent;
  }

  .nav-link.active {
    border-left-color: white;
    border-bottom: none;
  }

  .navbar-user {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-left: 0;
  }

  .btn-logout {
    width: 100%;
  }
}
