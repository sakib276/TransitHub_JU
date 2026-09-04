import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AdminEmergencyAlertsPage from '../pages/AdminEmergencyAlertsPage';
import { coordinateResponse, getEmergencyAlerts } from '../services/emergencyService';

vi.mock('../services/emergencyService', () => ({
  getEmergencyAlerts: vi.fn(),
  coordinateResponse: vi.fn(),
}));

const alert = {
  id: 1,
  role: 'passenger',
  reporterName: 'Anika Rahman',
  contact: '01711-000000',
  tripId: 'TRIP-1',
  vehiclePlate: null,
  details: '',
  location: 'JU Gate Stand',
  status: 'New',
  reportedAt: new Date('2026-09-06T10:00:00Z').toISOString(),
};

describe('AdminEmergencyAlertsPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows an empty message when there are no alerts', async () => {
    getEmergencyAlerts.mockResolvedValue([]);

    render(<AdminEmergencyAlertsPage />);

    expect(await screen.findByText('No emergency alerts right now.')).toBeInTheDocument();
  });

  it('lists reported alerts', async () => {
    getEmergencyAlerts.mockResolvedValue([alert]);

    render(<AdminEmergencyAlertsPage />);

    expect(await screen.findByText('Anika Rahman')).toBeInTheDocument();
    expect(screen.getByText('Trip: TRIP-1')).toBeInTheDocument();
  });

  it('coordinates a response for an alert', async () => {
    getEmergencyAlerts.mockResolvedValue([alert]);
    coordinateResponse.mockResolvedValue({ ...alert, status: 'Coordinating' });

    render(<AdminEmergencyAlertsPage />);

    fireEvent.click(await screen.findByRole('button', { name: /coordinate response/i }));

    await waitFor(() => {
      expect(coordinateResponse).toHaveBeenCalledWith(1, 'Coordinating');
    });

    expect(await screen.findByText('Coordinating')).toBeInTheDocument();
  });

  it('shows an error when the alert feed connection drops', async () => {
    getEmergencyAlerts.mockRejectedValue(new Error('Lost connection to the alert feed.'));

    render(<AdminEmergencyAlertsPage />);

    expect(await screen.findByText('Lost connection to the alert feed.')).toBeInTheDocument();
    expect(screen.getByText('Reconnecting...')).toBeInTheDocument();
  });
});
