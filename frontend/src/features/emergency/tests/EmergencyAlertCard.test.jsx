import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EmergencyAlertCard from '../components/EmergencyAlertCard';

const baseAlert = {
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

describe('EmergencyAlertCard', () => {
  it('shows reporter, trip, location, and status', () => {
    render(<EmergencyAlertCard alert={baseAlert} onCoordinate={vi.fn()} />);

    expect(screen.getByText('Anika Rahman')).toBeInTheDocument();
    expect(screen.getByText('Trip: TRIP-1')).toBeInTheDocument();
    expect(screen.getByText('Location: JU Gate Stand')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('shows a details-unavailable message when key info is missing', () => {
    render(
      <EmergencyAlertCard
        alert={{ ...baseAlert, reporterName: '', contact: '' }}
        onCoordinate={vi.fn()}
      />,
    );

    expect(screen.getByText('Some alert details are unavailable.')).toBeInTheDocument();
  });

  it('calls onCoordinate with the alert id and next status', () => {
    const onCoordinate = vi.fn();

    render(<EmergencyAlertCard alert={baseAlert} onCoordinate={onCoordinate} />);

    fireEvent.click(screen.getByRole('button', { name: /coordinate response/i }));

    expect(onCoordinate).toHaveBeenCalledWith(1, 'Coordinating');
  });

  it('disables "Mark Resolved" once already resolved', () => {
    render(
      <EmergencyAlertCard alert={{ ...baseAlert, status: 'Resolved' }} onCoordinate={vi.fn()} />,
    );

    expect(screen.getByRole('button', { name: /mark resolved/i })).toBeDisabled();
  });
});
