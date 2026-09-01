import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { AvailableVehiclesFeature } from './index';

describe('AvailableVehiclesFeature', () => {
  test('shows the CSE vehicles when the page loads', async () => {
    render(<AvailableVehiclesFeature />);

    expect(screen.getByRole('heading', { name: 'Available Vehicles' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Vehicles at CSE' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByText('Rahim Uddin')).toBeInTheDocument();
    expect(screen.getByText('Karim Hasan')).toBeInTheDocument();
  });

  test('loads vehicles for a newly selected pickup location', async () => {
    render(<AvailableVehiclesFeature />);

    await screen.findByText('Rahim Uddin');
    fireEvent.click(screen.getByRole('button', { name: 'Dairy Gate' }));

    expect(await screen.findByRole('heading', { name: 'Vehicles at Dairy Gate' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByText('Selim Mia')).toBeInTheDocument();
  });

  test('sends one ride request and prevents a duplicate request', async () => {
    render(<AvailableVehiclesFeature />);

    const requestButtons = await screen.findAllByRole('button', { name: 'Request Ride' });
    fireEvent.click(requestButtons[0]);

    expect(await screen.findByRole('status')).toHaveTextContent('Ride request sent. The driver will be notified.');
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: 'Request Sent' })).toHaveLength(2);
    });
    screen.getAllByRole('button', { name: 'Request Sent' }).forEach((button) => {
      expect(button).toBeDisabled();
    });
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  test('allows the passenger to join the queue', async () => {
    render(<AvailableVehiclesFeature />);

    await screen.findByText('Rahim Uddin');
    fireEvent.click(screen.getByRole('button', { name: 'Join Queue' }));

    expect(screen.getByRole('button', { name: 'Joined Queue' })).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent('You joined the queue.');
  });
});
