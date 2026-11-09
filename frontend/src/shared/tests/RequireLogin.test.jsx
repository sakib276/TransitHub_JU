import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RequireLogin from '../RequireLogin';
import LoginPage from '../../features/auth/pages/LoginPage';

/**
 * Makes a fake JWT whose payload has the given expiry.
 *
 * @param {number} expiresInSeconds - Seconds from now (negative = already expired).
 * @returns {string} Fake token.
 */
function fakeToken(expiresInSeconds) {
  const payload = btoa(JSON.stringify({ sub: 2, role: 'Passenger', exp: Math.floor(Date.now() / 1000) + expiresInSeconds }));
  return `header.${payload}.signature`;
}

/**
 * Renders the app routes starting at the given URL.
 *
 * @param {string} url - Starting URL.
 * @returns {void}
 */
function renderAt(url) {
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<p>Reset page</p>} />
        <Route path="/assigned-driver" element={<RequireLogin><p>Driver page</p></RequireLogin>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RequireLogin', () => {
  afterEach(() => {
    sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it('sends a user who is not logged in to the login page', () => {
    renderAt('/assigned-driver');

    expect(screen.getByText('Sign in to TransitHub JU')).toBeInTheDocument();
    expect(screen.queryByText('Driver page')).not.toBeInTheDocument();
  });

  it('sends a user whose login has expired to the login page', () => {
    sessionStorage.setItem('th_auth_token', fakeToken(-60));
    renderAt('/assigned-driver');

    expect(screen.getByText('Sign in to TransitHub JU')).toBeInTheDocument();
  });

  it('shows the page to a logged-in user', () => {
    sessionStorage.setItem('th_auth_token', fakeToken(3600));
    renderAt('/assigned-driver');

    expect(screen.getByText('Driver page')).toBeInTheDocument();
  });

  it('sends password reset links to the reset page', () => {
    renderAt('/assigned-driver?resetToken=abc');

    expect(screen.getByText('Reset page')).toBeInTheDocument();
  });

  it('goes back to the page the user wanted after logging in', async () => {
    const token = fakeToken(3600);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { token, user: { id: 2, fullName: 'Nusrat Jahan', email: 'nusrat@juniv.edu', role: 'Passenger' } },
      }),
    }));
    renderAt('/assigned-driver');

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'nusrat@juniv.edu' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => expect(screen.getByText('Driver page')).toBeInTheDocument());
    expect(sessionStorage.getItem('th_auth_token')).toBe(token);
  });
});
