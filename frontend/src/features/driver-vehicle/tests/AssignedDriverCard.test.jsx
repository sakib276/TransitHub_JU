import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AssignedDriverCard from '../components/AssignedDriverCard';

// Same shape the backend returns for Nusrat with the demo data.
const DRIVER = {
  requestId: 1,
  tripId: 1,
  tripStatus: 'Scheduled',
  departureTime: '2026-10-05 08:00:00',
  routeName: 'Main Gate - Central Library',
  pickupStop: 'Main Gate',
  dropStop: 'Central Library',
  driverName: 'Karim Mia',
  driverPhone: '01700000004',
  driverPhoto: 'photos/karim.jpg',
  vehicleNumber: 'JU-BUS-01',
  vehicleType: 'Bus',
  totalSeats: 40,
};

describe('AssignedDriverCard', () => {
  it('shows driver, vehicle, and trip details from the database', () => {
    render(<AssignedDriverCard driver={DRIVER} />);

    expect(screen.getByText('Karim Mia')).toBeInTheDocument();
    expect(screen.getByText('Phone: 01700000004')).toBeInTheDocument();
    expect(screen.getByText('Bus · 40 seats')).toBeInTheDocument();
    expect(screen.getByText('JU-BUS-01')).toBeInTheDocument();
    expect(
      screen.getByText('Main Gate - Central Library (Main Gate → Central Library)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Departure: 2026-10-05 08:00:00')).toBeInTheDocument();
    expect(screen.getByText('Scheduled')).toBeInTheDocument();
    expect(screen.getByAltText('Photo of Karim Mia')).toBeInTheDocument();
  });

  it('shows "On the way" when the trip is running', () => {
    render(<AssignedDriverCard driver={{ ...DRIVER, tripStatus: 'Running' }} />);

    expect(screen.getByText('On the way')).toBeInTheDocument();
  });

  it('shows initials when the driver has no photo', () => {
    render(<AssignedDriverCard driver={{ ...DRIVER, driverPhoto: null }} />);

    expect(screen.getByText('KM')).toBeInTheDocument();
    expect(screen.queryByAltText('Photo of Karim Mia')).not.toBeInTheDocument();
  });

  it('shows initials when the photo fails to load', () => {
    render(<AssignedDriverCard driver={DRIVER} />);

    fireEvent.error(screen.getByAltText('Photo of Karim Mia'));

    expect(screen.getByText('KM')).toBeInTheDocument();
  });
});
