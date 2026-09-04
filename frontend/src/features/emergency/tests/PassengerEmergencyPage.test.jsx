import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PassengerEmergencyPage from '../pages/PassengerEmergencyPage';
import { reportEmergency } from '../services/emergencyService';

vi.mock('../services/emergencyService', () => ({
  reportEmergency: vi.fn(),
}));

describe('PassengerEmergencyPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sends an emergency report with the passenger and trip details', async () => {
    reportEmergency.mockResolvedValue({ id: 1, status: 'New' });

    render(<PassengerEmergencyPage />);

    fireEvent.click(screen.getByRole('button', { name: /report emergency/i }));

    await waitFor(() => {
      expect(reportEmergency).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'passenger', tripId: 'TRIP-2091' }),
      );
    });

    expect(await screen.findByText(/help is on the way/i)).toBeInTheDocument();
  });

  it('disables the button and blocks sending once the trip is ended', () => {
    render(<PassengerEmergencyPage />);

    fireEvent.click(screen.getByRole('button', { name: /end trip/i }));

    expect(screen.getByRole('button', { name: /report emergency/i })).toBeDisabled();
    expect(
      screen.getByText(/don't have an active trip/i),
    ).toBeInTheDocument();
  });

  it('lets the passenger retry after a failed send', async () => {
    reportEmergency.mockRejectedValueOnce(new Error('Could not send emergency alert.'));
    reportEmergency.mockResolvedValueOnce({ id: 2, status: 'New' });

    render(<PassengerEmergencyPage />);

    fireEvent.click(screen.getByRole('button', { name: /report emergency/i }));

    expect(await screen.findByText('Could not send emergency alert.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /retry/i }));

    expect(await screen.findByText(/help is on the way/i)).toBeInTheDocument();
    expect(reportEmergency).toHaveBeenCalledTimes(2);
  });
});
