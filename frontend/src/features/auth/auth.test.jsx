import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginView } from './views/LoginView';

describe('authentication login UI', () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('submits administrator credentials to the admin login endpoint and saves the session', async () => {
    const user = { id: 8, fullName: 'Transit Admin', email: 'admin@example.com', role: 'Admin' };
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { token: 'test-token', user } }),
    });
    const onLogin = vi.fn();
    render(<LoginView onLogin={onLogin} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Admin' }));
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: user.email } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'StrongPass1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:5000/api/auth/login/admin');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ email: user.email, password: 'StrongPass1' });
    expect(onLogin).toHaveBeenCalledWith(user);
    expect(sessionStorage.getItem('th_auth_token')).toBe('test-token');
  });

  it('shows API errors when login fails', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ success: false, message: 'Invalid email or password.' }),
    });
    render(<LoginView />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'person@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong-password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect((await screen.findByRole('alert')).textContent).toContain('Invalid email or password.');
  });
});
