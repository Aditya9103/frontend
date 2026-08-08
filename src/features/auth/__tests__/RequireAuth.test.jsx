/**
 * RequireAuth.test.jsx — Component tests for the RequireAuth route guard
 *
 * Tests the three critical rendering paths:
 *  1. Loading spinner while authCheckComplete === false
 *  2. Redirect to /login when not authenticated
 *  3. Redirect to /denied when authenticated but missing permissions
 *  4. Renders children when authenticated + authorized
 *
 * Uses a minimal Redux Provider with pre-configured auth state instead of
 * dispatching real thunks, so tests are fast and isolated.
 */
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import RequireAuth from '../components/RequireAuth';
import authReducer from '../redux/AuthSlice';

// ── Test helpers ──────────────────────────────────────────────────────────────

const makeStore = (authState) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: authState },
  });

const TestPage = () => <div>Protected Content</div>;
const LoginPage = () => <div>Login Page</div>;
const DeniedPage = () => <div>Denied Page</div>;

const renderWithGuard = (authState, allowedPermissions = [], allowedRoles = []) => {
  const store = makeStore(authState);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/denied" element={<DeniedPage />} />
          <Route
            element={
              <RequireAuth
                allowedPermissions={allowedPermissions}
                allowedRoles={allowedRoles}
              />
            }
          >
            <Route path="/protected" element={<TestPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

// ── Base auth state ───────────────────────────────────────────────────────────

const baseAuth = {
  isLoggedIn: false,
  role: '',
  permissions: [],
  authCheckComplete: false,
  data: {},
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('RequireAuth', () => {
  it('shows a loading spinner while auth check is in-flight', () => {
    renderWithGuard({ ...baseAuth, authCheckComplete: false });
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to /login when user is not authenticated', () => {
    renderWithGuard({ ...baseAuth, authCheckComplete: true, isLoggedIn: false });
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders children when authenticated with no permission requirement', () => {
    renderWithGuard({
      ...baseAuth,
      authCheckComplete: true,
      isLoggedIn: true,
      role: 'USER',
    });
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders children when user has the required permission', () => {
    renderWithGuard(
      {
        ...baseAuth,
        authCheckComplete: true,
        isLoggedIn: true,
        role: 'ADMIN',
        permissions: ['course:edit', 'user:view'],
      },
      ['course:edit']
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to /denied when user lacks a required permission', () => {
    renderWithGuard(
      {
        ...baseAuth,
        authCheckComplete: true,
        isLoggedIn: true,
        role: 'USER',
        permissions: ['course:view'],
      },
      ['course:edit'] // user doesn't have this
    );
    expect(screen.getByText('Denied Page')).toBeInTheDocument();
  });

  it('redirects to /denied for wrong legacy role', () => {
    renderWithGuard(
      {
        ...baseAuth,
        authCheckComplete: true,
        isLoggedIn: true,
        role: 'USER',
        permissions: [],
      },
      [], // no permission check
      ['ADMIN'] // legacy role check
    );
    expect(screen.getByText('Denied Page')).toBeInTheDocument();
  });

  it('SUPER_ADMIN bypasses legacy role checks', () => {
    renderWithGuard(
      {
        ...baseAuth,
        authCheckComplete: true,
        isLoggedIn: true,
        role: 'SUPER_ADMIN',
        permissions: [],
      },
      [],
      ['ADMIN'] // SUPER_ADMIN should bypass this
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
